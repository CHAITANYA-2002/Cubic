import { Layout } from "@/components/site/Layout";
import { CtaBand, Headline, PageHero, SectionHeader, TrustStrip } from "@/components/site/blocks";
import { useI18n } from "@/i18n";

export default function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <Layout>
      <PageHero eyebrow={a.eyebrow} title={a.title} subtitle={a.intro} />

      <section className="section-pad">
        <div className="container-w grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="display-2"><Headline text={a.storyTitle} /></h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed t-secondary">
              {a.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <aside className="space-y-6">
            <div className="card p-6">
              <p className="label">{a.founderTitle}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--brand-line)] bg-[var(--brand-soft)] font-mono text-lg font-semibold t-brand" aria-hidden="true">CK</span>
                <div>
                  <p className="font-bold t-primary">{a.founderName}</p>
                  <p className="text-sm t-secondary">{a.founderRole}</p>
                </div>
              </div>
              <p className="mt-4 text-[0.95rem] leading-relaxed t-secondary">{a.founderText}</p>
            </div>
            <div className="card p-6">
              <p className="label">{a.factsTitle}</p>
              <dl className="mt-4 divide-y divide-[var(--line)]">
                {a.facts.map((fact) => (
                  <div key={fact.label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="t-secondary">{fact.label}</dt>
                    <dd className="text-end font-medium t-primary">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad section-subtle">
        <div className="container-w">
          <SectionHeader title={a.principlesTitle} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.principles.map((principle) => (
              <div key={principle.title} className="card p-6">
                <h3 className="font-bold t-primary">{principle.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed t-secondary">{principle.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12"><TrustStrip /></div>
        </div>
      </section>

      <CtaBand />
    </Layout>
  );
}
