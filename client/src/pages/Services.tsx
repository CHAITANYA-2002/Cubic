import { ServiceIllustration } from "@/components/visuals/ServiceIllustration";
import { Link } from "wouter";
import { Layout } from "@/components/site/Layout";
import { CheckList, CtaBand, OfferPrice, PageHero, TrustStrip } from "@/components/site/blocks";
import { SERVICE_ICON, SERVICE_OFFER, SERVICE_SLUGS, type ServiceSlug } from "@/data/services";
import { useI18n } from "@/i18n";

function ServiceRow({ slug, index }: { slug: ServiceSlug; index: number }) {
  const { t } = useI18n();
  const item = t.services.items[slug];
  const Icon = SERVICE_ICON[slug];
  return (
    <article className="grid gap-8 border-t border-[var(--line)] py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div className={index % 2 ? "lg:order-2" : ""}>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-soft)] t-brand">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-mono text-xs t-secondary">0{index + 1}</span>
        </div>
        <h2 className="mt-5 text-2xl font-bold t-primary md:text-3xl">{t.common.serviceNames[slug]}</h2>
        <p className="mt-3 t-secondary">{item.short}</p>
        <OfferPrice offer={SERVICE_OFFER[slug]} prefix className="mt-6 block text-xl font-bold t-primary" />
        <p className="mt-1 text-sm t-secondary">{t.services.detail.timelineTitle}: {item.timeline}</p>
        <Link href={`/services/${slug}`} className="btn btn-outline mt-6">
          {t.services.index.details}
        </Link>
      </div>
      <div>
        <ServiceIllustration service={slug} />
        <p className="mt-6 text-sm font-semibold t-primary">{t.services.index.forWho}</p>
        <p className="mt-2 leading-relaxed t-secondary">{item.forWho[0]}</p>
        <p className="mt-6 text-sm font-semibold t-primary">{t.services.index.includes}</p>
        <CheckList className="mt-3" items={item.deliverables.slice(0, 4).map((d) => d.title)} />
      </div>
    </article>
  );
}

export default function Services() {
  const { t } = useI18n();
  return (
    <Layout>
      <PageHero eyebrow={t.services.index.eyebrow} title={t.services.index.title} subtitle={t.services.index.subtitle}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary btn-lg">{t.common.cta.bookCall}</Link>
          <Link href="/pricing" className="btn btn-outline btn-lg">{t.common.cta.seePricing}</Link>
        </div>
      </PageHero>
      <section className="section-pad">
        <div className="container-w"><TrustStrip /></div>
      </section>
      <section className="section-pad section-subtle">
        <div className="container-w">
          {SERVICE_SLUGS.map((slug, index) => <ServiceRow key={slug} slug={slug} index={index} />)}
        </div>
      </section>
      <CtaBand />
    </Layout>
  );
}
