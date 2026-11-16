import { z } from "zod";

// Team accounts, roles and what each role may open. Enforced on the server; the UI only hides tabs.

export const ROLES = ["owner", "admin", "sales", "delivery"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  sales: "Sales",
  delivery: "Delivery",
};

export const AREAS = [
  "dashboard",
  "leads",
  "pipeline",
  "calls",
  "chats",
  "tasks",
  "clients",
  "projects",
  "invoices",
  "expenses",
  "subscribers",
  "knowledge",
  "site",
  "settings",
  "team",
] as const;
export type Area = (typeof AREAS)[number];

const EVERYTHING = new Set<Area>(AREAS);
const ACCESS: Record<Role, ReadonlySet<Area>> = {
  owner: EVERYTHING,
  admin: new Set(AREAS.filter((area) => area !== "team")),
  sales: new Set<Area>(["dashboard", "leads", "pipeline", "calls", "chats", "tasks", "clients"]),
  delivery: new Set<Area>(["dashboard", "tasks", "clients", "projects", "calls"]),
};

export const can = (role: Role, area: Area) => ACCESS[role].has(area);

/** Sales and delivery see the records assigned to them plus anything not yet assigned. */
export const seesEverything = (role: Role) => role === "owner" || role === "admin";

// ---- Availability: weekly working hours in IST, one or more ranges per day ----

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM");
const range = z.tuple([hhmm, hhmm]).refine(([from, to]) => from < to, "End must be after start");
const dayRanges = z.array(range).max(4).optional();
export const availabilityInput = z.object({
  mon: dayRanges,
  tue: dayRanges,
  wed: dayRanges,
  thu: dayRanges,
  fri: dayRanges,
  sat: dayRanges,
  sun: dayRanges,
});
export type Availability = Partial<Record<Weekday, Array<[string, string]>>>;

export const DEFAULT_AVAILABILITY: Availability = {
  mon: [["10:00", "18:00"]],
  tue: [["10:00", "18:00"]],
  wed: [["10:00", "18:00"]],
  thu: [["10:00", "18:00"]],
  fri: [["10:00", "18:00"]],
};

// ---- Users ----

const name = z.string().trim().min(2, "Name is required").max(120);
const email = z.string().trim().toLowerCase().email("Enter a valid email").max(254);
export const password = z.string().min(10, "Use at least 10 characters").max(200);

export const userCreateInput = z.object({
  name,
  email,
  role: z.enum(["admin", "sales", "delivery"]),
  password,
  takesCalls: z.boolean().default(false),
  takesLeads: z.boolean().default(false),
});

export const userUpdateInput = z.object({
  name: name.optional(),
  email: email.optional(),
  role: z.enum(ROLES).optional(),
  active: z.boolean().optional(),
  takesCalls: z.boolean().optional(),
  takesLeads: z.boolean().optional(),
  availability: availabilityInput.optional(),
  password: password.optional(),
});

export const profileInput = z.object({
  name: name.optional(),
  email: email.or(z.literal("")).optional(),
  availability: availabilityInput.optional(),
  takesCalls: z.boolean().optional(),
});

export const changePasswordInput = z.object({ current: z.string().max(200).default(""), next: password });

export const loginInput = z.object({
  email: z.string().trim().toLowerCase().max(254).optional().default(""),
  password: z.string().min(1).max(200),
});

export type TeamUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  takesCalls: boolean;
  takesLeads: boolean;
  availability: Availability;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
};

/** What the browser learns about the signed-in person. */
export type Me = Pick<TeamUser, "id" | "name" | "email" | "role" | "takesCalls" | "availability"> & { areas: Area[]; expiresAt: string };

// ---- Scheduling rules (one document) ----

export const CALL_CHANNELS = ["Google Meet", "Zoom", "Phone", "WhatsApp"] as const;

export const schedulingInput = z.object({
  enabled: z.boolean().default(true),
  callMinutes: z.coerce.number().int().min(15).max(120).default(30),
  bufferMinutes: z.coerce.number().int().min(0).max(60).default(15),
  minNoticeHours: z.coerce.number().int().min(0).max(168).default(12),
  windowDays: z.coerce.number().int().min(1).max(60).default(21),
  holidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(100).default([]),
  channels: z.array(z.enum(CALL_CHANNELS)).min(1).default(["Google Meet", "Phone", "WhatsApp"]),
  defaultMeetingLink: z.string().trim().max(300).default(""),
});
export type Scheduling = z.infer<typeof schedulingInput>;

// ---- Lead assignment (one document) ----

export const assignmentInput = z.object({
  autoAssign: z.boolean().default(true),
});
export type Assignment = z.infer<typeof assignmentInput>;
