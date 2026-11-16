import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { CheckList, CtaBand, FaqList, Headline, MoreLink, OfferPrice, Photo, SectionHeader } from "@/components/site/blocks";
import { RelatedWork } from "@/components/work/RelatedWork";
import { SERVICE_LINE, SERVICE_OFFER, SERVICE_PHOTO, isServiceSlug } from "@/data/services";
import { useI18n } from "@/i18n";
import NotFound from "./not-found";

export default function ServiceDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { t } = useI18n();
  if (!isServiceSlug(slug)) return <NotFound />;

  const item = t.services.items[slug];
  const line = SERVICE_LINE[slug];

  return (
    <Layout>
      <section className="page-hero">
        <div className="container-w grid gap-12 pb-14 pt-10 md:pb-20 md:pt-16 lg:grid-cols-[1.8fr_1fr] lg:items-end">
          <div>
            <nav aria-label={t.common.accessibility.breadcrumb} className="mb-6 flex items-center gap-1.5 text-sm t-secondary">
              <Link href="/services" className="inline-flex min-h-11 items-center hover:t-primary">{t.common.nav.services}</Link>
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              <span aria-current="page" className="t-secondary">{t.common.serviceNames[slug]}</span>
            </nav>
            <p className="label rise mb-4">{t.common.serviceNames[slug]}</p>
            <h1 className="display-1 service-title"><Headline text={item.title} animate /></h1>
            <p className="lead rise rise-2 mt-7 max-w-2xl">{item.intro}</p>
            <div className="rise rise-3 mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
              <Link href="/contact" className="btn btn-primary btn-lg">{t.common.cta.getQuote}</Link>
              {line && <MoreLink href="/work">{t.common.cta.seeWork}</MoreLink>}
            </div>
          </div>
          <aside className="card-accent rise rise-3 h-fit">
            <p className="text-sm font-medium t-secondary">{t.services.detail.priceTitle}</p>
            <OfferPrice offer={SERVICE_OFFER[slug]} className="mt-2 block text-3xl font-semibold tracking-tight t-primary" />
            <p className="mt-1 text-xs t-secondary">{t.common.price.fixed} · {t.common.price.vatNote}</p>
            <p className="mt-5 text-sm font-medium t-secondary">{t.services.detail.timelineTitle}</p>
            <p className="mt-1 font-semibold t-primary">{item.timeline}</p>
            <div className="my-5 h-px bg-[var(--line)]" />
            <CheckList items={[t.common.trust.fixedPrice, t.common.trust.milestones, t.common.trust.ownCode, t.common.trust.warranty]} className="text-sm" />
          </aside>
        </div>
        <div className="container-w pb-4">
          <figure className="hero-figure"><Photo name={SERVICE_PHOTO[slug]} eager className="h-full w-full object-cover" /></figure>
        </div>
      </section>

      <nav aria-label={t.common.nav.services} className="sticky top-14 z-40 mt-16 hidden border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl lg:block">
        <div className="container-w flex gap-6">
          {["overview", "included", "process", "work", "faq"].map((id, index) => (
            <a key={id} href={`#${id}`} className="inline-flex min-h-12 items-center text-[0.84rem] t-muted hover:t-primary">{t.services.detail.navigation[index]}</a>
          ))}
        </div>
      </nav>

      <section id="overview" className="section-pad">
        <div className="container-w grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display-3"><Headline text={t.services.detail.whoTitle} /></h2>
            <CheckList items={item.forWho} className="mt-6" />
          </div>
          <div>
            <h2 className="display-3"><Headline text={t.services.detail.outcomesTitle} /></h2>
            <CheckList items={item.outcomes} className="mt-6" />
          </div>
        </div>
      </section>

      <section id="included" className="section-pad section-subtle">
        <div className="container-w">
          <SectionHeader title={t.services.detail.deliverablesTitle} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {item.deliverables.map((deliverable) => (
              <div key={deliverable.title} className="card reveal">
                <h3 className="text-lg font-semibold tracking-tight t-primary">{deliverable.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed t-secondary">{deliverable.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section-pad">
        <div className="container-w">
          <SectionHeader title={t.services.detail.processTitle} />
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {t.home.process.steps.map((step, index) => (
              <li key={step.title} className="reveal rule-top pt-6">
                <p className="text-sm font-semibold t-muted">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight t-primary">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed t-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div id="work">{line ? <RelatedWork line={line} /> : (
        <section className="section-pad section-subtle"><div className="container-w">
          <SectionHeader title={t.services.detail.relatedTitle} />
          <MoreLink href="/work">{t.common.cta.allWork}</MoreLink>
        </div></section>
      )}</div>

      <section id="faq" className="section-pad">
        <div className="container-w grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="display-2"><Headline text={t.services.detail.faqTitle} /></h2>
            <MoreLink href="/faq" className="mt-6">{t.common.cta.readFaq}</MoreLink>
          </div>
          <FaqList items={item.faqs} />
        </div>
      </section>

      <CtaBand title={t.services.detail.ctaTitle} text={t.services.detail.ctaText} />
    </Layout>
  );
}
