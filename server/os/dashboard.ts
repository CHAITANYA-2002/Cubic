import { invoiceTotals, isInvoiceOverdue, todayIso, type Activity, type Dashboard, type Deal, type Invoice, type Project, type Settings } from "../../shared/os";

export type DashboardInput = {
  deals: Deal[];
  projects: Project[];
  invoices: Invoice[];
  activity: Activity[];
  settings: Settings;
  newLeads: number;
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

function setupWarnings({ settings, invoices }: DashboardInput): string[] {
  const warnings = [
    !settings.legalName && "Legal entity name is blank — invoices will show the trading name only.",
    !settings.upiId && !settings.accountNumber && "No UPI ID or bank account in Settings — invoices have no payment instructions.",
    invoices.some((row) => row.gstMode !== "none") && !settings.gstin && "An invoice charges GST but no GSTIN is set in Settings.",
  ];
  return warnings.filter((warning): warning is string => Boolean(warning));
}

export function buildDashboard(input: DashboardInput): Dashboard {
  const { deals, projects, invoices, activity, newLeads } = input;
  const today = todayIso();
  const monthPrefix = today.slice(0, 7);

  const open = deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost");
  const won = deals.filter((deal) => deal.stage === "Won" && deal.updatedAt.startsWith(monthPrefix));
  const billed = invoices.filter((row) => row.kind === "invoice");
  const outstanding = billed.filter((row) => row.status === "Sent");
  const overdue = outstanding.filter((row) => isInvoiceOverdue(row, today));
  const paidThisMonth = billed.filter((row) => row.status === "Paid" && row.paidDate.startsWith(monthPrefix));

  const upcomingMilestones = projects
    .filter((project) => project.status === "Active" || project.status === "Planning" || project.status === "Review")
    .flatMap((project) =>
      project.milestones
        .filter((milestone) => milestone.status !== "Done")
        .map((milestone) => ({ projectId: project.id, projectName: project.name, milestone })),
    )
    .sort((a, b) => (a.milestone.dueDate || "9999").localeCompare(b.milestone.dueDate || "9999"))
    .slice(0, 6);

  return {
    newLeads,
    openDeals: open.length,
    pipelineValue: sum(open.map((deal) => deal.valueInr)),
    weightedPipeline: Math.round(sum(open.map((deal) => (deal.valueInr * deal.probability) / 100))),
    wonThisMonth: won.length,
    wonValueThisMonth: sum(won.map((deal) => deal.valueInr)),
    activeProjects: projects.filter((project) => project.status === "Active" || project.status === "Review").length,
    receivable: sum(outstanding.map((row) => invoiceTotals(row).total)),
    overdueReceivable: sum(overdue.map((row) => invoiceTotals(row).total)),
    collectedThisMonth: sum(paidThisMonth.map((row) => invoiceTotals(row).total)),
    overdueFollowUps: open.filter((deal) => !deal.nextActionDate || deal.nextActionDate <= today).slice(0, 8),
    upcomingMilestones,
    overdueInvoices: overdue,
    recentActivity: activity.slice(0, 12),
    setupWarnings: setupWarnings(input),
    // Filled in by the route, which knows who is asking.
    myOpenTasks: 0,
    myOverdueTasks: 0,
    dueTasks: [],
    upcomingCalls: [],
    callsToday: 0,
    openChats: 0,
    chatsToday: 0,
    leadsBySource: [],
    expensesThisMonth: 0,
    profitThisMonth: 0,
    winRate: 0,
  };
}
