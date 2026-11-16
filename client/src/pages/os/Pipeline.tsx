import { useState, type FormEvent } from "react";
import { DEAL_STAGES, todayIso, type Deal, type DealInput } from "@shared/os";
import { formatDate, formatInr, osFetch, useOsMutation, useOsState } from "@/lib/os-api";
import { isAdminRole, nameOf, useMe, useTeam } from "@/lib/workspace-api";
import { AssigneeSelect, TimelinePanel } from "./parts";
import { Actions, Badge, dangerButton, Field, FormError, ghostButton, inputClass, Modal, primaryButton, Stat } from "./ui";

const SERVICES = ["AI Solutions", "Web Applications", "Web Development", "UI/UX Design", "Maintenance & Support", "Digital Marketing", "Diagnostic"];
const SOURCES = ["Website form", "Referral", "LinkedIn", "Warm network", "Outbound", "Partner", "Other"];

type Draft = Omit<DealInput, "probability"> & { probability: number | "" };

const blankDeal = (): Draft => ({
  title: "",
  company: "",
  contactName: "",
  email: "",
  phone: "",
  source: "Referral",
  service: "AI Solutions",
  stage: "Lead",
  valueInr: 0,
  probability: "",
  nextAction: "",
  nextActionDate: todayIso(),
  lostReason: "",
  clientId: null,
  leadId: null,
  assignedTo: null,
  notes: "",
});

function DealForm({ deal, onClose }: { deal: Deal | null; onClose: () => void }) {
  const [draft, setDraft] = useState<Draft>(deal ? { ...deal } : blankDeal());
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));

  const save = useOsMutation((body: Draft) => {
    const payload = { ...body, probability: body.probability === "" ? undefined : body.probability };
    return deal ? osFetch("PATCH", `/api/os/deals/${deal.id}`, payload) : osFetch("POST", "/api/os/deals", payload);
  });
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/deals/${deal!.id}`));
  const win = useOsMutation(() => osFetch("POST", `/api/os/deals/${deal!.id}/win`));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, { onSuccess: onClose });
  };

  return (
    <>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Deal name"><input required value={draft.title} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="Acme Logistics — dispatch copilot" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company"><input value={draft.company} onChange={(e) => set("company", e.target.value)} className={inputClass} /></Field>
        <Field label="Contact person"><input value={draft.contactName} onChange={(e) => set("contactName", e.target.value)} className={inputClass} /></Field>
        <Field label="Email"><input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></Field>
        <Field label="Phone"><input value={draft.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></Field>
        <Field label="Service">
          <select value={draft.service} onChange={(e) => set("service", e.target.value)} className={inputClass}>{SERVICES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Source">
          <select value={draft.source} onChange={(e) => set("source", e.target.value)} className={inputClass}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Stage">
          <select value={draft.stage} onChange={(e) => set("stage", e.target.value as Draft["stage"])} className={inputClass}>{DEAL_STAGES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Value (₹)"><input type="number" min={0} value={draft.valueInr} onChange={(e) => set("valueInr", Number(e.target.value))} className={inputClass} /></Field>
        <Field label="Probability %" hint="Blank = stage default"><input type="number" min={0} max={100} value={draft.probability} onChange={(e) => set("probability", e.target.value === "" ? "" : Number(e.target.value))} className={inputClass} /></Field>
        <Field label="Next action date"><input type="date" value={draft.nextActionDate} onChange={(e) => set("nextActionDate", e.target.value)} className={inputClass} /></Field>
        <Field label="Owner"><AssigneeSelect value={draft.assignedTo} onChange={(id) => set("assignedTo", id)} /></Field>
      </div>
      <Field label="Next action"><input value={draft.nextAction} onChange={(e) => set("nextAction", e.target.value)} className={inputClass} placeholder="Send proposal v2" /></Field>
      {draft.stage === "Lost" && <Field label="Why lost"><input value={draft.lostReason} onChange={(e) => set("lostReason", e.target.value)} className={inputClass} /></Field>}
      <Field label="Notes"><textarea rows={4} value={draft.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} /></Field>
      <FormError error={save.error || remove.error || win.error} />
      <Actions>
        {deal && <button type="button" onClick={() => confirm("Delete this deal?") && remove.mutate(undefined, { onSuccess: onClose })} className={dangerButton}>Delete</button>}
        {deal && deal.stage !== "Won" && (
          <button type="button" onClick={() => win.mutate(undefined, { onSuccess: onClose })} className={ghostButton} title="Marks Won, creates the client and a project">
            Mark won → start project
          </button>
        )}
        <button disabled={save.isPending} className={primaryButton}>{save.isPending ? "Saving…" : "Save deal"}</button>
      </Actions>
    </form>
    {deal && (
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] t-muted">History</p>
        <TimelinePanel entity="deal" id={deal.id} />
      </div>
    )}
    </>
  );
}

export default function PipelineView() {
  const me = useMe();
  const { data: stateData, isLoading } = useOsState();
  const { data: team } = useTeam();
  const [editing, setEditing] = useState<Deal | null | "new">(null);
  const [showClosed, setShowClosed] = useState(false);
  const [owner, setOwner] = useState("all");
  const data = stateData && {
    ...stateData,
    deals: stateData.deals.filter((deal) => owner === "all" || (owner === "mine" ? deal.assignedTo === me.id : String(deal.assignedTo) === owner)),
  };
  const move = useOsMutation(({ id, stage }: { id: number; stage: Deal["stage"] }) => osFetch("PATCH", `/api/os/deals/${id}`, { stage }));

  if (isLoading || !data) return <p className="t-muted">Loading…</p>;
  const today = todayIso();
  const stages = DEAL_STAGES.filter((stage) => showClosed || (stage !== "Won" && stage !== "Lost"));
  const open = data.deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost");
  const total = open.reduce((sum, deal) => sum + deal.valueInr, 0);
  const weighted = open.reduce((sum, deal) => sum + (deal.valueInr * deal.probability) / 100, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Revenue</p>
          <h1 className="text-3xl t-primary">Pipeline</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} className={`${inputClass} !w-auto`}>
            <option value="all">Everyone</option>
            <option value="mine">Mine</option>
            {isAdminRole(me.role) && team?.filter((member) => member.id !== me.id).map((member) => <option key={member.id} value={String(member.id)}>{member.name}</option>)}
          </select>
          <button onClick={() => setShowClosed(!showClosed)} className={ghostButton}>{showClosed ? "Hide closed" : "Show won / lost"}</button>
          <button onClick={() => setEditing("new")} className={primaryButton}>New deal</button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat label="Open deals" value={open.length} />
        <Stat label="Pipeline" value={formatInr(total)} />
        <Stat label="Weighted" value={formatInr(Math.round(weighted))} hint="Value × probability" />
      </div>

      <FormError error={move.error} />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const deals = data.deals.filter((deal) => deal.stage === stage);
          return (
            <div key={stage} className="w-72 shrink-0 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <p className="text-sm font-semibold t-primary">{stage}</p>
                <span className="text-xs t-muted">{deals.length} · {formatInr(deals.reduce((s, d) => s + d.valueInr, 0))}</span>
              </div>
              <div className="space-y-2 p-3">
                {deals.map((deal) => {
                  const due = deal.stage !== "Won" && deal.stage !== "Lost" && (!deal.nextActionDate || deal.nextActionDate <= today);
                  return (
                    <div key={deal.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <button onClick={() => setEditing(deal)} className="block w-full text-left">
                        <p className="text-sm t-primary">{deal.title}</p>
                        <p className="mt-1 text-xs t-muted">{formatInr(deal.valueInr)} · {deal.probability}% · {nameOf(team, deal.assignedTo)}</p>
                        {deal.nextAction && <p className="mt-2 text-xs t-secondary">→ {deal.nextAction}</p>}
                      </button>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        {due ? <Badge tone="warn">Due {deal.nextActionDate ? formatDate(deal.nextActionDate) : "—"}</Badge> : <span className="text-[11px] t-muted">{formatDate(deal.nextActionDate)}</span>}
                        <select
                          aria-label="Move stage"
                          value={deal.stage}
                          onChange={(e) => move.mutate({ id: deal.id, stage: e.target.value as Deal["stage"] })}
                          className="rounded-lg border border-white/10 bg-transparent px-1.5 py-1 text-[11px] t-muted"
                        >
                          {DEAL_STAGES.map((s) => <option key={s} className="bg-black">{s}</option>)}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "New deal" : "Edit deal"} wide>
        {editing !== null && <DealForm deal={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
