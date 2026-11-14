// Renders the site's 3D artwork to transparent WebP files with headless Chrome.
// Usage: npx tsx script/render-3d.ts   (re-run after changing client/src/components/three/*)
import { createServer } from "vite";
import puppeteer from "puppeteer-core";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "client", "public", "images", "3d");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 5175;

const OBJECTS = [
  "web-development", "web-applications", "ai-solutions", "digital-marketing", "ui-ux-design", "maintenance",
  "process", "cta", "faq", "not-found",
];

type Job = { name: string; file: string; width: number; height: number };

const jobs: Job[] = [
  ...OBJECTS.flatMap((name) => [
    { name, file: `${name}.webp`, width: 800, height: 800 },
    { name, file: `${name}-400.webp`, width: 400, height: 400 },
  ]),
  { name: "hero", file: "hero-cube.webp", width: 1100, height: 900 },
  { name: "hero", file: "hero-cube-640.webp", width: 640, height: 524 },
];

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const server = await createServer({
    configFile: path.join(root, "vite.config.ts"),
    server: { port: PORT, strictPort: true },
    logLevel: "warn",
  });
  await server.listen();
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  try {
    const page = await browser.newPage();
    // Optional filter: `npx tsx script/render-3d.ts hero faq` renders only those objects.
    const only = process.argv.slice(2);
    for (const job of jobs.filter((item) => only.length === 0 || only.includes(item.name))) {
      // Rendered at 2x pixel ratio inside a CSS-pixel viewport of half the target size.
      await page.setViewport({ width: job.width / 2, height: job.height / 2, deviceScaleFactor: 2 });
      await page.goto(`http://localhost:${PORT}/render-3d.html?obj=${job.name}&w=${job.width / 2}&h=${job.height / 2}`, { waitUntil: "networkidle0" });
      await page.waitForFunction("window.__ready === true", { timeout: 60_000 });
      const canvas = await page.$("canvas");
      if (!canvas) throw new Error(`No canvas for ${job.name}`);
      await canvas.screenshot({ path: path.join(outDir, job.file), type: "webp", quality: 86, omitBackground: true });
      process.stdout.write(`rendered ${job.file}\n`);
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Render failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});
