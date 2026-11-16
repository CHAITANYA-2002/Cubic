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
  // The home page's largest paint is the flagship project screenshot.
  const preload = path === "/"
    ? '<link rel="preload" as="image" media="(max-width: 767px)" href="/images/work/superfox-roam-640.webp" fetchpriority="high" />'
      + '<link rel="preload" as="image" media="(min-width: 768px)" href="/images/work/superfox-roam.webp" imagesrcset="/images/work/superfox-roam-640.webp 640w, /images/work/superfox-roam.webp 1280w" imagesizes="(min-width: 1240px) 1160px, 100vw" fetchpriority="high" />'
    : "";
  const head = preload + headHtml(metaFor(path, locale, dict));
  return { html, head, lang: locale, dir: LOCALE_META[locale].dir };
}

export { PUBLIC_PATHS, SITE_URL } from "./seo/meta";
export { LOCALES } from "./i18n/config";
