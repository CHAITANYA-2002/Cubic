import type { Bindings } from "../env";
import { hmacKey, hmacSign, hmacVerify, randomHex } from "./crypto";

export const SESSION_COOKIE = "cubic_admin";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

/** Sign-in needs a signing secret. The owner also needs ADMIN_PASSWORD; staff use their own passwords. */
export const sessionsConfigured = (env: Bindings): env is Bindings & { SESSION_SECRET: string } =>
  (env.SESSION_SECRET?.length ?? 0) >= MIN_SECRET_LENGTH;

export const ownerLoginConfigured = (env: Bindings): env is Bindings & { ADMIN_PASSWORD: string; SESSION_SECRET: string } =>
  Boolean(env.ADMIN_PASSWORD) && sessionsConfigured(env);

export type SessionClaims = { userId: number; version: number; expiresAt: number };

/**
 * Stateless signed session: "v2.<expiresAtMs>.<userId>.<tokenVersion>.<nonce>.<hmac>". The server
 * checks the user is still active and the token version still matches on every request, so
 * deactivating someone or changing their password signs them out everywhere.
 */
export async function createSession(secret: string, userId: number, version: number, now = Date.now()): Promise<{ value: string; expiresAt: number }> {
  const expiresAt = now + SESSION_TTL_SECONDS * 1000;
  const payload = `v2.${expiresAt}.${userId}.${version}.${randomHex(16)}`;
  const signature = await hmacSign(await hmacKey(secret), payload);
  return { value: `${payload}.${signature}`, expiresAt };
}

export async function verifySession(secret: string | undefined, value: string | undefined, now = Date.now()): Promise<SessionClaims | null> {
  if (!secret || secret.length < MIN_SECRET_LENGTH || !value) return null;
  const parts = value.split(".");
  if (parts.length !== 6 || parts[0] !== "v2") return null;
  const [, expiry, user, version, nonce, signature] = parts;
  const expiresAt = Number(expiry);
  const userId = Number(user);
  const tokenVersion = Number(version);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return null;
  if (!Number.isSafeInteger(userId) || userId < 1 || !Number.isSafeInteger(tokenVersion) || tokenVersion < 1) return null;
  if (!/^[a-f0-9]{32}$/.test(nonce)) return null;
  const valid = await hmacVerify(await hmacKey(secret), parts.slice(0, 5).join("."), signature);
  return valid ? { userId, version: tokenVersion, expiresAt } : null;
}
