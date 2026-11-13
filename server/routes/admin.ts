import { Hono } from "hono";
import { api } from "../../shared/routes";
import type { AppEnv } from "../env";
import { leads, subscribers } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { saveSite, validateSite } from "../site/settings";

/** Mounted behind requireAdmin. */
export const adminRoutes = new Hono<AppEnv>();

adminRoutes.get(api.admin.submissions.path, async (c) => c.json(await leads.all(c.env.DB)));

adminRoutes.get("/api/admin/stats", async (c) => {
  const row = await c.env.DB.prepare(
    `SELECT
       (SELECT COUNT(*) FROM leads) AS total,
       (SELECT COUNT(*) FROM leads WHERE status = 'New') AS new,
       (SELECT COUNT(*) FROM leads WHERE status = 'Contacted') AS contacted,
       (SELECT COUNT(*) FROM subscribers) AS subscribers`,
  ).first<{ total: number; new: number; contacted: number; subscribers: number }>();
  return c.json({
    total: row?.total ?? 0,
    new: row?.new ?? 0,
    contacted: row?.contacted ?? 0,
    subscribers: row?.subscribers ?? 0,
  });
});

adminRoutes.patch(api.admin.update.path, async (c) => {
  const id = parseId(c);
  const update = api.admin.update.input.safeParse(await readJson(c));
  if (!update.success) throw new HttpError(400, "Invalid update");
  if (update.data.status === undefined && update.data.notes === undefined) throw new HttpError(400, "Nothing to update");
  const lead = leads.firstRow(await leads.update(c.env.DB, id, update.data).run());
  if (!lead) throw new HttpError(404, "Lead not found");
  return c.json(lead);
});

adminRoutes.delete("/api/admin/submissions/:id", async (c) => {
  const result = await leads.remove(c.env.DB, parseId(c)).run();
  return c.body(null, result.meta.changes > 0 ? 204 : 404);
});

adminRoutes.get("/api/admin/subscribers", async (c) => c.json(await subscribers.all(c.env.DB)));

adminRoutes.put("/api/admin/site", async (c) => {
  const site = validateSite(await readJson(c));
  await saveSite(c.env.DB, site);
  return c.json(site);
});
