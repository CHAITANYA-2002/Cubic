import { Link } from "wouter";
import { Layout } from "@/components/site/Layout";
import { FaqList, PageHero } from "@/components/site/blocks";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

export default function Faq() {
  const { t } = useI18n();
  const { site } = useSite();
  const f = t.faq;
  return (
    <Layout>
      <PageHero eyebrow={f.eyebrow} title={f.title} subtitle={f.subtitle} />
      <section className="section-pad">
        <div className="container-w grid gap-12 lg:grid-cols-[260px_1fr]">
          <nav aria-label={f.eyebrow} className="hidden lg:block">
            <ul className="sticky top-24 space-y-1 text-sm">
              {f.categories.map((category) => (
                <li key={category.id}>
                  <a href={`#${category.id}`} className="block rounded-md px-3 py-2 t-muted hover:bg-[var(--bg-subtle)] hover:t-primary">{category.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {f.categories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-24" aria-labelledby={`${category.id}-title`}>
                <h2 id={`${category.id}-title`} className="mb-5 text-2xl font-bold t-primary">{category.title}</h2>
                <FaqList items={category.items} />
              </section>
            ))}
            <div className="rounded-2xl bg-[var(--bg-subtle)] p-7 md:p-9">
              <h2 className="text-xl font-bold t-primary">{f.stillTitle}</h2>
              <p className="mt-2 t-secondary">{f.stillText}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn btn-primary">{t.common.cta.contactUs}</Link>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{t.common.cta.whatsapp}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
