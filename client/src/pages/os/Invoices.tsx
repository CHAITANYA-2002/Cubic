import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { GST_MODES, INVOICE_STATUSES, invoiceLabel, invoiceTotals, isInvoiceOverdue, todayIso, type Invoice, type InvoiceInput, type LineItem } from "@shared/os";
import { formatDate, formatInr, osFetch, useOsMutation, useOsState, type OsState } from "@/lib/os-api";
import { Actions, Badge, dangerButton, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton } from "./ui";

const statusTone = { Draft: "default", Sent: "info", Paid: "good", Cancelled: "bad" } as const;
const gstLabels: Record<(typeof GST_MODES)[number], string> = { none: "No GST", igst: "IGST (other state)", cgst_sgst: "CGST + SGST (same state)" };

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayIso(d);
};

function InvoiceForm({ invoice, kind, state, onClose }: { invoice: Invoice | null; kind: Invoice["kind"]; state: OsState; onClose: () => void }) {
  const issue = todayIso();
  const [draft, setDraft] = useState<InvoiceInput>(
    invoice
      ? { ...invoice }
      : {
          kind,
          clientId: state.clients[0]?.id ?? 0,
          projectId: null,
          issueDate: issue,
          dueDate: addDays(issue, kind === "quote" ? 14 : state.settings.paymentTermsDays),
          items: [{ description: "", qty: 1, rateInr: 0 }],
          gstMode: state.settings.gstin ? "cgst_sgst" : "none",
          gstRate: 18,
          status: "Draft",
          paidDate: "",
          notes: kind === "quote" ? "Fixed price. Payment: 40% to start, 30% at the midpoint milestone, 30% on delivery. Scope changes are re-quoted in writing. This quote is valid for 14 days." : "",
        },
  );
  const set = <K extends keyof InvoiceInput>(key: K, value: InvoiceInput[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const setItem = (index: number, change: Partial<LineItem>) => set("items", draft.items.map((item, i) => (i === index ? { ...item, ...change } : item)));

  const save = useOsMutation((body: InvoiceInput) => (invoice ? osFetch("PATCH", `/api/os/invoices/${invoice.id}`, body) : osFetch("POST", "/api/os/invoices", body)));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/invoices/${invoice!.id}`));
  const totals = invoiceTotals(draft);
  const projects = state.projects.filter((p) => p.clientId === draft.clientId);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, { onSuccess: onClose });
  };

  if (state.clients.length === 0) return <Empty>Add a client first.</Empty>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client">
          <select value={draft.clientId} onChange={(e) => setDraft({ ...draft, clientId: Number(e.target.value), projectId: null })} className={inputClass}>
            {state.clients.map((c) => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </Field>
        <Field label="Project (optional)">
          <select value={draft.projectId ?? ""} onChange={(e) => set("projectId", e.target.value ? Number(e.target.value) : null)} className={inputClass}>
            <option value="">—</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Issue date"><input type="date" required value={draft.issueDate} onChange={(e) => set("issueDate", e.target.value)} className={inputClass} /></Field>
        <Field label={draft.kind === "quote" ? "Valid until" : "Due date"}><input type="date" value={draft.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={inputClass} /></Field>
        <Field label="GST">
          <select value={draft.gstMode} onChange={(e) => set("gstMode", e.target.value as InvoiceInput["gstMode"])} className={inputClass}>
            {GST_MODES.map((m) => <option key={m} value={m}>{gstLabels[m]}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select value={draft.status} onChange={(e) => set("status", e.target.value as InvoiceInput["status"])} className={inputClass}>
            {INVOICE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      {draft.gstMode !== "none" && !state.settings.gstin && <p className="text-xs text-amber-300">You are charging GST but no GSTIN is set in Settings. Only GST-registered businesses may charge GST.</p>}

      <Field label="Line items">
        <div className="space-y-2">
          {draft.items.map((item, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_80px_130px_auto]">
              <input required value={item.description} onChange={(e) => setItem(index, { description: e.target.value })} className={inputClass} placeholder="Description" />
              <input type="number" min={0.01} step="any" value={item.qty} onChange={(e) => setItem(index, { qty: Number(e.target.value) })} className={inputClass} aria-label="Quantity" />
              <input type="number" min={0} value={item.rateInr} onChange={(e) => setItem(index, { rateInr: Number(e.target.value) })} className={inputClass} aria-label="Rate in rupees" />
              <button type="button" disabled={draft.items.length === 1} onClick={() => set("items", draft.items.filter((_, i) => i !== index))} className="px-2 text-sm text-red-300 disabled:opacity-30" aria-label="Remove line">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => set("items", [...draft.items, { description: "", qty: 1, rateInr: 0 }])} className={ghostButton}>+ Line</button>
        </div>
      </Field>

      <div className="ml-auto max-w-xs space-y-1 text-sm">
        <p className="flex justify-between t-muted"><span>Subtotal</span><span>{formatInr(totals.subtotal)}</span></p>
        {totals.tax > 0 && <p className="flex justify-between t-muted"><span>GST</span><span>{formatInr(totals.tax)}</span></p>}
        <p className="flex justify-between font-semibold t-primary"><span>Total</span><span>{formatInr(totals.total)}</span></p>
      </div>

      <Field label="Notes / terms"><textarea rows={3} value={draft.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} /></Field>
      {invoice && invoice.status !== "Draft" && <p className="text-xs text-amber-300">Issued — the client has seen this. Only status, payment date and notes can change; cancel and reissue to correct anything else.</p>}
      <FormError error={save.error || remove.error} />
      <Actions>
        {invoice && (invoice.kind === "quote" || !invoice.number) && <button type="button" onClick={() => confirm("Delete this document?") && remove.mutate(undefined, { onSuccess: onClose })} className={dangerButton}>Delete</button>}
        <button disabled={save.isPending} className={primaryButton}>{save.isPending ? "Saving…" : "Save"}</button>
      </Actions>
    </form>
  );
}

export default function InvoicesView() {
  const { data, isLoading } = useOsState();
  const [kind, setKind] = useState<Invoice["kind"]>("invoice");
  const [editing, setEditing] = useState<Invoice | null | "new">(null);
  const setStatus = useOsMutation(({ id, status }: { id: number; status: Invoice["status"] }) => osFetch("PATCH", `/api/os/invoices/${id}`, { status }));
  const convert = useOsMutation((quote: Invoice) =>
    osFetch("POST", "/api/os/invoices", {
      ...quote,
      kind: "invoice",
      status: "Draft",
      issueDate: todayIso(),
      dueDate: addDays(todayIso(), data?.settings.paymentTermsDays ?? 15),
      paidDate: "",
    }),
  );

  if (isLoading || !data) return <p className="t-muted">Loading…</p>;
  const today = todayIso();
  const rows = data.invoices.filter((row) => row.kind === kind);
  const clientName = (id: number) => {
    const client = data.clients.find((c) => c.id === id);
    return client ? client.company || client.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Finance</p>
          <h1 className="text-3xl t-primary">Invoices &amp; quotes</h1>
        </div>
        <button onClick={() => setEditing("new")} className={primaryButton}>New {kind}</button>
      </header>

      <div className="flex gap-2">
        {(["invoice", "quote"] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`rounded-xl px-4 py-2 text-sm ${kind === k ? "bg-white/10 t-primary" : "t-muted hover:bg-white/5"}`}>
            {k === "invoice" ? "Invoices" : "Quotes"}
          </button>
        ))}
      </div>

      <FormError error={setStatus.error || convert.error} />

      {rows.length === 0 ? (
        <Panel><Empty>No {kind === "invoice" ? "invoices" : "quotes"} yet.</Empty></Panel>
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="t-muted">
              <tr>{["Number", "Client", "Issued", kind === "quote" ? "Valid until" : "Due", "Total", "Status", ""].map((h) => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => {
                const overdue = isInvoiceOverdue(row, today);
                return (
                  <tr key={row.id}>
                    <td className="py-3"><button onClick={() => setEditing(row)} className="t-primary hover:underline">{invoiceLabel(row)}</button></td>
                    <td className="py-3 t-secondary">{clientName(row.clientId)}</td>
                    <td className="py-3 t-muted">{formatDate(row.issueDate)}</td>
                    <td className="py-3 t-muted">{formatDate(row.dueDate)}</td>
                    <td className="py-3 t-primary">{formatInr(invoiceTotals(row).total)}</td>
                    <td className="py-3">{overdue ? <Badge tone="bad">Overdue</Badge> : <Badge tone={statusTone[row.status]}>{row.status}</Badge>}</td>
                    <td className="py-3 text-right">
                      <span className="flex justify-end gap-3 text-xs">
                        <Link href={`/admin/print/${row.id}`} className="t-muted hover:t-primary">PDF</Link>
                        {row.status === "Draft" && <button onClick={() => setStatus.mutate({ id: row.id, status: "Sent" })} className="t-muted hover:t-primary">Mark sent</button>}
                        {row.kind === "invoice" && row.status === "Sent" && <button onClick={() => setStatus.mutate({ id: row.id, status: "Paid" })} className="text-emerald-300">Mark paid</button>}
                        {row.kind === "quote" && <button onClick={() => convert.mutate(row, { onSuccess: () => setKind("invoice") })} className="text-[var(--accent-primary)]">→ Invoice</button>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? `New ${kind}` : editing ? invoiceLabel(editing) : ""} wide>
        {editing !== null && <InvoiceForm invoice={editing === "new" ? null : editing} kind={kind} state={data} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
