// Production build: client bundle, SSR bundle, then one static HTML file per page per language,
// plus sitemap.xml, robots.txt, llms.txt, _redirects and _headers for Cloudflare Pages.
import { build } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { writeSeoFiles } from "./seo-files";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "dist", "public");
const serverDir = path.join(root, "dist", "server");

type Rendered = { html: string; head: string; lang: string; dir: string };
type ServerEntry = {
  render: (pagePath: string, locale: string) => Promise<Rendered>;
  PUBLIC_PATHS: string[];
  LOCALES: readonly string[];
  SITE_URL: string;
};

/** "/" -> "index.html", "/pricing" -> "pricing.html", ("/pricing", "de") -> "de/pricing.html". */
function fileFor(pagePath: string, locale: string): string {
  const prefix = locale === "en" ? "" : locale;
  if (pagePath === "/") return locale === "en" ? "index.html" : `${prefix}.html`;
  return path.join(prefix, `${pagePath.slice(1)}.html`);
}

function fillTemplate(template: string, page: Rendered): string {
  return template
    .replace('<html lang="en" dir="ltr">', `<html lang="${page.lang}" dir="${page.dir}">`)
    .replace("<!--app-head-->", page.head)
    .replace("<!--app-html-->", page.html);
}

async function writeFile(relative: string, content: string) {
  const target = path.join(outDir, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf8");
}

async function main() {
  await build({ configFile: path.join(root, "vite.config.ts"), mode: "production" });
  await build({
    configFile: path.join(root, "vite.config.ts"),
    mode: "production",
    build: { ssr: "src/entry-server.tsx", outDir: serverDir, emptyOutDir: true, copyPublicDir: false },
    logLevel: "warn",
  });

  const entry = (await import(pathToFileURL(path.join(serverDir, "entry-server.js")).href)) as ServerEntry;
  const template = await fs.readFile(path.join(outDir, "index.html"), "utf8");

  let count = 0;
  for (const locale of entry.LOCALES) {
    for (const pagePath of entry.PUBLIC_PATHS) {
      const page = await entry.render(pagePath, locale);
      await writeFile(fileFor(pagePath, locale), fillTemplate(template, page));
      count += 1;
    }
  }

  // 404 page (Cloudflare serves 404.html for unknown paths, with a 404 status).
  await writeFile("404.html", fillTemplate(template, await entry.render("/__not-found__", "en")));

  // Admin and client portal: client-rendered, never indexed.
  const appShell = template
    .replace("<!--app-head-->", '    <title>CubicTech</title>\n    <meta name="robots" content="noindex, nofollow" />')
    .replace("<!--app-html-->", "");
  await writeFile("admin.html", appShell);

  await writeSeoFiles(outDir, entry.SITE_URL, entry.LOCALES, entry.PUBLIC_PATHS);
  await fs.rm(serverDir, { recursive: true, force: true });
  process.stdout.write(`Prerendered ${count} pages across ${entry.LOCALES.length} languages.\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`Prerender failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});
