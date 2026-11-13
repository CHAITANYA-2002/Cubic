import type { Currency } from "../../shared/site";

const EUROZONE = new Set(["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"]);
const GULF = new Set(["AE", "SA", "QA", "KW", "BH", "OM"]);

export function currencyFor(country: string): Currency {
  if (country === "IN") return "INR";
  if (EUROZONE.has(country)) return "EUR";
  if (GULF.has(country)) return "AED";
  return "USD";
}

/** ISO 3166 alpha-2 from the edge, or null. "XX"/"T1" (unknown, Tor) are treated as unknown. */
export function normaliseCountry(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" && code !== "T1" ? code : null;
}
