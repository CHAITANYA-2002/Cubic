import { z } from "zod";
import { CALL_CHANNELS } from "./team";

// Sales workspace records: lead sources, timeline, tasks, calls, chatbot, expenses.

const text = (max: number) => z.string().trim().max(max);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const optionalDate = isoDate.or(z.literal(""));
const rupees = z.coerce.number().int().min(0).max(1_000_000_000);
const email = z.string().trim().toLowerCase().email("Enter a valid email").max(254);
const phone = text(30).refine((value) => value === "" || value.replace(/\D/g, "").length >= 7, "Enter a valid phone number");

export const LEAD_SOURCES = ["Website form", "Chatbot", "Call booking", "WhatsApp", "Phone", "Email", "Referral", "LinkedIn", "Event", "Other"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

/** A lead the team adds by hand (a WhatsApp message, a referral, a phone call). */
export const manualLeadInput = z.object({
  name: text(100).min(2, "Name is required"),
  email: email.or(z.literal("")).default(""),
  phone: phone.default(""),
  company: text(120).default(""),
  service: text(100).default(""),
  budget: text(100).default(""),
  message: text(3000).default(""),
  source: z.enum(LEAD_SOURCES).default("Other"),
  assignedTo: z.coerce.number().int().positive().nullable().default(null),
});

export const leadPatchInput = z.object({
  status: z.enum(["New", "Contacted", "Closed"]).optional(),
  notes: text(3000).optional(),
  assignedTo: z.coerce.number().int().positive().nullable().optional(),
  source: z.enum(LEAD_SOURCES).optional(),
});

// ---- Timeline ----

export const TIMELINE_ENTITIES = ["lead", "deal", "client", "project"] as const;
export type TimelineEntity = (typeof TIMELINE_ENTITIES)[number];
export const TIMELINE_KINDS = ["note", "call", "email", "whatsapp", "meeting"] as const;

export const timelineInput = z.object({
  kind: z.enum(TIMELINE_KINDS).default("note"),
  text: text(4000).min(1, "Write something"),
});

export type TimelineEntry = {
  id: number;
  entity: TimelineEntity;
  entityId: number;
  kind: string;
  text: string;
  userId: number | null;
  userName: string;
  at: string;
};

// ---- Tasks ----

export const TASK_PRIORITIES = ["Low", "Normal", "High"] as const;

export const taskInput = z.object({
  title: text(240).min(2, "Describe the task"),
  dueDate: optionalDate.default(""),
  priority: z.enum(TASK_PRIORITIES).default("Normal"),
  done: z.boolean().default(false),
  entity: z.enum(TIMELINE_ENTITIES).or(z.literal("")).default(""),
  entityId: z.coerce.number().int().positive().nullable().default(null),
  entityLabel: text(200).default(""),
  assignedTo: z.coerce.number().int().positive().nullable().default(null),
  notes: text(2000).default(""),
});

export type Task = z.infer<typeof taskInput> & {
  id: number;
  createdBy: number | null;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

// ---- Calls ----

export const BOOKING_STATUSES = ["Scheduled", "Completed", "Cancelled", "No-show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const publicBookingInput = z.object({
  start: z.string().datetime({ message: "Pick a time slot" }),
  name: text(100).min(2, "Please enter your name"),
  email,
  phone: phone.default(""),
  company: text(120).default(""),
  topic: text(1000).default(""),
  channel: z.enum(CALL_CHANNELS).default("Google Meet"),
  locale: z.enum(["en", "hi", "ar", "de", "fr"]).default("en"),
  botcheck: z.string().max(200).optional(),
});

export const rescheduleInput = z.object({ start: z.string().datetime({ message: "Pick a time slot" }) });

export const bookingPatchInput = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  outcome: text(4000).optional(),
  meetingLink: text(300).optional(),
  hostId: z.coerce.number().int().positive().optional(),
  start: z.string().datetime().optional(),
});

export const manualBookingInput = z.object({
  start: z.string().datetime({ message: "Pick a date and time" }),
  hostId: z.coerce.number().int().positive().optional(),
  name: text(100).min(2, "Name is required"),
  email: email.or(z.literal("")).default(""),
  phone: phone.default(""),
  company: text(120).default(""),
  topic: text(1000).default(""),
  channel: z.enum(CALL_CHANNELS).default("Google Meet"),
  meetingLink: text(300).default(""),
  leadId: z.coerce.number().int().positive().nullable().default(null),
});

export type Booking = {
  id: number;
  hostId: number;
  leadId: number | null;
  name: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  notes: string;
  channel: string;
  meetingLink: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  outcome: string;
  locale: string;
  manageToken: string;
  createdAt: string;
  updatedAt: string;
};

/** What the visitor sees on their manage page. */
export type PublicBooking = Pick<Booking, "name" | "email" | "topic" | "channel" | "meetingLink" | "startAt" | "endAt" | "status"> & { hostName: string };

// ---- Chatbot ----

export const chatTurnInput = z.object({
  sessionId: z.string().regex(/^[a-zA-Z0-9_-]{16,64}$/),
  message: text(1000).min(1),
  locale: z.enum(["en", "hi", "ar", "de", "fr"]).default("en"),
  page: text(200).default(""),
});

export const chatLeadInput = z.object({
  sessionId: z.string().regex(/^[a-zA-Z0-9_-]{16,64}$/),
  name: text(100).min(2, "Please enter your name"),
  email,
  phone: phone.default(""),
  message: text(2000).default(""),
  botcheck: z.string().max(200).optional(),
});

export type ChatMessage = { role: "user" | "assistant"; content: string; at: string };

export type ChatRecord = {
  id: number;
  sessionId: string;
  locale: string;
  page: string;
  messages: ChatMessage[];
  messageCount: number;
  leadId: number | null;
  status: "Open" | "Reviewed";
  createdAt: string;
  updatedAt: string;
};

export const kbInput = z.object({
  question: text(300).min(3, "Write the question"),
  answer: text(4000).min(3, "Write the answer"),
  tags: text(200).default(""),
  active: z.boolean().default(true),
});
export type KbEntry = z.infer<typeof kbInput> & { id: number; createdAt: string; updatedAt: string };

export const chatbotSettingsInput = z.object({
  enabled: z.boolean().default(true),
  dailyLimit: z.coerce.number().int().min(10).max(5000).default(400),
  perVisitorLimit: z.coerce.number().int().min(5).max(200).default(30),
  extraInstructions: text(2000).default(""),
});
export type ChatbotSettings = z.infer<typeof chatbotSettingsInput>;

// ---- Expenses ----

export const EXPENSE_CATEGORIES = ["Software & tools", "Hosting & domains", "Contractors", "Marketing", "Hardware", "Travel", "Office", "Taxes & fees", "Other"] as const;

export const expenseInput = z.object({
  date: isoDate,
  category: z.enum(EXPENSE_CATEGORIES).default("Other"),
  vendor: text(160).default(""),
  description: text(400).default(""),
  amountInr: rupees.refine((value) => value > 0, "Enter the amount"),
  gstInr: rupees.default(0),
  projectId: z.coerce.number().int().positive().nullable().default(null),
});
export type Expense = z.infer<typeof expenseInput> & { id: number; createdAt: string; updatedAt: string };
