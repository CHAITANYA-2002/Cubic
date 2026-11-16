import { fromBase64Url, toBase64Url } from "./crypto";

// PBKDF2-SHA256 password hashes: "pbkdf2$<iterations>$<salt>$<hash>". Cloudflare Workers caps
// PBKDF2 at 100,000 iterations, which is used here.
const ITERATIONS = 100_000;
const encoder = new TextEncoder();

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

/** Constant-time comparison of the derived key. Any malformed stored value simply fails. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, rounds, saltText, hashText] = stored.split("$");
  const iterations = Number(rounds);
  const salt = fromBase64Url(saltText ?? "");
  const expected = fromBase64Url(hashText ?? "");
  if (scheme !== "pbkdf2" || !Number.isInteger(iterations) || iterations < 1 || iterations > ITERATIONS || !salt || !expected) return false;
  const actual = await derive(password, salt, iterations);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i += 1) diff |= actual[i] ^ expected[i];
  return diff === 0;
}
