import { Hono } from "hono";
import { clientInput, projectInput, type Client } from "../../shared/os";
import type { AppEnv } from "../env";
import { clients, projects } from "../db/tables";
import { parseId, readJson } from "../http";
import { logActivity } from "./activity";
import { assertClientExists, newPortalToken, now, required } from "./records";

export const clientRoutes = new Hono<AppEnv>();

clientRoutes.post("/api/os/clients", async (c) => {
  const db = c.env.DB;
  const input = clientInput.parse(await readJson(c));
  const stamp = now();
  const row: Omit<Client, "id"> = { ...input, portalToken: newPortalToken(), createdAt: stamp, updatedAt: stamp };
  const [inserted] = await db.batch([clients.insert(db, row), ...logActivity(db, "client", `Client added: ${row.name}`)]);
  return c.json(clients.firstRow(inserted), 201);
});

clientRoutes.patch("/api/os/clients/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const found = required(await clients.byId(db, id));
  const input = clientInput.parse({ ...found, ...(await readJson(c)) });
  // The portal token is never taken from the body; only rotate-portal changes it.
  const updated = await clients.update(db, id, { ...input, updatedAt: now() }).run();
  return c.json(required(clients.firstRow(updated)));
});

clientRoutes.post("/api/os/clients/:id/rotate-portal", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const updated = await clients.update(db, id, { portalToken: newPortalToken(), updatedAt: now() }).run();
  return c.json(required(clients.firstRow(updated)));
});

export const projectRoutes = new Hono<AppEnv>();

projectRoutes.post("/api/os/projects", async (c) => {
  const db = c.env.DB;
  const input = projectInput.parse(await readJson(c));
  await assertClientExists(db, input.clientId);
  const stamp = now();
  const row = { ...input, createdAt: stamp, updatedAt: stamp };
  const [inserted] = await db.batch([projects.insert(db, row), ...logActivity(db, "project", `Project started: ${row.name}`)]);
  return c.json(projects.firstRow(inserted), 201);
});

projectRoutes.patch("/api/os/projects/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const previous = required(await projects.byId(db, id));
  const input = projectInput.parse({ ...previous, ...(await readJson(c)) });
  await assertClientExists(db, input.clientId);
  const statusChanged = previous.status !== input.status ? logActivity(db, "project", `${input.name} is now ${input.status}`) : [];
  const [updated] = await db.batch([projects.update(db, id, { ...input, updatedAt: now() }), ...statusChanged]);
  return c.json(projects.firstRow(updated));
});
