import { Hono } from "hono";
import { invoiceTotals, type PortalView } from "../../shared/os";
import type { AppEnv } from "../env";
import { clients, invoices, projects } from "../db/tables";
import { loadSettings } from "./settings";

/** Public, token-gated. Returns only the one client's own projects and issued documents. */
export const portalRoutes = new Hono<AppEnv>();

const notFound = { message: "Portal not found" };

portalRoutes.get("/api/portal/:token", async (c) => {
  c.header("Cache-Control", "no-store");
  c.header("X-Robots-Tag", "noindex, nofollow");
  const token = c.req.param("token");
  if (!/^[a-f0-9]{48}$/.test(token)) return c.json(notFound, 404);

  const db = c.env.DB;
  const row = await db.prepare("SELECT * FROM clients WHERE portal_token = ?").bind(token).first();
  if (!row) return c.json(notFound, 404);
  const client = clients.fromRow(row);

  const [projectRows, invoiceRows, settings] = await Promise.all([
    projects.all(db, "client_id = ?", [client.id]),
    invoices.all(db, "client_id = ? AND status NOT IN ('Draft', 'Cancelled')", [client.id]),
    loadSettings(db),
  ]);
  const { invoicePrefix: _prefix, paymentTermsDays: _terms, ...business } = settings;

  const view: PortalView = {
    client: { name: client.name, company: client.company, email: client.email, gstin: client.gstin, address: client.address },
    business,
    projects: projectRows.map(({ id, name, service, status, startDate, dueDate, milestones, updates }) => ({
      id,
      name,
      service,
      status,
      startDate,
      dueDate,
      milestones,
      updates: updates.filter((update) => update.visibleToClient),
    })),
    invoices: invoiceRows.map((invoice) => ({ ...invoice, totals: invoiceTotals(invoice) })),
  };
  return c.json(view);
});
