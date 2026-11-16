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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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
    <header className={`site-navbar sticky top-0 z-50 ${open ? "is-open" : scrolled ? "is-scrolled" : ""}`}>
      <div className="container-w flex h-14 items-center justify-between gap-4">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label={`${t.common.brand} — ${t.common.accessibility.home}`}>
          <Logo />
        </Link>

        <nav aria-label={t.common.accessibility.main} className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(location, link.href) ? "page" : undefined}
              className={`inline-flex min-h-11 items-center px-3 text-[0.84rem] transition-colors ${
                isActive(location, link.href) ? "t-primary" : "t-secondary hover:t-primary"
              }`}
            >
              {t.common.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Preferences />
          <Link href="/contact" className="btn btn-primary !min-h-9 !px-4 !text-[0.84rem]">{t.common.cta.bookCall}</Link>
        </div>

        <button
          type="button"
          className="-me-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.common.nav.close : t.common.nav.menu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="mobile-menu lg:hidden">
          <nav aria-label={t.common.accessibility.mobile} className="container-w flex flex-col py-3">
            {[...LINKS, { href: "/contact", key: "contact" as const }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(location, link.href) ? "page" : undefined}
                className="py-2.5 text-[1.75rem] font-semibold tracking-tight t-primary"
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
