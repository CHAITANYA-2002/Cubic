import { Link } from "wouter";
import type { OfferId } from "@shared/site";
import { Layout } from "@/components/site/Layout";
import { CheckList, CtaBand, OfferPrice, PageHero, SectionHeader } from "@/components/site/blocks";
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
        <p className="text-sm t-muted">{t.common.prefs.currencyNote} <strong className="t-primary">{currency}</strong> · {t.common.price.vatNote}</p>
      </PageHero>

      <section className="section-pad pb-0">
        <div className="container-w">
          <div className="grid gap-8 rounded-2xl border-2 border-[var(--brand)] bg-[var(--brand-soft)] p-7 md:grid-cols-[1.4fr_1fr] md:p-10">
            <div>
              <p className="label mb-3">{p.diagnostic.eyebrow}</p>
              <h2 className="display-2">{p.diagnostic.title}</h2>
              <p className="mt-4 leading-relaxed t-secondary">{p.diagnostic.text}</p>
              <CheckList items={p.diagnostic.points} className="mt-6" />
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-white p-6">
              <OfferPrice offer="diagnostic" className="text-3xl font-bold t-primary" />
              <p className="mt-1 text-sm t-muted">{t.common.price.fixed}</p>
              <Link href="/contact" className="btn btn-primary btn-lg mt-6">{p.diagnostic.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-w">
          <div className="overflow-hidden rounded-xl border border-[var(--line)]">
            <table className="w-full text-start">
              <caption className="sr-only">{p.title}</caption>
              <thead className="hidden bg-[var(--bg-subtle)] text-sm md:table-header-group">
                <tr>
                  <th scope="col" className="px-6 py-4 text-start font-semibold t-primary">{p.table.service}</th>
                  <th scope="col" className="px-6 py-4 text-start font-semibold t-primary">{p.table.price}</th>
                  <th scope="col" className="px-6 py-4 text-start font-semibold t-primary">{p.table.timeline}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {ROWS.map((offer) => (
                  <tr key={offer} className="flex flex-col gap-1 px-5 py-5 md:table-row md:p-0">
                    <th scope="row" className="text-start font-normal md:px-6 md:py-5">
                      <span className="block font-semibold t-primary">{t.common.offerNames[offer]}</span>
                      <span className="mt-1 block text-sm t-muted">{p.offers[offer].detail}</span>
                    </th>
                    <td className="md:px-6 md:py-5"><OfferPrice offer={offer} className="font-semibold t-primary" /></td>
                    <td className="text-sm t-muted md:px-6 md:py-5">{p.offers[offer].timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm t-muted">{t.common.price.estimateNote}</p>
        </div>
      </section>

      <section className="section-pad section-subtle">
        <div className="container-w grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionHeader title={p.termsTitle} />
            <div className="grid gap-5 sm:grid-cols-2">
              {p.terms.map((term) => (
                <div key={term.title} className="card p-6">
                  <h3 className="font-bold t-primary">{term.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed t-muted">{term.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold t-primary">{p.notIncluded.title}</h2>
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
