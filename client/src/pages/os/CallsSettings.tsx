import { useEffect, useState } from "react";
import { CALL_CHANNELS, WEEKDAYS, type Availability, type Scheduling, type Weekday } from "@shared/team";
import { osFetch, useOsMutation } from "@/lib/os-api";
import { isAdminRole, useMe, useScheduling } from "@/lib/workspace-api";
import { Actions, Field, FormError, ghostButton, inputClass, Panel, primaryButton } from "./ui";

const DAY_LABEL: Record<Weekday, string> = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };

/** Your weekly hours (IST) and whether visitors can book you. */
export function AvailabilityEditor() {
  const me = useMe();
  const [hours, setHours] = useState<Availability>(me.availability ?? {});
  const [takesCalls, setTakesCalls] = useState(me.takesCalls);
  const save = useOsMutation(() => osFetch("PUT", "/api/os/me", { availability: hours, takesCalls }));
  const setRange = (day: Weekday, index: number, part: 0 | 1, value: string) =>
    setHours((prev) => ({ ...prev, [day]: (prev[day] ?? []).map((range, i) => (i === index ? (part === 0 ? [value, range[1]] : [range[0], value]) : range)) }));
  const addRange = (day: Weekday) => setHours((prev) => ({ ...prev, [day]: [...(prev[day] ?? []), ["10:00", "18:00"] as [string, string]] }));
  const removeRange = (day: Weekday, index: number) => setHours((prev) => ({ ...prev, [day]: (prev[day] ?? []).filter((_, i) => i !== index) }));

  return (
    <Panel title="My availability (IST)">
      <label className="mb-4 flex items-center gap-2 text-sm t-secondary">
        <input type="checkbox" checked={takesCalls} onChange={(e) => setTakesCalls(e.target.checked)} className="h-4 w-4" />
        Visitors can book calls with me on /book
      </label>
      <div className="space-y-3">
        {WEEKDAYS.map((day) => (
          <div key={day} className="flex flex-wrap items-center gap-2">
            <span className="w-24 text-sm t-secondary">{DAY_LABEL[day]}</span>
            {(hours[day] ?? []).length === 0 && <span className="text-xs t-muted">Off</span>}
            {(hours[day] ?? []).map((range, index) => (
              <span key={index} className="flex items-center gap-1">
                <input type="time" aria-label={`${DAY_LABEL[day]} from`} value={range[0]} onChange={(e) => setRange(day, index, 0, e.target.value)} className={`${inputClass} !w-28`} />
                <span className="t-muted">–</span>
                <input type="time" aria-label={`${DAY_LABEL[day]} to`} value={range[1]} onChange={(e) => setRange(day, index, 1, e.target.value)} className={`${inputClass} !w-28`} />
                <button type="button" onClick={() => removeRange(day, index)} className="px-1 text-xs text-red-300/70" aria-label="Remove hours">✕</button>
              </span>
            ))}
            <button type="button" onClick={() => addRange(day)} className="text-xs t-muted hover:t-primary">+ hours</button>
          </div>
        ))}
      </div>
      <FormError error={save.error} />
      <Actions><button onClick={() => save.mutate(undefined)} disabled={save.isPending} className={primaryButton}>{save.isSuccess ? "Saved ✓" : "Save availability"}</button></Actions>
    </Panel>
  );
}

/** Call length, buffers, notice, booking window and holidays. Owner/admin edit; others read. */
export function SchedulingRules() {
  const me = useMe();
  const { data } = useScheduling();
  const [rules, setRules] = useState<Scheduling | null>(null);
  const [holiday, setHoliday] = useState("");
  useEffect(() => {
    if (data && !rules) setRules(data);
  }, [data, rules]);
  const save = useOsMutation(() => osFetch("PUT", "/api/os/scheduling", rules));
  if (!rules) return <Panel title="Booking rules"><p className="text-sm t-muted">Loading…</p></Panel>;
  const editable = isAdminRole(me.role);
  const set = <K extends keyof Scheduling>(key: K, value: Scheduling[K]) => setRules((prev) => (prev ? { ...prev, [key]: value } : prev));
  const number = (key: "callMinutes" | "bufferMinutes" | "minNoticeHours" | "windowDays", label: string) => (
    <Field label={label}><input type="number" disabled={!editable} value={rules[key]} onChange={(e) => set(key, Number(e.target.value))} className={inputClass} /></Field>
  );
  return (
    <Panel title="Booking rules">
      <fieldset disabled={!editable} className="space-y-4">
        <label className="flex items-center gap-2 text-sm t-secondary">
          <input type="checkbox" checked={rules.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-4 w-4" /> Online booking is open
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {number("callMinutes", "Call length (minutes)")}
          {number("bufferMinutes", "Gap between calls (minutes)")}
          {number("minNoticeHours", "Minimum notice (hours)")}
          {number("windowDays", "Bookable days ahead")}
        </div>
        <Field label="Channels offered">
          <div className="flex flex-wrap gap-3">
            {CALL_CHANNELS.map((channel) => (
              <label key={channel} className="flex items-center gap-1.5 text-sm t-secondary">
                <input type="checkbox" checked={rules.channels.includes(channel)} onChange={(e) => set("channels", e.target.checked ? [...rules.channels, channel] : rules.channels.filter((c) => c !== channel))} />
                {channel}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Default video link" hint="Added to Google Meet / Zoom bookings automatically. Leave blank to send one by hand.">
          <input value={rules.defaultMeetingLink} onChange={(e) => set("defaultMeetingLink", e.target.value)} className={inputClass} placeholder="https://meet.google.com/abc-defg-hij" />
        </Field>
        <Field label="Holidays (no bookings)">
          <div className="flex flex-wrap items-center gap-2">
            {rules.holidays.map((day) => (
              <button type="button" key={day} onClick={() => set("holidays", rules.holidays.filter((h) => h !== day))} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs t-secondary">{day} ✕</button>
            ))}
            <input type="date" value={holiday} onChange={(e) => setHoliday(e.target.value)} className={`${inputClass} !w-auto`} aria-label="Add holiday" />
            <button type="button" onClick={() => holiday && !rules.holidays.includes(holiday) && set("holidays", [...rules.holidays, holiday].sort())} className={ghostButton}>Add</button>
          </div>
        </Field>
      </fieldset>
      <FormError error={save.error} />
      {editable && <Actions><button onClick={() => save.mutate(undefined)} disabled={save.isPending} className={primaryButton}>{save.isSuccess ? "Saved ✓" : "Save rules"}</button></Actions>}
    </Panel>
  );
}
