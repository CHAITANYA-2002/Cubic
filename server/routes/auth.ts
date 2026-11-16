import { Hono, type Context, type MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { AREAS, can, changePasswordInput, loginInput, type Area, type Me } from "../../shared/team";
import type { AppEnv } from "../env";
import { users, type UserRow } from "../db/tables";
import { clientIp, HttpError, readJson } from "../http";
import { safeEqual } from "../security/crypto";
import { hashPassword, verifyPassword } from "../security/password";
import { clear, hit, isLimited, LIMITS, prune } from "../security/rate-limit";
import { createSession, ownerLoginConfigured, SESSION_COOKIE, SESSION_TTL_SECONDS, sessionsConfigured, verifySession } from "../security/session";
import { ensureOwner } from "../team/owner";

const isLocalHost = (c: Context) => ["localhost", "127.0.0.1", "[::1]"].includes(new URL(c.req.url).hostname);

const cookieOptions = (c: Context) => ({
  path: "/",
  httpOnly: true,
  secure: !isLocalHost(c),
  sameSite: "Strict" as const,
});

/** Every /api/admin/* (except login/logout) and /api/os/* route sits behind this. */
export const requireUser: MiddlewareHandler<AppEnv> = async (c, next) => {
  const claims = await verifySession(c.env.SESSION_SECRET, getCookie(c, SESSION_COOKIE));
  if (!claims) return c.json({ message: "Unauthorized" }, 401);
  const user = await users.byId(c.env.DB, claims.userId);
  if (!user || !user.active || user.tokenVersion !== claims.version) return c.json({ message: "Unauthorized" }, 401);
  c.set("user", user);
  c.header("Cache-Control", "no-store");
  await next();
};

/** Route-level guard on top of requireUser. */
export const requireArea =
  (area: Area): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    if (!can(c.get("user").role, area)) throw new HttpError(403, "Your role cannot open this section.");
    await next();
  };

export const toMe = (user: UserRow, expiresAt: number): Me => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  takesCalls: user.takesCalls,
  availability: user.availability,
  areas: AREAS.filter((area) => can(user.role, area)),
  expiresAt: new Date(expiresAt).toISOString(),
});

/** Owner signs in with ADMIN_PASSWORD (email blank or the owner's email); everyone else with email + password. */
async function authenticate(c: Context<AppEnv>, email: string, password: string): Promise<UserRow | null> {
  const db = c.env.DB;
  if (ownerLoginConfigured(c.env) && (await safeEqual(password, c.env.ADMIN_PASSWORD))) {
    const owner = await ensureOwner(db);
    if (!email || email === owner.email) return owner;
  }
  if (!email) return null;
  const user = users.firstRow(await db.prepare("SELECT * FROM users WHERE email = ? AND active = 1").bind(email).all());
  // Still derive a hash when the user is unknown so timing does not reveal which emails exist.
  const ok = await verifyPassword(password, user?.passwordHash || "pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  return ok && user ? user : null;
}

export const authRoutes = new Hono<AppEnv>();

authRoutes.post("/api/admin/login", async (c) => {
  c.header("Cache-Control", "no-store");
  if (!sessionsConfigured(c.env)) throw new HttpError(503, "Admin login is not configured on this server.");

  const db = c.env.DB;
  const now = Date.now();
  const limit = LIMITS.login(clientIp(c));
  if (await isLimited(db, limit, now)) throw new HttpError(429, "Too many attempts. Try again in 15 minutes.");

  const parsed = loginInput.safeParse(await readJson(c));
  const user = parsed.success ? await authenticate(c, parsed.data.email, parsed.data.password) : null;
  if (!user) {
    await hit(db, limit, now);
    throw new HttpError(401, "Incorrect email or password");
  }

  await Promise.all([
    clear(db, limit.key),
    prune(db, now),
    users.update(db, user.id, { lastLoginAt: new Date(now).toISOString() }).run(),
  ]);
  const session = await createSession(c.env.SESSION_SECRET, user.id, user.tokenVersion, now);
  setCookie(c, SESSION_COOKIE, session.value, { ...cookieOptions(c), maxAge: SESSION_TTL_SECONDS });
  return c.json(toMe(user, session.expiresAt));
});

authRoutes.post("/api/admin/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, cookieOptions(c));
  return c.body(null, 204);
});

authRoutes.get("/api/admin/session", requireUser, async (c) => {
  const claims = await verifySession(c.env.SESSION_SECRET, getCookie(c, SESSION_COOKIE));
  return c.json(toMe(c.get("user"), claims?.expiresAt ?? 0));
});

/** Change your own password. The owner's ADMIN_PASSWORD lives in Cloudflare and is changed there. */
authRoutes.post("/api/admin/password", requireUser, async (c) => {
  const user = c.get("user");
  if (user.role === "owner") throw new HttpError(400, "The owner password is ADMIN_PASSWORD. Change it with npm run admin:password.");
  const input = changePasswordInput.parse(await readJson(c));
  if (!(await verifyPassword(input.current, user.passwordHash))) throw new HttpError(400, "Your current password is wrong");
  const next = await hashPassword(input.next);
  const updated = users.firstRow(
    await users.update(c.env.DB, user.id, { passwordHash: next, tokenVersion: user.tokenVersion + 1, updatedAt: new Date().toISOString() }).run(),
  );
  if (!updated) throw new HttpError(404, "Account not found");
  const session = await createSession(c.env.SESSION_SECRET as string, updated.id, updated.tokenVersion);
  setCookie(c, SESSION_COOKIE, session.value, { ...cookieOptions(c), maxAge: SESSION_TTL_SECONDS });
  return c.json({ ok: true });
});
