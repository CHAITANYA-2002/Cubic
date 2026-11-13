import { bannerForPath } from "./data/banners";
import { renderToString } from "react-dom/server";
import App from "./App";
import { loadDict, type Locale } from "./i18n";
import { metaFor } from "./seo/meta";
import { headHtml } from "./seo/head";
import { LOCALE_META, localizedPath } from "./i18n/config";

/** Render one public page to HTML for the prerenderer (script/prerender.ts). */
export async function render(path: string, locale: Locale) {
  const dict = await loadDict(locale);
  const html = renderToString(<App locale={locale} dict={dict} ssrPath={localizedPath(path, locale)} />);
  const image = bannerForPath(path);
  const preload = path === "/" ? "" : `<link rel="preload" as="image" href="/images/banners/${image}.webp" imagesrcset="/images/banners/${image}-960.webp 960w, /images/banners/${image}.webp 1920w" imagesizes="100vw" fetchpriority="high" />`;
  const fontPreload = ["en", "de", "fr"].includes(locale) ? '<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/display-cf5f5ed194.woff2" /><link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/display-25b406678a.woff2" />' : "";
  const head = fontPreload + preload + headHtml(metaFor(path, locale, dict));
  return { html, head, lang: locale, dir: LOCALE_META[locale].dir };
}

export { PUBLIC_PATHS, SITE_URL } from "./seo/meta";
export { LOCALES } from "./i18n/config";
