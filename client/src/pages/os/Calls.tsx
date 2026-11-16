import { useState, type FormEvent } from "react";
import { BOOKING_STATUSES, type Booking } from "@shared/crm";
import { CALL_CHANNELS } from "@shared/team";
import { downloadFile, osFetch, useOsMutation } from "@/lib/os-api";
import { isAdminRole, istDateTime, istInputToIso, isoToIstInput, nameOf, useCalls, useMe, useTeam } from "@/lib/workspace-api";
import { AvailabilityEditor, SchedulingRules } from "./CallsSettings";
import { AssigneeSelect } from "./parts";
import { Actions, Badge, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton, Stat } from "./ui";

const statusTone = { Scheduled: "info", Completed: "good", Cancelled: "default", "No-show": "bad" } as const;
const istDay = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" });

function CallForm({ onClose }: { onClose: () => void }) {
  const me = useMe();
  const [draft, setDraft] = useState({ start: "", hostId: me.id as number | null, name: "", email: "", phone: "", company: "", topic: "", channel: "Google Meet" as (typeof CALL_CHANNELS)[number], meetingLink: "" });
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const save = useOsMutation(() => osFetch("POST", "/api/os/calls", { ...draft, start: istInputToIso(draft.start), hostId: draft.hostId ?? undefined }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(undefined, { onSuccess: onClose });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="When (IST)"><input type="datetime-local" required value={draft.start} onChange={(e) => set("start", e.target.value)} className={inputClass} /></Field>
        <Field label="Host"><AssigneeSelect value={draft.hostId} onChange={(id) => set("hostId", id)} label="Host" /></Field>
        <Field label="Name"><input required value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputClass} /></Field>
        <Field label="Company"><input value={draft.company} onChange={(e) => set("company", e.target.value)} className={inputClass} /></Field>
        <Field label="Email"><input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></Field>
        <Field label="Phone"><input value={draft.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></Field>
        <Field label="Channel">
          <select value={draft.channel} onChange={(e) => set("channel", e.target.value as typeof draft.channel)} className={inputClass}>{CALL_CHANNELS.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label="Meeting link"><input value={draft.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} className={inputClass} placeholder="https://meet.google.com/…" /></Field>
      </div>
      <Field label="Topic"><textarea rows={2} value={draft.topic} onChange={(e) => set("topic", e.target.value)} className={inputClass} /></Field>
      <FormError error={save.error} />
      <Actions><button disabled={save.isPending} className={primaryButton}>Schedule call</button></Actions>
    </form>
  );
}

function CallDetail({ call, onClose }: { call: Booking; onClose: () => void }) {
  const me = useMe();
  const { data: team } = useTeam();
  const [outcome, setOutcome] = useState(call.outcome);
  const [link, setLink] = useState(call.meetingLink);
  const [start, setStart] = useState(isoToIstInput(call.startAt));
  const update = useOsMutation((body: Record<string, unknown>) => osFetch("PATCH", `/api/os/calls/${call.id}`, body));
  const finish = (status: Booking["status"]) => update.mutate({ status, outcome }, { onSuccess: onClose });
  return (
    <div className="space-y-5 text-sm">
      <div className="space-y-1">
        <p className="t-primary">{istDateTime(call.startAt)} IST · {call.channel}</p>
        <p className="t-muted">{call.email}{call.phone && ` · ${call.phone}`}{call.company && ` · ${call.company}`}</p>
        <p className="t-muted">Host: {nameOf(team, call.hostId)} · <Badge tone={statusTone[call.status]}>{call.status}</Badge></p>
        {call.topic && <p className="whitespace-pre-line pt-2 t-secondary">{call.topic}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {call.meetingLink && <a href={call.meetingLink} target="_blank" rel="noreferrer" className={primaryButton}>Join</a>}
        {call.phone && <a href={`https://wa.me/${call.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={ghostButton}>WhatsApp</a>}
        <button onClick={() => downloadFile(`/api/os/calls/${call.id}/ics`, `call-${call.id}.ics`)} className={ghostButton}>Add to calendar</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="Meeting link"><input value={link} onChange={(e) => setLink(e.target.value)} className={inputClass} /></Field>
        <button onClick={() => update.mutate({ meetingLink: link })} className={`${ghostButton} self-end`}>Save link</button>
        <Field label="Move to (IST)"><input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} /></Field>
        <button onClick={() => update.mutate({ start: istInputToIso(start) })} className={`${ghostButton} self-end`}>Move</button>
      </div>
      {isAdminRole(me.role) && (
        <Field label="Host"><AssigneeSelect value={call.hostId} onChange={(hostId) => hostId && update.mutate({ hostId })} label="Host" /></Field>
      )}
      <Field label="Outcome / notes" hint="Saved to the lead's history when you close the call">
        <textarea rows={3} value={outcome} onChange={(e) => setOutcome(e.target.value)} className={inputClass} placeholder="Needs a booking system, budget ₹3–4L, send proposal by Friday" />
      </Field>
      <FormError error={update.error} />
      <Actions>
        {BOOKING_STATUSES.filter((status) => status !== call.status && status !== "Scheduled").map((status) => (
          <button key={status} onClick={() => finish(status)} className={status === "Completed" ? primaryButton : ghostButton}>Mark {status.toLowerCase()}</button>
        ))}
        {call.status !== "Scheduled" && <button onClick={() => update.mutate({ status: "Scheduled" }, { onSuccess: onClose })} className={ghostButton}>Reopen</button>}
      </Actions>
    </div>
  );
}

export default function CallsView() {
  const { data: calls = [], isLoading } = useCalls();
  const { data: team } = useTeam();
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [tab, setTab] = useState<"upcoming" | "past" | "availability">("upcoming");
  const now = new Date().toISOString();
  const upcoming = calls.filter((call) => call.status === "Scheduled" && call.endAt >= now);
  const past = calls.filter((call) => !(call.status === "Scheduled" && call.endAt >= now)).reverse();
  const needsOutcome = past.filter((call) => call.status === "Scheduled");
  const shown = tab === "upcoming" ? upcoming : past;
  const byDay = shown.reduce<Record<string, Booking[]>>((groups, call) => ({ ...groups, [istDay(call.startAt)]: [...(groups[istDay(call.startAt)] ?? []), call] }), {});
  const open = calls.find((call) => call.id === openId) ?? null;
  const bookingUrl = typeof window === "undefined" ? "/book" : `${window.location.origin}/book`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Discovery calls · times in IST</p>
          <h1 className="text-3xl t-primary">Calls</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigator.clipboard?.writeText(bookingUrl)} className={ghostButton} title={bookingUrl}>Copy booking link</button>
          <button onClick={() => setAdding(true)} className={primaryButton}>Schedule a call</button>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Upcoming" value={upcoming.length} />
        <Stat label="Today" value={upcoming.filter((call) => istDay(call.startAt) === istDay(now)).length} />
        <Stat label="Needs an outcome" value={needsOutcome.length} tone={needsOutcome.length ? "warn" : "default"} hint="Past calls still marked scheduled" />
      </div>
      <div className="flex gap-2" role="tablist">
        {(["upcoming", "past", "availability"] as const).map((value) => (
          <button key={value} role="tab" aria-selected={tab === value} aria-pressed={tab === value} onClick={() => setTab(value)} className="filter-pill capitalize">{value === "availability" ? "Availability & rules" : value}</button>
        ))}
      </div>

      {tab === "availability" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <AvailabilityEditor />
          <SchedulingRules />
        </div>
      ) : isLoading ? (
        <p className="t-muted">Loading…</p>
      ) : shown.length === 0 ? (
        <Panel><Empty>{tab === "upcoming" ? "No calls booked. Share your booking link: /book" : "No past calls in the last 30 days."}</Empty></Panel>
      ) : (
        Object.entries(byDay).map(([day, rows]) => (
          <Panel key={day} title={day}>
            <ul className="divide-y divide-white/5">
              {rows.map((call) => (
                <li key={call.id}>
                  <button onClick={() => setOpenId(call.id)} className="flex w-full flex-wrap items-center gap-3 py-3 text-left">
                    <span className="w-24 text-sm font-semibold t-primary">{new Date(call.startAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" })}</span>
                    <span className="min-w-0 flex-1 text-sm t-secondary">{call.name}{call.company && ` · ${call.company}`}<span className="block truncate text-xs t-muted">{call.topic}</span></span>
                    <Badge>{call.channel}</Badge>
                    <span className="text-xs t-muted">{nameOf(team, call.hostId)}</span>
                    <Badge tone={statusTone[call.status]}>{call.status}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ))
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Schedule a call" wide>{adding && <CallForm onClose={() => setAdding(false)} />}</Modal>
      <Modal open={open !== null} onClose={() => setOpenId(null)} title={open ? `Call with ${open.name}` : ""} wide>{open && <CallDetail call={open} onClose={() => setOpenId(null)} />}</Modal>
    </div>
  );
}
