import { Hono, type MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";
import { api } from "../../shared/routes";
import type { AppEnv } from "../env";
import { clientIp, HttpError, readJson } from "../http";
import { safeEqual } from "../security/crypto";
import { clear, hit, isLimited, LIMITS, prune } from "../security/rate-limit";
import { authConfigured, createSession, SESSION_COOKIE, SESSION_TTL_SECONDS, verifySession } from "../security/session";

const isLocalHost = (c: Context) => ["localhost", "127.0.0.1", "[::1]"].includes(new URL(c.req.url).hostname);

const cookieOptions = (c: Context) => ({
  path: "/",
  httpOnly: true,
  secure: !isLocalHost(c),
  sameSite: "Strict" as const,
});

/** Every /api/admin/* (except login/logout) and /api/os/* route sits behind this. */
export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  const expiresAt = await verifySession(c.env.SESSION_SECRET, getCookie(c, SESSION_COOKIE));
  if (!expiresAt) return c.json({ message: "Unauthorized" }, 401);
  c.header("Cache-Control", "no-store");
  await next();
};

export const authRoutes = new Hono<AppEnv>();

authRoutes.post(api.admin.login.path, async (c) => {
  c.header("Cache-Control", "no-store");
  if (!authConfigured(c.env)) throw new HttpError(503, "Admin login is not configured on this server.");

  const db = c.env.DB;
  const now = Date.now();
  const limit = LIMITS.login(clientIp(c));
  if (await isLimited(db, limit, now)) throw new HttpError(429, "Too many attempts. Try again in 15 minutes.");

  const parsed = api.admin.login.input.safeParse(await readJson(c));
  const password = parsed.success ? parsed.data.password : "";
  if (!(await safeEqual(password, c.env.ADMIN_PASSWORD))) {
    await hit(db, limit, now);
    throw new HttpError(401, "Incorrect password");
  }

  await Promise.all([clear(db, limit.key), prune(db, now)]);
  const session = await createSession(c.env.SESSION_SECRET, now);
  setCookie(c, SESSION_COOKIE, session.value, { ...cookieOptions(c), maxAge: SESSION_TTL_SECONDS });
  return c.json({ ok: true, expiresAt: new Date(session.expiresAt).toISOString() });
});

authRoutes.post("/api/admin/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, cookieOptions(c));
  return c.body(null, 204);
});

authRoutes.get("/api/admin/session", requireAdmin, async (c) => {
  const expiresAt = await verifySession(c.env.SESSION_SECRET, getCookie(c, SESSION_COOKIE));
  return c.json({ authenticated: true, expiresAt: new Date(expiresAt ?? 0).toISOString() });
});
