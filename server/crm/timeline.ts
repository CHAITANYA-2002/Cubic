import { Hono } from "hono";
import { TIMELINE_ENTITIES, timelineInput, type TimelineEntity } from "../../shared/crm";
import { can, type Area } from "../../shared/team";
import type { AppEnv } from "../env";
import type { D1Database, D1PreparedStatement } from "../db/d1";
import { deals, leads, timeline, type UserRow } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { assertMayTouch } from "./access";

const AREA_OF: Record<TimelineEntity, Area> = { lead: "leads", deal: "pipeline", client: "clients", project: "projects" };

/** One timeline row, for use inside a caller's batch. user is null for system events. */
export function timelineEntry(db: D1Database, entity: TimelineEntity, entityId: number, kind: string, text: string, user: UserRow | null): D1PreparedStatement {
  return timeline.insert(db, { entity, entityId, kind, text, userId: user?.id ?? null, userName: user?.name ?? "System", at: new Date().toISOString() });
}

function parseEntity(value: string | undefined): TimelineEntity {
  if (TIMELINE_ENTITIES.includes(value as TimelineEntity)) return value as TimelineEntity;
  throw new HttpError(400, "Unknown record type");
}

/** Role check plus ownership for leads and deals. */
async function assertAccess(db: D1Database, user: UserRow, entity: TimelineEntity, id: number) {
  if (!can(user.role, AREA_OF[entity])) throw new HttpError(403, "Your role cannot open this section.");
  if (entity === "lead") assertMayTouch(user, (await leads.byId(db, id))?.assignedTo);
  if (entity === "deal") assertMayTouch(user, (await deals.byId(db, id))?.assignedTo);
}

export const timelineRoutes = new Hono<AppEnv>();

timelineRoutes.get("/api/os/timeline/:entity/:id", async (c) => {
  const entity = parseEntity(c.req.param("entity"));
  const id = parseId(c);
  await assertAccess(c.env.DB, c.get("user"), entity, id);
  return c.json(await timeline.all(c.env.DB, "entity = ? AND entity_id = ?", [entity, id]));
});

timelineRoutes.post("/api/os/timeline/:entity/:id", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const entity = parseEntity(c.req.param("entity"));
  const id = parseId(c);
  await assertAccess(db, user, entity, id);
  const input = timelineInput.parse(await readJson(c));
  const row = timeline.firstRow(await timelineEntry(db, entity, id, input.kind, input.text, user).run());
  return c.json(row, 201);
});
