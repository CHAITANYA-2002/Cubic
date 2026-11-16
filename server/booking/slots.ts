import { WEEKDAYS, type Availability, type Scheduling } from "../../shared/team";

// All working hours are India Standard Time (UTC+05:30, no daylight saving). Slots are UTC instants.
const IST_OFFSET_MS = 330 * 60_000;
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export type Host = { id: number; availability: Availability };
export type Busy = { hostId: number; startAt: string; endAt: string };
export type Slot = { start: string; hostIds: number[] };

/** "2026-11-20" + "10:30" in IST -> epoch ms. */
export const istToUtc = (date: string, time: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, h, min) - IST_OFFSET_MS;
};

/** Epoch ms -> the IST calendar date "YYYY-MM-DD". */
export const istDate = (ms: number) => new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);

/** Monday-first weekday key of an IST date. */
const weekdayOf = (date: string) => {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return WEEKDAYS[(day + 6) % 7];
};

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => aStart < bEnd && bStart < aEnd;

/**
 * Every bookable start between now + notice and the end of the booking window, with the hosts free
 * at that time. A host is free when the call, padded by the buffer on both sides, overlaps none of
 * their scheduled calls. Holidays close the whole day.
 */
export function computeSlots(hosts: Host[], busy: Busy[], rules: Scheduling, now: number): Slot[] {
  if (!rules.enabled || hosts.length === 0) return [];
  const callMs = rules.callMinutes * MINUTE;
  const bufferMs = rules.bufferMinutes * MINUTE;
  const stepMs = callMs + bufferMs;
  const earliest = now + rules.minNoticeHours * 60 * MINUTE;
  const holidays = new Set(rules.holidays);
  const busyByHost = new Map<number, Array<[number, number]>>();
  for (const call of busy) {
    const list = busyByHost.get(call.hostId) ?? [];
    list.push([Date.parse(call.startAt), Date.parse(call.endAt)]);
    busyByHost.set(call.hostId, list);
  }

  const byStart = new Map<number, number[]>();
  const firstDay = istDate(now);
  for (let offset = 0; offset <= rules.windowDays; offset += 1) {
    const date = istDate(Date.parse(`${firstDay}T12:00:00Z`) + offset * DAY);
    if (holidays.has(date)) continue;
    const weekday = weekdayOf(date);
    for (const host of hosts) {
      for (const [from, to] of host.availability[weekday] ?? []) {
        const rangeEnd = istToUtc(date, to);
        for (let start = istToUtc(date, from); start + callMs <= rangeEnd; start += stepMs) {
          if (start < earliest) continue;
          const clash = (busyByHost.get(host.id) ?? []).some(([s, e]) => overlaps(start - bufferMs, start + callMs + bufferMs, s, e));
          if (clash) continue;
          const ids = byStart.get(start) ?? [];
          if (!ids.includes(host.id)) ids.push(host.id);
          byStart.set(start, ids);
        }
      }
    }
  }
  return Array.from(byStart.entries())
    .sort(([a], [b]) => a - b)
    .map(([start, hostIds]) => ({ start: new Date(start).toISOString(), hostIds }));
}

/** Of the hosts free at a slot, the one with the fewest upcoming calls (ties: lowest id). */
export function pickHost(hostIds: number[], upcoming: Busy[]): number | null {
  const load = (id: number) => upcoming.filter((call) => call.hostId === id).length;
  return [...hostIds].sort((a, b) => load(a) - load(b) || a - b)[0] ?? null;
}

const icsStamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** A single-event iCalendar file. Times are UTC, so every calendar shows the visitor's local time. */
export function buildIcs(event: { uid: string; start: string; end: string; title: string; description: string; location: string }, now = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CubicTech//Calls//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${icsStamp(now.toISOString())}`,
    `DTSTART:${icsStamp(event.start)}`,
    `DTEND:${icsStamp(event.end)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(event.description)}`,
    `LOCATION:${icsText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
