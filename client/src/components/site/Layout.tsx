import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { MessageCircle } from "lucide-react";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageMeta } from "./PageMeta";

const CONSENT_KEY = "cubic.consent";

function readConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return "unavailable";
  }
}

function CookieBanner({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const choose = (value: "ok" | "declined") => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Storage blocked: the banner just shows again next visit.
    }
    onClose();
  };
  return (
    <div role="region" aria-label={t.common.accessibility.cookies} className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] sm:inset-x-auto sm:start-4">
      <p className="text-sm t-secondary">
        {t.common.cookie.text}{" "}
        <Link href="/cookies" className="underline underline-offset-2 t-primary">{t.common.cookie.policy}</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn btn-dark" onClick={() => choose("ok")}>{t.common.cookie.accept}</button>
        <button type="button" className="btn btn-outline" onClick={() => choose("declined")}>{t.common.cookie.decline}</button>
      </div>
    </div>
  );
}

function WhatsAppButton() {
  const { t } = useI18n();
  const { site } = useSite();
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.cta.whatsapp}
      className="fixed bottom-4 end-4 z-50 inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-white shadow-lg hover:bg-[var(--surface-2)]"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">{t.common.cta.whatsapp}</span>
    </a>
  );
}

/** Chrome shared by every public page: skip link, header, footer, WhatsApp, cookie notice. */
export function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => setShowBanner(readConsent() === null), []);

  return (
    <div className="public-site flex min-h-screen flex-col bg-[var(--bg-primary)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[70] focus:min-h-11 focus:rounded-xl focus:bg-[var(--surface-2)] focus:px-4 focus:py-2 focus:shadow">
        {t.common.skipToContent}
      </a>
      <PageMeta />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-grow">{children}</main>
      <Footer />
      {showBanner ? <CookieBanner onClose={() => setShowBanner(false)} /> : <WhatsAppButton />}
    </div>
  );
}
