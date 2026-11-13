import type { D1Database } from "./db/d1";

/** Bindings provided by Cloudflare Pages (wrangler.toml + secrets) or by .dev.vars locally. */
export type Bindings = {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
};

export type AppEnv = { Bindings: Bindings };
