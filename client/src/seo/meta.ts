import { DEFAULT_SITE, priceIn, type OfferId, type SiteSettings } from "@shared/site";
import type { Dict } from "@/i18n";
import { LOCALES, LOCALE_META, localizedPath, type Locale } from "@/i18n/config";
import { SERVICE_SLUGS, SERVICE_OFFER, type ServiceSlug } from "@/data/services";

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://cubictech.pages.dev";
export const OG_IMAGE = `${SITE_URL}/og.png`;

export type JsonLd = Record<string, unknown>;
export type PageMetaData = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  noindex?: boolean;
  jsonLd: JsonLd[];
};

const LEGAL: Record<string, { title: string; description: string }> = {
  "/terms": { title: "Terms of Service | CubicTech", description: "The terms that govern use of the CubicTech website and our services." },
  "/privacy": { title: "Privacy Policy | CubicTech", description: "How CubicTech collects, uses and protects personal data, and your rights." },
  "/cookies": { title: "Cookie Policy | CubicTech", description: "The essential storage CubicTech uses and how to control it." },
};

export const absoluteUrl = (path: string, locale: Locale) => `${SITE_URL}${localizedPath(path, locale)}`;

export const alternates = (path: string) => [
  ...LOCALES.map((locale) => ({ hreflang: locale, href: absoluteUrl(path, locale) })),
  { hreflang: "x-default", href: absoluteUrl(path, "en") },
];

function organization(site: SiteSettings, t: Dict): JsonLd {
  const sameAs = Object.values(site.socials).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "CubicTech",
    alternateName: "Cubic Technologies",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    image: OG_IMAGE,
    description: t.common.footer.blurb,
    email: site.email,
    telephone: site.phone,
    founder: { "@type": "Person", name: "Chaitanya Khurana" },
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    areaServed: ["IN", "US", "GB", "DE", "FR", "AE", "SA", "EU"],
    availableLanguage: ["en", "hi"],
    knowsAbout: ["Web development", "Web applications", "AI agents", "Workflow automation", "UI/UX design", "SEO", "Digital marketing"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

const website = (locale: Locale): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: absoluteUrl("/", locale),
  name: "CubicTech",
  inLanguage: locale,
  publisher: { "@id": `${SITE_URL}/#organization` },
});

const breadcrumb = (items: Array<{ name: string; path: string }>, locale: Locale): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path, locale) })),
});

const faqPage = (items: Array<{ q: string; a: string }>): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
});

function offerSpec(offer: OfferId, site: SiteSettings) {
  const price = site.prices[offer];
  return (["INR", "USD", "EUR", "AED"] as const).map((currency) => {
    const [min, max] = priceIn(price, currency, site.fx);
    return { "@type": "PriceSpecification", priceCurrency: currency, minPrice: min, maxPrice: max };
  });
}

function serviceLd(slug: ServiceSlug, t: Dict, locale: Locale, site: SiteSettings): JsonLd {
  const item = t.services.items[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.common.serviceNames[slug],
    description: item.intro,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["IN", "US", "EU", "AE", "SA"],
    url: absoluteUrl(`/services/${slug}`, locale),
    offers: { "@type": "Offer", priceSpecification: offerSpec(SERVICE_OFFER[slug], site) },
  };
}

/** Title, description and structured data for a page. Shared by the prerenderer and the client. */
export function metaFor(path: string, locale: Locale, t: Dict, site: SiteSettings = DEFAULT_SITE): PageMetaData {
  const base = { path, locale, jsonLd: [organization(site, t), website(locale)] };
  const home = { name: t.common.brand, path: "/" };
  const page = (title: string, description: string, extra: JsonLd[] = [], crumbs: Array<{ name: string; path: string }> = []) => ({
    ...base,
    title,
    description,
    jsonLd: [...base.jsonLd, ...(crumbs.length ? [breadcrumb([home, ...crumbs], locale)] : []), ...extra],
  });

  if (path === "/") return page(t.home.metaTitle, t.home.metaDescription);
  if (path === "/services") return page(t.services.index.metaTitle, t.services.index.metaDescription, [], [{ name: t.common.nav.services, path }]);
  const serviceSlug = path.startsWith("/services/") ? path.slice("/services/".length) : "";
  if ((SERVICE_SLUGS as readonly string[]).includes(serviceSlug)) {
    const slug = serviceSlug as ServiceSlug;
    const item = t.services.items[slug];
    return page(item.metaTitle, item.metaDescription, [serviceLd(slug, t, locale, site), faqPage(item.faqs)], [
      { name: t.common.nav.services, path: "/services" },
      { name: t.common.serviceNames[slug], path },
    ]);
  }
  if (path === "/work") return page(t.work.metaTitle, t.work.metaDescription, [], [{ name: t.common.nav.work, path }]);
  if (path === "/pricing") return page(t.pricing.metaTitle, t.pricing.metaDescription, [], [{ name: t.common.nav.pricing, path }]);
  if (path === "/about") return page(t.about.metaTitle, t.about.metaDescription, [], [{ name: t.common.nav.about, path }]);
  if (path === "/contact") return page(t.contact.metaTitle, t.contact.metaDescription, [], [{ name: t.common.nav.contact, path }]);
  if (path === "/faq") {
    const all = t.faq.categories.flatMap((category) => category.items);
    return page(t.faq.metaTitle, t.faq.metaDescription, [faqPage(all)], [{ name: t.common.nav.faq, path }]);
  }
  if (LEGAL[path]) return page(LEGAL[path].title, LEGAL[path].description);
  return { ...page(`${t.common.notFound.title} | CubicTech`, t.common.notFound.text), noindex: true };
}

export const PUBLIC_PATHS = [
  "/",
  "/services",
  ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  "/work",
  "/pricing",
  "/about",
  "/faq",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
];

export const ogLocale = (locale: Locale) => LOCALE_META[locale].ogLocale;
