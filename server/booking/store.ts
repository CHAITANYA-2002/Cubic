import type { Booking } from "../../shared/crm";
import type { Lead } from "../../shared/os";
import { schedulingInput, type Scheduling } from "../../shared/team";
import type { D1Database } from "../db/d1";
import { bookings, leads, users, type UserRow } from "../db/tables";
import { loadDoc } from "../docs";
import { logActivity } from "../os/activity";
import { randomHex } from "../security/crypto";
import { timelineEntry } from "../crm/timeline";
import { computeSlots, type Busy, type Host } from "./slots";

export const loadScheduling = (db: D1Database): Promise<Scheduling> => loadDoc(db, "scheduling", schedulingInput);

export async function callHosts(db: D1Database): Promise<UserRow[]> {
  const { results } = await db.prepare("SELECT * FROM users WHERE active = 1 AND takes_calls = 1 ORDER BY id").all();
  return results.map(users.fromRow);
}

/** Scheduled calls that end after `fromMs`, as busy intervals. */
export async function busyFrom(db: D1Database, fromMs: number): Promise<Busy[]> {
  const { results } = await db
    .prepare("SELECT host_id, start_at, end_at FROM bookings WHERE status = 'Scheduled' AND end_at > ?")
    .bind(new Date(fromMs - 24 * 3600_000).toISOString())
    .all<{ host_id: number; start_at: string; end_at: string }>();
  return results.map((row) => ({ hostId: Number(row.host_id), startAt: row.start_at, endAt: row.end_at }));
}

/** Open slots right now, optionally ignoring one booking (when it is being moved). */
export async function openSlots(db: D1Database, ignoreBookingId?: number) {
  const now = Date.now();
  const [rules, hosts, busy] = await Promise.all([loadScheduling(db), callHosts(db), busyFrom(db, now)]);
  let ignored: Busy | null = null;
  if (ignoreBookingId) {
    const row = await bookings.byId(db, ignoreBookingId);
    if (row) ignored = { hostId: row.hostId, startAt: row.startAt, endAt: row.endAt };
  }
  const relevant = ignored ? busy.filter((call) => !(call.hostId === ignored?.hostId && call.startAt === ignored.startAt)) : busy;
  const hostList: Host[] = hosts.map((host) => ({ id: host.id, availability: host.availability }));
  return { rules, hosts, busy: relevant, slots: computeSlots(hostList, relevant, rules, now) };
}

export const newManageToken = () => randomHex(24);

type Visitor = { name: string; email: string; phone: string; company: string; topic: string };

/**
 * The lead behind a booking: an open lead with the same email is reused, otherwise a new one is
 * created (source "Call booking") and given to the host. Returns the lead id.
 */
export async function leadForBooking(db: D1Database, visitor: Visitor, hostId: number, startLabel: string): Promise<number> {
  const existing = await db
    .prepare("SELECT id FROM leads WHERE email = ? AND status <> 'Closed' ORDER BY id DESC LIMIT 1")
    .bind(visitor.email)
    .first<{ id: number }>();
  if (existing) {
    await timelineEntry(db, "lead", existing.id, "meeting", `Booked a call for ${startLabel}`, null).run();
    return existing.id;
  }
  const stamp = new Date().toISOString();
  const lead: Omit<Lead, "id"> = {
    name: visitor.name,
    email: visitor.email,
    phone: visitor.phone,
    company: visitor.company,
    service: "",
    budget: "",
    message: visitor.topic || "Booked a discovery call.",
    status: "New",
    notes: "",
    source: "Call booking",
    assignedTo: hostId,
    page: "/book",
    utm: "",
    createdAt: stamp,
    updatedAt: stamp,
  };
  const [inserted] = await db.batch([leads.insert(db, lead), ...logActivity(db, "lead", `Call booked by ${visitor.name} for ${startLabel}`)]);
  const row = leads.firstRow(inserted);
  if (!row) throw new Error("Lead insert returned no row");
  await timelineEntry(db, "lead", row.id, "meeting", `Booked a call for ${startLabel}`, null).run();
  return row.id;
}

export const istLabel = (iso: string) =>
  `${new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })} IST`;

export function bookingSummary(booking: Booking, hostName: string): string {
  return [
    `When: ${istLabel(booking.startAt)}`,
    `With: ${hostName}`,
    `How: ${booking.channel}${booking.meetingLink ? ` — ${booking.meetingLink}` : ""}`,
    booking.topic && `Topic: ${booking.topic}`,
  ]
    .filter(Boolean)
    .join("\n");
}
