import { Hono } from "hono";
import { api } from "../../shared/routes";
import type { ConsultationRequest } from "../../shared/schema";
import type { AppEnv } from "../env";
import { leads, subscribers } from "../db/tables";
import { clientIp, HttpError, readJson } from "../http";
import { logActivity } from "../os/activity";
import { hit, LIMITS } from "../security/rate-limit";
import { currencyFor, normaliseCountry } from "../site/geo";
import { loadSite } from "../site/settings";

export const publicRoutes = new Hono<AppEnv>();

const rejectBots = (botcheck: string | undefined) => {
  if (botcheck && botcheck.trim() !== "") throw new HttpError(400, "Submission rejected.");
};

publicRoutes.post(api.contact.submit.path, async (c) => {
  const db = c.env.DB;
  if (await hit(db, LIMITS.contact(clientIp(c)))) throw new HttpError(429, "Too many messages. Please wait a minute and try again.");
  const { botcheck, ...input } = api.contact.submit.input.parse(await readJson(c));
  rejectBots(botcheck);

  const lead: Omit<ConsultationRequest, "id"> = { ...input, status: "New", notes: "", createdAt: new Date().toISOString() };
  const [inserted] = await db.batch([
    leads.insert(db, lead),
    ...logActivity(db, "lead", `New enquiry from ${lead.name}${lead.company ? ` (${lead.company})` : ""}`),
  ]);
  const row = leads.firstRow(inserted);
  if (!row) throw new Error("Lead insert returned no row");
  return c.json(row, 201);
});

publicRoutes.post(api.newsletter.subscribe.path, async (c) => {
  const db = c.env.DB;
  if (await hit(db, LIMITS.newsletter(clientIp(c)))) throw new HttpError(429, "Too many requests. Please wait a minute and try again.");
  const result = api.newsletter.subscribe.input.safeParse(await readJson(c));
  if (!result.success) return c.json({ message: result.error.errors[0]?.message ?? "Invalid email" }, 400);
  rejectBots(result.data.botcheck);
  await db
    .prepare(`INSERT INTO ${subscribers.name} (email, subscribed_at) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`)
    .bind(result.data.email.toLowerCase(), new Date().toISOString())
    .run();
  return c.json({ message: "Subscribed" }, 201);
});

publicRoutes.get("/api/site", async (c) => {
  const site = await loadSite(c.env.DB);
  c.header("Cache-Control", "public, max-age=60");
  return c.json(site);
});

publicRoutes.get("/api/geo", (c) => {
  const cf = (c.req.raw as Request & { cf?: { country?: unknown } }).cf;
  const country = normaliseCountry(cf?.country) ?? normaliseCountry(c.req.header("cf-ipcountry"));
  c.header("Cache-Control", "private, no-store");
  c.header("Vary", "CF-IPCountry");
  return c.json(country ? { country, currency: currencyFor(country) } : { country: null, currency: null });
});
