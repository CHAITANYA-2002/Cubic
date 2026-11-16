import type { CSSProperties, ReactNode } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import type { OfferId } from "@shared/site";
import { useI18n } from "@/i18n";
import { useOfferPrice, useSite } from "@/lib/site";

/** Splits a headline so its second sentence (or closing phrase) can drop to the secondary tone. */
function splitAccent(text: string): [string, string] {
  const sentence = text.match(/^(.+?[.!?।؟])\s+(.+)$/);
  if (sentence) return [`${sentence[1]} `, sentence[2]];
  const words = text.split(" ");
  if (words.length < 2) return ["", text];
  const tail = Math.min(words.length - 1, Math.max(2, Math.round(words.length / 3)));
  return [`${words.slice(0, -tail).join(" ")} `, words.slice(-tail).join(" ")];
}

const toWords = (text: string) => text.trim().split(/\s+/).filter(Boolean);

/** One masked word: the inner span slides up through the clip when its headline animates. */
function Word({ word, index }: { word: string; index: number }) {
  return (
    <>
      <span className="w" style={{ "--w": index } as CSSProperties}><span>{word}</span></span>{" "}
    </>
  );
}

/**
 * Two-tone headline: the lead in full contrast, the closing phrase in grey.
 * Words rise through a mask — on load when `animate` is set, otherwise when the nearest `.reveal` enters view.
 */
export function Headline({ text, animate = false }: { text: string; animate?: boolean }) {
  const [lead, accent] = splitAccent(text);
  const leadWords = toWords(lead);
  const accentWords = toWords(accent);
  return (
    <span className={animate ? "mask-words words-load" : "mask-words"}>
      {leadWords.map((word, index) => <Word key={`l${index}`} word={word} index={index} />)}
      {accentWords.length > 0 && (
        <span className="accent-text">
          {accentWords.map((word, index) => <Word key={`a${index}`} word={word} index={leadWords.length + index} />)}
        </span>
      )}
    </span>
  );
}

/** "Learn more ›" style text link. External links get an outward arrow and open in a new tab. */
export function MoreLink({ href, children, external = false, className = "" }: {
  href: string; children: ReactNode; external?: boolean; className?: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`link-more ${className}`}>
        {children} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={href} className={`link-more ${className}`}>
      {children} <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

/** A graded editorial photograph from /images/photos. Decorative unless given alt text. */
export function Photo({ name, alt = "", className = "", eager = false, sizes = "(min-width: 1240px) 1160px, 100vw" }: {
  name: string; alt?: string; className?: string; eager?: boolean; sizes?: string;
}) {
  return (
    <img
      src={`/images/photos/${name}-800.webp`}
      srcSet={`/images/photos/${name}-800.webp 800w, /images/photos/${name}.webp 1600w`}
      sizes={sizes}
      width={1600}
      height={900}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}

export function SectionHeader({ eyebrow, title, subtitle, align = "start", action }: {
  eyebrow?: string; title: string; subtitle?: string; align?: "start" | "center"; action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div className={`reveal mb-12 flex flex-col gap-5 md:mb-16 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={centered ? "max-w-3xl" : "max-w-3xl"}>
        {eyebrow && <p className="label mb-3">{eyebrow}</p>}
        <h2 className="display-2"><Headline text={title} /></h2>
        {subtitle && <p className={`lead mt-5 ${centered ? "mx-auto" : ""}`}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Inner-page hero: large type on black, then an optional full-width photograph that settles in on scroll. */
export function PageHero({ eyebrow, title, subtitle, children, photo }: {
  eyebrow: string; title: string; subtitle?: string; children?: ReactNode; photo?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container-w pb-14 pt-16 md:pb-20 md:pt-28">
        <p className="label rise mb-4">{eyebrow}</p>
        <h1 className="display-1 max-w-5xl"><Headline text={title} animate /></h1>
        {subtitle && <p className="lead rise rise-2 mt-7 max-w-2xl">{subtitle}</p>}
        {children && <div className="rise rise-3 mt-9">{children}</div>}
      </div>
      {photo && (
        <div className="container-w pb-4">
          <figure className="hero-figure"><Photo name={photo} eager className="h-full w-full object-cover" /></figure>
        </div>
      )}
    </section>
  );
}

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 t-secondary">
          <Check className="mt-1 h-4 w-4 shrink-0 t-primary" strokeWidth={2.25} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Native <details>: works without JavaScript, keyboard accessible, and indexable. */
export function FaqList({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.q} className="faq-item">
          <summary className="faq-q text-start">
            <span className="flex-1">{item.q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p className="faq-a">{item.a}</p>
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
    t.common.trust.fixedPrice,
    t.common.trust.milestones,
    t.common.trust.ownCode,
    t.common.trust.warranty,
    t.common.trust.builder,
    t.common.trust.portal,
  ];
  return (
    <ul className="grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3 border-b border-[var(--line)] py-5 pe-6 t-secondary">
          <Check className="mt-1 h-4 w-4 shrink-0 t-primary" strokeWidth={2.25} aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ title, text }: { title?: string; text?: string; accent?: boolean }) {
  const { t } = useI18n();
  const { site } = useSite();
  return (
    <section className="cta-band section-pad">
      <div className="container-w container-narrow text-center">
        <h2 className="display-2 reveal"><Headline text={title ?? t.home.final.title} /></h2>
        <p className="lead reveal mx-auto mt-6">{text ?? t.home.final.text}</p>
        <div className="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Link href="/contact" className="btn btn-primary btn-lg">{t.home.final.primary}</Link>
          <MoreLink href={`https://wa.me/${site.whatsapp}`} external>{t.home.final.secondary}</MoreLink>
        </div>
      </div>
    </section>
  );
}
