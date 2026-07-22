import { db } from "./db";
import { consultationRequests, type InsertConsultationRequest, type ConsultationRequest } from "@shared/schema";
import { desc, eq } from "drizzle-orm";
type LeadUpdate = Partial<Pick<ConsultationRequest, "status" | "notes">>;
export interface IStorage { createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>; listConsultationRequests(): Promise<ConsultationRequest[]>; updateConsultationRequest(id: number, update: LeadUpdate): Promise<ConsultationRequest | undefined>; deleteConsultationRequest(id: number): Promise<boolean>; }
export class DatabaseStorage implements IStorage {
  async createConsultationRequest(request: InsertConsultationRequest) { const [item] = await db!.insert(consultationRequests).values(request).returning(); return item; }
  async listConsultationRequests() { return db!.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt)); }
  async updateConsultationRequest(id: number, update: LeadUpdate) { const [item] = await db!.update(consultationRequests).set(update).where(eq(consultationRequests.id,id)).returning(); return item; }
  async deleteConsultationRequest(id: number) { const result = await db!.delete(consultationRequests).where(eq(consultationRequests.id,id)).returning({ id: consultationRequests.id }); return result.length > 0; }
}
export class InMemoryStorage implements IStorage {
  private requests: ConsultationRequest[]=[]; private nextId=1;
  async createConsultationRequest(request: InsertConsultationRequest) { const item: ConsultationRequest={ id:this.nextId++, name:request.name, email:request.email, phone:request.phone, company:request.company ?? "", service:request.service ?? "", budget:request.budget ?? "", message:request.message, status:"New", notes:"", createdAt:new Date() }; this.requests.unshift(item); return item; }
  async listConsultationRequests(){return [...this.requests];}
  async updateConsultationRequest(id:number, update:LeadUpdate){const item=this.requests.find((lead)=>lead.id===id);if(item)Object.assign(item,update);return item;}
  async deleteConsultationRequest(id:number){const length=this.requests.length;this.requests=this.requests.filter((lead)=>lead.id!==id);return this.requests.length!==length;}
}
export const storage:IStorage=process.env.DATABASE_URL?new DatabaseStorage():new InMemoryStorage();
