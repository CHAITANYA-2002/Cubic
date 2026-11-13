import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { Logo } from "./Logo";
import { Preferences } from "./Preferences";

const LINKS = [
  { href: "/services", key: "services" },
  { href: "/work", key: "work" },
  { href: "/pricing", key: "pricing" },
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
] as const;

const isActive = (location: string, href: string) => location === href || location.startsWith(`${href}/`);

export function Navbar() {
  const { t } = useI18n();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-w flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${t.common.brand} — home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(location, link.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-[0.94rem] font-medium transition-colors ${
                isActive(location, link.href) ? "t-primary" : "t-muted hover:t-primary"
              }`}
            >
              {t.common.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Preferences />
          <Link href="/contact" className="btn btn-primary">{t.common.cta.bookCall}</Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--line)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.common.nav.close : t.common.nav.menu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-[var(--line)] bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-w flex flex-col py-3">
            {[...LINKS, { href: "/contact", key: "contact" as const }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(location, link.href) ? "page" : undefined}
                className="border-b border-[var(--line)] py-3.5 text-base font-medium t-primary last:border-0"
              >
                {t.common.nav[link.key]}
              </Link>
            ))}
          </nav>
          <div className="container-w flex flex-col gap-4 pb-6">
            <Preferences compact />
            <Link href="/contact" className="btn btn-primary btn-lg w-full">{t.common.cta.bookCall}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
