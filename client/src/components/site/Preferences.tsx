import { useLocation } from "wouter";
import { Globe } from "lucide-react";
import { CURRENCIES, type Currency } from "@shared/site";
import { LOCALES, LOCALE_META, localizedPath, useI18n, type Locale } from "@/i18n";
import { useSite } from "@/lib/site";

/** Language and currency pickers. Native <select>s: accessible, keyboard friendly, no JS menu. */
export function Preferences({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const [location] = useLocation();

  const switchLocale = (next: Locale) => {
    // `location` is relative to the current locale's base, so it is the bare page path.
    window.location.assign(localizedPath(location, next));
  };

  const selectClass =
    "min-h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2 text-sm t-secondary hover:border-[var(--line-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand)]";

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "text-sm"}`}>
      <Globe className="h-4 w-4 t-secondary" aria-hidden="true" />
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
      <CurrencySelect id={`cur-${compact ? "m" : "d"}`} />
    </div>
  );
}

/** Shared currency control for navigation and the public rate card. */
export function CurrencySelect({ id, visibleLabel = false }: { id: string; visibleLabel?: boolean }) {
  const { t } = useI18n();
  const { currency, setCurrency } = useSite();
  return (
    <div className="flex items-center gap-3">
      <label className={visibleLabel ? "text-sm font-medium t-secondary" : "sr-only"} htmlFor={id}>{t.common.prefs.currency}</label>
      <select id={id} className="min-h-11 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-3 text-sm t-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
        value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
        {CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
      </select>
    </div>
  );
}
