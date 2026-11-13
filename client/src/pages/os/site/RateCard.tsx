import { DEFAULT_SITE, OFFER_IDS, priceIn, type OfferId, type OfferPrice, type SiteSettings } from "@shared/site";
import { Panel } from "../ui";
import type { SiteUpdate } from "./SiteView";

// Admin-only English labels. An offer added to OFFER_IDS still appears (by id) until labelled here.
const OFFER_LABELS: Partial<Record<OfferId, string>> = {
  diagnostic: "Diagnostic",
  landing: "Landing page / microsite",
  website: "Business website",
  webapp: "Web application",
  ai: "AI agent / automation",
  uiux: "UI/UX engagement",
  marketing: "Digital marketing retainer",
  care: "Care plan",
  fractional: "Fractional engineering",
};

type RangeKey = "inr" | "usd";

const cellInput = "glow-input !w-28 !px-2 !py-1.5 !text-sm";
const compact = (value: number) => value.toLocaleString("en-US");
const EMPTY_PRICE: OfferPrice = { inr: [0, 0], usd: [0, 0], monthly: false };

function priceOf(site: SiteSettings, id: OfferId): OfferPrice {
  return site.prices[id] ?? DEFAULT_SITE.prices[id] ?? EMPTY_PRICE;
}

function PriceInput({ value, label, onChange }: { value: number; label: string; onChange: (value: string) => void }) {
  return <input type="number" min={0} step={1} value={value} onChange={(e) => onChange(e.target.value)} className={cellInput} aria-label={label} />;
}

export function RateCard({ site, onChange }: { site: SiteSettings; onChange: SiteUpdate }) {
  const setPrice = (id: OfferId, price: OfferPrice) => onChange({ ...site, prices: { ...site.prices, [id]: price } });

  const setRange = (id: OfferId, key: RangeKey, index: 0 | 1, value: string) => {
    const price = priceOf(site, id);
    const range: [number, number] = index === 0 ? [Number(value), price[key][1]] : [price[key][0], Number(value)];
    setPrice(id, { ...price, [key]: range });
  };

  return (
    <Panel title="Rate card">
      <p className="mb-4 text-xs t-muted">
        Whole numbers. INR is the Indian card; USD is the international card. EUR and AED are derived from USD with the exchange rates
        above (rounded) and shown here as a preview. Keep INR in step with firm/playbooks/pricing.md.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.12em] t-muted">
            <tr>
              <th className="py-2 pr-3 font-medium">Offer</th>
              <th className="py-2 pr-3 font-medium">INR min</th>
              <th className="py-2 pr-3 font-medium">INR max</th>
              <th className="py-2 pr-3 font-medium">USD min</th>
              <th className="py-2 pr-3 font-medium">USD max</th>
              <th className="py-2 pr-3 font-medium">Monthly</th>
              <th className="py-2 pr-3 font-medium">EUR</th>
              <th className="py-2 font-medium">AED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {OFFER_IDS.map((id) => {
              const price = priceOf(site, id);
              const [eurMin, eurMax] = priceIn(price, "EUR", site.fx);
              const [aedMin, aedMax] = priceIn(price, "AED", site.fx);
              const label = OFFER_LABELS[id] ?? id;
              const invalid = price.inr[0] > price.inr[1] || price.usd[0] > price.usd[1];
              return (
                <tr key={id} className={invalid ? "bg-red-500/5" : undefined}>
                  <td className="py-2 pr-3 t-primary">
                    {label}
                    {invalid && <span className="block text-[11px] text-red-300">Minimum is above maximum</span>}
                  </td>
                  <td className="py-2 pr-3"><PriceInput value={price.inr[0]} label={`${label} INR minimum`} onChange={(v) => setRange(id, "inr", 0, v)} /></td>
                  <td className="py-2 pr-3"><PriceInput value={price.inr[1]} label={`${label} INR maximum`} onChange={(v) => setRange(id, "inr", 1, v)} /></td>
                  <td className="py-2 pr-3"><PriceInput value={price.usd[0]} label={`${label} USD minimum`} onChange={(v) => setRange(id, "usd", 0, v)} /></td>
                  <td className="py-2 pr-3"><PriceInput value={price.usd[1]} label={`${label} USD maximum`} onChange={(v) => setRange(id, "usd", 1, v)} /></td>
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={price.monthly}
                      onChange={(e) => setPrice(id, { ...price, monthly: e.target.checked })}
                      className="h-4 w-4 accent-[var(--accent-primary)]"
                      aria-label={`${label} billed monthly`}
                    />
                  </td>
                  <td className="py-2 pr-3 text-xs t-muted">€{compact(eurMin)}–{compact(eurMax)}</td>
                  <td className="py-2 text-xs t-muted">AED {compact(aedMin)}–{compact(aedMax)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
