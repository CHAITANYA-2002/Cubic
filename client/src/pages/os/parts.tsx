import { useState, type FormEvent } from "react";
import { Mail, MessageCircle, NotebookPen, Phone, Users, Zap } from "lucide-react";
import { TIMELINE_KINDS, type TimelineEntity } from "@shared/crm";
import { osFetch, useOsMutation } from "@/lib/os-api";
import { isAdminRole, istDateTime, nameOf, useMe, useTeam, useTimeline } from "@/lib/workspace-api";
import { Empty, FormError, inputClass, primaryButton } from "./ui";

const KIND_ICON = { note: NotebookPen, call: Phone, email: Mail, whatsapp: MessageCircle, meeting: Users, system: Zap } as const;
const KIND_LABEL: Record<string, string> = { note: "Note", call: "Call", email: "Email", whatsapp: "WhatsApp", meeting: "Meeting", system: "Update" };

/** Running history of a lead, deal, client or project, with a box to log what just happened. */
export function TimelinePanel({ entity, id }: { entity: TimelineEntity; id: number }) {
  const { data = [], isLoading } = useTimeline(entity, id);
  const [kind, setKind] = useState<(typeof TIMELINE_KINDS)[number]>("note");
  const [text, setText] = useState("");
  const add = useOsMutation((body: { kind: string; text: string }) => osFetch("POST", `/api/os/timeline/${entity}/${id}`, body));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    add.mutate({ kind, text }, { onSuccess: () => setText("") });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Entry type">
          {TIMELINE_KINDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
              className={`rounded-full border px-3 py-1 text-xs ${kind === value ? "border-white/40 bg-white/10 t-primary" : "border-white/10 t-muted"}`}
            >
              {KIND_LABEL[value]}
            </button>
          ))}
        </div>
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} className={inputClass} placeholder="What happened? e.g. Called — wants a quote by Friday" aria-label="Timeline entry" />
        <div className="flex justify-end">
          <button disabled={add.isPending || !text.trim()} className={primaryButton}>{add.isPending ? "Saving…" : "Log it"}</button>
        </div>
        <FormError error={add.error} />
      </form>
      {isLoading ? (
        <p className="text-sm t-muted">Loading…</p>
      ) : data.length === 0 ? (
        <Empty>No history yet.</Empty>
      ) : (
        <ol className="space-y-3 border-l border-white/10 pl-4">
          {data.map((entry) => {
            const Icon = KIND_ICON[entry.kind as keyof typeof KIND_ICON] ?? Zap;
            return (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[25px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111113]"><Icon className="h-3 w-3 t-muted" /></span>
                <p className="text-[11px] t-muted">{KIND_LABEL[entry.kind] ?? entry.kind} · {entry.userName} · {istDateTime(entry.at)}</p>
                <p className="mt-0.5 whitespace-pre-line text-sm t-secondary">{entry.text}</p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/** Owners and admins pick anyone; others can take a record or release it. */
export function AssigneeSelect({ value, onChange, label = "Assigned to" }: { value: number | null; onChange: (id: number | null) => void; label?: string }) {
  const me = useMe();
  const { data: team = [] } = useTeam();
  const options = isAdminRole(me.role) ? team : team.filter((member) => member.id === me.id || member.id === value);
  return (
    <select aria-label={label} value={value ?? ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} className={`${inputClass} !w-auto`}>
      <option value="">Unassigned</option>
      {options.map((member) => (
        <option key={member.id} value={member.id}>{member.id === me.id ? `${member.name} (me)` : member.name}</option>
      ))}
    </select>
  );
}

export function AssigneeName({ id }: { id: number | null }) {
  const { data: team } = useTeam();
  return <>{nameOf(team, id)}</>;
}
