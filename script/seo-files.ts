import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_SITE, OFFER_IDS } from "../shared/site";
import { en } from "../client/src/i18n/en";

const url = (siteUrl: string, pagePath: string, locale: string) => {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${siteUrl}${pagePath === "/" ? prefix || "/" : `${prefix}${pagePath}`}`;
};

function sitemap(siteUrl: string, locales: readonly string[], paths: string[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const entries = paths.flatMap((pagePath) =>
    locales.map((locale) => {
      const alternates = [...locales.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${url(siteUrl, pagePath, alt)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(siteUrl, pagePath, "en")}"/>`];
      const priority = pagePath === "/" ? "1.0" : pagePath.startsWith("/services") || pagePath === "/work" || pagePath === "/pricing" ? "0.8" : "0.5";
      return `  <url>\n    <loc>${url(siteUrl, pagePath, locale)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n${alternates.join("\n")}\n  </url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

const robots = (siteUrl: string) => `# Search engines and AI assistants are welcome to read the public site.
User-agent: *
Allow: /
Disallow: /admin
Disallow: /portal
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const money = (value: number, currency: "INR" | "USD") =>
  new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

/** A plain-text brief for AI assistants (https://llmstxt.org). Generated from the same content as the site. */
function llms(siteUrl: string): string {
  const offers = OFFER_IDS.map((id) => {
    const price = DEFAULT_SITE.prices[id];
    const range = (currency: "INR" | "USD") => {
      const [min, max] = currency === "INR" ? price.inr : price.usd;
      return min === max ? money(min, currency) : `${money(min, currency)}–${money(max, currency)}`;
    };
    return `- ${en.common.offerNames[id]}: ${range("INR")} (India) / ${range("USD")} (international)${price.monthly ? " per month" : ""}`;
  });
  const services = Object.entries(en.services.items).map(([slug, item]) =>
    `- [${en.common.serviceNames[slug as keyof typeof en.common.serviceNames]}](${siteUrl}/services/${slug}): ${item.short} Typical timeline: ${item.timeline}.`);
  const faqs = en.faq.categories.flatMap((category) => category.items).map((item) => `### ${item.q}\n${item.a}`);

  return `# CubicTech

> ${en.common.footer.blurb}

- Website: ${siteUrl}
- Contact: ${DEFAULT_SITE.email} · WhatsApp ${DEFAULT_SITE.phone} · ${DEFAULT_SITE.hours}
- Founder: Chaitanya Khurana (founder & principal engineer)
- Languages on the site: English, Hindi, Arabic, German, French
- Engagement model: fixed price in writing, milestone payments 40/30/30, client owns the code on full payment, 30-day defect warranty

## Services
${services.join("\n")}

## Pricing (published ranges; each proposal names one fixed price)
${offers.join("\n")}
EUR and AED prices are derived from the USD card. Details: ${siteUrl}/pricing

## Live work
- ${siteUrl}/work — live builds with links; product demos are labelled as demos and run on sample data.

## Frequently asked questions
${faqs.join("\n\n")}
`;
}

const redirects = `/admin/* /admin 200
/portal/* /admin 200
`;

const headers = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-5Dl41e/3GkkoYIJh2eaLs6Ijxn91wHKOBIEL84QQTfw='; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.web3forms.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=604800

/admin
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store
`;

export async function writeSeoFiles(outDir: string, siteUrl: string, locales: readonly string[], paths: string[]) {
  const write = (name: string, content: string) => fs.writeFile(path.join(outDir, name), content, "utf8");
  await Promise.all([
    write("sitemap.xml", sitemap(siteUrl, locales, paths)),
    write("robots.txt", robots(siteUrl)),
    write("llms.txt", llms(siteUrl)),
    write("_redirects", redirects),
    write("_headers", headers),
  ]);
}
