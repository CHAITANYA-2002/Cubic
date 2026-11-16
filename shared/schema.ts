import { z } from "zod";

// Website enquiries and newsletter sign-ups. Stored in Cloudflare D1 (see migrations/).

export const LEAD_STATUS_VALUES = ["New", "Contacted", "Closed"] as const;

const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === "" || value.replace(/\D/g, "").length >= 7, "Please enter a valid phone number")
  .optional()
  .default("");

export const insertConsultationRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  // Optional: international leads often prefer email only.
  phone: optionalPhone,
  company: z.string().trim().max(120).optional().default(""),
  service: z.string().trim().max(100).optional().default(""),
  budget: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(10, "Tell us a little more about your project").max(3000),
  // Where the visitor was and which campaign brought them (set by the form, never shown to them).
  page: z.string().trim().max(200).optional().default(""),
  utm: z.string().trim().max(300).optional().default(""),
  // Honeypot: humans never see this field, so any value means a bot. Rejected server-side.
  botcheck: z.string().max(200).optional(),
});

export const updateConsultationRequestSchema = z.object({
  status: z.enum(LEAD_STATUS_VALUES).optional(),
  notes: z.string().max(3000).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(254),
  botcheck: z.string().max(200).optional(),
});

export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;

export type ConsultationRequest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: (typeof LEAD_STATUS_VALUES)[number];
  notes: string;
  source: string;
  assignedTo: number | null;
  page: string;
  utm: string;
  createdAt: string;
  updatedAt: string;
};

export type Subscriber = { id: number; email: string; subscribedAt: string };
