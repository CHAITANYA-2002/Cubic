import { createContext, useContext, type ReactNode } from "react";
import { en } from "./en";
import { LOCALE_META, localeBase, type Locale } from "./config";

/** Every locale must provide the same shape as English (TypeScript enforces completeness). */
export type Dict = typeof en;

const loaders: Record<Locale, () => Promise<Dict>> = {
  en: async () => en,
  hi: () => import("./hi").then((m) => m.hi),
  ar: () => import("./ar").then((m) => m.ar),
  de: () => import("./de").then((m) => m.de),
  fr: () => import("./fr").then((m) => m.fr),
};

export const loadDict = (locale: Locale): Promise<Dict> => loaders[locale]();

type I18nValue = { locale: Locale; t: Dict; base: string; dir: "ltr" | "rtl"; intl: string };

const I18nContext = createContext<I18nValue>({ locale: "en", t: en, base: "", dir: "ltr", intl: "en-IN" });

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: ReactNode }) {
  const meta = LOCALE_META[locale];
  const value: I18nValue = { locale, t: dict, base: localeBase(locale), dir: meta.dir, intl: meta.intl };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

export { LOCALES, LOCALE_META, localeFromPath, localizedPath, stripLocale, type Locale } from "./config";
