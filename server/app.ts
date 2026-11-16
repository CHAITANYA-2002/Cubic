import { Hono } from "hono";
import { csrf } from "hono/csrf";
import type { Area } from "../shared/team";
import type { AppEnv } from "./env";
import { errorResponse, limitBody } from "./http";
import { osRoutes, portalRoutes } from "./os";
import { adminRoutes } from "./routes/admin";
import { authRoutes, requireArea, requireUser } from "./routes/auth";
import { publicRoutes } from "./routes/public";
import { bookingAdminRoutes } from "./booking/admin";
import { bookingPublicRoutes } from "./booking/public";
import { chatAdminRoutes, chatPublicRoutes, knowledgeRoutes } from "./chat/routes";
import { leadRoutes } from "./crm/leads";
import { taskRoutes } from "./crm/tasks";
import { timelineRoutes } from "./crm/timeline";
import { expenseRoutes } from "./finance/expenses";
import { teamRoutes } from "./team/routes";

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
app.use("/api/chat", limitBody(4 * 1024));
app.use("/api/chat/*", limitBody(8 * 1024));
app.use("/api/booking/*", limitBody(8 * 1024));
app.use("/api/booking", limitBody(8 * 1024));
app.use("/api/*", limitBody(1024 * 1024));

// Public and token-gated routes.
app.route("/", publicRoutes);
app.route("/", portalRoutes);
app.route("/", bookingPublicRoutes);
app.route("/", chatPublicRoutes);
app.route("/", authRoutes);

// Everything below requires a signed-in, active team member.
app.use("/api/admin/*", requireUser);
app.use("/api/os/*", requireUser);

// Section guards. Routes not listed here (state, team, me, timeline, export, settings) check the
// role inside the handler because what they return depends on it.
const GUARDS: Array<[string, Area]> = [
  ["/api/admin/submissions", "leads"],
  ["/api/admin/submissions/*", "leads"],
  ["/api/admin/stats", "dashboard"],
  ["/api/admin/subscribers", "subscribers"],
  ["/api/admin/site", "site"],
  ["/api/os/dashboard", "dashboard"],
  ["/api/os/leads", "leads"],
  ["/api/os/leads/*", "leads"],
  ["/api/os/leads/:id/convert", "pipeline"],
  ["/api/os/deals", "pipeline"],
  ["/api/os/deals/*", "pipeline"],
  ["/api/os/clients", "clients"],
  ["/api/os/clients/*", "clients"],
  ["/api/os/projects", "projects"],
  ["/api/os/projects/*", "projects"],
  ["/api/os/invoices", "invoices"],
  ["/api/os/invoices/*", "invoices"],
  ["/api/os/tasks", "tasks"],
  ["/api/os/tasks/*", "tasks"],
  ["/api/os/calls", "calls"],
  ["/api/os/calls/*", "calls"],
  ["/api/os/scheduling", "calls"],
  ["/api/os/chats", "chats"],
  ["/api/os/chats/*", "chats"],
  ["/api/os/kb", "knowledge"],
  ["/api/os/kb/*", "knowledge"],
  ["/api/os/chatbot", "knowledge"],
  ["/api/os/chatbot/*", "knowledge"],
  ["/api/os/expenses", "expenses"],
  ["/api/os/expenses/*", "expenses"],
];
GUARDS.forEach(([path, area]) => app.use(path, requireArea(area)));

app.route("/", adminRoutes);
app.route("/", leadRoutes);
app.route("/", osRoutes);
app.route("/", teamRoutes);
app.route("/", timelineRoutes);
app.route("/", taskRoutes);
app.route("/", bookingAdminRoutes);
app.route("/", chatAdminRoutes);
app.route("/", knowledgeRoutes);
app.route("/", expenseRoutes);

app.notFound((c) => c.json({ message: "Not found" }, 404));
app.onError(errorResponse);

export default app;
