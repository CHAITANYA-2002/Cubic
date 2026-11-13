import { Hono } from "hono";
import { settingsInput, todayIso } from "../../shared/os";
import type { AppEnv } from "../env";
import { activity, clients, deals, invoices, leads, projects, subscribers } from "../db/tables";
import { readJson } from "../http";
import { loadSite } from "../site/settings";
import { buildDashboard } from "./dashboard";
import { loadSettings, saveSettings } from "./settings";

/** State, dashboard, backup export and firm settings. Mounted behind requireAdmin. */
export const coreRoutes = new Hono<AppEnv>();

coreRoutes.get("/api/os/state", async (c) => {
  const db = c.env.DB;
  const [dealRows, clientRows, projectRows, invoiceRows, settings] = await Promise.all([
    deals.all(db),
    clients.all(db),
    projects.all(db),
    invoices.all(db),
    loadSettings(db),
  ]);
  return c.json({ deals: dealRows, clients: clientRows, projects: projectRows, invoices: invoiceRows, settings });
});

coreRoutes.get("/api/os/dashboard", async (c) => {
  const db = c.env.DB;
  const [dealRows, projectRows, invoiceRows, recent, settings, fresh] = await Promise.all([
    deals.all(db),
    projects.all(db, "status IN ('Active', 'Planning', 'Review')"),
    invoices.all(db),
    db.prepare("SELECT * FROM activity ORDER BY id DESC LIMIT 12").all(),
    loadSettings(db),
    db.prepare("SELECT COUNT(*) AS n FROM leads WHERE status = 'New'").first<{ n: number }>(),
  ]);
  return c.json(
    buildDashboard({
      deals: dealRows,
      projects: projectRows,
      invoices: invoiceRows,
      activity: recent.results.map(activity.fromRow),
      settings,
      newLeads: fresh?.n ?? 0,
    }),
  );
});

/** Full backup. Same top-level shape as the old cubic-os.json, plus site settings and subscribers. */
coreRoutes.get("/api/os/export", async (c) => {
  const db = c.env.DB;
  const [leadRows, dealRows, clientRows, projectRows, invoiceRows, activityRows, settings, counters, site, subscriberRows] = await Promise.all([
    leads.all(db),
    deals.all(db),
    clients.all(db),
    projects.all(db),
    invoices.all(db),
    activity.all(db),
    loadSettings(db),
    db.prepare("SELECT key, value FROM counters").all<{ key: string; value: number }>(),
    loadSite(db),
    subscribers.all(db),
  ]);
  const seq = Object.fromEntries(counters.results.map((row) => [row.key, row.value]));
  c.header("Content-Disposition", `attachment; filename="cubic-os-backup-${todayIso()}.json"`);
  return c.json({
    leads: leadRows,
    deals: dealRows,
    clients: clientRows,
    projects: projectRows,
    invoices: invoiceRows,
    activity: activityRows,
    settings,
    seq,
    site,
    subscribers: subscriberRows,
  });
});

coreRoutes.put("/api/os/settings", async (c) => {
  const settings = settingsInput.parse(await readJson(c));
  await saveSettings(c.env.DB, settings);
  return c.json(settings);
});
