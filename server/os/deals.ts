import { Hono } from "hono";
import { dealInput, todayIso, type Client, type Deal, type Project } from "../../shared/os";
import type { AppEnv } from "../env";
import { raw, type RawSql } from "../db/sql";
import { clients, deals, leads, projects } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { logActivity } from "./activity";
import { assertClientExists, buildDeal, newPortalToken, now, required } from "./records";
import { seesEverything } from "../../shared/team";
import { allowedAssignee, assertMayTouch } from "../crm/access";
import { timelineEntry } from "../crm/timeline";

export const dealRoutes = new Hono<AppEnv>();

dealRoutes.post("/api/os/deals", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const input = dealInput.parse(await readJson(c));
  const assignedTo = seesEverything(user.role) ? input.assignedTo ?? user.id : allowedAssignee(user, input.assignedTo ?? user.id, user.id);
  const row = buildDeal({ ...input, assignedTo });
  if (row.clientId) await assertClientExists(db, row.clientId);
  const [inserted] = await db.batch([deals.insert(db, row), ...logActivity(db, "deal", `Deal added by ${user.name}: ${row.title}`)]);
  return c.json(deals.firstRow(inserted), 201);
});

dealRoutes.patch("/api/os/deals/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const user = c.get("user");
  const previous = required(await deals.byId(db, id), "Deal not found");
  assertMayTouch(user, previous.assignedTo);
  const body = await readJson(c);
  const input = dealInput.parse({ ...previous, probability: undefined, ...body });
  if (input.clientId) await assertClientExists(db, input.clientId);
  const assignedTo = allowedAssignee(user, "assignedTo" in body ? input.assignedTo : undefined, previous.assignedTo);
  const next = buildDeal({ ...input, assignedTo }, previous);
  const stageMoved = previous.stage !== next.stage;
  const moved = stageMoved ? [...logActivity(db, "deal", `${next.title} moved to ${next.stage}`), timelineEntry(db, "deal", id, "system", `Stage: ${previous.stage} → ${next.stage}`, user)] : [];
  const reassigned = assignedTo !== previous.assignedTo ? [timelineEntry(db, "deal", id, "system", assignedTo ? `Reassigned (user #${assignedTo})` : "Unassigned", user)] : [];
  const [updated] = await db.batch([deals.update(db, id, next), ...moved, ...reassigned]);
  return c.json(deals.firstRow(updated));
});

/**
 * Winning a deal creates the client (if needed) and a project in one transaction, so delivery
 * starts from the same record. The unique index on projects.deal_id stops a double win.
 */
dealRoutes.post("/api/os/deals/:id/win", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const deal = required(await deals.byId(db, id), "Deal not found");
  assertMayTouch(c.get("user"), deal.assignedTo);
  const hasProject = await db.prepare("SELECT 1 AS ok FROM projects WHERE deal_id = ?").bind(id).first();
  if (deal.stage === "Won" || hasProject) throw new HttpError(409, "This deal is already won and has a project.");
  if (deal.clientId) await assertClientExists(db, deal.clientId);

  const stamp = now();
  const portalToken = newPortalToken();
  const newClient: Omit<Client, "id"> = {
    name: deal.contactName || deal.company || deal.title,
    company: deal.company,
    email: deal.email,
    phone: deal.phone,
    gstin: "",
    address: "",
    notes: "",
    portalToken,
    createdAt: stamp,
    updatedAt: stamp,
  };
  const clientRef: number | RawSql = deal.clientId ?? raw("SELECT id FROM clients WHERE portal_token = ?", [portalToken]);
  const project = {
    clientId: clientRef,
    dealId: deal.id,
    name: deal.title,
    service: deal.service,
    status: "Planning" as const,
    startDate: todayIso(),
    dueDate: "",
    budgetInr: deal.valueInr,
    milestones: [],
    updates: [],
    notes: deal.notes,
    createdAt: stamp,
    updatedAt: stamp,
  };

  const results = await db.batch([
    ...(deal.clientId ? [] : [clients.insert(db, newClient)]),
    projects.insert(db, project),
    deals.update(db, id, { clientId: clientRef, stage: "Won", probability: 100, updatedAt: stamp }),
    ...logActivity(db, "deal", `Won: ${deal.title} — project created`),
  ]);
  const offset = deal.clientId ? 0 : 1;
  const createdProject = projects.firstRow(results[offset]) as Project;
  const won = deals.firstRow(results[offset + 1]) as Deal;
  return c.json({ deal: won, clientId: createdProject.clientId, project: createdProject });
});

dealRoutes.post("/api/os/leads/:id/convert", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const user = c.get("user");
  const lead = required(await leads.byId(db, id), "Lead not found");
  assertMayTouch(user, lead.assignedTo);
  const markContacted = leads.update(db, id, { status: "Contacted" });

  const existing = await db.prepare("SELECT * FROM deals WHERE lead_id = ? ORDER BY id LIMIT 1").bind(id).first();
  if (existing) {
    await markContacted.run();
    return c.json(deals.fromRow(existing), 201);
  }

  const input = dealInput.parse({
    title: `${lead.company || lead.name} — ${lead.service || "Enquiry"}`,
    company: lead.company,
    contactName: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source || "Website form",
    service: lead.service,
    stage: "Qualified",
    nextAction: "Reply and book a discovery call",
    nextActionDate: todayIso(),
    leadId: id,
    assignedTo: lead.assignedTo ?? user.id,
    notes: [lead.budget && `Stated budget: ${lead.budget}`, lead.message].filter(Boolean).join("\n\n"),
  });
  const row = buildDeal(input);
  const [inserted] = await db.batch([
    deals.insert(db, row),
    markContacted,
    ...logActivity(db, "deal", `Lead qualified: ${row.title}`),
    timelineEntry(db, "lead", id, "system", "Qualified into a deal", user),
  ]);
  return c.json(deals.firstRow(inserted), 201);
});
