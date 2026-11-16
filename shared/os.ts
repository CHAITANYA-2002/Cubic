import { z } from "zod";

// Cubic OS — the firm's internal operating system. Money is stored as whole rupees.

export const DEAL_STAGES = ["Lead", "Qualified", "Discovery", "Proposal", "Negotiation", "Won", "Lost"] as const;
export const PROJECT_STATUSES = ["Planning", "Active", "Review", "Delivered", "On hold"] as const;
export const MILESTONE_STATUSES = ["Pending", "In progress", "Done"] as const;
export const INVOICE_STATUSES = ["Draft", "Sent", "Paid", "Cancelled"] as const;
export const INVOICE_KINDS = ["invoice", "quote"] as const;
export const GST_MODES = ["none", "igst", "cgst_sgst"] as const;
export const LEAD_STATUSES = ["New", "Contacted", "Closed"] as const;

export const STAGE_PROBABILITY: Record<(typeof DEAL_STAGES)[number], number> = {
  Lead: 5,
  Qualified: 15,
  Discovery: 30,
  Proposal: 50,
  Negotiation: 70,
  Won: 100,
  Lost: 0,
};

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().default("");
const rupees = z.coerce.number().int().min(0).max(1_000_000_000);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").or(z.literal(""));

export const dealInput = z.object({
  title: text(160).min(2, "Give the deal a name"),
  company: optionalText(160),
  contactName: optionalText(120),
  email: z.string().trim().email().max(254).or(z.literal("")).optional().default(""),
  phone: optionalText(30),
  source: optionalText(80),
  service: optionalText(100),
  stage: z.enum(DEAL_STAGES).default("Lead"),
  valueInr: rupees.default(0),
  probability: z.coerce.number().int().min(0).max(100).optional(),
  nextAction: optionalText(240),
  nextActionDate: isoDate.optional().default(""),
  lostReason: optionalText(240),
  clientId: z.coerce.number().int().positive().nullable().optional().default(null),
  leadId: z.coerce.number().int().positive().nullable().optional().default(null),
  assignedTo: z.coerce.number().int().positive().nullable().optional().default(null),
  notes: optionalText(4000),
});

export const clientInput = z.object({
  name: text(120).min(2, "Client name is required"),
  company: optionalText(160),
  email: z.string().trim().email().max(254).or(z.literal("")).optional().default(""),
  phone: optionalText(30),
  gstin: optionalText(20),
  address: optionalText(400),
  notes: optionalText(4000),
});

export const milestoneInput = z.object({
  id: z.string().min(1).max(40),
  title: text(160).min(1),
  dueDate: isoDate.optional().default(""),
  status: z.enum(MILESTONE_STATUSES).default("Pending"),
  amountInr: rupees.default(0),
});

export const projectUpdateInput = z.object({
  id: z.string().min(1).max(40),
  date: isoDate,
  text: text(2000).min(1),
  visibleToClient: z.boolean().default(false),
});

export const projectInput = z.object({
  clientId: z.coerce.number().int().positive(),
  dealId: z.coerce.number().int().positive().nullable().optional().default(null),
  name: text(160).min(2, "Project name is required"),
  service: optionalText(100),
  status: z.enum(PROJECT_STATUSES).default("Planning"),
  startDate: isoDate.optional().default(""),
  dueDate: isoDate.optional().default(""),
  budgetInr: rupees.default(0),
  milestones: z.array(milestoneInput).max(40).default([]),
  updates: z.array(projectUpdateInput).max(200).default([]),
  notes: optionalText(4000),
});

export const lineItemInput = z.object({
  description: text(300).min(1, "Describe the line item"),
  qty: z.coerce.number().positive().max(10_000),
  rateInr: rupees,
});

export const invoiceInput = z.object({
  kind: z.enum(INVOICE_KINDS).default("invoice"),
  clientId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive().nullable().optional().default(null),
  issueDate: isoDate,
  dueDate: isoDate.optional().default(""),
  items: z.array(lineItemInput).min(1, "Add at least one line item").max(50),
  gstMode: z.enum(GST_MODES).default("none"),
  gstRate: z.coerce.number().min(0).max(28).default(18),
  status: z.enum(INVOICE_STATUSES).default("Draft"),
  paidDate: isoDate.optional().default(""),
  notes: optionalText(2000),
});

export const settingsInput = z.object({
  businessName: text(160).min(1),
  legalName: optionalText(160),
  gstin: optionalText(20),
  pan: optionalText(12),
  address: optionalText(400),
  email: optionalText(254),
  phone: optionalText(30),
  website: optionalText(200),
  bankName: optionalText(120),
  accountName: optionalText(120),
  accountNumber: optionalText(40),
  ifsc: optionalText(20),
  upiId: optionalText(80),
  invoicePrefix: text(12).min(1).default("CT"),
  paymentTermsDays: z.coerce.number().int().min(0).max(120).default(15),
  invoiceFooter: optionalText(600),
});

export type DealInput = z.infer<typeof dealInput>;
export type ClientInput = z.infer<typeof clientInput>;
export type ProjectInput = z.infer<typeof projectInput>;
export type InvoiceInput = z.infer<typeof invoiceInput>;
export type Milestone = z.infer<typeof milestoneInput>;
export type ProjectUpdate = z.infer<typeof projectUpdateInput>;
export type LineItem = z.infer<typeof lineItemInput>;
export type Settings = z.infer<typeof settingsInput>;

type Stamped = { id: number; createdAt: string; updatedAt: string };
export type Deal = Omit<DealInput, "probability"> & Stamped & { probability: number };
export type Client = ClientInput & Stamped & { portalToken: string };
export type Project = ProjectInput & Stamped;
export type Invoice = InvoiceInput & Stamped & { number: string };
export type Activity = { id: number; at: string; kind: string; text: string };

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: (typeof LEAD_STATUSES)[number];
  notes: string;
  source: string;
  assignedTo: number | null;
  page: string;
  utm: string;
  createdAt: string;
  updatedAt: string;
};

export type Dashboard = {
  newLeads: number;
  openDeals: number;
  pipelineValue: number;
  weightedPipeline: number;
  wonThisMonth: number;
  wonValueThisMonth: number;
  activeProjects: number;
  receivable: number;
  overdueReceivable: number;
  collectedThisMonth: number;
  overdueFollowUps: Deal[];
  upcomingMilestones: Array<{ projectId: number; projectName: string; milestone: Milestone }>;
  overdueInvoices: Invoice[];
  recentActivity: Activity[];
  setupWarnings: string[];
  /** Workspace v2. Money figures are zero for roles without the invoices area. */
  myOpenTasks: number;
  myOverdueTasks: number;
  dueTasks: Array<{ id: number; title: string; dueDate: string; priority: string; entityLabel: string }>;
  upcomingCalls: Array<{ id: number; name: string; company: string; startAt: string; channel: string; hostId: number }>;
  callsToday: number;
  openChats: number;
  chatsToday: number;
  leadsBySource: Array<{ source: string; count: number }>;
  expensesThisMonth: number;
  profitThisMonth: number;
  winRate: number;
};

export type PortalView = {
  client: Pick<Client, "name" | "company" | "email" | "gstin" | "address">;
  business: Omit<Settings, "invoicePrefix" | "paymentTermsDays">;
  projects: Array<Pick<Project, "id" | "name" | "service" | "status" | "startDate" | "dueDate" | "milestones" | "updates">>;
  invoices: Array<Invoice & { totals: InvoiceTotals }>;
};

export type InvoiceTotals = { subtotal: number; cgst: number; sgst: number; igst: number; tax: number; total: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Shared by the server, the admin UI and the client portal so every view agrees on the total. */
export function invoiceTotals(invoice: Pick<InvoiceInput, "items" | "gstMode" | "gstRate">): InvoiceTotals {
  const subtotal = round2(invoice.items.reduce((sum, item) => sum + item.qty * item.rateInr, 0));
  const tax = invoice.gstMode === "none" ? 0 : round2((subtotal * invoice.gstRate) / 100);
  const half = round2(tax / 2);
  return {
    subtotal,
    igst: invoice.gstMode === "igst" ? tax : 0,
    cgst: invoice.gstMode === "cgst_sgst" ? half : 0,
    sgst: invoice.gstMode === "cgst_sgst" ? round2(tax - half) : 0,
    tax,
    total: round2(subtotal + tax),
  };
}

/** Drafts get their number when issued; until then show a stable placeholder. */
export const invoiceLabel = (invoice: Pick<Invoice, "id" | "number">) => invoice.number || `Draft #${invoice.id}`;

export function isInvoiceOverdue(invoice: Pick<Invoice, "kind" | "status" | "dueDate">, today: string): boolean {
  return invoice.kind === "invoice" && invoice.status === "Sent" && invoice.dueDate !== "" && invoice.dueDate < today;
}

export function todayIso(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
