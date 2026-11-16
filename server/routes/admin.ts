import { Hono } from "hono";
import type { AppEnv } from "../env";
import { subscribers } from "../db/tables";
import { readJson } from "../http";
import { saveSite, validateSite } from "../site/settings";

/** Subscribers and public site settings. Each route is guarded by its area in app.ts. */
export const adminRoutes = new Hono<AppEnv>();

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

adminRoutes.get("/api/admin/subscribers", async (c) => c.json(await subscribers.all(c.env.DB)));

adminRoutes.put("/api/admin/site", async (c) => {
  const site = validateSite(await readJson(c));
  await saveSite(c.env.DB, site);
  return c.json(site);
});
