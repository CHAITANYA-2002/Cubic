import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { newsletterSchema, updateConsultationRequestSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";
const adminPassword=process.env.ADMIN_PASSWORD ?? "cubic@14412815";
const adminToken=process.env.ADMIN_TOKEN ?? "cubic-local-admin";
const subscribers=new Set<string>();
const isAdmin=(req:Request)=>req.header("x-admin-token")===adminToken;
const guard=(req:Request,res:Response)=>{if(!isAdmin(req)){res.status(401).json({message:"Unauthorized"});return false;}return true;};
function appendToCSV(data:Record<string,string>){const file=path.join(process.cwd(),"submissions.csv");const headers="Date,Name,Email,Phone,Company,Service,Budget,Message\n";const quote=(value:string)=>{const v=String(value??"");const safe=/^[=+\-@\t\r]/.test(v)?"'"+v:v;return `"${safe.replace(/"/g,'""')}"`;};const row=[new Date().toISOString(),data.name,data.email,data.phone,data.company,data.service,data.budget,data.message].map(quote).join(",")+"\n";fs.existsSync(file)?fs.appendFileSync(file,row):fs.writeFileSync(file,headers+row);}
export async function registerRoutes(httpServer:Server,app:Express):Promise<Server>{
  app.post(api.contact.submit.path,async(req,res)=>{try{const input=api.contact.submit.input.parse(req.body);const lead=await storage.createConsultationRequest(input);appendToCSV(input);res.status(201).json(lead);}catch(error){if(error instanceof z.ZodError)return res.status(400).json({message:error.errors[0].message,field:error.errors[0].path.join(".")});res.status(500).json({message:"Unable to send your request. Please try again."});}});
  app.post(api.newsletter.subscribe.path,(req,res)=>{const result=newsletterSchema.safeParse(req.body);if(!result.success)return res.status(400).json({message:result.error.errors[0].message});subscribers.add(result.data.email.toLowerCase());res.status(201).json({message:"Subscribed"});});
  app.post(api.admin.login.path,(req,res)=>{if(req.body?.password!==adminPassword)return res.status(401).json({message:"Incorrect password"});res.json({token:adminToken});});
  app.get(api.admin.submissions.path,async(req,res)=>{if(guard(req,res))res.json(await storage.listConsultationRequests());});
  app.get("/api/admin/stats",async(req,res)=>{if(!guard(req,res))return;const leads=await storage.listConsultationRequests();res.json({total:leads.length,new:leads.filter((lead)=>lead.status==="New").length,contacted:leads.filter((lead)=>lead.status==="Contacted").length,subscribers:subscribers.size});});
  app.patch(api.admin.update.path,async(req,res)=>{if(!guard(req,res))return;const update=updateConsultationRequestSchema.safeParse(req.body);const id=Number(req.params.id);if(!update.success||!Number.isInteger(id))return res.status(400).json({message:"Invalid update"});const lead=await storage.updateConsultationRequest(id,update.data);if(!lead)return res.status(404).json({message:"Lead not found"});res.json(lead);});
  app.delete("/api/admin/submissions/:id",async(req,res)=>{if(!guard(req,res))return;res.status(await storage.deleteConsultationRequest(Number(req.params.id))?204:404).end();});
  return httpServer;
}
