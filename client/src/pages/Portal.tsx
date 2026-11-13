import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { PortalView } from "@shared/os";
import { PageMeta } from "@/components/PageMeta";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { formatDate, formatInr, useNoIndex } from "@/lib/os-api";

const milestoneIcon = { Done: CheckCircle2, "In progress": Loader2, Pending: Circle } as const;

async function fetchPortal(token: string): Promise<PortalView> {
  const res = await fetch(`/api/portal/${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(res.status === 404 ? "This portal link is invalid or has been reset. Ask CubicTech for a new one." : "Could not load the portal.");
  return res.json();
}

export default function Portal() {
  useNoIndex();
  const { token = "" } = useParams<{ token: string }>();
  const { data, isLoading, error } = useQuery({ queryKey: ["portal", token], queryFn: () => fetchPortal(token), retry: false });
  const [openInvoice, setOpenInvoice] = useState<number | null>(null);

  if (isLoading) return <p className="p-10 text-center t-muted">Loading your project…</p>;
  if (error || !data) return <p className="mx-auto max-w-md p-10 text-center t-secondary">{error instanceof Error ? error.message : "Not found"}</p>;

  const selected = data.invoices.find((row) => row.id === openInvoice);
  if (selected) {
    return (
      <div className="min-h-screen bg-neutral-200 py-10 print:bg-white print:py-0">
        <PageMeta title={selected.number} description="Invoice" />
        <div className="mx-auto mb-6 flex max-w-[820px] justify-between px-4 print:hidden">
          <button onClick={() => setOpenInvoice(null)} className="text-sm text-neutral-700 underline">← Back to portal</button>
          <button onClick={() => window.print()} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white">Print / Save as PDF</button>
        </div>
        <InvoiceDocument invoice={selected} business={data.business} client={data.client} />
      </div>
    );
  }

  const outstanding = data.invoices.filter((row) => row.kind === "invoice" && row.status === "Sent").reduce((sum, row) => sum + row.totals.total, 0);

  return (
    <>
      <PageMeta title={`${data.client.company || data.client.name} · Client portal`} description="Project status, milestones and invoices" />
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 md:py-16">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <p className="label mb-3">{data.business.businessName} · Client portal</p>
            <h1 className="text-3xl t-primary md:text-4xl">{data.client.company || data.client.name}</h1>
          </div>
          <div className="text-right text-sm t-muted">
            <p>Questions? {data.business.email}</p>
            <p>{data.business.phone}</p>
          </div>
        </header>

        {outstanding > 0 && (
          <div className="mb-8 rounded-2xl border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 p-5 text-sm t-secondary">
            Outstanding balance: <b className="t-primary">{formatInr(outstanding)}</b>
            {data.business.upiId && <> · UPI <b className="t-primary">{data.business.upiId}</b></>}
          </div>
        )}

        <section className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] t-muted">Projects</h2>
          {data.projects.length === 0 && <p className="t-muted">Your project will appear here once kickoff is scheduled.</p>}
          {data.projects.map((project) => {
            const done = project.milestones.filter((m) => m.status === "Done").length;
            const pct = project.milestones.length ? Math.round((done / project.milestones.length) * 100) : 0;
            return (
              <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl t-primary">{project.name}</h3>
                    <p className="text-xs t-muted">{project.service} · started {formatDate(project.startDate)}{project.dueDate && ` · target ${formatDate(project.dueDate)}`}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs t-secondary">{project.status}</span>
                </div>

                {project.milestones.length > 0 && (
                  <>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full bg-[var(--accent-primary)]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs t-muted">{pct}%</span>
                    </div>
                    <ol className="mt-5 space-y-3">
                      {project.milestones.map((m) => {
                        const Icon = milestoneIcon[m.status];
                        return (
                          <li key={m.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="flex items-center gap-3">
                              <Icon className={`h-4 w-4 ${m.status === "Done" ? "text-emerald-400" : m.status === "In progress" ? "text-[var(--accent-primary)]" : "t-muted"}`} />
                              <span className={m.status === "Done" ? "t-muted" : "t-secondary"}>{m.title}</span>
                            </span>
                            <span className="text-xs t-muted">{formatDate(m.dueDate)}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </>
                )}

                {project.updates.length > 0 && (
                  <div className="mt-6 border-t border-white/5 pt-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.15em] t-muted">Updates</p>
                    <ul className="space-y-4">
                      {project.updates.map((u) => (
                        <li key={u.id} className="text-sm">
                          <p className="text-xs t-muted">{formatDate(u.date)}</p>
                          <p className="whitespace-pre-line t-secondary">{u.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {data.invoices.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] t-muted">Quotes &amp; invoices</h2>
            <ul className="divide-y divide-white/5 rounded-2xl border border-white/10">
              {data.invoices.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                  <span>
                    <span className="t-primary">{row.number}</span>
                    <span className="ml-3 text-xs t-muted">{row.kind === "quote" ? "Quote" : "Invoice"} · {formatDate(row.issueDate)}</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="t-primary">{formatInr(row.totals.total)}</span>
                    <span className="text-xs t-muted">{row.status}</span>
                    <button onClick={() => setOpenInvoice(row.id)} className="text-xs text-[var(--accent-primary)] hover:underline">View</button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-16 text-center text-xs t-muted">This page is private to you. Please don't share the link.</footer>
      </main>
    </>
  );
}
