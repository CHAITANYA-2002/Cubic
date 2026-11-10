import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import {
  STAGE_PROBABILITY,
  clientInput,
  dealInput,
  invoiceInput,
  invoiceTotals,
  projectInput,
  settingsInput,
  todayIso,
  type Client,
  type Deal,
  type Invoice,
  type PortalView,
  type Project,
} from "@shared/os";
import { requireAdmin } from "../auth";
import { storage } from "../storage";
import { buildDashboard } from "./dashboard";
import { nextId, read, withActivity, write, type OsDocument } from "./store";

type Collection = "deals" | "clients" | "projects" | "invoices";

const newPortalToken = () => crypto.randomBytes(24).toString("hex");
const now = () => new Date().toISOString();

function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);
  if (Number.isInteger(id) && id > 0) return id;
  res.status(400).json({ message: "Invalid id" });
  return null;
}

function sendError(res: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    const issue = error.errors[0];
    return res.status(400).json({ message: issue.message, field: issue.path.join(".") });
  }
  if (error instanceof HttpError) return res.status(error.status).json({ message: error.message });
  console.error("[os] request failed", error);
  return res.status(500).json({ message: "Something went wrong saving that. Try again." });
}

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

function replaceRow<K extends Collection>(doc: OsDocument, key: K, id: number, build: (row: OsDocument[K][number]) => OsDocument[K][number]) {
  const rows = doc[key] as Array<OsDocument[K][number]>;
  const found = rows.find((row) => row.id === id);
  if (!found) throw new HttpError(404, "Not found");
  const updated = build(found);
  return { doc: { ...doc, [key]: rows.map((row) => (row.id === id ? updated : row)) } as OsDocument, row: updated };
}

function assertClientExists(doc: OsDocument, clientId: number) {
  if (!doc.clients.some((client) => client.id === clientId)) throw new HttpError(400, "Choose an existing client");
}

function buildDeal(input: z.infer<typeof dealInput>, id: number, previous?: Deal): Deal {
  const stageChanged = previous && previous.stage !== input.stage;
  const probability = input.probability ?? (stageChanged || !previous ? STAGE_PROBABILITY[input.stage] : previous.probability);
  const stamp = now();
  return { ...input, probability, id, createdAt: previous?.createdAt ?? stamp, updatedAt: stamp };
}

/** Indian financial year (April–March) of a YYYY-MM-DD date, e.g. "26-27". */
function financialYear(isoDate: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  const start = month >= 4 ? year : year - 1;
  return `${String(start % 100).padStart(2, "0")}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/**
 * GST needs a consecutive series per financial year, so invoices are numbered only when they
 * leave Draft and numbered invoices can never be deleted. Quotes are numbered on creation.
 */
function invoiceNumber(doc: OsDocument, kind: Invoice["kind"], issueDate: string): { doc: OsDocument; number: string } {
  const fy = financialYear(issueDate || todayIso());
  const key = `${kind}-${fy}`;
  const value = (doc.seq[key] ?? 0) + 1;
  const prefix = kind === "quote" ? `${doc.settings.invoicePrefix}-Q` : doc.settings.invoicePrefix;
  return { doc: { ...doc, seq: { ...doc.seq, [key]: value } }, number: `${prefix}/${fy}/${String(value).padStart(3, "0")}` };
}

function assignNumberIfIssued(doc: OsDocument, invoice: Invoice): { doc: OsDocument; invoice: Invoice } {
  if (invoice.number || (invoice.kind === "invoice" && invoice.status === "Draft")) return { doc, invoice };
  const { doc: next, number } = invoiceNumber(doc, invoice.kind, invoice.issueDate);
  return { doc: next, invoice: { ...invoice, number } };
}

function registerDeals(app: Express) {
  app.post("/api/os/deals", async (req, res) => {
    try {
      const input = dealInput.parse(req.body);
      const deal = await write((doc) => {
        const { doc: next, id } = nextId(doc, "deals");
        const row = buildDeal(input, id);
        return { doc: withActivity({ ...next, deals: [row, ...next.deals] }, "deal", `Deal added: ${row.title}`), result: row };
      });
      res.status(201).json(deal);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.patch("/api/os/deals/:id", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const deal = await write((doc) => {
        const previous = doc.deals.find((row) => row.id === id);
        if (!previous) throw new HttpError(404, "Deal not found");
        const input = dealInput.parse({ ...previous, probability: undefined, ...req.body });
        const { doc: next, row } = replaceRow(doc, "deals", id, () => buildDeal(input, id, previous));
        const moved = previous.stage !== row.stage ? withActivity(next, "deal", `${row.title} moved to ${row.stage}`) : next;
        return { doc: moved, result: row };
      });
      res.json(deal);
    } catch (error) {
      sendError(res, error);
    }
  });

  // Winning a deal creates the client (if needed) and a project so delivery starts from the same record.
  app.post("/api/os/deals/:id/win", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const result = await write((doc) => {
        const deal = doc.deals.find((row) => row.id === id);
        if (!deal) throw new HttpError(404, "Deal not found");
        if (deal.stage === "Won" || doc.projects.some((row) => row.dealId === id)) throw new HttpError(409, "This deal is already won and has a project.");
        if (deal.clientId) assertClientExists(doc, deal.clientId);
        const stamp = now();

        let working = doc;
        let clientId = deal.clientId;
        if (!clientId) {
          const created = nextId(working, "clients");
          const client: Client = {
            id: created.id,
            name: deal.contactName || deal.company || deal.title,
            company: deal.company,
            email: deal.email,
            phone: deal.phone,
            gstin: "",
            address: "",
            notes: "",
            portalToken: newPortalToken(),
            createdAt: stamp,
            updatedAt: stamp,
          };
          working = { ...created.doc, clients: [client, ...created.doc.clients] };
          clientId = client.id;
        }

        const createdProject = nextId(working, "projects");
        const project: Project = {
          id: createdProject.id,
          clientId,
          dealId: deal.id,
          name: deal.title,
          service: deal.service,
          status: "Planning",
          startDate: todayIso(),
          dueDate: "",
          budgetInr: deal.valueInr,
          milestones: [],
          updates: [],
          notes: deal.notes,
          createdAt: stamp,
          updatedAt: stamp,
        };
        working = { ...createdProject.doc, projects: [project, ...createdProject.doc.projects] };

        const won: Deal = { ...deal, clientId, stage: "Won", probability: 100, updatedAt: stamp };
        working = { ...working, deals: working.deals.map((row) => (row.id === id ? won : row)) };
        return { doc: withActivity(working, "deal", `Won: ${deal.title} — project created`), result: { deal: won, clientId, project } };
      });
      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  });
}

function registerClients(app: Express) {
  app.post("/api/os/clients", async (req, res) => {
    try {
      const input = clientInput.parse(req.body);
      const client = await write((doc) => {
        const { doc: next, id } = nextId(doc, "clients");
        const stamp = now();
        const row: Client = { ...input, id, portalToken: newPortalToken(), createdAt: stamp, updatedAt: stamp };
        return { doc: withActivity({ ...next, clients: [row, ...next.clients] }, "client", `Client added: ${row.name}`), result: row };
      });
      res.status(201).json(client);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.patch("/api/os/clients/:id", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const client = await write((doc) => {
        const { doc: next, row } = replaceRow(doc, "clients", id, (found) => {
          const input = clientInput.parse({ ...found, ...req.body });
          return { ...found, ...input, updatedAt: now() };
        });
        return { doc: next, result: row };
      });
      res.json(client);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/os/clients/:id/rotate-portal", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const client = await write((doc) => {
        const { doc: next, row } = replaceRow(doc, "clients", id, (found) => ({ ...found, portalToken: newPortalToken(), updatedAt: now() }));
        return { doc: next, result: row };
      });
      res.json(client);
    } catch (error) {
      sendError(res, error);
    }
  });
}

function registerProjects(app: Express) {
  app.post("/api/os/projects", async (req, res) => {
    try {
      const input = projectInput.parse(req.body);
      const project = await write((doc) => {
        assertClientExists(doc, input.clientId);
        const { doc: next, id } = nextId(doc, "projects");
        const stamp = now();
        const row: Project = { ...input, id, createdAt: stamp, updatedAt: stamp };
        return { doc: withActivity({ ...next, projects: [row, ...next.projects] }, "project", `Project started: ${row.name}`), result: row };
      });
      res.status(201).json(project);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.patch("/api/os/projects/:id", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const project = await write((doc) => {
        const previous = doc.projects.find((row) => row.id === id);
        const { doc: next, row } = replaceRow(doc, "projects", id, (found) => {
          const input = projectInput.parse({ ...found, ...req.body });
          assertClientExists(doc, input.clientId);
          return { ...found, ...input, updatedAt: now() };
        });
        const statusChanged = previous && previous.status !== row.status;
        return { doc: statusChanged ? withActivity(next, "project", `${row.name} is now ${row.status}`) : next, result: row };
      });
      res.json(project);
    } catch (error) {
      sendError(res, error);
    }
  });
}

function registerInvoices(app: Express) {
  app.post("/api/os/invoices", async (req, res) => {
    try {
      const input = invoiceInput.parse(req.body);
      const invoice = await write((doc) => {
        assertClientExists(doc, input.clientId);
        const { doc: withId, id } = nextId(doc, "invoices");
        const stamp = now();
        const { doc: next, invoice: row } = assignNumberIfIssued(withId, { ...input, id, number: "", createdAt: stamp, updatedAt: stamp });
        const label = `${row.kind === "quote" ? "Quote" : "Invoice"} ${row.number || "draft"}`;
        return { doc: withActivity({ ...next, invoices: [row, ...next.invoices] }, "invoice", `${label} created`), result: row };
      });
      res.status(201).json(invoice);
    } catch (error) {
      sendError(res, error);
    }
  });

  app.patch("/api/os/invoices/:id", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const invoice = await write((doc) => {
        const previous = doc.invoices.find((row) => row.id === id);
        if (!previous) throw new HttpError(404, "Not found");
        // Once issued, only status, payment date and notes may change — the client has already seen it.
        const body = req.body ?? {};
        const change = previous.status === "Draft" ? body : { status: body.status, paidDate: body.paidDate, notes: body.notes };
        const defined = Object.fromEntries(Object.entries(change).filter(([, value]) => value !== undefined));
        const input = invoiceInput.parse({ ...previous, ...defined, kind: previous.kind });
        assertClientExists(doc, input.clientId);
        const paidDate = input.status === "Paid" && !input.paidDate ? todayIso() : input.paidDate;
        const numbered = assignNumberIfIssued(doc, { ...previous, ...input, paidDate, updatedAt: now() });
        const { doc: next, row } = replaceRow(numbered.doc, "invoices", id, () => numbered.invoice);
        const paidNow = previous?.status !== "Paid" && row.status === "Paid";
        const logged = paidNow ? withActivity(next, "payment", `Payment received: ${row.number} (₹${invoiceTotals(row).total.toLocaleString("en-IN")})`) : next;
        return { doc: logged, result: row };
      });
      res.json(invoice);
    } catch (error) {
      sendError(res, error);
    }
  });
}

function registerDeletes(app: Express) {
  const blockers: Record<Collection, (doc: OsDocument, id: number) => string | null> = {
    deals: () => null,
    projects: (doc, id) => (doc.invoices.some((row) => row.projectId === id) ? "This project has invoices. Remove them first." : null),
    invoices: (doc, id) => {
      const invoice = doc.invoices.find((row) => row.id === id);
      return invoice?.kind === "invoice" && invoice.number ? "Issued invoices are kept for GST records. Mark it Cancelled instead." : null;
    },
    clients: (doc, id) =>
      doc.projects.some((row) => row.clientId === id) || doc.invoices.some((row) => row.clientId === id) || doc.deals.some((row) => row.clientId === id)
        ? "This client has deals, projects or invoices. Remove those first."
        : null,
  };

  const remove = (key: Collection) => async (req: Request, res: Response) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      await write((doc) => {
        const blocked = blockers[key](doc, id);
        if (blocked) throw new HttpError(409, blocked);
        const rows = doc[key] as Array<{ id: number }>;
        if (!rows.some((row) => row.id === id)) throw new HttpError(404, "Not found");
        return { doc: { ...doc, [key]: rows.filter((row) => row.id !== id) } as OsDocument, result: null };
      });
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  };

  (Object.keys(blockers) as Collection[]).forEach((key) => app.delete(`/api/os/${key}/:id`, remove(key)));
}

function registerLeadConversion(app: Express) {
  app.post("/api/os/leads/:id/convert", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const lead = await storage.getConsultationRequest(id);
      if (!lead) throw new HttpError(404, "Lead not found");
      const input = dealInput.parse({
        title: `${lead.company || lead.name} — ${lead.service || "Enquiry"}`,
        company: lead.company,
        contactName: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: "Website form",
        service: lead.service,
        stage: "Qualified",
        nextAction: "Reply and book a discovery call",
        nextActionDate: todayIso(),
        leadId: id,
        notes: [lead.budget && `Stated budget: ${lead.budget}`, lead.message].filter(Boolean).join("\n\n"),
      });
      const deal = await write((doc) => {
        const existing = doc.deals.find((row) => row.leadId === id);
        if (existing) return { doc, result: existing };
        const { doc: next, id: dealId } = nextId(doc, "deals");
        const row = buildDeal(input, dealId);
        return { doc: withActivity({ ...next, deals: [row, ...next.deals] }, "deal", `Lead qualified: ${row.title}`), result: row };
      });
      await storage.updateConsultationRequest(id, { status: "Contacted" });
      res.status(201).json(deal);
    } catch (error) {
      sendError(res, error);
    }
  });
}

function registerPortal(app: Express) {
  app.get("/api/portal/:token", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const token = String(req.params.token);
    if (!/^[a-f0-9]{48}$/.test(token)) return res.status(404).json({ message: "Portal not found" });
    const doc = await read();
    const client = doc.clients.find((row) => row.portalToken === token);
    if (!client) return res.status(404).json({ message: "Portal not found" });

    const { invoicePrefix: _prefix, paymentTermsDays: _terms, ...business } = doc.settings;
    const view: PortalView = {
      client: { name: client.name, company: client.company, email: client.email, gstin: client.gstin, address: client.address },
      business,
      projects: doc.projects
        .filter((row) => row.clientId === client.id)
        .map(({ id, name, service, status, startDate, dueDate, milestones, updates }) => ({
          id,
          name,
          service,
          status,
          startDate,
          dueDate,
          milestones,
          updates: updates.filter((update) => update.visibleToClient),
        })),
      invoices: doc.invoices
        .filter((row) => row.clientId === client.id && row.status !== "Draft" && row.status !== "Cancelled")
        .map((row) => ({ ...row, totals: invoiceTotals(row) })),
    };
    res.json(view);
  });
}

export function registerOsRoutes(app: Express) {
  registerPortal(app);

  app.use("/api/os", requireAdmin);
  app.get("/api/os/state", async (_req, res) => {
    const doc = await read();
    res.json({ deals: doc.deals, clients: doc.clients, projects: doc.projects, invoices: doc.invoices, settings: doc.settings });
  });
  app.get("/api/os/dashboard", async (_req, res) => {
    const doc = await read();
    const leads = await storage.listConsultationRequests();
    res.json(buildDashboard(doc, leads.filter((lead) => lead.status === "New").length));
  });
  app.get("/api/os/export", async (_req, res) => {
    const doc = await read();
    res.setHeader("Content-Disposition", `attachment; filename="cubic-os-backup-${todayIso()}.json"`);
    res.json(doc);
  });
  app.put("/api/os/settings", async (req, res) => {
    try {
      const settings = settingsInput.parse(req.body);
      await write((doc) => ({ doc: { ...doc, settings }, result: null }));
      res.json(settings);
    } catch (error) {
      sendError(res, error);
    }
  });

  registerDeals(app);
  registerClients(app);
  registerProjects(app);
  registerInvoices(app);
  registerDeletes(app);
  registerLeadConversion(app);
}
