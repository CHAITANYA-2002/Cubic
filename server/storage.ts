import { db } from "./db";
import { consultationRequests, type InsertConsultationRequest, type ConsultationRequest } from "@shared/schema";

export interface IStorage {
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
}

export class DatabaseStorage implements IStorage {
  async createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest> {
    const [newItem] = await db.insert(consultationRequests).values(request).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
