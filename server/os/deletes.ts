import { Hono } from "hono";
import type { AppEnv } from "../env";
import type { D1Database } from "../db/d1";
import { clients, deals, invoices, projects } from "../db/tables";
import { HttpError, parseId } from "../http";

type Collection = "deals" | "clients" | "projects" | "invoices";

const exists = async (db: D1Database, sql: string, id: number) => Boolean(await db.prepare(sql).bind(id).first());

/** Why a row may not be deleted, or null when it can go. Mirrors the rules of the old document store. */
const blockers: Record<Collection, (db: D1Database, id: number) => Promise<string | null>> = {
  deals: async () => null,
  projects: async (db, id) =>
    (await exists(db, "SELECT 1 FROM invoices WHERE project_id = ? LIMIT 1", id)) ? "This project has invoices. Remove them first." : null,
  invoices: async (db, id) => {
    const row = await db.prepare("SELECT kind, number FROM invoices WHERE id = ?").bind(id).first<{ kind: string; number: string }>();
    return row?.kind === "invoice" && row.number ? "Issued invoices are kept for GST records. Mark it Cancelled instead." : null;
  },
  clients: async (db, id) => {
    const used = await exists(
      db,
      `SELECT 1 WHERE EXISTS (SELECT 1 FROM projects WHERE client_id = ?1)
         OR EXISTS (SELECT 1 FROM invoices WHERE client_id = ?1)
         OR EXISTS (SELECT 1 FROM deals WHERE client_id = ?1)`,
      id,
    );
    return used ? "This client has deals, projects or invoices. Remove those first." : null;
  },
};

const tables = { deals, clients, projects, invoices };

export const deleteRoutes = new Hono<AppEnv>();

(Object.keys(blockers) as Collection[]).forEach((key) => {
  deleteRoutes.delete(`/api/os/${key}/:id`, async (c) => {
    const db = c.env.DB;
    const id = parseId(c);
    const blocked = await blockers[key](db, id);
    if (blocked) throw new HttpError(409, blocked);
    const result = await tables[key].remove(db, id).run();
    if (result.meta.changes === 0) throw new HttpError(404, "Not found");
    return c.body(null, 204);
  });
});
