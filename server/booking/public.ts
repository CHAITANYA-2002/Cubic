import { Hono } from "hono";
import { publicBookingInput, rescheduleInput, type Booking, type PublicBooking } from "../../shared/crm";
import type { AppEnv } from "../env";
import { bookings, users } from "../db/tables";
import { clientIp, HttpError, readJson } from "../http";
import { notifyTeam, sendMail } from "../mail";
import { hit } from "../security/rate-limit";
import { timelineEntry } from "../crm/timeline";
import { buildIcs, pickHost } from "./slots";
import { bookingSummary, busyFrom, istLabel, leadForBooking, newManageToken, openSlots } from "./store";

const limit = (ip: string) => ({ key: `booking:${ip}`, max: 6, windowMs: 10 * 60 * 1000 });
const TOKEN = /^[a-f0-9]{48}$/;

async function byToken(c: { env: AppEnv["Bindings"]; req: { param: (key: string) => string } }): Promise<Booking> {
  const token = c.req.param("token");
  if (!TOKEN.test(token)) throw new HttpError(404, "Booking not found");
  const row = await c.env.DB.prepare("SELECT * FROM bookings WHERE manage_token = ?").bind(token).first();
  if (!row) throw new HttpError(404, "Booking not found");
  return bookings.fromRow(row);
}

async function toPublic(db: AppEnv["Bindings"]["DB"], booking: Booking): Promise<PublicBooking> {
  const host = await users.byId(db, booking.hostId);
  const { name, email, topic, channel, meetingLink, startAt, endAt, status } = booking;
  return { name, email, topic, channel, meetingLink, startAt, endAt, status, hostName: host?.name ?? "CubicTech" };
}

/** Public call booking (/book) and the visitor's manage link. */
export const bookingPublicRoutes = new Hono<AppEnv>();

bookingPublicRoutes.get("/api/booking/slots", async (c) => {
  c.header("Cache-Control", "no-store");
  const { rules, slots } = await openSlots(c.env.DB);
  return c.json({ enabled: rules.enabled, callMinutes: rules.callMinutes, channels: rules.channels, slots: slots.map((slot) => slot.start) });
});

bookingPublicRoutes.post("/api/booking", async (c) => {
  const db = c.env.DB;
  if (await hit(db, limit(clientIp(c)))) throw new HttpError(429, "Too many bookings. Please wait a few minutes.");
  const { botcheck, ...input } = publicBookingInput.parse(await readJson(c));
  if (botcheck) throw new HttpError(400, "Submission rejected.");

  const { rules, slots, busy } = await openSlots(db);
  const slot = slots.find((candidate) => candidate.start === new Date(input.start).toISOString());
  if (!slot) throw new HttpError(409, "That time was just taken. Please pick another slot.");
  const upcoming = busy.filter((call) => Date.parse(call.startAt) > Date.now());
  const hostId = pickHost(slot.hostIds, upcoming);
  if (!hostId) throw new HttpError(409, "That time was just taken. Please pick another slot.");

  const startAt = slot.start;
  const endAt = new Date(Date.parse(startAt) + rules.callMinutes * 60_000).toISOString();
  const leadId = await leadForBooking(db, input, hostId, istLabel(startAt));
  const stamp = new Date().toISOString();
  const row: Omit<Booking, "id"> = {
    hostId,
    leadId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    topic: input.topic,
    notes: "",
    channel: input.channel,
    meetingLink: input.channel === "Google Meet" || input.channel === "Zoom" ? rules.defaultMeetingLink : "",
    startAt,
    endAt,
    status: "Scheduled",
    outcome: "",
    locale: input.locale,
    manageToken: newManageToken(),
    createdAt: stamp,
    updatedAt: stamp,
  };
  // The unique (host, start) index rejects a double booking that slipped past the slot check.
  const booking = bookings.firstRow(await bookings.insert(db, row).run());
  if (!booking) throw new Error("Booking insert returned no row");
  const host = await users.byId(db, hostId);
  const summary = bookingSummary(booking, host?.name ?? "CubicTech");
  await Promise.all([
    notifyTeam(c.env, `New call: ${booking.name} — ${istLabel(startAt)}`, `${summary}\nEmail: ${booking.email}\nPhone: ${booking.phone || "—"}`, booking.email),
    sendMail(c.env, { to: booking.email, subject: "Your call with CubicTech is booked", text: `Hi ${booking.name},\n\nYour call is booked.\n\n${summary}\n\nThanks,\nCubicTech` }),
  ]);
  return c.json({ token: booking.manageToken, booking: await toPublic(db, booking) }, 201);
});

bookingPublicRoutes.get("/api/booking/manage/:token", async (c) => {
  c.header("Cache-Control", "no-store");
  c.header("X-Robots-Tag", "noindex, nofollow");
  const booking = await byToken(c);
  return c.json(await toPublic(c.env.DB, booking));
});

bookingPublicRoutes.post("/api/booking/manage/:token/cancel", async (c) => {
  const db = c.env.DB;
  const booking = await byToken(c);
  if (booking.status !== "Scheduled") throw new HttpError(409, "This call is no longer scheduled.");
  const updated = bookings.firstRow(await bookings.update(db, booking.id, { status: "Cancelled", updatedAt: new Date().toISOString() }).run());
  if (booking.leadId) await timelineEntry(db, "lead", booking.leadId, "meeting", `Cancelled the call on ${istLabel(booking.startAt)}`, null).run();
  await notifyTeam(c.env, `Call cancelled: ${booking.name}`, `${booking.name} cancelled the call on ${istLabel(booking.startAt)}.`);
  return c.json(await toPublic(db, updated ?? booking));
});

bookingPublicRoutes.post("/api/booking/manage/:token/reschedule", async (c) => {
  const db = c.env.DB;
  if (await hit(db, limit(clientIp(c)))) throw new HttpError(429, "Too many changes. Please wait a few minutes.");
  const booking = await byToken(c);
  if (booking.status !== "Scheduled") throw new HttpError(409, "This call is no longer scheduled.");
  const { start } = rescheduleInput.parse(await readJson(c));
  const { rules, slots } = await openSlots(db, booking.id);
  const slot = slots.find((candidate) => candidate.start === new Date(start).toISOString());
  if (!slot) throw new HttpError(409, "That time was just taken. Please pick another slot.");
  const upcoming = (await busyFrom(db, Date.now())).filter((call) => call.startAt !== booking.startAt);
  const hostId = slot.hostIds.includes(booking.hostId) ? booking.hostId : pickHost(slot.hostIds, upcoming) ?? booking.hostId;
  const endAt = new Date(Date.parse(slot.start) + rules.callMinutes * 60_000).toISOString();
  const updated = bookings.firstRow(await bookings.update(db, booking.id, { startAt: slot.start, endAt, hostId, updatedAt: new Date().toISOString() }).run());
  if (booking.leadId) await timelineEntry(db, "lead", booking.leadId, "meeting", `Moved the call from ${istLabel(booking.startAt)} to ${istLabel(slot.start)}`, null).run();
  await notifyTeam(c.env, `Call moved: ${booking.name}`, `${booking.name} moved the call to ${istLabel(slot.start)}.`);
  return c.json(await toPublic(db, updated ?? booking));
});

bookingPublicRoutes.get("/api/booking/manage/:token/ics", async (c) => {
  const booking = await byToken(c);
  const host = await users.byId(c.env.DB, booking.hostId);
  const ics = buildIcs({
    uid: `booking-${booking.id}@cubictech`,
    start: booking.startAt,
    end: booking.endAt,
    title: "Call with CubicTech",
    description: bookingSummary(booking, host?.name ?? "CubicTech"),
    location: booking.meetingLink || booking.channel,
  });
  return c.body(ics, 200, { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="cubictech-call.ics"' });
});
