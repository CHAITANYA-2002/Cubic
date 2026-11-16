import type { Booking, ChatRecord, Expense, KbEntry, Task, TimelineEntry } from "../../shared/crm";
import type { Activity, Client, Deal, Invoice, Project } from "../../shared/os";
import type { ConsultationRequest, Subscriber } from "../../shared/schema";
import type { TeamUser } from "../../shared/team";
import { defineTable } from "./table";

/** A user row as stored. passwordHash and tokenVersion never leave the server. */
export type UserRow = TeamUser & { passwordHash: string; tokenVersion: number };

export const users = defineTable<UserRow>("users", [
  ["id", "id", "int"],
  ["name", "name", "text"],
  ["email", "email", "text"],
  ["role", "role", "text"],
  ["passwordHash", "password_hash", "text"],
  ["active", "active", "bool"],
  ["takesCalls", "takes_calls", "bool"],
  ["takesLeads", "takes_leads", "bool"],
  ["availability", "availability", "json"],
  ["tokenVersion", "token_version", "int"],
  ["lastLoginAt", "last_login_at", "text"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
]);

export const publicUser = ({ passwordHash: _hash, tokenVersion: _version, ...user }: UserRow): TeamUser => user;

export const timeline = defineTable<TimelineEntry>("timeline", [
  ["id", "id", "int"],
  ["entity", "entity", "text"],
  ["entityId", "entity_id", "int"],
  ["kind", "kind", "text"],
  ["text", "text", "text"],
  ["userId", "user_id", "ref"],
  ["userName", "user_name", "text"],
  ["at", "at", "text"],
]);

export const tasks = defineTable<Task>("tasks", [
  ["id", "id", "int"],
  ["title", "title", "text"],
  ["dueDate", "due_date", "text"],
  ["priority", "priority", "text"],
  ["done", "done", "bool"],
  ["entity", "entity", "text"],
  ["entityId", "entity_id", "ref"],
  ["entityLabel", "entity_label", "text"],
  ["assignedTo", "assigned_to", "ref"],
  ["createdBy", "created_by", "ref"],
  ["notes", "notes", "text"],
  ["completedAt", "completed_at", "text"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
]);

export const bookings = defineTable<Booking>("bookings", [
  ["id", "id", "int"],
  ["hostId", "host_id", "int"],
  ["leadId", "lead_id", "ref"],
  ["name", "name", "text"],
  ["email", "email", "text"],
  ["phone", "phone", "text"],
  ["company", "company", "text"],
  ["topic", "topic", "text"],
  ["notes", "notes", "text"],
  ["channel", "channel", "text"],
  ["meetingLink", "meeting_link", "text"],
  ["startAt", "start_at", "text"],
  ["endAt", "end_at", "text"],
  ["status", "status", "text"],
  ["outcome", "outcome", "text"],
  ["locale", "locale", "text"],
  ["manageToken", "manage_token", "text"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
]);

export const chats = defineTable<ChatRecord & { ipHash: string }>("chats", [
  ["id", "id", "int"],
  ["sessionId", "session_id", "text"],
  ["locale", "locale", "text"],
  ["page", "page", "text"],
  ["ipHash", "ip_hash", "text"],
  ["messages", "messages", "json"],
  ["messageCount", "message_count", "int"],
  ["leadId", "lead_id", "ref"],
  ["status", "status", "text"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
]);

export const kbEntries = defineTable<KbEntry>("kb_entries", [
  ["id", "id", "int"],
  ["question", "question", "text"],
  ["answer", "answer", "text"],
  ["tags", "tags", "text"],
  ["active", "active", "bool"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
]);

export const expenses = defineTable<Expense>("expenses", [
  ["id", "id", "int"],
  ["date", "date", "text"],
  ["category", "category", "text"],
  ["vendor", "vendor", "text"],
  ["description", "description", "text"],
  ["amountInr", "amount_inr", "int"],
  ["gstInr", "gst_inr", "int"],
  ["projectId", "project_id", "ref"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
]);

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
  ["source", "source", "text"],
  ["assignedTo", "assigned_to", "ref"],
  ["page", "page", "text"],
  ["utm", "utm", "text"],
  ["createdAt", "created_at", "text"],
  ["updatedAt", "updated_at", "text"],
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
  ["assignedTo", "assigned_to", "ref"],
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
