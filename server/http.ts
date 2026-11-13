import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export class HttpError extends Error {
  constructor(
    readonly status: 400 | 401 | 403 | 404 | 409 | 411 | 413 | 429 | 503,
    message: string,
  ) {
    super(message);
  }
}

/** Parsed JSON body, or a 400 when the body is missing or malformed. */
export async function readJson(c: Context): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await c.req.json();
    if (body && typeof body === "object" && !Array.isArray(body)) return body as Record<string, unknown>;
  } catch {
    // fall through to the user-facing error below
  }
  throw new HttpError(400, "Send a JSON object in the request body.");
}

export function parseId(c: Context): number {
  const id = Number(c.req.param("id"));
  if (Number.isInteger(id) && id > 0) return id;
  throw new HttpError(400, "Invalid id");
}

/**
 * Rejects oversized bodies from the declared Content-Length before anything is read. Requests
 * that carry a body must declare its length (browsers always do for fetch with a string body).
 */
export function limitBody(maxBytes: number): MiddlewareHandler {
  return async (c, next) => {
    if (!["POST", "PUT", "PATCH"].includes(c.req.method)) return next();
    const declared = c.req.header("content-length");
    if (declared === undefined) {
      if (c.req.header("transfer-encoding")) throw new HttpError(411, "Send the request with a Content-Length header.");
      return next();
    }
    const length = Number(declared);
    if (!Number.isFinite(length) || length < 0) throw new HttpError(400, "Invalid Content-Length.");
    if (length > maxBytes) throw new HttpError(413, "That request is too large.");
    return next();
  };
}

/** Client IP as seen by Cloudflare. CF-Connecting-IP is set by the edge and cannot be spoofed there. */
export const clientIp = (c: Context) => c.req.header("cf-connecting-ip") ?? "local";

const constraintMessage = (text: string) => {
  if (text.includes("UNIQUE constraint failed")) return { status: 409 as const, message: "That record already exists or was just changed. Refresh and try again." };
  if (text.includes("FOREIGN KEY constraint failed")) return { status: 400 as const, message: "A referenced client or project no longer exists." };
  return null;
};

/** One place that turns any thrown error into a user-safe JSON response. Never leaks internals. */
export function errorResponse(error: unknown, c: Context) {
  if (error instanceof z.ZodError) {
    const issue = error.errors[0];
    return c.json({ message: issue?.message ?? "Invalid input", field: issue?.path.join(".") ?? "" }, 400);
  }
  if (error instanceof HttpError) return c.json({ message: error.message }, error.status);
  if (error instanceof HTTPException) {
    const message = error.status === 403 ? "Request blocked: cross-site requests are not allowed." : "Request failed.";
    return c.json({ message }, error.status);
  }
  const known = constraintMessage(error instanceof Error ? `${error.message} ${String(error.cause ?? "")}` : "");
  if (known) return c.json({ message: known.message }, known.status);
  console.error("[api] request failed", c.req.method, c.req.path, error instanceof Error ? error.message : error);
  return c.json({ message: "Something went wrong. Please try again." }, 500);
}
