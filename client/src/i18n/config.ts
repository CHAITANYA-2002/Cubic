import type { Currency } from "@shared/site";

export const LOCALES = ["en", "hi", "ar", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; native: string; dir: "ltr" | "rtl"; intl: string; currency: Currency; ogLocale: string }> = {
  en: { label: "English", native: "English", dir: "ltr", intl: "en-IN", currency: "INR", ogLocale: "en_IN" },
  hi: { label: "Hindi", native: "हिन्दी", dir: "ltr", intl: "hi-IN", currency: "INR", ogLocale: "hi_IN" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl", intl: "ar-AE", currency: "AED", ogLocale: "ar_AE" },
  de: { label: "German", native: "Deutsch", dir: "ltr", intl: "de-DE", currency: "EUR", ogLocale: "de_DE" },
  fr: { label: "French", native: "Français", dir: "ltr", intl: "fr-FR", currency: "EUR", ogLocale: "fr_FR" },
};

export const isLocale = (value: string | undefined): value is Locale =>
  Boolean(value) && (LOCALES as readonly string[]).includes(value as string);

/** "/de/pricing" -> "de"; "/pricing" -> "en". */
export function localeFromPath(path: string): Locale {
  const first = path.split("/")[1];
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** "/de/pricing" -> "/pricing". */
export function stripLocale(path: string): string {
  const locale = localeFromPath(path);
  if (locale === DEFAULT_LOCALE) return path || "/";
  const rest = path.slice(locale.length + 1);
  return rest === "" ? "/" : rest;
}

/** Path for the same page in another locale: ("/pricing", "de") -> "/de/pricing". */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === "" ? "/" : path;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export const localeBase = (locale: Locale) => (locale === DEFAULT_LOCALE ? "" : `/${locale}`);
