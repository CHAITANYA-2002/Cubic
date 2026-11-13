import { useMemo, useState } from "react";
import { formatDate, saveBlob, toCsv, useSubscribers } from "@/lib/os-api";
import { Empty, FormError, ghostButton, inputClass, Panel } from "./ui";

export default function SubscribersView() {
  const { data: subscribers = [], isLoading, error } = useSubscribers();
  const [search, setSearch] = useState("");

  const visible = useMemo(() => subscribers.filter((row) => row.email.includes(search.trim().toLowerCase())), [subscribers, search]);

  const exportCsv = () => {
    const rows = [["Email", "Subscribed"], ...visible.map((row) => [row.email, row.subscribedAt])];
    saveBlob(new Blob([toCsv(rows)], { type: "text/csv" }), `cubic-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Newsletter</p>
          <h1 className="text-3xl t-primary">Subscribers</h1>
          <p className="mt-1 text-sm t-muted">{subscribers.length} total. Only email people who signed up, and honour unsubscribe requests.</p>
        </div>
        <button onClick={exportCsv} disabled={visible.length === 0} className={`${ghostButton} disabled:opacity-50`}>Export CSV</button>
      </header>

      <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} max-w-xs`} placeholder="Search emails" aria-label="Search subscribers" />
      <FormError error={error} />

      {isLoading ? (
        <p className="t-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <Panel><Empty>No subscribers yet. They arrive from the newsletter form on the site.</Empty></Panel>
      ) : (
        <Panel>
          <ul className="divide-y divide-white/5">
            {visible.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <a href={`mailto:${row.email}`} className="t-primary hover:underline">{row.email}</a>
                <span className="text-xs t-muted">{formatDate(row.subscribedAt)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
