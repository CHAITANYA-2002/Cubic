import { db } from "./db";
import { consultationRequests, type InsertConsultationRequest, type ConsultationRequest } from "@shared/schema";
import type { Lead } from "@shared/os";
import { desc, eq } from "drizzle-orm";
import { nextId, read, withActivity, write } from "./os/store";

type LeadUpdate = Partial<Pick<ConsultationRequest, "status" | "notes">>;

export interface IStorage {
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  listConsultationRequests(): Promise<ConsultationRequest[]>;
  getConsultationRequest(id: number): Promise<ConsultationRequest | undefined>;
  updateConsultationRequest(id: number, update: LeadUpdate): Promise<ConsultationRequest | undefined>;
  deleteConsultationRequest(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createConsultationRequest(request: InsertConsultationRequest) {
    const [item] = await db!.insert(consultationRequests).values(request).returning();
    return item;
  }
  async listConsultationRequests() {
    return db!.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt));
  }
  async getConsultationRequest(id: number) {
    const [item] = await db!.select().from(consultationRequests).where(eq(consultationRequests.id, id));
    return item;
  }
  async updateConsultationRequest(id: number, update: LeadUpdate) {
    const [item] = await db!.update(consultationRequests).set(update).where(eq(consultationRequests.id, id)).returning();
    return item;
  }
  async deleteConsultationRequest(id: number) {
    const result = await db!.delete(consultationRequests).where(eq(consultationRequests.id, id)).returning({ id: consultationRequests.id });
    return result.length > 0;
  }
}

const toRequest = (lead: Lead): ConsultationRequest => ({ ...lead, createdAt: new Date(lead.createdAt) });

/** Leads persisted in the Cubic OS document (data/cubic-os.json) — survives restarts. */
export class DocumentStorage implements IStorage {
  async createConsultationRequest(request: InsertConsultationRequest) {
    const lead = await write((doc) => {
      const { doc: next, id } = nextId(doc, "leads");
      const item: Lead = {
        id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        company: request.company ?? "",
        service: request.service ?? "",
        budget: request.budget ?? "",
        message: request.message,
        status: "New",
        notes: "",
        createdAt: new Date().toISOString(),
      };
      const withLead = { ...next, leads: [item, ...next.leads] };
      return { doc: withActivity(withLead, "lead", `New enquiry from ${item.name}${item.company ? ` (${item.company})` : ""}`), result: item };
    });
    return toRequest(lead);
  }
  async listConsultationRequests() {
    return (await read()).leads.map(toRequest);
  }
  async getConsultationRequest(id: number) {
    const lead = (await read()).leads.find((item) => item.id === id);
    return lead && toRequest(lead);
  }
  async updateConsultationRequest(id: number, update: LeadUpdate) {
    const lead = await write((doc) => {
      const found = doc.leads.find((item) => item.id === id);
      if (!found) return { doc, result: undefined };
      const updated = { ...found, ...update } as Lead;
      return { doc: { ...doc, leads: doc.leads.map((item) => (item.id === id ? updated : item)) }, result: updated };
    });
    return lead && toRequest(lead);
  }
  async deleteConsultationRequest(id: number) {
    return write((doc) => {
      const leads = doc.leads.filter((item) => item.id !== id);
      return { doc: { ...doc, leads }, result: leads.length !== doc.leads.length };
    });
  }
}

export const storage: IStorage = process.env.DATABASE_URL ? new DatabaseStorage() : new DocumentStorage();
