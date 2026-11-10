import { useState, type FormEvent } from "react";
import { invoiceTotals, type Client, type ClientInput } from "@shared/os";
import { formatInr, osFetch, useOsMutation, useOsState } from "@/lib/os-api";
import { Actions, dangerButton, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton } from "./ui";

const blankClient = (): ClientInput => ({ name: "", company: "", email: "", phone: "", gstin: "", address: "", notes: "" });

export const portalUrl = (client: Client) => `${window.location.origin}/portal/${client.portalToken}`;

function ClientForm({ client, onClose }: { client: Client | null; onClose: () => void }) {
  const [draft, setDraft] = useState<ClientInput>(client ? { ...client } : blankClient());
  const set = <K extends keyof ClientInput>(key: K, value: ClientInput[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const save = useOsMutation((body: ClientInput) => (client ? osFetch("PATCH", `/api/os/clients/${client.id}`, body) : osFetch("POST", "/api/os/clients", body)));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/clients/${client!.id}`));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, { onSuccess: onClose });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contact name"><input required value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputClass} /></Field>
        <Field label="Company"><input value={draft.company} onChange={(e) => set("company", e.target.value)} className={inputClass} /></Field>
        <Field label="Email"><input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></Field>
        <Field label="Phone"><input value={draft.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></Field>
        <Field label="Client GSTIN" hint="Needed on B2B tax invoices"><input value={draft.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} className={inputClass} /></Field>
      </div>
      <Field label="Billing address"><textarea rows={3} value={draft.address} onChange={(e) => set("address", e.target.value)} className={inputClass} /></Field>
      <Field label="Notes"><textarea rows={3} value={draft.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} /></Field>
      <FormError error={save.error || remove.error} />
      <Actions>
        {client && <button type="button" onClick={() => confirm("Delete this client?") && remove.mutate(undefined, { onSuccess: onClose })} className={dangerButton}>Delete</button>}
        <button disabled={save.isPending} className={primaryButton}>{save.isPending ? "Saving…" : "Save client"}</button>
      </Actions>
    </form>
  );
}

export default function ClientsView() {
  const { data, isLoading } = useOsState();
  const [editing, setEditing] = useState<Client | null | "new">(null);
  const [copied, setCopied] = useState<number | null>(null);
  const rotate = useOsMutation((id: number) => osFetch("POST", `/api/os/clients/${id}/rotate-portal`));

  if (isLoading || !data) return <p className="t-muted">Loading…</p>;

  async function copyPortal(client: Client) {
    try {
      await navigator.clipboard.writeText(portalUrl(client));
      setCopied(client.id);
    } catch {
      prompt("Copy the portal link:", portalUrl(client));
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Relationships</p>
          <h1 className="text-3xl t-primary">Clients</h1>
        </div>
        <button onClick={() => setEditing("new")} className={primaryButton}>New client</button>
      </header>

      <FormError error={rotate.error} />

      {data.clients.length === 0 ? (
        <Panel><Empty>No clients yet. Win a deal in the pipeline, or add one here.</Empty></Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.clients.map((client) => {
            const projects = data.projects.filter((p) => p.clientId === client.id);
            const invoices = data.invoices.filter((i) => i.clientId === client.id && i.kind === "invoice");
            const billed = invoices.filter((i) => i.status !== "Draft" && i.status !== "Cancelled").reduce((s, i) => s + invoiceTotals(i).total, 0);
            const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + invoiceTotals(i).total, 0);
            return (
              <Panel key={client.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold t-primary">{client.company || client.name}</p>
                    <p className="text-xs t-muted">{client.company ? `${client.name} · ` : ""}{client.email} {client.phone && `· ${client.phone}`}</p>
                  </div>
                  <button onClick={() => setEditing(client)} className={ghostButton}>Edit</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div><p className="text-[11px] uppercase tracking-wider t-muted">Projects</p><p className="t-primary">{projects.length}</p></div>
                  <div><p className="text-[11px] uppercase tracking-wider t-muted">Billed</p><p className="t-primary">{formatInr(billed)}</p></div>
                  <div><p className="text-[11px] uppercase tracking-wider t-muted">Paid</p><p className="t-primary">{formatInr(paid)}</p></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                  <button onClick={() => copyPortal(client)} className={ghostButton}>{copied === client.id ? "Link copied" : "Copy portal link"}</button>
                  <a href={portalUrl(client)} target="_blank" rel="noreferrer" className={ghostButton}>Preview portal</a>
                  <button onClick={() => confirm("Revoke the current portal link and issue a new one?") && rotate.mutate(client.id)} className="px-2 text-xs t-muted hover:t-primary">Reset link</button>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "New client" : "Edit client"} wide>
        {editing !== null && <ClientForm client={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
