import { invoiceTotals, isInvoiceOverdue, todayIso, type Dashboard } from "@shared/os";
import type { OsDocument } from "./store";

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

function setupWarnings(doc: OsDocument): string[] {
  const { settings } = doc;
  const warnings = [
    !process.env.ADMIN_PASSWORD && "ADMIN_PASSWORD is not set — the default development password is in use.",
    !settings.legalName && "Legal entity name is blank — invoices will show the trading name only.",
    !settings.upiId && !settings.accountNumber && "No UPI ID or bank account in Settings — invoices have no payment instructions.",
    doc.invoices.some((row) => row.gstMode !== "none") && !settings.gstin && "An invoice charges GST but no GSTIN is set in Settings.",
  ];
  return warnings.filter((warning): warning is string => Boolean(warning));
}

export function buildDashboard(doc: OsDocument, newLeads: number): Dashboard {
  const today = todayIso();
  const monthPrefix = today.slice(0, 7);

  const open = doc.deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost");
  const won = doc.deals.filter((deal) => deal.stage === "Won" && deal.updatedAt.startsWith(monthPrefix));
  const billed = doc.invoices.filter((row) => row.kind === "invoice");
  const outstanding = billed.filter((row) => row.status === "Sent");
  const overdue = outstanding.filter((row) => isInvoiceOverdue(row, today));
  const paidThisMonth = billed.filter((row) => row.status === "Paid" && row.paidDate.startsWith(monthPrefix));

  const upcomingMilestones = doc.projects
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
    activeProjects: doc.projects.filter((project) => project.status === "Active" || project.status === "Review").length,
    receivable: sum(outstanding.map((row) => invoiceTotals(row).total)),
    overdueReceivable: sum(overdue.map((row) => invoiceTotals(row).total)),
    collectedThisMonth: sum(paidThisMonth.map((row) => invoiceTotals(row).total)),
    overdueFollowUps: open.filter((deal) => !deal.nextActionDate || deal.nextActionDate <= today).slice(0, 8),
    upcomingMilestones,
    overdueInvoices: overdue,
    recentActivity: doc.activity.slice(0, 12),
    setupWarnings: setupWarnings(doc),
  };
}
