import type { D1Database } from "../db/d1";

type Window = { key: string; max: number; windowMs: number };

/** True when the key has already used up its window. Read-only: use before checking a password. */
export async function isLimited(db: D1Database, { key, max }: Window, now = Date.now()): Promise<boolean> {
  const row = await db.prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?").bind(key).first<{ count: number; reset_at: number }>();
  return Boolean(row && row.reset_at > now && row.count >= max);
}

/** Records one hit atomically and returns true when this hit is over the limit. */
export async function hit(db: D1Database, { key, max, windowMs }: Window, now = Date.now()): Promise<boolean> {
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (key, count, reset_at) VALUES (?1, 1, ?2)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN rate_limits.reset_at <= ?3 THEN 1 ELSE rate_limits.count + 1 END,
         reset_at = CASE WHEN rate_limits.reset_at <= ?3 THEN ?2 ELSE rate_limits.reset_at END
       RETURNING count`,
    )
    .bind(key, now + windowMs, now)
    .first<{ count: number }>();
  return (row?.count ?? 0) > max;
}

export function clear(db: D1Database, key: string) {
  return db.prepare("DELETE FROM rate_limits WHERE key = ?").bind(key).run();
}

/** Expired windows are dead weight; drop them now and then so the table stays tiny. */
export function prune(db: D1Database, now = Date.now()) {
  return db.prepare("DELETE FROM rate_limits WHERE reset_at <= ?").bind(now).run();
}

export const LIMITS = {
  login: (ip: string): Window => ({ key: `login:${ip}`, max: 5, windowMs: 15 * 60 * 1000 }),
  contact: (ip: string): Window => ({ key: `contact:${ip}`, max: 5, windowMs: 60 * 1000 }),
  newsletter: (ip: string): Window => ({ key: `newsletter:${ip}`, max: 5, windowMs: 60 * 1000 }),
};
