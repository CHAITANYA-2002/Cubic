import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { newsletterSchema, updateConsultationRequestSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { login, logout, requireAdmin } from "./auth";
import { registerOsRoutes } from "./os/routes";

const subscribers = new Set<string>();

function appendToCSV(data: Record<string, string>) {
  const file = path.join(process.cwd(), "submissions.csv");
  const headers = "Date,Name,Email,Phone,Company,Service,Budget,Message\n";
  const quote = (value: string) => {
    const v = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const row = [new Date().toISOString(), data.name, data.email, data.phone, data.company, data.service, data.budget, data.message].map(quote).join(",") + "\n";
  fs.existsSync(file) ? fs.appendFileSync(file, row) : fs.writeFileSync(file, headers + row);
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const lead = await storage.createConsultationRequest(input);
      appendToCSV(input);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors[0].message, field: error.errors[0].path.join(".") });
      res.status(500).json({ message: "Unable to send your request. Please try again." });
    }
  });

  app.post(api.newsletter.subscribe.path, (req, res) => {
    const result = newsletterSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
    subscribers.add(result.data.email.toLowerCase());
    res.status(201).json({ message: "Subscribed" });
  });

  app.post(api.admin.login.path, login);
  app.post("/api/admin/logout", logout);

  app.use("/api/admin", requireAdmin);
  app.get(api.admin.submissions.path, async (_req, res) => {
    res.json(await storage.listConsultationRequests());
  });
  app.get("/api/admin/stats", async (_req, res) => {
    const leads = await storage.listConsultationRequests();
    res.json({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "New").length,
      contacted: leads.filter((lead) => lead.status === "Contacted").length,
      subscribers: subscribers.size,
    });
  });
  app.patch(api.admin.update.path, async (req, res) => {
    const update = updateConsultationRequestSchema.safeParse(req.body);
    const id = Number(req.params.id);
    if (!update.success || !Number.isInteger(id)) return res.status(400).json({ message: "Invalid update" });
    const lead = await storage.updateConsultationRequest(id, update.data);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });
  app.delete("/api/admin/submissions/:id", async (req, res) => {
    res.status((await storage.deleteConsultationRequest(Number(req.params.id))) ? 204 : 404).end();
  });

  registerOsRoutes(app);
  return httpServer;
}
