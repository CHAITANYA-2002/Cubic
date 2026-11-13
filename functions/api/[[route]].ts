import { handle } from "hono/cloudflare-pages";
import app from "../../server/app";

// Cloudflare Pages routes every /api/* request here; static files and the SPA are served by Pages.
export const onRequest = handle(app);
