import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { CtaBand, FaqList, Headline, OfferPrice, SectionHeader, TrustStrip } from "@/components/site/blocks";
import { DeviceComposition } from "@/components/visuals/Devices";
import { Aurora } from "@/components/visuals/Aurora";
import { ServiceIllustration } from "@/components/visuals/ServiceIllustration";
import { TechnologyStrip, StatsBand } from "@/components/visuals/TechnologyStrip";
import { DeliveryBento } from "@/components/visuals/DeliveryBento";
import { VisualProjectCard } from "@/components/visuals/VisualProjectCard";
import { Testimonials } from "@/components/work/Testimonials";
import { SERVICE_OFFER, SERVICE_SLUGS } from "@/data/services";
import { projectBySlug, type Project } from "@/data/work";
import { useI18n } from "@/i18n";

const FEATURED = ["superfox-roam", "aria-frontdesk", "flowops-sdr"]
  .map(projectBySlug)
  .filter((project): project is Project => Boolean(project));

const PRICE_TEASER = ["website", "webapp", "ai", "marketing"] as const;

function Hero() {
  const { t } = useI18n();

  return (
    <section className="home-hero tech-grid overflow-hidden border-b border-[var(--line)]">
      <Aurora />
      <div className="container-w section-pad relative grid items-center gap-12 lg:min-h-[88vh] lg:grid-cols-[1.1fr_1fr]">
        <div className="reveal">
          <p className="label mb-5">{t.home.hero.eyebrow}</p>
          <h1 className="display-1"><Headline text={t.home.hero.title} animate /></h1>
          <p className="lead mt-6 max-w-xl">{t.home.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-primary btn-lg">
              {t.home.hero.primary} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link href="/work" className="btn btn-outline btn-lg">{t.home.hero.secondary}</Link>
          </div>
          <p className="mt-5 text-sm t-secondary">{t.home.hero.note}</p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label={t.common.accessibility.technology}>
            {t.home.stack.map((tech) => <li key={tech} className="chip">{tech}</li>)}
          </ul>
        </div>
        <DeviceComposition />
      </div>
    </section>
  );
}

function ServicesGrid() {
  const { t } = useI18n();
  return (
    <section className="section-pad">
      <div className="container-w">
        <SectionHeader eyebrow={t.home.services.eyebrow} title={t.home.services.title} subtitle={t.home.services.subtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_SLUGS.map((slug) => {
            return (
              <Link key={slug} href={`/services/${slug}`} className="card card-hover group flex flex-col p-6">
                <ServiceIllustration service={slug} />
                <h3 className="mt-5 text-lg font-bold t-primary">{t.common.serviceNames[slug]}</h3>
                <p className="mt-2 flex-grow text-[0.95rem] leading-relaxed t-secondary">{t.services.items[slug].short}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-sm">
                  <OfferPrice offer={SERVICE_OFFER[slug]} prefix className="font-semibold t-primary" />
                  <ArrowRight className="h-4 w-4 t-secondary transition-transform group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const { t } = useI18n();
  return (
    <section className="section-pad section-subtle">
      <div className="container-w">
        <SectionHeader
          eyebrow={t.home.work.eyebrow}
          title={t.home.work.title}
          subtitle={t.home.work.subtitle}
          action={<Link href="/work" className="btn btn-outline">{t.common.cta.allWork}</Link>}
        />
        <div className="selected-visuals">
          {FEATURED.map((project) => <VisualProjectCard key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const { t } = useI18n();
  return (
    <section className="section-pad">
      <div className="container-w">
        <SectionHeader eyebrow={t.home.why.eyebrow} title={t.home.why.title} />
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {t.home.why.items.map((item, index) => (
            <div key={item.title} className="rule-top pt-5">
              <p className="font-mono text-xs t-secondary">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-bold t-primary">{item.title}</h3>
              <p className="mt-2 leading-relaxed t-secondary">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-2xl border border-[var(--line)] bg-[var(--bg-subtle)] p-6 md:p-8">
          <p className="mb-5 text-sm font-semibold t-primary">{t.home.proofStrip.title}</p>
          <TrustStrip />
        </div>
      </div>
    </section>
  );
}

function Process() {
  const { t } = useI18n();
  return (
    <section className="section-pad section-subtle">
      <div className="container-w">
        <SectionHeader eyebrow={t.home.process.eyebrow} title={t.home.process.title} />
        <ol className="process-steps grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {t.home.process.steps.map((step, index) => (
            <li key={step.title} className="card p-6">
              <span className="step-dot">{index + 1}</span>
              <h3 className="mt-4 font-bold t-primary">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed t-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
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
          action={<Link href="/pricing" className="btn btn-outline">{t.home.pricing.cta}</Link>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRICE_TEASER.map((offer) => (
            <div key={offer} className="card p-6">
              <p className="text-sm font-medium t-secondary">{t.common.offerNames[offer]}</p>
              <OfferPrice offer={offer} prefix className="mt-2 block text-xl font-bold t-primary" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm t-secondary">{t.common.price.estimateNote}</p>
      </div>
    </section>
  );
}

function FaqTeaser() {
  const { t } = useI18n();
  const items = t.faq.categories.flatMap((category) => category.items.slice(0, 2)).slice(0, 6);
  return (
    <section className="section-pad section-subtle">
      <div className="container-w grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="label mb-3">{t.home.faq.eyebrow}</p>
          <h2 className="display-2"><Headline text={t.home.faq.title} /></h2>
          <Link href="/faq" className="btn btn-outline mt-6">{t.home.faq.cta}</Link>
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
      <StatsBand />
      <TechnologyStrip />
      <ServicesGrid />
      <SelectedWork />
      <DeliveryBento />
      <WhyUs />
      <Process />
      <Testimonials />
      <PricingTeaser />
      <FaqTeaser />
      <CtaBand />
    </Layout>
  );
}
