import { describe, expect, it } from "vitest";
import { schedulingInput } from "../../shared/team";
import { buildIcs, computeSlots, istDate, istToUtc, pickHost } from "./slots";

const rules = schedulingInput.parse({ callMinutes: 30, bufferMinutes: 15, minNoticeHours: 0, windowDays: 1 });
// Monday 2026-11-16, 08:00 IST.
const mondayMorning = istToUtc("2026-11-16", "08:00");
const host = { id: 1, availability: { mon: [["10:00", "12:00"]] as Array<[string, string]> } };

describe("IST conversion", () => {
  it("maps IST wall time to UTC", () => {
    expect(new Date(istToUtc("2026-11-16", "10:00")).toISOString()).toBe("2026-11-16T04:30:00.000Z");
  });
  it("reads the IST date across midnight UTC", () => {
    expect(istDate(Date.parse("2026-11-16T20:00:00Z"))).toBe("2026-11-17");
  });
});

describe("computeSlots", () => {
  it("steps by call plus buffer and stops before the range ends", () => {
    const slots = computeSlots([host], [], rules, mondayMorning);
    expect(slots.map((slot) => slot.start)).toEqual([
      "2026-11-16T04:30:00.000Z", // 10:00
      "2026-11-16T05:15:00.000Z", // 10:45
      "2026-11-16T06:00:00.000Z", // 11:30 (ends 12:00)
    ]);
  });

  it("drops slots inside the notice period", () => {
    const at1030 = istToUtc("2026-11-16", "10:30");
    const slots = computeSlots([host], [], { ...rules, minNoticeHours: 0 }, at1030);
    expect(slots.map((slot) => slot.start)).toEqual(["2026-11-16T05:15:00.000Z", "2026-11-16T06:00:00.000Z"]);
  });

  it("keeps the buffer around an existing call", () => {
    const busy = [{ hostId: 1, startAt: "2026-11-16T05:15:00.000Z", endAt: "2026-11-16T05:45:00.000Z" }];
    const slots = computeSlots([host], busy, rules, mondayMorning);
    // 10:00-10:30 + 15 min buffer touches 10:45 exactly: allowed. 11:30 starts 45 min after 10:45 ends.
    expect(slots.map((slot) => slot.start)).toEqual(["2026-11-16T04:30:00.000Z", "2026-11-16T06:00:00.000Z"]);
  });

  it("closes holidays and days without hours", () => {
    expect(computeSlots([host], [], { ...rules, holidays: ["2026-11-16"] }, mondayMorning)).toEqual([]);
    const tuesday = istToUtc("2026-11-17", "08:00");
    expect(computeSlots([host], [], rules, tuesday)).toEqual([]);
  });

  it("merges hosts free at the same time", () => {
    const second = { id: 2, availability: { mon: [["10:00", "10:30"]] as Array<[string, string]> } };
    const [first] = computeSlots([host, second], [], rules, mondayMorning);
    expect(first.hostIds).toEqual([1, 2]);
  });

  it("returns nothing when booking is switched off", () => {
    expect(computeSlots([host], [], { ...rules, enabled: false }, mondayMorning)).toEqual([]);
  });
});

describe("pickHost", () => {
  it("prefers the host with fewer upcoming calls", () => {
    const upcoming = [{ hostId: 1, startAt: "", endAt: "" }];
    expect(pickHost([1, 2], upcoming)).toBe(2);
    expect(pickHost([1, 2], [])).toBe(1);
    expect(pickHost([], [])).toBeNull();
  });
});

describe("buildIcs", () => {
  it("writes UTC times and escapes text", () => {
    const ics = buildIcs({ uid: "a@b", start: "2026-11-16T04:30:00.000Z", end: "2026-11-16T05:00:00.000Z", title: "Call, CubicTech", description: "Line 1\nLine 2", location: "Google Meet" }, new Date("2026-11-01T00:00:00Z"));
    expect(ics).toContain("DTSTART:20261116T043000Z");
    expect(ics).toContain("SUMMARY:Call\\, CubicTech");
    expect(ics).toContain("DESCRIPTION:Line 1\\nLine 2");
  });
});
