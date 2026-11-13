import { Layout } from "@/components/site/Layout";
import { useI18n } from "@/i18n";

export type LegalSection = [heading: string, body: string];

/** Legal pages are maintained in English (the governing version) in every locale. */
export function Legal({ title, description, updated, sections }: { title: string; description: string; updated: string; sections: LegalSection[] }) {
  const { t, locale } = useI18n();
  return (
    <Layout>
      <article className="container-w max-w-3xl py-16 md:py-24" lang="en" dir="ltr">
        <p className="label mb-4">CubicTech · Legal</p>
        <h1 className="display-1">{title}</h1>
        <p className="mt-4 text-sm t-muted">Last updated: {updated}</p>
        {locale !== "en" && <p className="mt-4 rounded-md bg-[var(--bg-subtle)] p-3 text-sm t-secondary" lang={locale} dir="auto">{t.common.legalNote}</p>}
        <p className="lead mt-8">{description}</p>
        <div className="mt-12 space-y-10">
          {sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-xl font-bold t-primary">{heading}</h2>
              <p className="mt-3 leading-relaxed t-secondary">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </Layout>
  );
}
