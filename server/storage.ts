import { db } from "./db";
import { consultationRequests, type InsertConsultationRequest, type ConsultationRequest } from "@shared/schema";

export interface IStorage {
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
}

export class DatabaseStorage implements IStorage {
  async createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest> {
    const [newItem] = await db!.insert(consultationRequests).values(request).returning();
    return newItem;
  }
}

export class InMemoryStorage implements IStorage {
  private requests: ConsultationRequest[] = [];
  private nextId = 1;

  async createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest> {
    const newItem: ConsultationRequest = {
      id: this.nextId++,
      ...request,
      createdAt: new Date(),
    };
    this.requests.push(newItem);
    return newItem;
  }
}

// Use Postgres when configured, otherwise keep submissions in memory so the
// app works out of the box.
export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new InMemoryStorage();
