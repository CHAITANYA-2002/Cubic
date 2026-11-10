import { invoiceLabel, invoiceTotals, type Invoice, type Settings } from "@shared/os";

export type InvoiceParty = { name: string; company: string; email?: string; gstin?: string; address?: string };
export type InvoiceBusiness = Partial<Settings> & Pick<Settings, "businessName">;

const inr = (value: number) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (iso: string) => (iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—");

/** Paper-style invoice / quote. Always light, so it prints and saves to PDF cleanly. */
export function InvoiceDocument({ invoice, business, client }: { invoice: Invoice; business: InvoiceBusiness; client: InvoiceParty }) {
  const totals = invoiceTotals(invoice);
  const isQuote = invoice.kind === "quote";
  // A tax invoice is only valid from a GST-registered business.
  const taxInvoice = !isQuote && invoice.gstMode !== "none" && Boolean(business.gstin);
  const title = isQuote ? "Quotation" : taxInvoice ? "Tax Invoice" : "Invoice";
  const hasPayment = business.upiId || business.accountNumber;

  return (
    <article className="invoice-paper mx-auto w-full max-w-[820px] bg-white p-8 text-[13px] leading-relaxed text-neutral-800 shadow-2xl sm:p-12">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-neutral-900">{business.businessName}</p>
          {business.legalName && business.legalName !== business.businessName && <p>{business.legalName}</p>}
          {business.address && <p className="whitespace-pre-line text-neutral-600">{business.address}</p>}
          <p className="text-neutral-600">{[business.email, business.phone].filter(Boolean).join(" · ")}</p>
          {business.gstin && <p className="text-neutral-600">GSTIN: {business.gstin}</p>}
          {business.pan && <p className="text-neutral-600">PAN: {business.pan}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a8794c]">{title}</p>
          <p className="mt-1 text-lg font-semibold text-neutral-900">{invoiceLabel(invoice)}</p>
          <p className="text-neutral-600">Issued {date(invoice.issueDate)}</p>
          {invoice.dueDate && <p className="text-neutral-600">{isQuote ? "Valid until" : "Due"} {date(invoice.dueDate)}</p>}
          {invoice.status === "Paid" && <p className="mt-2 inline-block rounded border border-emerald-600 px-2 py-0.5 text-xs font-semibold text-emerald-700">PAID {invoice.paidDate && date(invoice.paidDate)}</p>}
          {invoice.status === "Cancelled" && <p className="mt-2 inline-block rounded border border-red-600 px-2 py-0.5 text-xs font-semibold text-red-700">CANCELLED</p>}
        </div>
      </header>

      <section className="py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">{isQuote ? "Prepared for" : "Billed to"}</p>
        <p className="mt-1 font-semibold text-neutral-900">{client.company || client.name}</p>
        {client.company && <p>{client.name}</p>}
        {client.address && <p className="whitespace-pre-line text-neutral-600">{client.address}</p>}
        {client.email && <p className="text-neutral-600">{client.email}</p>}
        {client.gstin && <p className="text-neutral-600">GSTIN: {client.gstin}</p>}
      </section>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-y border-neutral-300 text-left text-xs uppercase tracking-wider text-neutral-500">
            <th className="py-2 pr-2 font-semibold">#</th>
            <th className="py-2 pr-2 font-semibold">Description</th>
            <th className="py-2 pr-2 text-right font-semibold">Qty</th>
            <th className="py-2 pr-2 text-right font-semibold">Rate</th>
            <th className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-neutral-100 align-top">
              <td className="py-3 pr-2 text-neutral-500">{index + 1}</td>
              <td className="py-3 pr-2 whitespace-pre-line">{item.description}</td>
              <td className="py-3 pr-2 text-right">{item.qty}</td>
              <td className="py-3 pr-2 text-right">{inr(item.rateInr)}</td>
              <td className="py-3 text-right">{inr(item.qty * item.rateInr)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto mt-4 w-full max-w-xs space-y-1">
        <Row label="Subtotal" value={inr(totals.subtotal)} />
        {invoice.gstMode === "igst" && <Row label={`IGST @ ${invoice.gstRate}%`} value={inr(totals.igst)} />}
        {invoice.gstMode === "cgst_sgst" && (
          <>
            <Row label={`CGST @ ${invoice.gstRate / 2}%`} value={inr(totals.cgst)} />
            <Row label={`SGST @ ${invoice.gstRate / 2}%`} value={inr(totals.sgst)} />
          </>
        )}
        <div className="flex justify-between border-t border-neutral-300 pt-2 text-base font-semibold text-neutral-900">
          <span>Total</span>
          <span>{inr(totals.total)}</span>
        </div>
      </div>

      {invoice.notes && (
        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Notes</p>
          <p className="mt-1 whitespace-pre-line text-neutral-700">{invoice.notes}</p>
        </section>
      )}

      {!isQuote && hasPayment && (
        <section className="mt-8 rounded-lg bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">How to pay</p>
          {business.upiId && <p className="mt-1">UPI: <b>{business.upiId}</b></p>}
          {business.accountNumber && (
            <p className="mt-1">
              Bank transfer: {business.accountName} · A/c {business.accountNumber} · IFSC {business.ifsc} {business.bankName && `· ${business.bankName}`}
            </p>
          )}
          <p className="mt-1 text-neutral-500">Please quote {invoiceLabel(invoice)} as the payment reference.</p>
        </section>
      )}

      {business.invoiceFooter && <p className="mt-10 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-500">{business.invoiceFooter}</p>}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-neutral-700">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
