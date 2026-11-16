import { Link } from "wouter";
import { Layout } from "@/components/site/Layout";
import { CheckList, CtaBand, MoreLink, OfferPrice, PageHero, Photo, TrustStrip } from "@/components/site/blocks";
import { SERVICE_OFFER, SERVICE_PHOTO, SERVICE_SLUGS, type ServiceSlug } from "@/data/services";
import { useI18n } from "@/i18n";

const pad = (value: number) => String(value).padStart(2, "0");

function ServiceRow({ slug, index }: { slug: ServiceSlug; index: number }) {
  const { t } = useI18n();
  const item = t.services.items[slug];
  return (
    <article className={`feature-row ${index % 2 ? "is-flipped" : ""}`}>
      <div className="reveal">
        <p className="text-sm font-semibold t-muted">{pad(index + 1)}</p>
        <h2 className="display-2 mt-3">{t.common.serviceNames[slug]}</h2>
        <p className="lead mt-5">{item.short}</p>
        <p className="mt-8 text-sm font-semibold t-primary">{t.services.index.includes}</p>
        <CheckList className="mt-4" items={item.deliverables.slice(0, 4).map((d) => d.title)} />
        <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <OfferPrice offer={SERVICE_OFFER[slug]} prefix className="text-xl font-semibold tracking-tight t-primary" />
          <span className="text-sm t-muted">{t.services.detail.timelineTitle}: {item.timeline}</span>
        </div>
        <MoreLink href={`/services/${slug}`} className="mt-4">{t.services.index.details}</MoreLink>
      </div>
      <div className="feature-media reveal-img">
        <Photo name={SERVICE_PHOTO[slug]} sizes="(min-width: 1024px) 560px, 100vw" />
      </div>
    </article>
  );
}

export default function Services() {
  const { t } = useI18n();
  return (
    <Layout>
      <PageHero eyebrow={t.services.index.eyebrow} title={t.services.index.title} subtitle={t.services.index.subtitle} photo="blueprint">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
          <Link href="/contact" className="btn btn-primary btn-lg">{t.common.cta.bookCall}</Link>
          <MoreLink href="/pricing">{t.common.cta.seePricing}</MoreLink>
        </div>
      </PageHero>
      <section className="section-pad pb-0">
        <div className="container-w">
          {SERVICE_SLUGS.map((slug, index) => <ServiceRow key={slug} slug={slug} index={index} />)}
        </div>
      </section>
      <section className="theme-light section-pad">
        <div className="container-w"><TrustStrip /></div>
      </section>
      <CtaBand />
    </Layout>
  );
}
