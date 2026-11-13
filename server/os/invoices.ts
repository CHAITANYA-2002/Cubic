import { Hono } from "hono";
import { invoiceInput, invoiceTotals, todayIso, type Invoice } from "../../shared/os";
import type { AppEnv } from "../env";
import type { D1PreparedStatement } from "../db/d1";
import { concat, type RawSql } from "../db/sql";
import { invoices } from "../db/tables";
import { parseId, readJson } from "../http";
import { logActivity } from "./activity";
import { needsNumber, nextNumber } from "./numbering";
import { assertClientExists, now, required } from "./records";
import { loadSettings } from "./settings";

export const invoiceRoutes = new Hono<AppEnv>();

const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

invoiceRoutes.post("/api/os/invoices", async (c) => {
  const db = c.env.DB;
  const input = invoiceInput.parse(await readJson(c));
  await assertClientExists(db, input.clientId);
  const stamp = now();
  const base = { ...input, number: "", createdAt: stamp, updatedAt: stamp };
  const kindLabel = input.kind === "quote" ? "Quote" : "Invoice";

  if (!needsNumber(base)) {
    const [inserted] = await db.batch([invoices.insert(db, base), ...logActivity(db, "invoice", `${kindLabel} draft created`)]);
    return c.json(invoices.firstRow(inserted), 201);
  }
  const { bump, number } = nextNumber(db, await loadSettings(db), input.kind, input.issueDate);
  const [, inserted] = await db.batch([
    bump,
    invoices.insert(db, { ...base, number }),
    ...logActivity(db, "invoice", concat(`${kindLabel} `, number, " created")),
  ]);
  return c.json(invoices.firstRow(inserted), 201);
});

invoiceRoutes.patch("/api/os/invoices/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const previous = required(await invoices.byId(db, id));
  const body = await readJson(c);
  // Once issued, only status, payment date and notes may change — the client has already seen it.
  const change = previous.status === "Draft" ? body : { status: body.status, paidDate: body.paidDate, notes: body.notes };
  const defined = Object.fromEntries(Object.entries(change).filter(([, value]) => value !== undefined));
  const input = invoiceInput.parse({ ...previous, ...defined, kind: previous.kind });
  await assertClientExists(db, input.clientId);

  const paidDate = input.status === "Paid" && !input.paidDate ? todayIso() : input.paidDate;
  const next: Omit<Invoice, "id"> = { ...previous, ...input, paidDate, updatedAt: now() };
  const numbering = needsNumber(next) ? nextNumber(db, await loadSettings(db), next.kind, next.issueDate) : null;
  const number: string | RawSql = numbering?.number ?? next.number;

  const paidNow = previous.status !== "Paid" && next.status === "Paid";
  const payment = paidNow ? logActivity(db, "payment", concat("Payment received: ", number, ` (${rupees(invoiceTotals(next).total)})`)) : [];
  const statements: D1PreparedStatement[] = [
    ...(numbering ? [numbering.bump] : []),
    invoices.update(db, id, { ...next, number }),
    ...payment,
  ];
  const results = await db.batch(statements);
  return c.json(invoices.firstRow(results[numbering ? 1 : 0]));
});
