import type { D1Database } from "./db/d1";
import type { UserRow } from "./db/tables";

/** Workers AI binding (wrangler.toml [ai]). Only the text-generation call shape is used. */
export type AiBinding = {
  run(model: string, input: { messages: Array<{ role: string; content: string }>; max_tokens?: number; temperature?: number }): Promise<unknown>;
};

/** Bindings provided by Cloudflare Pages (wrangler.toml + secrets) or by .dev.vars locally. */
export type Bindings = {
  DB: D1Database;
  AI?: AiBinding;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
  /** Optional e-mail notifications through Resend. Without a key, nothing is sent. */
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  NOTIFY_EMAIL?: string;
};

export type AppEnv = { Bindings: Bindings; Variables: { user: UserRow } };
