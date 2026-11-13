import { Banner } from "@/components/visuals/Banner";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ChevronDown, FileText, KeyRound, LayoutDashboard, Receipt, ShieldCheck, UserRound } from "lucide-react";
import type { OfferId } from "@shared/site";
import { useI18n } from "@/i18n";
import { useOfferPrice, useSite } from "@/lib/site";

/** Splits a headline so its second sentence (or closing phrase) can carry the gold italic accent. */
function splitAccent(text: string): [string, string] {
  const sentence = text.match(/^(.+?[.!?।؟])\s+(.+)$/);
  if (sentence) return [`${sentence[1]} `, sentence[2]];
  const words = text.split(" ");
  if (words.length < 2) return ["", text];
  const tail = Math.min(words.length - 1, Math.max(2, Math.round(words.length / 3)));
  return [`${words.slice(0, -tail).join(" ")} `, words.slice(-tail).join(" ")];
}

export function Headline({ text }: { text: string }) {
  const [lead, accent] = splitAccent(text);
  return (
    <>
      {lead}
      {accent && <span className="accent-text">{accent}</span>}
    </>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, align = "start", action }: {
  eyebrow?: string; title: string; subtitle?: string; align?: "start" | "center"; action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div className={`mb-10 flex flex-col gap-4 md:mb-14 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={centered ? "max-w-2xl" : "max-w-3xl"}>
        {eyebrow && <p className="label mb-3">{eyebrow}</p>}
        <h2 className="display-2"><Headline text={title} /></h2>
        {subtitle && <p className="lead mt-4">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="tech-grid border-b border-[var(--line)]">
      <div className="container-w section-pad">
        <p className="label mb-5">{eyebrow}</p>
        <h1 className="display-1 max-w-4xl"><Headline text={title} /></h1>
        {subtitle && <p className="lead mt-6 max-w-2xl">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 t-secondary">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--success)]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Native <details>: works without JavaScript, keyboard accessible, and indexable. */
export function FaqList({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
      {items.map((item) => (
        <details key={item.q} className="group px-6 md:px-7">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-start font-semibold t-primary [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown className="h-5 w-5 shrink-0 t-secondary transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="pb-5 leading-relaxed t-secondary">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function OfferPrice({ offer, prefix = false, className = "" }: { offer: OfferId; prefix?: boolean; className?: string }) {
  const { t } = useI18n();
  const price = useOfferPrice(offer);
  return (
    <span className={className} dir="ltr">
      {prefix ? `${t.common.price.from} ${price.from}` : price.label}
      {price.monthly && <span className="text-[0.85em] font-normal t-secondary"> {t.common.price.perMonth}</span>}
    </span>
  );
}

export function TrustStrip() {
  const { t } = useI18n();
  const items = [
    { icon: FileText, text: t.common.trust.fixedPrice },
    { icon: Receipt, text: t.common.trust.milestones },
    { icon: KeyRound, text: t.common.trust.ownCode },
    { icon: ShieldCheck, text: t.common.trust.warranty },
    { icon: UserRound, text: t.common.trust.builder },
    { icon: LayoutDashboard, text: t.common.trust.portal },
  ];
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-3 text-[0.95rem] t-secondary">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] t-brand">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ title, text, accent = true }: { title?: string; text?: string; accent?: boolean }) {
  const { t } = useI18n();
  const { site } = useSite();
  return (
    <section className="section-pad banner-cta">
      <Banner name="earth" hero={false} />
      <div className="container-w">
        <div className={`${accent ? "card-accent" : "card"} px-6 py-12 md:px-14 md:py-16`}>
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="display-2"><Headline text={title ?? t.home.final.title} /></h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed t-secondary">{text ?? t.home.final.text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link href="/contact" className="btn btn-primary btn-lg">
                {t.home.final.primary} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-lg">
                {t.home.final.secondary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
