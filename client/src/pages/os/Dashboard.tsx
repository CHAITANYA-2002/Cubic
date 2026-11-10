import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { invoiceLabel } from "@shared/os";
import { formatDate, formatInr, useDashboard } from "@/lib/os-api";
import { Badge, Empty, Panel, Stat } from "./ui";

export default function DashboardView() {
  const { data, isLoading, error } = useDashboard();
  if (isLoading) return <p className="t-muted">Loading…</p>;
  if (error || !data) return <p className="text-red-400">{error instanceof Error ? error.message : "Could not load dashboard"}</p>;

  return (
    <div className="space-y-8">
      <header>
        <p className="label mb-2">Today</p>
        <h1 className="text-3xl t-primary">Dashboard</h1>
      </header>

      {data.setupWarnings.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300"><AlertTriangle className="h-4 w-4" /> Finish setting up</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-100/80">
            {data.setupWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
          <Link href="/admin/settings" className="mt-3 inline-block text-sm text-amber-300 underline">Open settings</Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="New enquiries" value={data.newLeads} tone={data.newLeads > 0 ? "warn" : "default"} hint="Unanswered website leads" />
        <Stat label="Open pipeline" value={formatInr(data.pipelineValue)} hint={`${data.openDeals} deals · weighted ${formatInr(data.weightedPipeline)}`} />
        <Stat label="Won this month" value={formatInr(data.wonValueThisMonth)} hint={`${data.wonThisMonth} deals`} tone="good" />
        <Stat label="Active projects" value={data.activeProjects} hint="Capacity: 2 at a time" tone={data.activeProjects > 2 ? "warn" : "default"} />
        <Stat label="Receivable" value={formatInr(data.receivable)} hint="Sent, not yet paid" />
        <Stat label="Overdue" value={formatInr(data.overdueReceivable)} tone={data.overdueReceivable > 0 ? "warn" : "default"} hint={`${data.overdueInvoices.length} invoices`} />
        <Stat label="Collected this month" value={formatInr(data.collectedThisMonth)} tone="good" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Follow-ups due" action={<Link href="/admin/pipeline" className="text-xs t-muted hover:t-primary">Pipeline →</Link>}>
          {data.overdueFollowUps.length === 0 ? (
            <Empty>No follow-ups due. Every open deal has a future next action.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.overdueFollowUps.map((deal) => (
                <li key={deal.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm t-primary">{deal.title}</p>
                    <p className="text-xs t-muted">{deal.nextAction || "No next action set"}</p>
                  </div>
                  <Badge tone={deal.nextActionDate ? "warn" : "bad"}>{deal.nextActionDate ? formatDate(deal.nextActionDate) : "No date"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Upcoming milestones" action={<Link href="/admin/projects" className="text-xs t-muted hover:t-primary">Projects →</Link>}>
          {data.upcomingMilestones.length === 0 ? (
            <Empty>No open milestones.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.upcomingMilestones.map(({ projectId, projectName, milestone }) => (
                <li key={`${projectId}-${milestone.id}`} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm t-primary">{milestone.title}</p>
                    <p className="text-xs t-muted">{projectName}{milestone.amountInr ? ` · ${formatInr(milestone.amountInr)}` : ""}</p>
                  </div>
                  <Badge tone={milestone.status === "In progress" ? "info" : "default"}>{formatDate(milestone.dueDate)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Overdue invoices" action={<Link href="/admin/invoices" className="text-xs t-muted hover:t-primary">Invoices →</Link>}>
          {data.overdueInvoices.length === 0 ? (
            <Empty>Nothing overdue.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.overdueInvoices.map((invoice) => (
                <li key={invoice.id} className="flex justify-between py-3 text-sm">
                  <span className="t-primary">{invoiceLabel(invoice)}</span>
                  <Badge tone="bad">Due {formatDate(invoice.dueDate)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent activity">
          {data.recentActivity.length === 0 ? (
            <Empty>Activity shows up here as you work.</Empty>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.map((entry) => (
                <li key={entry.id} className="flex justify-between gap-4 text-sm">
                  <span className="t-secondary">{entry.text}</span>
                  <span className="shrink-0 text-xs t-muted">{formatDate(entry.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
