import { useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { CtaBand, FaqList, Headline, MoreLink, OfferPrice, Photo, SectionHeader } from "@/components/site/blocks";
import { BrowserFrame } from "@/components/work/ProjectCard";
import { Testimonials } from "@/components/work/Testimonials";
import { WorkRail } from "@/components/work/WorkRail";
import { useActiveIndex } from "@/components/visuals/useActiveIndex";
import { useScrollProgress } from "@/components/visuals/useScrollMotion";
import { SERVICE_OFFER, SERVICE_PHOTO, SERVICE_SLUGS } from "@/data/services";
import { projects } from "@/data/work";
import { useI18n } from "@/i18n";

const PRICE_TEASER = ["website", "webapp", "ai", "marketing"] as const;
const pad = (value: number) => String(value).padStart(2, "0");

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  const flagship = projects[0];
  return (
    <section className="home-hero">
      <div className="container-w pt-16 text-center md:pt-28">
        <p className="label rise">{h.eyebrow}</p>
        <h1 className="display-1 mx-auto mt-5 max-w-5xl"><Headline text={h.title} animate /></h1>
        <p className="lead rise rise-2 mx-auto mt-7">{h.subtitle}</p>
        <div className="rise rise-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-7">
          <Link href="/contact" className="btn btn-primary btn-lg">{h.primary}</Link>
          <MoreLink href="/work">{h.secondary}</MoreLink>
        </div>
        <p className="rise rise-4 mt-4 text-sm t-muted">{h.note}</p>
      </div>
      <div className="container-w mt-16 md:mt-24">
        <a href={flagship.liveUrl} target="_blank" rel="noopener noreferrer" className="hero-stage zoom-on-scroll" aria-label={`${flagship.name} — ${h.liveCaption}`}>
          <BrowserFrame project={flagship} eager sizes="(min-width: 1240px) 1160px, 100vw" />
        </a>
        <p className="mt-5 text-center text-sm t-muted">{flagship.name} · {h.liveCaption}</p>
      </div>
    </section>
  );
}

function ProofBar() {
  const { t } = useI18n();
  return (
    <div className="container-w">
      <ul className="proof-bar">
        {t.home.proofBar.map((item, index) => (
          <li key={item} className="reveal" style={{ "--d": index } as CSSProperties}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** A large statement whose words light up as it scrolls past. */
function Statement() {
  const { t } = useI18n();
  const ref = useRef<HTMLParagraphElement>(null);
  useScrollProgress(ref, 0.9, 0.55);
  const words = t.home.statement.split(" ");
  return (
    <section className="section-pad">
      <div className="container-w container-narrow">
        <p ref={ref} className="statement statement-words" style={{ "--n": words.length } as CSSProperties}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} style={{ "--i": index } as CSSProperties}>{word} </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Services() {
  const { t } = useI18n();
  return (
    <section className="theme-light section-pad">
      <div className="container-w">
        <SectionHeader eyebrow={t.home.services.eyebrow} title={t.home.services.title} subtitle={t.home.services.subtitle} />
        <div className="service-bento">
          {SERVICE_SLUGS.map((slug, index) => (
            <Link key={slug} href={`/services/${slug}`} className="service-tile reveal" style={{ "--d": index % 3 } as CSSProperties}>
              <div className="service-tile-copy">
                <h3 className="display-3">{t.common.serviceNames[slug]}</h3>
                <p className="mt-3 t-secondary">{t.services.items[slug].short}</p>
                <OfferPrice offer={SERVICE_OFFER[slug]} prefix className="mt-5 block font-semibold t-primary" />
                <span className="link-more mt-1">{t.services.index.details} <ChevronRight className="h-4 w-4" aria-hidden="true" /></span>
              </div>
              <div className="service-tile-media">
                <Photo name={SERVICE_PHOTO[slug]} sizes="(min-width: 1024px) 560px, 100vw" className="h-full w-full object-cover" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const { t } = useI18n();
  return (
    <section className="pt-[var(--section-space)]">
      <div className="container-w">
        <SectionHeader
          eyebrow={t.home.work.eyebrow}
          title={t.home.work.title}
          subtitle={t.home.work.subtitle}
          action={<MoreLink href="/work">{t.common.cta.allWork}</MoreLink>}
        />
      </div>
      <WorkRail projects={projects} />
    </section>
  );
}

/** Sticky storytelling: the step number stays pinned while each step scrolls past. */
function Process() {
  const { t } = useI18n();
  const ref = useRef<HTMLOListElement>(null);
  const steps = t.home.process.steps;
  const active = useActiveIndex(ref, ":scope > li");
  return (
    <section className="section-pad">
      <div className="container-w grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="label mb-3">{t.home.process.eyebrow}</p>
          <h2 className="display-2"><Headline text={t.home.process.title} /></h2>
          <div className="process-counter mt-12 hidden lg:flex" aria-hidden="true">
            <span className="process-counter-num" key={active}>{pad(active + 1)}</span>
            <span className="process-counter-total">/ {pad(steps.length)}</span>
          </div>
          <div className="process-track mt-6 hidden lg:block" aria-hidden="true">
            <i style={{ transform: `scaleX(${(active + 1) / steps.length})` }} />
          </div>
        </div>
        <ol ref={ref} className="process-steps">
          {steps.map((step, index) => (
            <li key={step.title} className={index === active ? "is-active" : ""}>
              <p className="text-sm font-semibold t-muted">{pad(index + 1)}</p>
              <h3 className="display-3 mt-3">{step.title}</h3>
              <p className="lead mt-4">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhyUs() {
  const { t } = useI18n();
  return (
    <section className="theme-light section-pad">
      <div className="container-w">
        <SectionHeader eyebrow={t.home.why.eyebrow} title={t.home.why.title} />
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {t.home.why.items.map((item, index) => (
            <div key={item.title} className="reveal rule-top pt-6" style={{ "--d": index % 3 } as CSSProperties}>
              <h3 className="text-xl font-semibold tracking-tight t-primary">{item.title}</h3>
              <p className="mt-3 leading-relaxed t-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const { t } = useI18n();
  return (
    <section className="section-pad">
      <div className="container-w">
        <SectionHeader
          eyebrow={t.home.pricing.eyebrow}
          title={t.home.pricing.title}
          subtitle={t.home.pricing.subtitle}
          action={<MoreLink href="/pricing">{t.home.pricing.cta}</MoreLink>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICE_TEASER.map((offer, index) => (
            <div key={offer} className="card price-tile reveal" style={{ "--d": index } as CSSProperties}>
              <p className="t-secondary">{t.common.offerNames[offer]}</p>
              <OfferPrice offer={offer} prefix className="mt-6 block text-[1.7rem] font-semibold leading-tight tracking-tight t-primary" />
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm t-muted">{t.common.price.estimateNote}</p>
      </div>
    </section>
  );
}

function FaqTeaser() {
  const { t } = useI18n();
  const items = t.faq.categories.flatMap((category) => category.items.slice(0, 2)).slice(0, 6);
  return (
    <section className="theme-light section-pad">
      <div className="container-w grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="reveal">
          <p className="label mb-3">{t.home.faq.eyebrow}</p>
          <h2 className="display-2"><Headline text={t.home.faq.title} /></h2>
          <MoreLink href="/faq" className="mt-6">{t.home.faq.cta}</MoreLink>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <Hero />
      <ProofBar />
      <Statement />
      <Services />
      <SelectedWork />
      <Process />
      <WhyUs />
      <Testimonials />
      <PricingTeaser />
      <FaqTeaser />
      <CtaBand />
    </Layout>
  );
}
