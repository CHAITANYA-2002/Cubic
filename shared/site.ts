import { z } from "zod";

// Public site settings: contact details, socials, rate card and FX. Defaults live here so the
// prerendered HTML is complete without a backend; the admin can override every field at runtime.

export const CURRENCIES = ["INR", "USD", "EUR", "AED"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const OFFER_IDS = [
  "diagnostic",
  "landing",
  "website",
  "webapp",
  "ai",
  "uiux",
  "marketing",
  "care",
  "fractional",
] as const;
export type OfferId = (typeof OFFER_IDS)[number];

const amount = z.coerce.number().int().min(0).max(1_000_000_000);
const range = z.tuple([amount, amount]);

export const offerPriceSchema = z.object({
  inr: range,
  usd: range,
  monthly: z.boolean().default(false),
});

const optionalUrl = z.string().trim().url().max(300).or(z.literal(""));

export const testimonialSchema = z.object({
  quote: z.string().trim().min(10).max(600),
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().max(80).default(""),
  company: z.string().trim().max(120).default(""),
});

export const siteSettingsSchema = z.object({
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "Digits only, with country code"),
  hours: z.string().trim().max(120),
  address: z.string().trim().max(240),
  socials: z.object({
    linkedin: optionalUrl,
    instagram: optionalUrl,
    github: optionalUrl,
    x: optionalUrl,
  }),
  // How many units of each currency equal one US dollar. Used only for EUR and AED, which are
  // derived from the USD card; INR has its own card because the Indian market prices differently.
  fx: z.object({ EUR: z.coerce.number().positive().max(10), AED: z.coerce.number().positive().max(10) }),
  prices: z.object(Object.fromEntries(OFFER_IDS.map((id) => [id, offerPriceSchema])) as Record<OfferId, typeof offerPriceSchema>),
  testimonials: z.array(testimonialSchema).max(12),
  acceptingProjects: z.boolean(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type OfferPrice = z.infer<typeof offerPriceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;

// INR mirrors firm/playbooks/pricing.md Part 2 (Tier B). USD is the Tier C sheet — a draft that the
// principal approves or edits in /admin/site before it goes in front of foreign buyers.
export const DEFAULT_SITE: SiteSettings = {
  email: "chaitanyakhurana10@gmail.com",
  phone: "+91 79769 89699",
  whatsapp: "917976989699",
  hours: "Mon–Sat, 10:00–19:00 IST",
  address: "India · remote-first, working with teams worldwide",
  socials: { linkedin: "", instagram: "", github: "https://github.com/CHAITANYA-2002", x: "" },
  fx: { EUR: 0.92, AED: 3.67 },
  prices: {
    diagnostic: { inr: [35_000, 35_000], usd: [1_200, 1_200], monthly: false },
    landing: { inr: [60_000, 120_000], usd: [3_000, 6_000], monthly: false },
    website: { inr: [150_000, 400_000], usd: [7_500, 18_000], monthly: false },
    webapp: { inr: [400_000, 1_500_000], usd: [18_000, 50_000], monthly: false },
    ai: { inr: [200_000, 800_000], usd: [10_000, 35_000], monthly: false },
    uiux: { inr: [150_000, 500_000], usd: [6_000, 20_000], monthly: false },
    marketing: { inr: [50_000, 150_000], usd: [2_000, 5_000], monthly: true },
    care: { inr: [40_000, 80_000], usd: [1_500, 3_500], monthly: true },
    fractional: { inr: [150_000, 300_000], usd: [6_000, 12_000], monthly: true },
  },
  testimonials: [],
  acceptingProjects: true,
};

const niceRound = (value: number) => {
  const step = value >= 10_000 ? 500 : value >= 1_000 ? 100 : 10;
  return Math.round(value / step) * step;
};

/** Price range for an offer in the requested currency. EUR and AED are derived from USD. */
export function priceIn(price: OfferPrice, currency: Currency, fx: SiteSettings["fx"]): [number, number] {
  if (currency === "INR") return price.inr;
  if (currency === "USD") return price.usd;
  const rate = fx[currency];
  return [niceRound(price.usd[0] * rate), niceRound(price.usd[1] * rate)];
}
