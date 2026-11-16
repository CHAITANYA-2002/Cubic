import { useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { LEAD_SOURCES, type LeadSource } from "@shared/crm";
import { LEAD_STATUSES, todayIso, type Deal, type Lead } from "@shared/os";
import { formatDate, osFetch, saveBlob, toCsv, useLeads, useOsMutation } from "@/lib/os-api";
import { isAdminRole, nameOf, useMe, useTeam } from "@/lib/workspace-api";
import { AssigneeSelect, TimelinePanel } from "./parts";
import { Actions, Badge, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton } from "./ui";

const statusTone = { New: "warn", Contacted: "info", Closed: "default" } as const;
const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;
const hasPhone = (phone: string) => phone.replace(/\D/g, "").length >= 7;

function exportCsv(rows: Lead[], team: ReturnType<typeof useTeam>["data"]) {
  const header = ["Name", "Email", "Phone", "Company", "Service", "Budget", "Message", "Status", "Source", "Assigned to", "Page", "Campaign", "Date"];
  const body = rows.map((lead) => [lead.name, lead.email, lead.phone, lead.company, lead.service, lead.budget, lead.message, lead.status, lead.source, nameOf(team, lead.assignedTo), lead.page, lead.utm, lead.createdAt]);
  saveBlob(new Blob([toCsv([header, ...body])], { type: "text/csv" }), `cubic-leads-${todayIso()}.csv`);
}

function NewLeadForm({ onClose }: { onClose: () => void }) {
  const me = useMe();
  const [draft, setDraft] = useState({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "", source: "WhatsApp" as LeadSource, assignedTo: isAdminRole(me.role) ? null : me.id as number | null });
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const save = useOsMutation((body: typeof draft) => osFetch("POST", "/api/os/leads", body));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, { onSuccess: onClose });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><input required value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputClass} /></Field>
        <Field label="Company"><input value={draft.company} onChange={(e) => set("company", e.target.value)} className={inputClass} /></Field>
        <Field label="Email"><input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></Field>
        <Field label="Phone / WhatsApp"><input value={draft.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></Field>
        <Field label="Service wanted"><input value={draft.service} onChange={(e) => set("service", e.target.value)} className={inputClass} placeholder="Website, app, AI agent…" /></Field>
        <Field label="Budget"><input value={draft.budget} onChange={(e) => set("budget", e.target.value)} className={inputClass} /></Field>
        <Field label="Source">
          <select value={draft.source} onChange={(e) => set("source", e.target.value as LeadSource)} className={inputClass}>{LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Assigned to" hint={isAdminRole(me.role) ? "Blank = auto-assign to the least busy person" : undefined}>
          <AssigneeSelect value={draft.assignedTo} onChange={(id) => set("assignedTo", id)} />
        </Field>
      </div>
      <Field label="What they need"><textarea rows={3} value={draft.message} onChange={(e) => set("message", e.target.value)} className={inputClass} /></Field>
      <FormError error={save.error} />
      <Actions><button disabled={save.isPending} className={primaryButton}>{save.isPending ? "Saving…" : "Add lead"}</button></Actions>
    </form>
  );
}

function FollowUp({ lead }: { lead: Lead }) {
  const [title, setTitle] = useState(`Follow up with ${lead.name}`);
  const [dueDate, setDueDate] = useState(todayIso());
  const add = useOsMutation(() => osFetch("POST", "/api/os/tasks", { title, dueDate, entity: "lead", entityId: lead.id, entityLabel: `${lead.name}${lead.company ? ` · ${lead.company}` : ""}`, assignedTo: lead.assignedTo }));
  return (
    <div className="flex flex-wrap items-end gap-2">
      <Field label="Follow-up task"><input value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} min-w-[220px]`} /></Field>
      <Field label="Due"><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} /></Field>
      <button type="button" disabled={add.isPending || add.isSuccess} onClick={() => add.mutate(undefined)} className={ghostButton}>{add.isSuccess ? "Added ✓" : "Add task"}</button>
      <FormError error={add.error} />
    </div>
  );
}

function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const me = useMe();
  const [, navigate] = useLocation();
  const update = useOsMutation((body: Partial<Pick<Lead, "status" | "assignedTo">>) => osFetch("PATCH", `/api/admin/submissions/${lead.id}`, body));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/admin/submissions/${lead.id}`));
  const convert = useOsMutation(() => osFetch<Deal>("POST", `/api/os/leads/${lead.id}/convert`));
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-sm">
        <p className="t-secondary">{lead.email}{lead.phone && ` · ${lead.phone}`}{lead.company && ` · ${lead.company}`}</p>
        <p className="text-xs t-muted">{lead.source} · {formatDate(lead.createdAt)}{lead.page && ` · from ${lead.page}`}{lead.utm && ` · ${lead.utm}`}</p>
        {(lead.service || lead.budget) && <p className="text-xs t-muted">{[lead.service, lead.budget].filter(Boolean).join(" · ")}</p>}
        <p className="whitespace-pre-line pt-2 t-secondary">{lead.message}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {lead.email && <a href={`mailto:${lead.email}`} className={ghostButton}>Email</a>}
        {hasPhone(lead.phone) && <a href={whatsappLink(lead.phone)} target="_blank" rel="noreferrer" className={ghostButton}>WhatsApp</a>}
        {hasPhone(lead.phone) && <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className={ghostButton}>Call</a>}
        <select aria-label="Status" value={lead.status} onChange={(e) => update.mutate({ status: e.target.value as Lead["status"] })} className={`${inputClass} !w-auto`}>
          {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <AssigneeSelect value={lead.assignedTo} onChange={(assignedTo) => update.mutate({ assignedTo })} />
        <button disabled={convert.isPending} onClick={() => convert.mutate(undefined, { onSuccess: () => navigate("/admin/pipeline") })} className={primaryButton}>Qualify → deal</button>
        {isAdminRole(me.role) && (
          <button onClick={() => confirm(`Delete the enquiry from ${lead.name}?`) && remove.mutate(undefined, { onSuccess: onClose })} className="px-2 text-sm text-red-300">Delete</button>
        )}
      </div>
      <FormError error={update.error || remove.error || convert.error} />
      <FollowUp lead={lead} />
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] t-muted">History</p>
        <TimelinePanel entity="lead" id={lead.id} />
      </div>
    </div>
  );
}

export default function LeadsView() {
  const me = useMe();
  const { data: leads = [], isLoading } = useLeads();
  const { data: team } = useTeam();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Open");
  const [source, setSource] = useState("All");
  const [owner, setOwner] = useState(isAdminRole(me.role) ? "all" : "mine");
  const [openId, setOpenId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const visible = useMemo(
    () =>
      leads.filter((lead) => {
        const statusOk = status === "All" || (status === "Open" ? lead.status !== "Closed" : lead.status === status);
        const ownerOk = owner === "all" || (owner === "mine" ? lead.assignedTo === me.id : owner === "none" ? lead.assignedTo === null : String(lead.assignedTo) === owner);
        const text = `${lead.name} ${lead.email} ${lead.company} ${lead.service} ${lead.phone}`.toLowerCase();
        return statusOk && ownerOk && (source === "All" || lead.source === source) && text.includes(search.toLowerCase());
      }),
    [leads, search, status, source, owner, me.id],
  );
  const open = leads.find((lead) => lead.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Website, chatbot, calls and manual leads</p>
          <h1 className="text-3xl t-primary">Inbox</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCsv(visible, team)} className={ghostButton}>Export CSV</button>
          <button onClick={() => setAdding(true)} className={primaryButton}>Add lead</button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} max-w-xs`} placeholder="Search name, email, company" aria-label="Search leads" />
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} !w-auto`}>
          {["Open", "All", ...LEAD_STATUSES].map((value) => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)} className={`${inputClass} !w-auto`}>
          {["All", ...LEAD_SOURCES].map((value) => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} className={`${inputClass} !w-auto`}>
          <option value="all">Everyone</option>
          <option value="mine">Mine</option>
          <option value="none">Unassigned</option>
          {isAdminRole(me.role) && team?.filter((member) => member.id !== me.id).map((member) => <option key={member.id} value={String(member.id)}>{member.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <p className="t-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <Panel><Empty>No leads match. New enquiries from the website, chatbot and call booking land here.</Empty></Panel>
      ) : (
        <div className="space-y-2">
          {visible.map((lead) => (
            <button key={lead.id} onClick={() => setOpenId(lead.id)} className="block w-full rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.04]">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold t-primary">{lead.name}</p>
                <Badge tone={statusTone[lead.status]}>{lead.status}</Badge>
                <Badge tone={lead.source === "Chatbot" ? "info" : lead.source === "Call booking" ? "good" : "default"}>{lead.source}</Badge>
                {lead.service && <Badge>{lead.service}</Badge>}
                <span className="ml-auto text-xs t-muted">{nameOf(team, lead.assignedTo)} · {formatDate(lead.createdAt)}</span>
              </div>
              <p className="mt-1 truncate text-sm t-muted">{lead.company && `${lead.company} · `}{lead.message}</p>
            </button>
          ))}
        </div>
      )}

      <Modal open={open !== null} onClose={() => setOpenId(null)} title={open ? `${open.name}${open.company ? ` — ${open.company}` : ""}` : ""} wide>
        {open && <LeadDetail lead={open} onClose={() => setOpenId(null)} />}
      </Modal>
      <Modal open={adding} onClose={() => setAdding(false)} title="Add a lead" wide>
        {adding && <NewLeadForm onClose={() => setAdding(false)} />}
      </Modal>
    </div>
  );
}
