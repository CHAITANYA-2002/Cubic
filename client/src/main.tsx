import { createRoot } from "react-dom/client";
import App from "./App";
import { loadDict, LOCALE_META, localeFromPath } from "./i18n";
import "./index.css";

const locale = localeFromPath(window.location.pathname);
document.documentElement.lang = locale;
document.documentElement.dir = LOCALE_META[locale].dir;

// Prerendered HTML is already on screen; replace it once this locale's copy has loaded.
loadDict(locale).then((dict) => {
  createRoot(document.getElementById("root")!).render(<App locale={locale} dict={dict} />);
});
