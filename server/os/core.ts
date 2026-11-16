import { Hono } from "hono";
import { settingsInput, todayIso, type Dashboard } from "../../shared/os";
import { can, seesEverything } from "../../shared/team";
import type { AppEnv } from "../env";
import type { D1Database } from "../db/d1";
import { activity, bookings, chats, clients, deals, expenses, invoices, kbEntries, leads, projects, publicUser, subscribers, tasks, timeline, users, type UserRow } from "../db/tables";
import { HttpError, readJson } from "../http";
import { loadSite } from "../site/settings";
import { scopeWhere } from "../crm/access";
import { buildDashboard } from "./dashboard";
import { defaultSettings, loadSettings, saveSettings } from "./settings";

/** State, dashboard, backup export and firm settings. Mounted behind requireUser. */
export const coreRoutes = new Hono<AppEnv>();

/** Everything a view needs, cut to what the role may see. */
coreRoutes.get("/api/os/state", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const dealScope = scopeWhere(user);
  const [dealRows, clientRows, projectRows, invoiceRows, settings] = await Promise.all([
    can(user.role, "pipeline") ? deals.all(db, dealScope.where, dealScope.params) : Promise.resolve([]),
    can(user.role, "clients") ? clients.all(db) : Promise.resolve([]),
    can(user.role, "projects") || can(user.role, "invoices") ? projects.all(db) : Promise.resolve([]),
    can(user.role, "invoices") ? invoices.all(db) : Promise.resolve([]),
    can(user.role, "invoices") || can(user.role, "settings") ? loadSettings(db) : Promise.resolve(defaultSettings),
  ]);
  return c.json({ deals: dealRows, clients: clientRows, projects: projectRows, invoices: invoiceRows, settings });
});

const count = async (db: D1Database, sql: string, params: unknown[] = []) => (await db.prepare(sql).bind(...params).first<{ n: number }>())?.n ?? 0;

async function workspaceExtras(db: D1Database, user: UserRow, base: Dashboard): Promise<Dashboard> {
  const today = todayIso();
  const month = today.slice(0, 7);
  const nowIso = new Date().toISOString();
  const mine = seesEverything(user.role) ? "" : " AND (assigned_to IS NULL OR assigned_to = ?)";
  const mineParams = seesEverything(user.role) ? [] : [user.id];
  const hostScope = seesEverything(user.role) ? "" : " AND host_id = ?";

  const [openTasks, overdueTasks, dueTaskRows, callRows, callsToday, openChats, chatsToday, sources, wonLost, spent] = await Promise.all([
    count(db, "SELECT COUNT(*) AS n FROM tasks WHERE done = 0 AND assigned_to = ?", [user.id]),
    count(db, "SELECT COUNT(*) AS n FROM tasks WHERE done = 0 AND assigned_to = ? AND due_date <> '' AND due_date < ?", [user.id, today]),
    tasks.all(db, `done = 0 AND due_date <> '' AND due_date <= ?${mine}`, [today, ...mineParams]),
    bookings.all(db, `status = 'Scheduled' AND end_at >= ?${hostScope}`, [nowIso, ...mineParams]),
    count(db, `SELECT COUNT(*) AS n FROM bookings WHERE status = 'Scheduled' AND substr(start_at, 1, 10) = ?${hostScope}`, [today, ...mineParams]),
    can(user.role, "chats") ? count(db, "SELECT COUNT(*) AS n FROM chats WHERE status = 'Open'") : Promise.resolve(0),
    can(user.role, "chats") ? count(db, "SELECT COUNT(*) AS n FROM chats WHERE substr(created_at, 1, 10) = ?", [today]) : Promise.resolve(0),
    db.prepare(`SELECT source, COUNT(*) AS n FROM leads WHERE substr(created_at, 1, 7) = ?${mine} GROUP BY source ORDER BY n DESC`).bind(month, ...mineParams).all<{ source: string; n: number }>(),
    db.prepare(`SELECT SUM(stage = 'Won') AS won, SUM(stage = 'Lost') AS lost FROM deals WHERE 1 = 1${mine}`).bind(...mineParams).first<{ won: number; lost: number }>(),
    can(user.role, "expenses") ? count(db, "SELECT COALESCE(SUM(amount_inr), 0) AS n FROM expenses WHERE substr(date, 1, 7) = ?", [month]) : Promise.resolve(0),
  ]);
  const won = Number(wonLost?.won ?? 0);
  const lost = Number(wonLost?.lost ?? 0);
  const money = can(user.role, "invoices");
  return {
    ...base,
    ...(money ? {} : { receivable: 0, overdueReceivable: 0, collectedThisMonth: 0, overdueInvoices: [], setupWarnings: [] }),
    myOpenTasks: openTasks,
    myOverdueTasks: overdueTasks,
    dueTasks: dueTaskRows
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 8)
      .map(({ id, title, dueDate, priority, entityLabel }) => ({ id, title, dueDate, priority, entityLabel })),
    upcomingCalls: callRows
      .sort((a, b) => a.startAt.localeCompare(b.startAt))
      .slice(0, 6)
      .map(({ id, name, company, startAt, channel, hostId }) => ({ id, name, company, startAt, channel, hostId })),
    callsToday,
    openChats,
    chatsToday,
    leadsBySource: sources.results.map((row) => ({ source: row.source, count: Number(row.n) })),
    expensesThisMonth: spent,
    profitThisMonth: money ? base.collectedThisMonth - spent : 0,
    winRate: won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0,
  };
}

coreRoutes.get("/api/os/dashboard", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const dealScope = scopeWhere(user);
  const leadScope = scopeWhere(user);
  const [dealRows, projectRows, invoiceRows, recent, settings, fresh] = await Promise.all([
    deals.all(db, dealScope.where, dealScope.params),
    can(user.role, "projects") || seesEverything(user.role) ? projects.all(db, "status IN ('Active', 'Planning', 'Review')") : Promise.resolve([]),
    can(user.role, "invoices") ? invoices.all(db) : Promise.resolve([]),
    seesEverything(user.role) ? db.prepare("SELECT * FROM activity ORDER BY id DESC LIMIT 12").all() : Promise.resolve({ results: [] }),
    loadSettings(db),
    db.prepare(`SELECT COUNT(*) AS n FROM leads WHERE status = 'New'${leadScope.where ? ` AND ${leadScope.where}` : ""}`).bind(...leadScope.params).first<{ n: number }>(),
  ]);
  const base = buildDashboard({
    deals: dealRows,
    projects: projectRows,
    invoices: invoiceRows,
    activity: recent.results.map(activity.fromRow),
    settings,
    newLeads: fresh?.n ?? 0,
  });
  return c.json(await workspaceExtras(db, user, base));
});

/** Full backup of every table, owner/admin only. */
coreRoutes.get("/api/os/export", async (c) => {
  if (!can(c.get("user").role, "settings")) throw new HttpError(403, "Only an owner or admin can export a backup.");
  const db = c.env.DB;
  const [leadRows, dealRows, clientRows, projectRows, invoiceRows, activityRows, settings, counters, site, subscriberRows, userRows, timelineRows, taskRows, bookingRows, chatRows, kbRows, expenseRows, docs] =
    await Promise.all([
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
      users.all(db),
      timeline.all(db),
      tasks.all(db),
      bookings.all(db),
      chats.all(db),
      kbEntries.all(db),
      expenses.all(db),
      db.prepare("SELECT key, data FROM app_docs").all<{ key: string; data: string }>(),
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
    team: userRows.map(publicUser),
    timeline: timelineRows,
    tasks: taskRows,
    calls: bookingRows.map(({ manageToken: _token, ...call }) => call),
    chats: chatRows.map(({ ipHash: _hash, ...chat }) => chat),
    knowledge: kbRows,
    expenses: expenseRows,
    documents: Object.fromEntries(docs.results.map((row) => [row.key, JSON.parse(row.data)])),
  });
});

coreRoutes.put("/api/os/settings", async (c) => {
  if (!can(c.get("user").role, "settings")) throw new HttpError(403, "Only an owner or admin can change settings.");
  const settings = settingsInput.parse(await readJson(c));
  await saveSettings(c.env.DB, settings);
  return c.json(settings);
});
