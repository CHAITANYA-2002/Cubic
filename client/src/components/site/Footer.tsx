import { Link } from "wouter";
import { Github, Instagram, Linkedin, Mail, MessageCircle, Phone, Twitter } from "lucide-react";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";
import { SERVICE_SLUGS } from "@/data/services";
import { Logo } from "./Logo";

const SOCIAL_ICONS = { linkedin: Linkedin, instagram: Instagram, github: Github, x: Twitter } as const;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold t-primary">{title}</h2>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

const linkClass = "inline-flex min-h-11 items-center py-1 t-secondary hover:t-primary transition-colors";

export function Footer() {
  const { t } = useI18n();
  const { site } = useSite();
  const socials = (Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>).filter((key) => site.socials[key]);

  return (
    <footer className="visual-footer border-t border-[var(--line)] bg-[var(--bg-subtle)]">
      <svg className="footer-watermark" viewBox="0 0 1200 240" aria-hidden="true" focusable="false"><text x="600" y="210" textAnchor="middle" fontSize="220" fill="currentColor">{t.common.brand}</text></svg>
      <div className="container-w relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed t-secondary">{t.common.footer.blurb}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map((key) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a key={key} href={site.socials[key]} target="_blank" rel="noopener noreferrer" aria-label={key}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] t-secondary hover:t-primary">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <Column title={t.common.footer.servicesTitle}>
          {SERVICE_SLUGS.map((slug) => (
            <li key={slug}><Link href={`/services/${slug}`} className={linkClass}>{t.common.serviceNames[slug]}</Link></li>
          ))}
        </Column>

        <Column title={t.common.footer.company}>
          <li><Link href="/work" className={linkClass}>{t.common.nav.work}</Link></li>
          <li><Link href="/pricing" className={linkClass}>{t.common.nav.pricing}</Link></li>
          <li><Link href="/about" className={linkClass}>{t.common.nav.about}</Link></li>
          <li><Link href="/faq" className={linkClass}>{t.common.nav.faq}</Link></li>
          <li><Link href="/contact" className={linkClass}>{t.common.nav.contact}</Link></li>
        </Column>

        <Column title={t.common.footer.contactTitle}>
          <li>
            <a href={`mailto:${site.email}`} className={`${linkClass} inline-flex items-center gap-2 break-all`}>
              <Mail className="h-4 w-4 shrink-0" />{site.email}
            </a>
          </li>
          <li>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={`${linkClass} inline-flex items-center gap-2`} dir="ltr">
              <Phone className="h-4 w-4 shrink-0" />{site.phone}
            </a>
          </li>
          <li>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`}>
              <MessageCircle className="h-4 w-4 shrink-0" />{t.common.cta.whatsapp}
            </a>
          </li>
          <li className="t-secondary">{site.hours}</li>
          <li className="t-secondary">{t.common.footer.responseTime}</li>
        </Column>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="container-w flex flex-col gap-3 py-6 text-xs t-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {t.common.brand}. {t.common.footer.rights}</p>
          <div className="flex gap-5">
            <Link href="/terms" className={linkClass}>{t.common.footer.terms}</Link>
            <Link href="/privacy" className={linkClass}>{t.common.footer.privacy}</Link>
            <Link href="/cookies" className={linkClass}>{t.common.footer.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
