import { useLocation } from "wouter";
import { Globe } from "lucide-react";
import { CURRENCIES, type Currency } from "@shared/site";
import { LOCALES, LOCALE_META, localizedPath, useI18n, type Locale } from "@/i18n";
import { useSite } from "@/lib/site";

/** Language and currency pickers. Native <select>s: accessible, keyboard friendly, no JS menu. */
export function Preferences({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const { currency, setCurrency } = useSite();
  const [location] = useLocation();

  const switchLocale = (next: Locale) => {
    // `location` is relative to the current locale's base, so it is the bare page path.
    window.location.assign(localizedPath(location, next));
  };

  const selectClass =
    "h-9 rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 text-sm t-secondary hover:border-[var(--line-strong)] focus:border-[var(--brand)] focus:outline-none";

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "text-sm"}`}>
      <Globe className="h-4 w-4 t-muted" aria-hidden="true" />
      <label className="sr-only" htmlFor={`lang-${compact ? "m" : "d"}`}>{t.common.prefs.language}</label>
      <select
        id={`lang-${compact ? "m" : "d"}`}
        className={selectClass}
        value={locale}
        onChange={(event) => switchLocale(event.target.value as Locale)}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} lang={code}>{LOCALE_META[code].native}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor={`cur-${compact ? "m" : "d"}`}>{t.common.prefs.currency}</label>
      <select
        id={`cur-${compact ? "m" : "d"}`}
        className={selectClass}
        value={currency}
        onChange={(event) => setCurrency(event.target.value as Currency)}
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code}>{code}</option>
        ))}
      </select>
    </div>
  );
}
