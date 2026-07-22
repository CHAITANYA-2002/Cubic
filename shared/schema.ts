import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const consultationRequests = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull().default(""),
  service: text("service").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("New"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const insertConsultationRequestSchema = createInsertSchema(consultationRequests, {
  name: () => z.string().trim().min(2, "Please enter your name").max(100),
  email: () => z.string().trim().email("Please enter a valid email address").max(254),
  phone: () => z.string().trim().min(7, "Please enter a valid phone number").max(30),
  company: () => z.string().trim().max(120).optional().default(""),
  service: () => z.string().trim().max(100).optional().default(""),
  budget: () => z.string().trim().max(100).optional().default(""),
  message: () => z.string().trim().min(10, "Tell us a little more about your project").max(3000),
}).omit({ id: true, createdAt: true, status: true, notes: true });

export const updateConsultationRequestSchema = z.object({ status: z.enum(["New", "Contacted", "Closed"]).optional(), notes: z.string().max(3000).optional() });
export const newsletterSchema = z.object({ email: z.string().trim().email("Please enter a valid email address").max(254) });
export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
