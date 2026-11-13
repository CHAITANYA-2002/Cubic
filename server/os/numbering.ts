import { todayIso, type Invoice, type Settings } from "../../shared/os";
import type { D1Database, D1PreparedStatement } from "../db/d1";
import { raw, type RawSql } from "../db/sql";

/** Indian financial year (April–March) of a YYYY-MM-DD date, e.g. "26-27". */
export function financialYear(isoDate: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  const start = month >= 4 ? year : year - 1;
  return `${String(start % 100).padStart(2, "0")}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/**
 * GST needs a consecutive series per financial year, so invoices are numbered only when they leave
 * Draft, and numbered invoices can never be deleted. Quotes are numbered on creation.
 */
export const needsNumber = (invoice: Pick<Invoice, "number" | "kind" | "status">) =>
  !invoice.number && !(invoice.kind === "invoice" && invoice.status === "Draft");

/**
 * The counter bump and the number that reads it run in the same D1 batch (one transaction), so a
 * failed insert rolls the counter back and the series never has gaps.
 */
export function nextNumber(db: D1Database, settings: Settings, kind: Invoice["kind"], issueDate: string): { bump: D1PreparedStatement; number: RawSql } {
  const fy = financialYear(issueDate || todayIso());
  const key = `${kind}-${fy}`;
  const prefix = kind === "quote" ? `${settings.invoicePrefix}-Q` : settings.invoicePrefix;
  return {
    bump: db.prepare("INSERT INTO counters (key, value) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET value = value + 1").bind(key),
    number: raw("? || '/' || ? || '/' || printf('%03d', (SELECT value FROM counters WHERE key = ?))", [prefix, fy, key]),
  };
}
