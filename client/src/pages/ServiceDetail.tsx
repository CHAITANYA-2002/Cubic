import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { CheckList, CtaBand, FaqList, Headline, OfferPrice, SectionHeader } from "@/components/site/blocks";
import { RelatedWork } from "@/components/work/RelatedWork";
import { SERVICE_ICON, SERVICE_LINE, SERVICE_OFFER, isServiceSlug } from "@/data/services";
import { useI18n } from "@/i18n";
import NotFound from "./not-found";

export default function ServiceDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { t } = useI18n();
  if (!isServiceSlug(slug)) return <NotFound />;

  const item = t.services.items[slug];
  const Icon = SERVICE_ICON[slug];
  const line = SERVICE_LINE[slug];

  return (
    <Layout>
      <section className="tech-grid border-b border-[var(--line)]">
        <div className="container-w grid gap-10 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm t-muted">
              <Link href="/services" className="hover:t-primary">{t.common.nav.services}</Link>
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              <span aria-current="page" className="t-secondary">{t.common.serviceNames[slug]}</span>
            </nav>
            <p className="label mb-4 inline-flex items-center gap-2"><Icon className="h-4 w-4" aria-hidden="true" />{t.common.serviceNames[slug]}</p>
            <h1 className="display-1"><Headline text={item.title} /></h1>
            <p className="lead mt-6 max-w-2xl">{item.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-primary btn-lg">{t.common.cta.getQuote}</Link>
              {line && <Link href="/work" className="btn btn-outline btn-lg">{t.common.cta.seeWork}</Link>}
            </div>
          </div>
          <aside className="card-accent h-fit p-6 md:p-7">
            <p className="text-sm font-medium t-muted">{t.services.detail.priceTitle}</p>
            <OfferPrice offer={SERVICE_OFFER[slug]} className="mt-1 block text-2xl font-bold t-primary" />
            <p className="mt-1 text-xs t-muted">{t.common.price.fixed} · {t.common.price.vatNote}</p>
            <p className="mt-5 text-sm font-medium t-muted">{t.services.detail.timelineTitle}</p>
            <p className="mt-1 font-semibold t-primary">{item.timeline}</p>
            <div className="my-5 h-px bg-[var(--line)]" />
            <CheckList items={[t.common.trust.fixedPrice, t.common.trust.milestones, t.common.trust.ownCode, t.common.trust.warranty]} className="text-sm" />
          </aside>
        </div>
      </section>

      <nav aria-label={t.common.nav.services} className="sticky top-16 z-40 hidden border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl lg:block">
        <div className="container-w flex gap-6">
          {["overview", "included", "process", "work", "faq"].map((id, index) => (
            <a key={id} href={`#${id}`} className="inline-flex min-h-12 items-center px-2 text-sm t-secondary hover:t-primary">{t.services.detail.navigation[index]}</a>
          ))}
        </div>
      </nav>

      <section id="overview" className="section-pad">
        <div className="container-w grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display-2">{t.services.detail.whoTitle}</h2>
            <CheckList items={item.forWho} className="mt-6" />
          </div>
          <div>
            <h2 className="display-2">{t.services.detail.outcomesTitle}</h2>
            <CheckList items={item.outcomes} className="mt-6" />
          </div>
        </div>
      </section>

      <section id="included" className="section-pad section-subtle">
        <div className="container-w">
          <SectionHeader title={t.services.detail.deliverablesTitle} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {item.deliverables.map((deliverable) => (
              <div key={deliverable.title} className="card p-6">
                <h3 className="font-bold t-primary">{deliverable.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed t-muted">{deliverable.text}</p>
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
              <li key={step.title} className="rule-top pt-5">
                <p className="font-mono text-xs t-deco">0{index + 1}</p>
                <h3 className="mt-2 font-bold t-primary">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed t-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div id="work">{line ? <RelatedWork line={line} /> : (
        <section className="section-pad section-subtle"><div className="container-w">
          <SectionHeader title={t.services.detail.relatedTitle} />
          <Link href="/work" className="btn btn-outline">{t.common.cta.allWork}</Link>
        </div></section>
      )}</div>

      <section id="faq" className="section-pad">
        <div className="container-w grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="display-2">{t.services.detail.faqTitle}</h2>
            <Link href="/faq" className="btn btn-outline mt-6">{t.common.cta.readFaq}</Link>
          </div>
          <FaqList items={item.faqs} />
        </div>
      </section>

      <CtaBand title={t.services.detail.ctaTitle} text={t.services.detail.ctaText} />
    </Layout>
  );
}
