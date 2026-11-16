import { useMemo, useState, type FormEvent } from "react";
import { EXPENSE_CATEGORIES, type Expense } from "@shared/crm";
import { todayIso } from "@shared/os";
import { formatDate, formatInr, osFetch, saveBlob, toCsv, useOsMutation, useOsState } from "@/lib/os-api";
import { useExpenses } from "@/lib/workspace-api";
import { Actions, dangerButton, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton, Stat } from "./ui";

type Draft = Omit<Expense, "id" | "createdAt" | "updatedAt">;
const blank = (): Draft => ({ date: todayIso(), category: "Software & tools", vendor: "", description: "", amountInr: 0, gstInr: 0, projectId: null });

function ExpenseForm({ expense, onClose }: { expense: Expense | null; onClose: () => void }) {
  const { data } = useOsState();
  const [draft, setDraft] = useState<Draft>(expense ?? blank());
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const save = useOsMutation(() => (expense ? osFetch("PATCH", `/api/os/expenses/${expense.id}`, draft) : osFetch("POST", "/api/os/expenses", draft)));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/expenses/${expense?.id}`));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(undefined, { onSuccess: onClose });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date"><input type="date" required value={draft.date} onChange={(e) => set("date", e.target.value)} className={inputClass} /></Field>
        <Field label="Category">
          <select value={draft.category} onChange={(e) => set("category", e.target.value as Draft["category"])} className={inputClass}>{EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label="Amount (₹, before GST)"><input type="number" min={1} required value={draft.amountInr || ""} onChange={(e) => set("amountInr", Number(e.target.value))} className={inputClass} /></Field>
        <Field label="GST paid (₹)" hint="Input tax credit, if any"><input type="number" min={0} value={draft.gstInr || ""} onChange={(e) => set("gstInr", Number(e.target.value))} className={inputClass} /></Field>
        <Field label="Vendor"><input value={draft.vendor} onChange={(e) => set("vendor", e.target.value)} className={inputClass} placeholder="Vercel, Figma, contractor name…" /></Field>
        <Field label="Project (optional)">
          <select value={draft.projectId ?? ""} onChange={(e) => set("projectId", e.target.value ? Number(e.target.value) : null)} className={inputClass}>
            <option value="">General</option>
            {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Description"><input value={draft.description} onChange={(e) => set("description", e.target.value)} className={inputClass} /></Field>
      <FormError error={save.error || remove.error} />
      <Actions>
        {expense && <button type="button" onClick={() => confirm("Delete this expense?") && remove.mutate(undefined, { onSuccess: onClose })} className={dangerButton}>Delete</button>}
        <button disabled={save.isPending} className={primaryButton}>Save</button>
      </Actions>
    </form>
  );
}

export default function ExpensesView() {
  const { data: rows = [], isLoading } = useExpenses();
  const [editing, setEditing] = useState<Expense | null | "new">(null);
  const [month, setMonth] = useState(todayIso().slice(0, 7));
  const shown = useMemo(() => rows.filter((row) => month === "all" || row.date.startsWith(month)), [rows, month]);
  const total = shown.reduce((sum, row) => sum + row.amountInr, 0);
  const gst = shown.reduce((sum, row) => sum + row.gstInr, 0);
  const byCategory = EXPENSE_CATEGORIES.map((category) => ({ category, sum: shown.filter((row) => row.category === category).reduce((s, r) => s + r.amountInr, 0) })).filter((row) => row.sum > 0);
  const months = Array.from(new Set(rows.map((row) => row.date.slice(0, 7)).concat(todayIso().slice(0, 7)))).sort().reverse();

  const exportCsv = () => {
    const body = shown.map((row) => [row.date, row.category, row.vendor, row.description, row.amountInr, row.gstInr]);
    saveBlob(new Blob([toCsv([["Date", "Category", "Vendor", "Description", "Amount (INR)", "GST (INR)"], ...body])], { type: "text/csv" }), `cubic-expenses-${month}.csv`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Money out</p>
          <h1 className="text-3xl t-primary">Expenses</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)} className={`${inputClass} !w-auto`}>
            {months.map((value) => <option key={value} value={value}>{value}</option>)}
            <option value="all">All time</option>
          </select>
          <button onClick={exportCsv} className={ghostButton}>Export CSV</button>
          <button onClick={() => setEditing("new")} className={primaryButton}>Add expense</button>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat label="Spent" value={formatInr(total)} hint={`${shown.length} entries`} />
        <Stat label="GST paid" value={formatInr(gst)} hint="Possible input credit" />
        <Stat label="Biggest category" value={[...byCategory].sort((a, b) => b.sum - a.sum)[0]?.category ?? "—"} />
      </div>
      <Panel>
        {isLoading ? (
          <p className="t-muted">Loading…</p>
        ) : shown.length === 0 ? (
          <Empty>No expenses for this period.</Empty>
        ) : (
          <ul className="divide-y divide-white/5">
            {shown.map((row) => (
              <li key={row.id}>
                <button onClick={() => setEditing(row)} className="flex w-full flex-wrap items-center gap-3 py-3 text-left text-sm">
                  <span className="w-28 t-muted">{formatDate(row.date)}</span>
                  <span className="min-w-0 flex-1 t-primary">{row.vendor || row.category}<span className="block truncate text-xs t-muted">{row.category}{row.description && ` · ${row.description}`}</span></span>
                  <span className="font-semibold t-primary">{formatInr(row.amountInr)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add expense" : "Edit expense"} wide>
        {editing !== null && <ExpenseForm expense={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
