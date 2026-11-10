import { Link, useParams } from "wouter";
import { invoiceLabel } from "@shared/os";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { PageMeta } from "@/components/PageMeta";
import { getToken, useOsState } from "@/lib/os-api";

export default function InvoicePrint() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useOsState();

  if (!getToken()) return <p className="p-10 t-muted">Sign in at <Link href="/admin" className="underline">/admin</Link> first.</p>;
  if (isLoading) return <p className="p-10 t-muted">Loading…</p>;
  if (error || !data) return <p className="p-10 text-red-400">{error instanceof Error ? error.message : "Could not load"}</p>;

  const invoice = data.invoices.find((row) => row.id === Number(id));
  const client = invoice && data.clients.find((row) => row.id === invoice.clientId);
  if (!invoice || !client) return <p className="p-10 t-muted">Document not found.</p>;

  return (
    <div className="min-h-screen bg-neutral-200 py-10 print:bg-white print:py-0">
      <PageMeta title={invoiceLabel(invoice)} description="Invoice" />
      <div className="mx-auto mb-6 flex max-w-[820px] justify-between px-4 print:hidden">
        <Link href="/admin/invoices" className="text-sm text-neutral-700 underline">← Back to invoices</Link>
        <button onClick={() => window.print()} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white">Print / Save as PDF</button>
      </div>
      <InvoiceDocument invoice={invoice} business={data.settings} client={client} />
    </div>
  );
}
