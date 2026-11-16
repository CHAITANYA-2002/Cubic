import { Link } from "wouter";
import type { OfferId } from "@shared/site";
import { CurrencySelect } from "@/components/site/Preferences";
import { Layout } from "@/components/site/Layout";
import { CheckList, CtaBand, Headline, OfferPrice, PageHero, SectionHeader } from "@/components/site/blocks";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

const ROWS: Array<Exclude<OfferId, "diagnostic">> = ["landing", "website", "webapp", "ai", "uiux", "marketing", "care", "fractional"];

export default function Pricing() {
  const { t } = useI18n();
  const { currency } = useSite();
  const p = t.pricing;

  return (
    <Layout>
      <PageHero eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle}>
        <p className="text-sm t-secondary">{t.common.prefs.currencyNote} <strong className="t-primary">{currency}</strong> · {t.common.price.vatNote}</p>
      </PageHero>

      <section className="section-pad">
        <div className="container-w">
          <div className="reveal grid gap-8 card-accent p-7 md:grid-cols-[1.4fr_1fr] md:p-12">
            <div>
              <p className="label mb-3">{p.diagnostic.eyebrow}</p>
              <h2 className="display-2"><Headline text={p.diagnostic.title} /></h2>
              <p className="mt-4 leading-relaxed t-secondary">{p.diagnostic.text}</p>
              <CheckList items={p.diagnostic.points} className="mt-6" />
            </div>
            <div className="flex flex-col justify-center rounded-2xl bg-[var(--bg-primary)] p-7">
              <OfferPrice offer="diagnostic" className="text-4xl font-semibold tracking-tight t-primary" />
              <p className="mt-1 text-sm t-secondary">{t.common.price.fixed}</p>
              <Link href="/contact" className="btn btn-primary btn-lg mt-6">{p.diagnostic.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-w">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm t-secondary">{t.common.prefs.currencyNote}</p>
            <CurrencySelect id="pricing-currency" visibleLabel />
          </div>
          <div className="reveal overflow-hidden rounded-[var(--card-radius)] bg-[var(--surface)]">
            <table className="w-full text-start">
              <caption className="sr-only">{p.title}</caption>
              <thead className="hidden border-b border-[var(--line)] text-sm md:table-header-group">
                <tr>
                  <th scope="col" className="px-7 py-5 text-start font-medium t-muted">{p.table.service}</th>
                  <th scope="col" className="px-7 py-5 text-start font-medium t-muted">{p.table.price}</th>
                  <th scope="col" className="px-7 py-5 text-start font-medium t-muted">{p.table.timeline}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {ROWS.map((offer) => (
                  <tr key={offer} className="flex flex-col gap-1 px-5 py-5 md:table-row md:p-0">
                    <th scope="row" className="text-start font-normal md:px-7 md:py-6">
                      <span className="block text-lg font-semibold tracking-tight t-primary">{t.common.offerNames[offer]}</span>
                      <span className="mt-1 block text-sm t-secondary">{p.offers[offer].detail}</span>
                    </th>
                    <td className="md:px-7 md:py-6"><OfferPrice offer={offer} className="text-lg font-semibold t-primary" /></td>
                    <td className="text-sm t-secondary md:px-7 md:py-6">{p.offers[offer].timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm t-secondary">{t.common.price.estimateNote}</p>
        </div>
      </section>

      <section className="section-pad section-subtle">
        <div className="container-w grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionHeader title={p.termsTitle} />
            <div className="grid gap-5 sm:grid-cols-2">
              {p.terms.map((term) => (
                <div key={term.title} className="card reveal">
                  <h3 className="text-lg font-semibold tracking-tight t-primary">{term.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed t-secondary">{term.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="display-3">{p.notIncluded.title}</h2>
            <ul className="mt-5 list-disc space-y-2 ps-5 t-secondary">
              {p.notIncluded.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </Layout>
  );
}
