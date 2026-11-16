import { useRef } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/site/Layout";
import { FaqList, MoreLink, PageHero } from "@/components/site/blocks";
import { useActiveIndex } from "@/components/visuals/useActiveIndex";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

export default function Faq() {
  const { t } = useI18n();
  const { site } = useSite();
  const f = t.faq;
  const sections = useRef<HTMLDivElement>(null);
  const activeIndex = useActiveIndex(sections, ":scope > section", "-25% 0px -65% 0px");
  const active = f.categories[activeIndex]?.id;

  return (
    <Layout>
      <PageHero eyebrow={f.eyebrow} title={f.title} subtitle={f.subtitle} />
      <section className="pb-[var(--section-space)]">
        <div className="container-w grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-20">
          <nav aria-label={f.eyebrow} className="faq-chips">
            {f.categories.map((category) => (
              <a key={category.id} href={`#${category.id}`} aria-current={active === category.id ? "true" : undefined}>{category.title}</a>
            ))}
          </nav>
          <nav aria-label={f.eyebrow} className="hidden lg:block">
            <ul className="faq-nav sticky top-24">
              {f.categories.map((category) => (
                <li key={category.id}>
                  <a href={`#${category.id}`} aria-current={active === category.id ? "true" : undefined}>{category.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div ref={sections} className="space-y-20">
            {f.categories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-24" aria-labelledby={`${category.id}-title`}>
                <h2 id={`${category.id}-title`} className="display-3 mb-6">{category.title}</h2>
                <FaqList items={category.items} />
              </section>
            ))}
          </div>
        </div>
      </section>
      <section className="theme-light section-pad">
        <div className="container-w container-narrow text-center">
          <h2 className="display-2 reveal">{f.stillTitle}</h2>
          <p className="lead reveal mx-auto mt-5">{f.stillText}</p>
          <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
            <Link href="/contact" className="btn btn-primary btn-lg">{t.common.cta.contactUs}</Link>
            <MoreLink href={`https://wa.me/${site.whatsapp}`} external>{t.common.cta.whatsapp}</MoreLink>
          </div>
        </div>
      </section>
    </Layout>
  );
}
