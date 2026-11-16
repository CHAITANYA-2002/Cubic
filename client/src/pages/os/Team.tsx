import { useState, type FormEvent } from "react";
import { ROLE_LABELS, type Role } from "@shared/team";
import { formatDate, osFetch, useOsMutation } from "@/lib/os-api";
import { useAssignment, useTeam, type TeamMember } from "@/lib/workspace-api";
import { Actions, Badge, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton } from "./ui";

const ROLE_HELP: Record<Exclude<Role, "owner">, string> = {
  admin: "Everything except managing the team.",
  sales: "Inbox, pipeline, calls, chats, tasks and clients — their own records plus unassigned ones.",
  delivery: "Projects, clients, tasks and calls.",
};

function newPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(14)), (byte) => alphabet[byte % alphabet.length]).join("");
}

function MemberForm({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  const [draft, setDraft] = useState({
    name: member?.name ?? "",
    email: member?.email ?? "",
    role: (member?.role === "owner" ? "owner" : member?.role ?? "sales") as Role,
    password: member ? "" : newPassword(),
    takesCalls: member?.takesCalls ?? true,
    takesLeads: member?.takesLeads ?? true,
    active: member?.active ?? true,
  });
  const [shown, setShown] = useState(!member);
  const isOwner = member?.role === "owner";
  const save = useOsMutation(() => {
    if (!member) return osFetch("POST", "/api/os/team", draft);
    const { password, role, active, ...rest } = draft;
    return osFetch("PATCH", `/api/os/team/${member.id}`, { ...rest, ...(isOwner ? {} : { role, active }), ...(password ? { password } : {}) });
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(undefined, { onSuccess: onClose });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} /></Field>
        <Field label="Work email (their login)"><input type="email" required={!isOwner} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputClass} /></Field>
        {!isOwner && (
          <Field label="Role" hint={draft.role !== "owner" ? ROLE_HELP[draft.role] : undefined}>
            <select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })} className={inputClass}>
              {(["admin", "sales", "delivery"] as const).map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
            </select>
          </Field>
        )}
        {!isOwner && (
          <Field label={member ? "New password (leave blank to keep)" : "Temporary password"} hint="Share it privately. They can change it under My account.">
            <div className="flex gap-2">
              <input type={shown ? "text" : "password"} value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} className={inputClass} minLength={member ? 0 : 10} required={!member} autoComplete="new-password" />
              <button type="button" onClick={() => { setDraft({ ...draft, password: newPassword() }); setShown(true); }} className={ghostButton}>Generate</button>
            </div>
          </Field>
        )}
      </div>
      <div className="flex flex-wrap gap-5 text-sm t-secondary">
        <label className="flex items-center gap-2"><input type="checkbox" checked={draft.takesLeads} onChange={(e) => setDraft({ ...draft, takesLeads: e.target.checked })} /> Gets new leads automatically</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={draft.takesCalls} onChange={(e) => setDraft({ ...draft, takesCalls: e.target.checked })} /> Bookable on /book</label>
        {member && !isOwner && <label className="flex items-center gap-2"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Active (can sign in)</label>}
      </div>
      <FormError error={save.error} />
      <Actions><button disabled={save.isPending} className={primaryButton}>{member ? "Save" : "Create login"}</button></Actions>
    </form>
  );
}

export default function TeamView() {
  const { data: team = [], isLoading } = useTeam();
  const { data: assignment } = useAssignment();
  const [editing, setEditing] = useState<TeamMember | null | "new">(null);
  const toggleAuto = useOsMutation((autoAssign: boolean) => osFetch("PUT", "/api/os/assignment", { autoAssign }));
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Logins and roles</p>
          <h1 className="text-3xl t-primary">Team</h1>
        </div>
        <button onClick={() => setEditing("new")} className={primaryButton}>Add team member</button>
      </header>
      <Panel title="Lead routing">
        <label className="flex items-center gap-2 text-sm t-secondary">
          <input type="checkbox" checked={assignment?.autoAssign ?? true} onChange={(e) => toggleAuto.mutate(e.target.checked)} />
          Give each new lead to the least busy person who gets leads (open leads + open deals)
        </label>
        <FormError error={toggleAuto.error} />
      </Panel>
      <Panel>
        {isLoading ? (
          <p className="t-muted">Loading…</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {team.map((member) => (
              <li key={member.id}>
                <button onClick={() => setEditing(member)} className="flex w-full flex-wrap items-center gap-3 py-3 text-left">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm t-primary">{member.name}</span>
                    <span className="block text-xs t-muted">{member.email || "Signs in with ADMIN_PASSWORD"} · last sign-in {member.lastLoginAt ? formatDate(member.lastLoginAt) : "never"}</span>
                  </span>
                  <Badge tone={member.role === "owner" ? "good" : "default"}>{ROLE_LABELS[member.role]}</Badge>
                  {member.takesLeads && <Badge tone="info">Leads</Badge>}
                  {member.takesCalls && <Badge tone="info">Calls</Badge>}
                  {member.active === false && <Badge tone="bad">Inactive</Badge>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add team member" : `Edit ${editing?.name ?? ""}`} wide>
        {editing !== null && <MemberForm member={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
