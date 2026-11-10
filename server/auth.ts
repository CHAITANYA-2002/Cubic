import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const DEV_PASSWORD = "cubic@14412815";

const isProduction = process.env.NODE_ENV === "production";
const usingDevPassword = !process.env.ADMIN_PASSWORD && !isProduction;
const configuredPassword = process.env.ADMIN_PASSWORD ?? (isProduction ? null : DEV_PASSWORD);

if (!configuredPassword) {
  console.warn("[auth] ADMIN_PASSWORD is not set — admin login is disabled in production.");
} else if (usingDevPassword) {
  console.warn("[auth] ADMIN_PASSWORD is not set — dev password accepted from this machine only.");
}

// Raw socket address: a client cannot spoof it with X-Forwarded-For.
const isLoopback = (req: Request) => ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress ?? "");

const sessions = new Map<string, number>();
const attempts = new Map<string, { count: number; resetAt: number }>();

function prune(now: number) {
  sessions.forEach((expiry, token) => expiry < now && sessions.delete(token));
  attempts.forEach((entry, ip) => entry.resetAt < now && attempts.delete(ip));
}

const digest = (value: string) => crypto.createHash("sha256").update(value).digest();

function passwordMatches(candidate: string): boolean {
  if (!configuredPassword) return false;
  return crypto.timingSafeEqual(digest(candidate), digest(configuredPassword));
}

function rateLimited(ip: string, now: number): boolean {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= LOGIN_MAX_ATTEMPTS;
}

function recordFailure(ip: string, now: number) {
  const entry = attempts.get(ip);
  const fresh = !entry || entry.resetAt < now;
  attempts.set(ip, fresh ? { count: 1, resetAt: now + LOGIN_WINDOW_MS } : { ...entry, count: entry.count + 1 });
}

export function login(req: Request, res: Response) {
  const now = Date.now();
  const ip = req.ip ?? "unknown";
  if (!configuredPassword) return res.status(503).json({ message: "Admin login is not configured on this server" });
  if (usingDevPassword && !isLoopback(req)) return res.status(503).json({ message: "Set ADMIN_PASSWORD to sign in from another device" });
  prune(now);
  if (rateLimited(ip, now)) return res.status(429).json({ message: "Too many attempts. Try again in 15 minutes." });

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!passwordMatches(password)) {
    recordFailure(ip, now);
    return res.status(401).json({ message: "Incorrect password" });
  }

  attempts.delete(ip);
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, now + SESSION_TTL_MS);
  return res.json({ token });
}

export function logout(req: Request, res: Response) {
  sessions.delete(req.header("x-admin-token") ?? "");
  res.status(204).end();
}

export function isAdmin(req: Request): boolean {
  const token = req.header("x-admin-token") ?? "";
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (expiry < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!isAdmin(req)) return res.status(401).json({ message: "Unauthorized" });
  next();
}
