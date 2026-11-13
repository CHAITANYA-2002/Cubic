import type { Bindings } from "../env";
import { hmacKey, hmacSign, hmacVerify, randomHex } from "./crypto";

export const SESSION_COOKIE = "cubic_admin";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

/** Admin login fails closed: both secrets must be configured, with no fallback or default. */
export function authConfigured(env: Bindings): env is Bindings & { ADMIN_PASSWORD: string; SESSION_SECRET: string } {
  return Boolean(env.ADMIN_PASSWORD) && (env.SESSION_SECRET?.length ?? 0) >= MIN_SECRET_LENGTH;
}

/**
 * Stateless session: "v1.<expiresAtMs>.<nonce>.<hmac>". Nothing is stored server-side, so signing
 * out clears the cookie and rotating SESSION_SECRET signs every device out.
 */
export async function createSession(secret: string, now = Date.now()): Promise<{ value: string; expiresAt: number }> {
  const expiresAt = now + SESSION_TTL_SECONDS * 1000;
  const payload = `v1.${expiresAt}.${randomHex(16)}`;
  const signature = await hmacSign(await hmacKey(secret), payload);
  return { value: `${payload}.${signature}`, expiresAt };
}

export async function verifySession(secret: string | undefined, value: string | undefined, now = Date.now()): Promise<number | null> {
  if (!secret || secret.length < MIN_SECRET_LENGTH || !value) return null;
  const parts = value.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return null;
  const [version, expiry, nonce, signature] = parts;
  const expiresAt = Number(expiry);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || !/^[a-f0-9]{32}$/.test(nonce)) return null;
  const valid = await hmacVerify(await hmacKey(secret), `${version}.${expiry}.${nonce}`, signature);
  return valid ? expiresAt : null;
}
