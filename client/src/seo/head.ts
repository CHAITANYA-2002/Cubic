import { LOCALES, LOCALE_META } from "@/i18n/config";
import { OG_IMAGE, alternates, canonicalUrl, ogLocale, type PageMetaData } from "./meta";

const OG_IMAGE_ALT = "CubicTech — software and AI studio";
const hreflangs = (meta: PageMetaData) => (meta.localized ? alternates(meta.path) : []);

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// JSON-LD lives inside <script>: neutralise "</script>" and HTML comment openers.
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/** Head tags for a page, as an HTML string. Used by the prerenderer. */
export function headHtml(meta: PageMetaData): string {
  const url = canonicalUrl(meta);
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...hreflangs(meta).map((alt) => `<link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="CubicTech" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${ogLocale(meta.locale)}" />`,
    ...(meta.localized
      ? LOCALES.filter((locale) => locale !== meta.locale).map((locale) => `<meta property="og:locale:alternate" content="${ogLocale(locale)}" />`)
      : []),
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${OG_IMAGE_ALT}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:image:alt" content="${OG_IMAGE_ALT}" />`,
    ...meta.jsonLd.map((ld) => `<script type="application/ld+json" data-seo>${safeJson(ld)}</script>`),
  ];
  return tags.map((tag) => `    ${tag}`).join("\n");
}

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
};

/** Keep the live document head in sync during client-side navigation. */
export function applyHead(meta: PageMetaData) {
  const url = canonicalUrl(meta);
  document.title = meta.title;
  document.documentElement.lang = meta.locale;
  document.documentElement.dir = LOCALE_META[meta.locale].dir;
  upsertMeta('meta[name="description"]', { name: "description", content: meta.description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large" });
  upsertMeta('link[rel="canonical"]', { rel: "canonical", href: url });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: ogLocale(meta.locale) });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  hreflangs(meta).forEach((alt) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = alt.hreflang;
    link.href = alt.href;
    document.head.appendChild(link);
  });

  document.head.querySelectorAll("script[data-seo]").forEach((el) => el.remove());
  meta.jsonLd.forEach((ld) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  });
}

export { OG_IMAGE };
