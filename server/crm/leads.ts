import { Hono } from "hono";
import { leadPatchInput, manualLeadInput } from "../../shared/crm";
import type { Lead } from "../../shared/os";
import { seesEverything } from "../../shared/team";
import type { AppEnv } from "../env";
import { leads, users } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { logActivity } from "../os/activity";
import { allowedAssignee, assertAdmin, assertMayTouch, scopeWhere } from "./access";
import { chooseAssignee } from "./assign";
import { timelineEntry } from "./timeline";

/** The Inbox. Mounted behind requireUser + the "leads" area. */
export const leadRoutes = new Hono<AppEnv>();

leadRoutes.get("/api/admin/submissions", async (c) => {
  const scope = scopeWhere(c.get("user"));
  return c.json(await leads.all(c.env.DB, scope.where, scope.params));
});

leadRoutes.post("/api/os/leads", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const input = manualLeadInput.parse(await readJson(c));
  // Admins may route it anywhere (or let auto-assign pick); everyone else keeps what they add.
  const assignedTo = seesEverything(user.role)
    ? input.assignedTo ?? (await chooseAssignee(db)) ?? user.id
    : allowedAssignee(user, input.assignedTo ?? user.id, user.id);
  const stamp = new Date().toISOString();
  const row: Omit<Lead, "id"> = {
    ...input,
    message: input.message || `Added by ${user.name}`,
    status: "New",
    notes: "",
    assignedTo,
    page: "",
    utm: "",
    createdAt: stamp,
    updatedAt: stamp,
  };
  const [inserted] = await db.batch([leads.insert(db, row), ...logActivity(db, "lead", `Lead added by ${user.name}: ${row.name} (${row.source})`)]);
  const lead = leads.firstRow(inserted);
  if (!lead) throw new Error("Lead insert returned no row");
  await timelineEntry(db, "lead", lead.id, "system", `Added by ${user.name} from ${row.source}`, user).run();
  return c.json(lead, 201);
});

leadRoutes.patch("/api/admin/submissions/:id", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const id = parseId(c);
  const lead = await leads.byId(db, id);
  if (!lead) throw new HttpError(404, "Lead not found");
  assertMayTouch(user, lead.assignedTo);

  const input = leadPatchInput.parse(await readJson(c));
  const assignedTo = allowedAssignee(user, input.assignedTo, lead.assignedTo);
  const change = { ...input, assignedTo, updatedAt: new Date().toISOString() };
  const events: string[] = [];
  if (input.status && input.status !== lead.status) events.push(`Status: ${lead.status} → ${input.status}`);
  if (assignedTo !== lead.assignedTo) {
    const owner = assignedTo ? await users.byId(db, assignedTo) : null;
    if (assignedTo && !owner?.active) throw new HttpError(400, "Choose an active team member");
    events.push(owner ? `Assigned to ${owner.name}` : "Unassigned");
  }
  const [updated] = await db.batch([leads.update(db, id, change), ...events.map((text) => timelineEntry(db, "lead", id, "system", text, user))]);
  return c.json(leads.firstRow(updated));
});

leadRoutes.delete("/api/admin/submissions/:id", async (c) => {
  assertAdmin(c.get("user"));
  const db = c.env.DB;
  const id = parseId(c);
  const results = await db.batch([leads.remove(db, id), db.prepare("DELETE FROM timeline WHERE entity = 'lead' AND entity_id = ?").bind(id)]);
  return c.body(null, results[0].meta.changes > 0 ? 204 : 404);
});
