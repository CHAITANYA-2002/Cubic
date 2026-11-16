import { Hono } from "hono";
import { assignmentInput, can, DEFAULT_AVAILABILITY, profileInput, userCreateInput, userUpdateInput, type Availability } from "../../shared/team";
import type { AppEnv } from "../env";
import { publicUser, users, type UserRow } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { loadDoc, saveDoc } from "../docs";
import { hashPassword } from "../security/password";
import { logActivity } from "../os/activity";

const now = () => new Date().toISOString();

/** Team accounts and personal settings. Mounted behind requireUser. */
export const teamRoutes = new Hono<AppEnv>();

const assertTeamAdmin = (user: UserRow) => {
  if (!can(user.role, "team")) throw new HttpError(403, "Only the owner manages team accounts.");
};

/** Everyone gets names and roles (for assignment pickers); only the owner gets the full rows. */
teamRoutes.get("/api/os/team", async (c) => {
  const rows = await c.env.DB.prepare("SELECT * FROM users ORDER BY role = 'owner' DESC, name").all();
  const all = rows.results.map(users.fromRow);
  if (can(c.get("user").role, "team")) return c.json(all.map(publicUser));
  return c.json(all.filter((row) => row.active).map(({ id, name, role, takesCalls, takesLeads }) => ({ id, name, role, takesCalls, takesLeads })));
});

teamRoutes.post("/api/os/team", async (c) => {
  const actor = c.get("user");
  assertTeamAdmin(actor);
  const db = c.env.DB;
  const input = userCreateInput.parse(await readJson(c));
  const stamp = now();
  const row: Omit<UserRow, "id"> = {
    name: input.name,
    email: input.email,
    role: input.role,
    passwordHash: await hashPassword(input.password),
    active: true,
    takesCalls: input.takesCalls,
    takesLeads: input.takesLeads,
    availability: DEFAULT_AVAILABILITY,
    tokenVersion: 1,
    lastLoginAt: "",
    createdAt: stamp,
    updatedAt: stamp,
  };
  const [inserted] = await db.batch([users.insert(db, row), ...logActivity(db, "team", `${actor.name} added ${input.name} (${input.role})`)]);
  const created = users.firstRow(inserted);
  if (!created) throw new Error("User insert returned no row");
  return c.json(publicUser(created), 201);
});

teamRoutes.patch("/api/os/team/:id", async (c) => {
  const actor = c.get("user");
  assertTeamAdmin(actor);
  const db = c.env.DB;
  const id = parseId(c);
  const target = await users.byId(db, id);
  if (!target) throw new HttpError(404, "Team member not found");
  const input = userUpdateInput.parse(await readJson(c));
  if (target.role === "owner" && (input.role || input.active === false || input.password)) {
    throw new HttpError(400, "The owner account cannot be demoted, deactivated or given a password here.");
  }
  if (input.role === "owner") throw new HttpError(400, "There is only one owner.");

  const { password, ...rest } = input;
  // A new password or deactivation signs the person out of every device.
  const revoke = Boolean(password) || input.active === false || (input.role !== undefined && input.role !== target.role);
  const change: Partial<UserRow> = {
    ...rest,
    ...(password ? { passwordHash: await hashPassword(password) } : {}),
    ...(revoke ? { tokenVersion: target.tokenVersion + 1 } : {}),
    updatedAt: now(),
  };
  const updated = users.firstRow(await users.update(db, id, change).run());
  if (!updated) throw new HttpError(404, "Team member not found");
  return c.json(publicUser(updated));
});

/** Your own name, email, working hours and whether you take calls. */
teamRoutes.put("/api/os/me", async (c) => {
  const user = c.get("user");
  const input = profileInput.parse(await readJson(c));
  if (input.email === "" && user.role !== "owner") throw new HttpError(400, "Staff accounts need an email to sign in");
  const change: Partial<UserRow> = { ...input, availability: (input.availability as Availability | undefined) ?? user.availability, updatedAt: now() };
  const updated = users.firstRow(await users.update(c.env.DB, user.id, change).run());
  if (!updated) throw new HttpError(404, "Account not found");
  return c.json(publicUser(updated));
});

teamRoutes.get("/api/os/assignment", async (c) => c.json(await loadDoc(c.env.DB, "assignment", assignmentInput)));

teamRoutes.put("/api/os/assignment", async (c) => {
  assertTeamAdmin(c.get("user"));
  const settings = assignmentInput.parse(await readJson(c));
  await saveDoc(c.env.DB, "assignment", settings);
  return c.json(settings);
});
