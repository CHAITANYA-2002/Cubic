import type { Activity, Client, Deal, Invoice, Project } from "../../shared/os";
import type { ConsultationRequest, Subscriber } from "../../shared/schema";
import { defineTable } from "./table";

const stamps = [
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
] as const;

export const leads = defineTable<ConsultationRequest>("leads", [
  ["id", "id", "int"],
  ["name", "name", "text"],
  ["email", "email", "text"],
  ["phone", "phone", "text"],
  ["company", "company", "text"],
  ["service", "service", "text"],
  ["budget", "budget", "text"],
  ["message", "message", "text"],
  ["status", "status", "text"],
  ["notes", "notes", "text"],
  ["createdAt", "created_at", "text"],
]);

export const subscribers = defineTable<Subscriber>("subscribers", [
  ["id", "id", "int"],
  ["email", "email", "text"],
  ["subscribedAt", "subscribed_at", "text"],
]);

export const clients = defineTable<Client>("clients", [
  ["id", "id", "int"],
  ["name", "name", "text"],
  ["company", "company", "text"],
  ["email", "email", "text"],
  ["phone", "phone", "text"],
  ["gstin", "gstin", "text"],
  ["address", "address", "text"],
  ["notes", "notes", "text"],
  ["portalToken", "portal_token", "text"],
  ...stamps,
]);

export const deals = defineTable<Deal>("deals", [
  ["id", "id", "int"],
  ["title", "title", "text"],
  ["company", "company", "text"],
  ["contactName", "contact_name", "text"],
  ["email", "email", "text"],
  ["phone", "phone", "text"],
  ["source", "source", "text"],
  ["service", "service", "text"],
  ["stage", "stage", "text"],
  ["valueInr", "value_inr", "int"],
  ["probability", "probability", "int"],
  ["nextAction", "next_action", "text"],
  ["nextActionDate", "next_action_date", "text"],
  ["lostReason", "lost_reason", "text"],
  ["clientId", "client_id", "ref"],
  ["leadId", "lead_id", "ref"],
  ["notes", "notes", "text"],
  ...stamps,
]);

export const projects = defineTable<Project>("projects", [
  ["id", "id", "int"],
  ["clientId", "client_id", "int"],
  ["dealId", "deal_id", "ref"],
  ["name", "name", "text"],
  ["service", "service", "text"],
  ["status", "status", "text"],
  ["startDate", "start_date", "text"],
  ["dueDate", "due_date", "text"],
  ["budgetInr", "budget_inr", "int"],
  ["milestones", "milestones", "json"],
  ["updates", "updates", "json"],
  ["notes", "notes", "text"],
  ...stamps,
]);

export const invoices = defineTable<Invoice>("invoices", [
  ["id", "id", "int"],
  ["kind", "kind", "text"],
  ["clientId", "client_id", "int"],
  ["projectId", "project_id", "ref"],
  ["number", "number", "text"],
  ["issueDate", "issue_date", "text"],
  ["dueDate", "due_date", "text"],
  ["items", "items", "json"],
  ["gstMode", "gst_mode", "text"],
  ["gstRate", "gst_rate", "real"],
  ["status", "status", "text"],
  ["paidDate", "paid_date", "text"],
  ["notes", "notes", "text"],
  ...stamps,
]);

export const activity = defineTable<Activity>("activity", [
  ["id", "id", "int"],
  ["at", "at", "text"],
  ["kind", "kind", "text"],
  ["text", "text", "text"],
]);
