import { Hono, type Context } from "hono";
import { chatbotSettingsInput, chatLeadInput, chatTurnInput, kbInput, type ChatMessage, type ChatRecord, type KbEntry } from "../../shared/crm";
import type { Lead } from "../../shared/os";
import type { AppEnv } from "../env";
import { chats, kbEntries, leads } from "../db/tables";
import { clientIp, HttpError, parseId, readJson } from "../http";
import { loadDoc, saveDoc } from "../docs";
import { notifyTeam } from "../mail";
import { logActivity } from "../os/activity";
import { hit } from "../security/rate-limit";
import { loadSite } from "../site/settings";
import { assertAdmin } from "../crm/access";
import { chooseAssignee } from "../crm/assign";
import { timelineEntry } from "../crm/timeline";
import { buildCorpus } from "./knowledge";
import { fallbackAnswer, history, readModelText, systemPrompt } from "./prompt";
import { retrieve, wantsToTalk } from "./retrieve";

// Primary model, then a smaller one if the first is unavailable or over capacity.
const MODELS = ["@cf/meta/llama-3.3-70b-instruct-fp8-fast", "@cf/meta/llama-3.1-8b-instruct-fp8"];
const KEEP_MESSAGES = 60;

const loadChatSettings = (db: AppEnv["Bindings"]["DB"]) => loadDoc(db, "chatbot", chatbotSettingsInput);

async function ipHash(c: Context<AppEnv>): Promise<string> {
  const data = new TextEncoder().encode(`${clientIp(c)}|${c.env.SESSION_SECRET ?? "cubic"}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  return Array.from(digest.slice(0, 16), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function findChat(db: AppEnv["Bindings"]["DB"], sessionId: string) {
  return chats.firstRow(await db.prepare("SELECT * FROM chats WHERE session_id = ?").bind(sessionId).all());
}

async function askModel(c: Context<AppEnv>, messages: Array<{ role: string; content: string }>): Promise<string> {
  if (!c.env.AI) return "";
  for (const model of MODELS) {
    try {
      const text = readModelText(await c.env.AI.run(model, { messages, max_tokens: 450, temperature: 0.3 }));
      if (text) return text;
    } catch (error) {
      console.error("[chat] model failed", model, error instanceof Error ? error.message : error);
    }
  }
  return "";
}

/** Public chatbot endpoints. */
export const chatPublicRoutes = new Hono<AppEnv>();

chatPublicRoutes.post("/api/chat", async (c) => {
  const db = c.env.DB;
  const input = chatTurnInput.parse(await readJson(c));
  const settings = await loadChatSettings(db);
  if (!settings.enabled) throw new HttpError(503, "The assistant is offline right now. Please use the contact form.");

  const visitor = await ipHash(c);
  const today = new Date().toISOString().slice(0, 10);
  const [visitorOver, dayOver] = await Promise.all([
    hit(db, { key: `chat:${visitor}`, max: settings.perVisitorLimit, windowMs: 24 * 3600_000 }),
    hit(db, { key: `chat-day:${today}`, max: settings.dailyLimit, windowMs: 24 * 3600_000 }),
  ]);

  const [site, kb, existing] = await Promise.all([loadSite(db), kbEntries.all(db, "active = 1"), findChat(db, input.sessionId)]);
  const previous = existing?.messages ?? [];
  const context = retrieve(buildCorpus(site, kb), [...previous.slice(-2).map((m) => m.content), input.message].join(" "));

  let reply = "";
  if (!visitorOver && !dayOver) {
    const turns = [...history(previous), { role: "user", content: input.message }];
    reply = await askModel(c, [{ role: "system", content: systemPrompt(context, input.locale, settings.extraInstructions) }, ...turns]);
  }
  if (!reply) reply = fallbackAnswer(context, input.message);

  const stamp = new Date().toISOString();
  const added: ChatMessage[] = [
    { role: "user", content: input.message, at: stamp },
    { role: "assistant", content: reply, at: stamp },
  ];
  const messages = [...previous, ...added].slice(-KEEP_MESSAGES);
  if (existing) {
    await chats.update(db, existing.id, { messages, messageCount: existing.messageCount + 2, status: "Open", updatedAt: stamp }).run();
  } else {
    const row: Omit<ChatRecord & { ipHash: string }, "id"> = {
      sessionId: input.sessionId,
      locale: input.locale,
      page: input.page,
      ipHash: visitor,
      messages,
      messageCount: 2,
      leadId: null,
      status: "Open",
      createdAt: stamp,
      updatedAt: stamp,
    };
    await chats.insert(db, row).run();
  }
  return c.json({ reply, suggestContact: wantsToTalk(input.message) || /\/book|\/contact/.test(reply) });
});

/** The visitor leaves their details from inside the chat; the transcript goes with the lead. */
chatPublicRoutes.post("/api/chat/lead", async (c) => {
  const db = c.env.DB;
  if (await hit(db, { key: `chat-lead:${await ipHash(c)}`, max: 3, windowMs: 3600_000 })) throw new HttpError(429, "Please wait a little before sending again.");
  const { botcheck, ...input } = chatLeadInput.parse(await readJson(c));
  if (botcheck) throw new HttpError(400, "Submission rejected.");
  const chat = await findChat(db, input.sessionId);
  const transcript = (chat?.messages ?? [])
    .slice(-12)
    .map((message) => `${message.role === "user" ? "Visitor" : "Assistant"}: ${message.content}`)
    .join("\n");
  const stamp = new Date().toISOString();
  const lead: Omit<Lead, "id"> = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: "",
    service: "",
    budget: "",
    message: input.message || "Left details in the website chat.",
    status: "New",
    notes: "",
    source: "Chatbot",
    assignedTo: await chooseAssignee(db),
    page: chat?.page ?? "",
    utm: "",
    createdAt: stamp,
    updatedAt: stamp,
  };
  const [inserted] = await db.batch([leads.insert(db, lead), ...logActivity(db, "lead", `Chatbot lead: ${lead.name}`)]);
  const row = leads.firstRow(inserted);
  if (!row) throw new Error("Lead insert returned no row");
  await Promise.all([
    transcript ? timelineEntry(db, "lead", row.id, "system", `Chat transcript:\n${transcript}`, null).run() : null,
    chat ? chats.update(db, chat.id, { leadId: row.id, updatedAt: stamp }).run() : null,
    notifyTeam(c.env, `Chatbot lead: ${lead.name}`, `${lead.name} <${lead.email}> ${lead.phone}\n\n${lead.message}\n\n${transcript}`, lead.email),
  ]);
  return c.json({ ok: true }, 201);
});

/** Chats, knowledge base and bot settings. Mounted behind requireUser + the "chats" area. */
export const chatAdminRoutes = new Hono<AppEnv>();

chatAdminRoutes.get("/api/os/chats", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM chats ORDER BY updated_at DESC LIMIT 200").all();
  return c.json(results.map((row) => {
    const { ipHash: _hash, ...chat } = chats.fromRow(row);
    return chat;
  }));
});

chatAdminRoutes.patch("/api/os/chats/:id", async (c) => {
  const body = await readJson(c);
  const status = body.status === "Reviewed" ? "Reviewed" : "Open";
  const updated = chats.firstRow(await chats.update(c.env.DB, parseId(c), { status }).run());
  if (!updated) throw new HttpError(404, "Chat not found");
  return c.json({ id: updated.id, status: updated.status });
});

chatAdminRoutes.delete("/api/os/chats/:id", async (c) => {
  assertAdmin(c.get("user"));
  await chats.remove(c.env.DB, parseId(c)).run();
  return c.body(null, 204);
});

/** Knowledge base and settings: owner/admin only. */
export const knowledgeRoutes = new Hono<AppEnv>();

knowledgeRoutes.get("/api/os/kb", async (c) => c.json(await kbEntries.all(c.env.DB)));

knowledgeRoutes.post("/api/os/kb", async (c) => {
  const input = kbInput.parse(await readJson(c));
  const stamp = new Date().toISOString();
  const row: Omit<KbEntry, "id"> = { ...input, createdAt: stamp, updatedAt: stamp };
  return c.json(kbEntries.firstRow(await kbEntries.insert(c.env.DB, row).run()), 201);
});

knowledgeRoutes.patch("/api/os/kb/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const previous = await kbEntries.byId(db, id);
  if (!previous) throw new HttpError(404, "Answer not found");
  const input = kbInput.parse({ ...previous, ...(await readJson(c)) });
  return c.json(kbEntries.firstRow(await kbEntries.update(db, id, { ...input, updatedAt: new Date().toISOString() }).run()));
});

knowledgeRoutes.delete("/api/os/kb/:id", async (c) => {
  await kbEntries.remove(c.env.DB, parseId(c)).run();
  return c.body(null, 204);
});

knowledgeRoutes.get("/api/os/chatbot", async (c) => {
  const settings = await loadChatSettings(c.env.DB);
  const today = new Date().toISOString().slice(0, 10);
  const used = await c.env.DB.prepare("SELECT count FROM rate_limits WHERE key = ?").bind(`chat-day:${today}`).first<{ count: number }>();
  return c.json({ settings, usedToday: used?.count ?? 0, aiConnected: Boolean(c.env.AI) });
});

knowledgeRoutes.put("/api/os/chatbot", async (c) => {
  const settings = chatbotSettingsInput.parse(await readJson(c));
  await saveDoc(c.env.DB, "chatbot", settings);
  return c.json(settings);
});

/** Try the assistant from the admin without counting against visitor limits or saving a chat. */
knowledgeRoutes.post("/api/os/chatbot/test", async (c) => {
  const db = c.env.DB;
  const body = await readJson(c);
  const message = typeof body.message === "string" ? body.message.slice(0, 1000) : "";
  if (!message) throw new HttpError(400, "Type a question");
  const [site, kb, settings] = await Promise.all([loadSite(db), kbEntries.all(db, "active = 1"), loadChatSettings(db)]);
  const context = retrieve(buildCorpus(site, kb), message);
  const reply = (await askModel(c, [{ role: "system", content: systemPrompt(context, "en", settings.extraInstructions) }, { role: "user", content: message }])) || fallbackAnswer(context, message);
  return c.json({ reply, sources: context.map((chunk) => chunk.title) });
});
