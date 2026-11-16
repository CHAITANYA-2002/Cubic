import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { invoiceLabel } from "@shared/os";
import { formatDate, formatInr, useDashboard } from "@/lib/os-api";
import { istDateTime, nameOf, useMe, useTeam } from "@/lib/workspace-api";
import { Badge, Empty, Panel, Stat } from "./ui";

const more = (href: string, label: string) => <Link href={href} className="text-xs t-muted hover:t-primary">{label} →</Link>;

export default function DashboardView() {
  const me = useMe();
  const { data: team } = useTeam();
  const { data, isLoading, error } = useDashboard();
  if (isLoading) return <p className="t-muted">Loading…</p>;
  if (error || !data) return <p className="text-red-400">{error instanceof Error ? error.message : "Could not load dashboard"}</p>;
  const money = me.areas.includes("invoices");
  const sees = (area: (typeof me.areas)[number]) => me.areas.includes(area);
  const sourceTotal = data.leadsBySource.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="label mb-2">Today · {me.name}</p>
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
        <Stat label="New leads" value={data.newLeads} tone={data.newLeads > 0 ? "warn" : "default"} hint="Not yet contacted" />
        <Stat label="My tasks" value={data.myOpenTasks} tone={data.myOverdueTasks > 0 ? "warn" : "default"} hint={`${data.myOverdueTasks} overdue`} />
        <Stat label="Calls today" value={data.callsToday} hint={`${data.upcomingCalls.length} coming up`} />
        {sees("chats") && <Stat label="Chats to review" value={data.openChats} hint={`${data.chatsToday} started today`} />}
        {sees("pipeline") && <Stat label="Open pipeline" value={formatInr(data.pipelineValue)} hint={`${data.openDeals} deals · weighted ${formatInr(data.weightedPipeline)}`} />}
        {sees("pipeline") && <Stat label="Won this month" value={formatInr(data.wonValueThisMonth)} hint={`${data.wonThisMonth} deals · win rate ${data.winRate}%`} tone="good" />}
        {(sees("projects") || money) && <Stat label="Active projects" value={data.activeProjects} hint="Capacity: 2 at a time" tone={data.activeProjects > 2 ? "warn" : "default"} />}
        {money && <Stat label="Receivable" value={formatInr(data.receivable)} hint={`${formatInr(data.overdueReceivable)} overdue`} tone={data.overdueReceivable > 0 ? "warn" : "default"} />}
        {money && <Stat label="Collected this month" value={formatInr(data.collectedThisMonth)} tone="good" />}
        {money && <Stat label="Spent this month" value={formatInr(data.expensesThisMonth)} />}
        {money && <Stat label="Cash profit this month" value={formatInr(data.profitThisMonth)} tone={data.profitThisMonth >= 0 ? "good" : "warn"} hint="Collected − expenses" />}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Tasks due" action={more("/admin/tasks", "Tasks")}>
          {data.dueTasks.length === 0 ? (
            <Empty>Nothing due. Add follow-ups from any lead.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.dueTasks.map((task) => (
                <li key={task.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm t-primary">{task.title}</p>
                    {task.entityLabel && <p className="text-xs t-muted">{task.entityLabel}</p>}
                  </div>
                  <Badge tone={task.priority === "High" ? "bad" : "warn"}>{formatDate(task.dueDate)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Upcoming calls (IST)" action={more("/admin/calls", "Calls")}>
          {data.upcomingCalls.length === 0 ? (
            <Empty>No calls booked. Share /book.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.upcomingCalls.map((call) => (
                <li key={call.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm t-primary">{call.name}{call.company && ` · ${call.company}`}</p>
                    <p className="text-xs t-muted">{call.channel} · {nameOf(team, call.hostId)}</p>
                  </div>
                  <Badge tone="info">{istDateTime(call.startAt)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {sees("pipeline") && (
          <Panel title="Follow-ups due" action={more("/admin/pipeline", "Pipeline")}>
            {data.overdueFollowUps.length === 0 ? (
              <Empty>Every open deal has a future next action.</Empty>
            ) : (
              <ul className="divide-y divide-white/5">
                {data.overdueFollowUps.map((deal) => (
                  <li key={deal.id} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm t-primary">{deal.title}</p>
                      <p className="text-xs t-muted">{deal.nextAction || "No next action set"} · {nameOf(team, deal.assignedTo)}</p>
                    </div>
                    <Badge tone={deal.nextActionDate ? "warn" : "bad"}>{deal.nextActionDate ? formatDate(deal.nextActionDate) : "No date"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        <Panel title="Where leads came from (this month)" action={more("/admin/leads", "Inbox")}>
          {data.leadsBySource.length === 0 ? (
            <Empty>No leads this month yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {data.leadsBySource.map((row) => (
                <li key={row.source} className="text-sm">
                  <div className="flex justify-between"><span className="t-secondary">{row.source}</span><span className="t-primary">{row.count}</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${Math.round((row.count / sourceTotal) * 100)}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {(sees("projects") || money) && (
          <Panel title="Upcoming milestones" action={more("/admin/projects", "Projects")}>
            {data.upcomingMilestones.length === 0 ? (
              <Empty>No open milestones.</Empty>
            ) : (
              <ul className="divide-y divide-white/5">
                {data.upcomingMilestones.map(({ projectId, projectName, milestone }) => (
                  <li key={`${projectId}-${milestone.id}`} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm t-primary">{milestone.title}</p>
                      <p className="text-xs t-muted">{projectName}{money && milestone.amountInr ? ` · ${formatInr(milestone.amountInr)}` : ""}</p>
                    </div>
                    <Badge tone={milestone.status === "In progress" ? "info" : "default"}>{formatDate(milestone.dueDate)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        {money && (
          <Panel title="Overdue invoices" action={more("/admin/invoices", "Invoices")}>
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
        )}

        {data.recentActivity.length > 0 && (
          <Panel title="Recent activity">
            <ul className="space-y-3">
              {data.recentActivity.map((entry) => (
                <li key={entry.id} className="flex justify-between gap-4 text-sm">
                  <span className="t-secondary">{entry.text}</span>
                  <span className="shrink-0 text-xs t-muted">{formatDate(entry.at)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}
