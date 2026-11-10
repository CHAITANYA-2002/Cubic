import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { MILESTONE_STATUSES, PROJECT_STATUSES, todayIso, type Milestone, type Project, type ProjectInput } from "@shared/os";
import { formatDate, formatInr, newLocalId, osFetch, useOsMutation, useOsState, type OsState } from "@/lib/os-api";
import { Actions, Badge, dangerButton, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton } from "./ui";

const statusTone = { Planning: "default", Active: "info", Review: "warn", Delivered: "good", "On hold": "bad" } as const;

const blankProject = (clientId: number): ProjectInput => ({
  clientId,
  dealId: null,
  name: "",
  service: "",
  status: "Planning",
  startDate: todayIso(),
  dueDate: "",
  budgetInr: 0,
  milestones: [],
  updates: [],
  notes: "",
});

function MilestoneEditor({ milestones, onChange }: { milestones: Milestone[]; onChange: (next: Milestone[]) => void }) {
  const patch = (id: string, change: Partial<Milestone>) => onChange(milestones.map((m) => (m.id === id ? { ...m, ...change } : m)));
  return (
    <div className="space-y-2">
      {milestones.map((m) => (
        <div key={m.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_130px_120px_110px_auto]">
          <input value={m.title} onChange={(e) => patch(m.id, { title: e.target.value })} className={inputClass} placeholder="Milestone" required />
          <input type="date" value={m.dueDate} onChange={(e) => patch(m.id, { dueDate: e.target.value })} className={inputClass} />
          <input type="number" min={0} value={m.amountInr} onChange={(e) => patch(m.id, { amountInr: Number(e.target.value) })} className={inputClass} placeholder="₹" />
          <select value={m.status} onChange={(e) => patch(m.id, { status: e.target.value as Milestone["status"] })} className={inputClass}>
            {MILESTONE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button type="button" onClick={() => onChange(milestones.filter((x) => x.id !== m.id))} className="px-2 text-sm text-red-300" aria-label="Remove milestone">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...milestones, { id: newLocalId(), title: "", dueDate: "", status: "Pending", amountInr: 0 }])} className={ghostButton}>
        + Milestone
      </button>
    </div>
  );
}

function ProjectForm({ project, state, onClose }: { project: Project | null; state: OsState; onClose: () => void }) {
  const [draft, setDraft] = useState<ProjectInput>(project ? { ...project } : blankProject(state.clients[0]?.id ?? 0));
  const [updateText, setUpdateText] = useState("");
  const [updateVisible, setUpdateVisible] = useState(true);
  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => setDraft((prev) => ({ ...prev, [key]: value }));

  const save = useOsMutation((body: ProjectInput) => (project ? osFetch("PATCH", `/api/os/projects/${project.id}`, body) : osFetch("POST", "/api/os/projects", body)));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/projects/${project!.id}`));

  const addUpdate = () => {
    if (!updateText.trim()) return;
    set("updates", [{ id: newLocalId(), date: todayIso(), text: updateText.trim(), visibleToClient: updateVisible }, ...draft.updates]);
    setUpdateText("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, { onSuccess: onClose });
  };

  if (state.clients.length === 0) return <Empty>Add a client first — every project belongs to one.</Empty>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name"><input required value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputClass} /></Field>
        <Field label="Client">
          <select value={draft.clientId} onChange={(e) => set("clientId", Number(e.target.value))} className={inputClass}>
            {state.clients.map((c) => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </Field>
        <Field label="Service"><input value={draft.service} onChange={(e) => set("service", e.target.value)} className={inputClass} /></Field>
        <Field label="Status">
          <select value={draft.status} onChange={(e) => set("status", e.target.value as ProjectInput["status"])} className={inputClass}>
            {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Start"><input type="date" value={draft.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} /></Field>
        <Field label="Due"><input type="date" value={draft.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={inputClass} /></Field>
        <Field label="Budget (₹)"><input type="number" min={0} value={draft.budgetInr} onChange={(e) => set("budgetInr", Number(e.target.value))} className={inputClass} /></Field>
      </div>

      <Field label="Milestones" hint="Shown to the client in their portal. Amounts drive milestone invoices.">
        <MilestoneEditor milestones={draft.milestones} onChange={(next) => set("milestones", next)} />
      </Field>

      <Field label="Progress updates">
        <div className="space-y-2">
          <textarea rows={2} value={updateText} onChange={(e) => setUpdateText(e.target.value)} className={inputClass} placeholder="What shipped, what's next, what you need from the client" />
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs t-muted">
              <input type="checkbox" checked={updateVisible} onChange={(e) => setUpdateVisible(e.target.checked)} /> Visible in client portal
            </label>
            <button type="button" onClick={addUpdate} className={ghostButton}>Add update</button>
          </div>
          {draft.updates.map((u) => (
            <div key={u.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 p-3 text-sm">
              <div>
                <p className="text-xs t-muted">{formatDate(u.date)} {u.visibleToClient ? "· client sees this" : "· internal"}</p>
                <p className="whitespace-pre-line t-secondary">{u.text}</p>
              </div>
              <button type="button" onClick={() => set("updates", draft.updates.filter((x) => x.id !== u.id))} className="text-xs text-red-300">Remove</button>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Internal notes"><textarea rows={3} value={draft.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} /></Field>
      <FormError error={save.error || remove.error} />
      <Actions>
        {project && <button type="button" onClick={() => confirm("Delete this project?") && remove.mutate(undefined, { onSuccess: onClose })} className={dangerButton}>Delete</button>}
        <button disabled={save.isPending} className={primaryButton}>{save.isPending ? "Saving…" : "Save project"}</button>
      </Actions>
    </form>
  );
}

export default function ProjectsView() {
  const { data, isLoading } = useOsState();
  const [editing, setEditing] = useState<Project | null | "new">(null);
  const [, navigate] = useLocation();
  const invoiceMilestone = useOsMutation(({ project, milestone }: { project: Project; milestone: Milestone }) =>
    osFetch("POST", "/api/os/invoices", {
      kind: "invoice",
      clientId: project.clientId,
      projectId: project.id,
      issueDate: todayIso(),
      dueDate: "",
      items: [{ description: `${project.name} — ${milestone.title}`, qty: 1, rateInr: milestone.amountInr }],
      gstMode: "none",
      gstRate: 18,
      status: "Draft",
    }),
  );

  if (isLoading || !data) return <p className="t-muted">Loading…</p>;
  const clientName = (id: number) => {
    const client = data.clients.find((c) => c.id === id);
    return client ? client.company || client.name : "Unknown client";
  };
  const active = data.projects.filter((p) => p.status === "Active" || p.status === "Review").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Delivery</p>
          <h1 className="text-3xl t-primary">Projects</h1>
        </div>
        <button onClick={() => setEditing("new")} className={primaryButton}>New project</button>
      </header>

      {active > 2 && <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">{active} projects are active. Capacity is two — anything more is a queue, not a yes.</p>}
      <FormError error={invoiceMilestone.error} />

      {data.projects.length === 0 ? (
        <Panel><Empty>No projects yet. Mark a deal won to start one automatically.</Empty></Panel>
      ) : (
        <div className="space-y-4">
          {data.projects.map((project) => {
            const done = project.milestones.filter((m) => m.status === "Done").length;
            const pct = project.milestones.length ? Math.round((done / project.milestones.length) * 100) : 0;
            return (
              <Panel key={project.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold t-primary">{project.name}</p>
                      <Badge tone={statusTone[project.status]}>{project.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs t-muted">{clientName(project.clientId)} · {formatInr(project.budgetInr)} · due {formatDate(project.dueDate)}</p>
                  </div>
                  <button onClick={() => setEditing(project)} className={ghostButton}>Open</button>
                </div>
                {project.milestones.length > 0 && (
                  <>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full bg-[var(--accent-primary)]" style={{ width: `${pct}%` }} />
                    </div>
                    <ul className="mt-3 divide-y divide-white/5">
                      {project.milestones.map((m) => (
                        <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                          <span className={m.status === "Done" ? "t-muted line-through" : "t-secondary"}>{m.title}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs t-muted">{formatDate(m.dueDate)}{m.amountInr ? ` · ${formatInr(m.amountInr)}` : ""}</span>
                            {m.amountInr > 0 && (
                              <button
                                onClick={() => invoiceMilestone.mutate({ project, milestone: m }, { onSuccess: () => navigate("/admin/invoices") })}
                                className="text-xs text-[var(--accent-primary)] hover:underline"
                              >
                                Invoice
                              </button>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "New project" : "Project"} wide>
        {editing !== null && <ProjectForm project={editing === "new" ? null : editing} state={data} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
