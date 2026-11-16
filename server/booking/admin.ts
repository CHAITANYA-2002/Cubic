import { Hono } from "hono";
import { bookingPatchInput, manualBookingInput, type Booking } from "../../shared/crm";
import { schedulingInput } from "../../shared/team";
import type { AppEnv } from "../env";
import { bookings, users } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { saveDoc } from "../docs";
import { assertAdmin, assertMayTouch, scopeWhere } from "../crm/access";
import { timelineEntry } from "../crm/timeline";
import { buildIcs } from "./slots";
import { bookingSummary, istLabel, loadScheduling, newManageToken } from "./store";

/** Calls calendar for the team. Mounted behind requireUser + the "calls" area. */
export const bookingAdminRoutes = new Hono<AppEnv>();

bookingAdminRoutes.get("/api/os/calls", async (c) => {
  const user = c.get("user");
  const from = c.req.query("from") ?? new Date(Date.now() - 30 * 86_400_000).toISOString();
  const scope = scopeWhere(user, "host_id");
  const where = ["start_at >= ?", scope.where].filter(Boolean).join(" AND ");
  const rows = await bookings.all(c.env.DB, where, [from, ...scope.params]);
  return c.json(rows.sort((a, b) => a.startAt.localeCompare(b.startAt)));
});

bookingAdminRoutes.post("/api/os/calls", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const input = manualBookingInput.parse(await readJson(c));
  const hostId = input.hostId ?? user.id;
  assertMayTouch(user, hostId);
  const host = await users.byId(db, hostId);
  if (!host?.active) throw new HttpError(400, "Choose an active team member as host");
  const rules = await loadScheduling(db);
  const startAt = new Date(input.start).toISOString();
  const stamp = new Date().toISOString();
  const row: Omit<Booking, "id"> = {
    hostId,
    leadId: input.leadId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    topic: input.topic,
    notes: "",
    channel: input.channel,
    meetingLink: input.meetingLink,
    startAt,
    endAt: new Date(Date.parse(startAt) + rules.callMinutes * 60_000).toISOString(),
    status: "Scheduled",
    outcome: "",
    locale: "en",
    manageToken: newManageToken(),
    createdAt: stamp,
    updatedAt: stamp,
  };
  const created = bookings.firstRow(await bookings.insert(db, row).run());
  if (!created) throw new Error("Booking insert returned no row");
  if (created.leadId) await timelineEntry(db, "lead", created.leadId, "meeting", `Call scheduled for ${istLabel(startAt)} with ${host.name}`, user).run();
  return c.json(created, 201);
});

bookingAdminRoutes.patch("/api/os/calls/:id", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const id = parseId(c);
  const booking = await bookings.byId(db, id);
  if (!booking) throw new HttpError(404, "Call not found");
  assertMayTouch(user, booking.hostId);
  const input = bookingPatchInput.parse(await readJson(c));
  if (input.hostId && input.hostId !== booking.hostId) assertAdmin(user);

  const rules = await loadScheduling(db);
  const { start, ...rest } = input;
  const moved = start ? { startAt: new Date(start).toISOString(), endAt: new Date(Date.parse(start) + rules.callMinutes * 60_000).toISOString() } : {};
  const updated = bookings.firstRow(await bookings.update(db, id, { ...rest, ...moved, updatedAt: new Date().toISOString() }).run());
  if (booking.leadId && input.status && input.status !== booking.status) {
    const note = input.outcome ? `${input.status}: ${input.outcome}` : `Call marked ${input.status}`;
    await timelineEntry(db, "lead", booking.leadId, "call", note, user).run();
  }
  return c.json(updated);
});

bookingAdminRoutes.get("/api/os/calls/:id/ics", async (c) => {
  const booking = await bookings.byId(c.env.DB, parseId(c));
  if (!booking) throw new HttpError(404, "Call not found");
  assertMayTouch(c.get("user"), booking.hostId);
  const ics = buildIcs({
    uid: `booking-${booking.id}@cubictech`,
    start: booking.startAt,
    end: booking.endAt,
    title: `Call: ${booking.name}${booking.company ? ` (${booking.company})` : ""}`,
    description: `${bookingSummary(booking, "you")}\nEmail: ${booking.email}\nPhone: ${booking.phone}`,
    location: booking.meetingLink || booking.channel,
  });
  return c.body(ics, 200, { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="call-${booking.id}.ics"` });
});

bookingAdminRoutes.get("/api/os/scheduling", async (c) => c.json(await loadScheduling(c.env.DB)));

bookingAdminRoutes.put("/api/os/scheduling", async (c) => {
  assertAdmin(c.get("user"));
  const rules = schedulingInput.parse(await readJson(c));
  await saveDoc(c.env.DB, "scheduling", rules);
  return c.json(rules);
});
