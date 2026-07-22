import { z } from "zod";
import { insertConsultationRequestSchema, consultationRequests, newsletterSchema, updateConsultationRequestSchema } from "./schema";
export type { InsertConsultationRequest } from "./schema";
export const errorSchemas = { validation: z.object({ message: z.string(), field: z.string().optional() }), internal: z.object({ message: z.string() }) };
export const api = {
  contact: { submit: { method: "POST" as const, path: "/api/contact", input: insertConsultationRequestSchema, responses: { 201: z.custom<typeof consultationRequests.$inferSelect>(), 400: errorSchemas.validation, 500: errorSchemas.internal } } },
  newsletter: { subscribe: { method: "POST" as const, path: "/api/newsletter", input: newsletterSchema } },
  admin: { login: { method: "POST" as const, path: "/api/admin/login", input: z.object({ password: z.string().min(1) }) }, submissions: { method: "GET" as const, path: "/api/admin/submissions" }, update: { method: "PATCH" as const, path: "/api/admin/submissions/:id", input: updateConsultationRequestSchema } },
};
export function buildUrl(path: string, params?: Record<string, string | number>): string { return Object.entries(params ?? {}).reduce((url,[key,value]) => url.replace(`:${key}`,String(value)),path); }
