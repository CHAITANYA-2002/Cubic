import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CURRENCIES, DEFAULT_SITE, priceIn, siteSettingsSchema, type Currency, type OfferId, type SiteSettings } from "@shared/site";

const CURRENCY_KEY = "cubic.currency";

type SiteValue = {
  site: SiteSettings;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const SiteContext = createContext<SiteValue>({ site: DEFAULT_SITE, currency: "INR", setCurrency: () => undefined });

const isCurrency = (value: unknown): value is Currency => (CURRENCIES as readonly unknown[]).includes(value);

function readStoredCurrency(): Currency | null {
  try {
    const value = window.localStorage.getItem(CURRENCY_KEY);
    return isCurrency(value) ? value : null;
  } catch {
    return null;
  }
}

function storeCurrency(currency: Currency) {
  try {
    window.localStorage.setItem(CURRENCY_KEY, currency);
  } catch {
    // Private mode or blocked storage: the choice simply isn't remembered.
  }
}

/** Fallback when the geo endpoint is unavailable: guess the market from the browser's time zone. */
function currencyFromTimeZone(): Currency | null {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  if (zone === "Asia/Kolkata" || zone === "Asia/Calcutta") return "INR";
  if (["Asia/Dubai", "Asia/Riyadh", "Asia/Qatar", "Asia/Kuwait", "Asia/Bahrain", "Asia/Muscat"].includes(zone)) return "AED";
  if (zone.startsWith("Europe/") && !["Europe/London", "Europe/Dublin"].includes(zone)) return "EUR";
  if (zone.startsWith("America/")) return "USD";
  return null;
}

async function detectCurrency(): Promise<Currency | null> {
  try {
    const response = await fetch("/api/geo");
    if (response.ok) {
      const body: unknown = await response.json();
      const currency = (body as { currency?: unknown })?.currency;
      if (isCurrency(currency)) return currency;
    }
  } catch {
    // Static preview or offline: fall through to the time-zone guess.
  }
  return currencyFromTimeZone();
}

async function fetchSite(): Promise<SiteSettings | null> {
  try {
    const response = await fetch("/api/site");
    if (!response.ok) return null;
    const parsed = siteSettingsSchema.safeParse(await response.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function SiteProvider({ defaultCurrency, children }: { defaultCurrency: Currency; children: ReactNode }) {
  const [site, setSite] = useState<SiteSettings>(DEFAULT_SITE);
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);

  useEffect(() => {
    let active = true;
    fetchSite().then((remote) => active && remote && setSite(remote));
    const stored = readStoredCurrency();
    if (stored) setCurrencyState(stored);
    else detectCurrency().then((detected) => active && detected && setCurrencyState(detected));
    return () => {
      active = false;
    };
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    storeCurrency(next);
  }, []);

  const value = useMemo(() => ({ site, currency, setCurrency }), [site, currency, setCurrency]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

const SYMBOL_LOCALE: Record<Currency, string> = { INR: "en-IN", USD: "en-US", EUR: "de-DE", AED: "en-AE" };

// Four fixed currencies: reuse their formatters across cards and currency updates.
const moneyFormatters = new Map<Currency, Intl.NumberFormat>();

export function formatMoney(value: number, currency: Currency): string {
  let formatter = moneyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat(SYMBOL_LOCALE[currency], {
      style: "currency", currency, maximumFractionDigits: 0,
    });
    moneyFormatters.set(currency, formatter);
  }
  return formatter.format(value);
}

/** Formatted range for an offer in the visitor's currency, e.g. "₹1,50,000 – ₹4,00,000". */
export function useOfferPrice(offer: OfferId) {
  const { site, currency } = useSite();
  const price = site.prices[offer];
  const [min, max] = priceIn(price, currency, site.fx);
  const label = min === max ? formatMoney(min, currency) : `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
  return { label, from: formatMoney(min, currency), monthly: price.monthly, currency };
}
