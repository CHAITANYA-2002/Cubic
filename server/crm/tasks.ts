import { Hono } from "hono";
import { taskInput, type Task } from "../../shared/crm";
import type { AppEnv } from "../env";
import { tasks } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { allowedAssignee, assertMayTouch, scopeWhere } from "./access";

/** Follow-ups and to-dos. Mounted behind requireUser + the "tasks" area. */
export const taskRoutes = new Hono<AppEnv>();

taskRoutes.get("/api/os/tasks", async (c) => {
  const scope = scopeWhere(c.get("user"));
  const rows = await tasks.all(c.env.DB, scope.where, scope.params);
  // Open first (soonest due first, undated last), then the 100 most recently finished.
  const open = rows.filter((task) => !task.done).sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
  const finished = rows.filter((task) => task.done).slice(0, 100);
  return c.json([...open, ...finished]);
});

taskRoutes.post("/api/os/tasks", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const input = taskInput.parse(await readJson(c));
  const stamp = new Date().toISOString();
  const row: Omit<Task, "id"> = {
    ...input,
    assignedTo: allowedAssignee(user, input.assignedTo ?? user.id, user.id),
    createdBy: user.id,
    completedAt: input.done ? stamp : "",
    createdAt: stamp,
    updatedAt: stamp,
  };
  return c.json(tasks.firstRow(await tasks.insert(db, row).run()), 201);
});

taskRoutes.patch("/api/os/tasks/:id", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const id = parseId(c);
  const previous = await tasks.byId(db, id);
  if (!previous) throw new HttpError(404, "Task not found");
  assertMayTouch(user, previous.assignedTo);
  const body = await readJson(c);
  const input = taskInput.parse({ ...previous, ...body });
  const stamp = new Date().toISOString();
  const completedAt = input.done ? previous.completedAt || stamp : "";
  const assignedTo = allowedAssignee(user, "assignedTo" in body ? input.assignedTo : undefined, previous.assignedTo);
  return c.json(tasks.firstRow(await tasks.update(db, id, { ...input, assignedTo, completedAt, updatedAt: stamp }).run()));
});

taskRoutes.delete("/api/os/tasks/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const previous = await tasks.byId(db, id);
  if (!previous) throw new HttpError(404, "Task not found");
  assertMayTouch(c.get("user"), previous.assignedTo);
  await tasks.remove(db, id).run();
  return c.body(null, 204);
});
