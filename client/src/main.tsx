import { LOCALE_META, localeFromPath } from "./i18n/config";
import "./index.css";
import "./styles/visuals.css";

const locale = localeFromPath(window.location.pathname);
const prerenderLocale = document.documentElement.lang;
document.documentElement.lang = locale;
document.documentElement.dir = LOCALE_META[locale].dir;
const root = document.getElementById("root")!;

async function bootstrap() {
  const [{ createElement }, { hydrateRoot, createRoot }, { default: App }, { loadDict }] = await Promise.all([
    import("react"), import("react-dom/client"), import("./App"), import("./i18n"),
  ]);
  const dict = await loadDict(locale);
  const app = createElement(App, { locale, dict });
  if (root.hasChildNodes() && prerenderLocale === locale) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

// Public HTML already works without JavaScript. Finish its first paint before
// loading enhancements; empty workspace shells still bootstrap immediately.
if (!root.hasChildNodes() || document.readyState === "complete") void bootstrap();
else window.addEventListener("load", () => {
  window.requestAnimationFrame(() => window.setTimeout(() => void bootstrap(), 0));
}, { once: true });
