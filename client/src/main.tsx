import { LOCALE_META, localeFromPath } from "./i18n/config";
import "./index.css";
import "./styles/visuals.css";
import "./styles/motion.css";
import "./styles/depth.css";

const locale = localeFromPath(window.location.pathname);
const prerenderLocale = document.documentElement.lang;
document.documentElement.lang = locale;
document.documentElement.dir = LOCALE_META[locale].dir;
const root = document.getElementById("root")!;

// The intro plays once per browser session; later page loads skip straight to content.
function settleIntro() {
  const intro = document.getElementById("intro");
  if (!intro) return;
  try {
    if (window.sessionStorage.getItem("cubic.intro")) intro.remove();
    else window.sessionStorage.setItem("cubic.intro", "1");
  } catch {
    // Storage blocked: the CSS animation simply plays and hides itself.
  }
  if (root.firstElementChild === null) intro.remove();
}
settleIntro();

async function bootstrap() {
  const [{ createElement }, { hydrateRoot, createRoot }, { default: App }, { loadDict }] = await Promise.all([
    import("react"), import("react-dom/client"), import("./App"), import("./i18n"),
  ]);
  const dict = await loadDict(locale);
  const app = createElement(App, { locale, dict });
  if (root.firstElementChild !== null && prerenderLocale === locale) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

// Public HTML already works without JavaScript. Finish its first paint before
// loading enhancements; empty workspace shells still bootstrap immediately.
if (root.firstElementChild === null || document.readyState === "complete") void bootstrap();
else window.addEventListener("load", () => {
  window.requestAnimationFrame(() => window.setTimeout(() => void bootstrap(), 0));
}, { once: true });
