import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { LEAD_STATUSES, type Deal, type Lead } from "@shared/os";
import { formatDate, osFetch, useLeads, useOsMutation } from "@/lib/os-api";
import { Badge, Empty, FormError, inputClass, Panel, primaryButton, ghostButton } from "./ui";

const statusTone = { New: "warn", Contacted: "info", Closed: "default" } as const;

function exportCsv(rows: Lead[]) {
  const header = ["Name", "Email", "Phone", "Company", "Service", "Budget", "Message", "Status", "Date"];
  const body = rows.map((lead) => [lead.name, lead.email, lead.phone, lead.company, lead.service, lead.budget, lead.message, lead.status, lead.createdAt]);
  const csv = [header, ...body].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "cubic-leads.csv" });
  link.click();
  URL.revokeObjectURL(url);
}

const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

export default function LeadsView() {
  const { data: leads = [], isLoading } = useLeads();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [, navigate] = useLocation();

  const update = useOsMutation(({ id, status }: { id: number; status: Lead["status"] }) => osFetch("PATCH", `/api/admin/submissions/${id}`, { status }));
  const remove = useOsMutation((id: number) => osFetch("DELETE", `/api/admin/submissions/${id}`));
  const convert = useOsMutation((id: number) => osFetch<Deal>("POST", `/api/os/leads/${id}/convert`));

  const visible = useMemo(
    () =>
      leads.filter(
        (lead) =>
          (filter === "All" || lead.status === filter) &&
          `${lead.name} ${lead.email} ${lead.company} ${lead.service}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [leads, search, filter],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Website enquiries</p>
          <h1 className="text-3xl t-primary">Inbox</h1>
        </div>
        <button onClick={() => exportCsv(visible)} className={ghostButton}>Export CSV</button>
      </header>

      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} max-w-xs`} placeholder="Search enquiries" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} !w-auto`}>
          {["All", ...LEAD_STATUSES].map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>

      <FormError error={update.error || remove.error || convert.error} />

      {isLoading ? (
        <p className="t-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <Panel><Empty>No enquiries yet. They arrive here from the contact form.</Empty></Panel>
      ) : (
        <div className="space-y-3">
          {visible.map((lead) => (
            <Panel key={lead.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold t-primary">{lead.name}</p>
                    <Badge tone={statusTone[lead.status]}>{lead.status}</Badge>
                    {lead.service && <Badge>{lead.service}</Badge>}
                    {lead.budget && <Badge>{lead.budget}</Badge>}
                  </div>
                  <p className="mt-1 text-xs t-muted">
                    {lead.company && `${lead.company} · `}{lead.email} · {lead.phone} · {formatDate(lead.createdAt)}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-sm t-secondary">{lead.message}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`mailto:${lead.email}`} className={ghostButton}>Email</a>
                  <a href={whatsappLink(lead.phone)} target="_blank" rel="noreferrer" className={ghostButton}>WhatsApp</a>
                  <select value={lead.status} onChange={(e) => update.mutate({ id: lead.id, status: e.target.value as Lead["status"] })} className={`${inputClass} !w-auto`}>
                    {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <button
                    disabled={convert.isPending}
                    onClick={() => convert.mutate(lead.id, { onSuccess: () => navigate("/admin/pipeline") })}
                    className={primaryButton}
                  >
                    Qualify → deal
                  </button>
                  <button onClick={() => confirm(`Delete the enquiry from ${lead.name}?`) && remove.mutate(lead.id)} className="px-2 text-sm text-red-300">Delete</button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
