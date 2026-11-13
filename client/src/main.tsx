import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { loadDict, LOCALE_META, localeFromPath } from "./i18n";
import "./index.css";

const locale = localeFromPath(window.location.pathname);
document.documentElement.lang = locale;
document.documentElement.dir = LOCALE_META[locale].dir;

// Attach to prerendered public content without replacing it or replaying the hero.
loadDict(locale).then((dict) => {
  const root = document.getElementById("root")!;
  const app = <App locale={locale} dict={dict} />;
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
});
