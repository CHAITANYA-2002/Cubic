import { Hono } from "hono";
import { csrf } from "hono/csrf";
import type { AppEnv } from "./env";
import { errorResponse, limitBody } from "./http";
import { osRoutes, portalRoutes } from "./os";
import { adminRoutes } from "./routes/admin";
import { authRoutes, requireAdmin } from "./routes/auth";
import { publicRoutes } from "./routes/public";

/**
 * The whole API. Runs on Cloudflare Pages Functions (functions/api/[[route]].ts) and, in local
 * development, inside Vite through @hono/vite-dev-server with a local D1 from wrangler.
 */
const app = new Hono<AppEnv>();

app.use("/api/*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
});
app.use("/api/*", csrf());
app.use("/api/contact", limitBody(16 * 1024));
app.use("/api/newsletter", limitBody(2 * 1024));
app.use("/api/*", limitBody(1024 * 1024));

// Public and token-gated routes.
app.route("/", publicRoutes);
app.route("/", portalRoutes);
app.route("/", authRoutes);

// Everything below requires a signed admin session cookie.
app.use("/api/admin/*", requireAdmin);
app.use("/api/os/*", requireAdmin);
app.route("/", adminRoutes);
app.route("/", osRoutes);

app.notFound((c) => c.json({ message: "Not found" }, 404));
app.onError(errorResponse);

export default app;
