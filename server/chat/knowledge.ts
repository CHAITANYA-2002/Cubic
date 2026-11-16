import { en } from "../../client/src/i18n/en";
import { projects } from "../../client/src/data/work";
import type { KbEntry } from "../../shared/crm";
import { OFFER_IDS, type SiteSettings } from "../../shared/site";

// Everything the chatbot may say comes from here: the English website copy (the single source the
// other four languages are translated from), live site settings, and answers the owner adds.

export type Chunk = { id: string; title: string; text: string; core?: boolean };

const MAX_CHUNK = 1400;

/** Flattens nested copy into "label: value" lines, skipping SEO and UI-only keys. */
function flatten(value: unknown, path: string[] = []): string[] {
  const skip = /^(meta|aria|eyebrow|cta|navigation|seeLive|details|forWho$|youGet|includes$|label)/i;
  const key = path[path.length - 1] ?? "";
  if (skip.test(key)) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => flatten(item, path));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.q === "string" && typeof obj.a === "string") return [`Q: ${obj.q}\nA: ${obj.a}`];
    if (typeof obj.title === "string" && typeof obj.text === "string") return [`${obj.title}: ${obj.text}`];
    return Object.entries(obj).flatMap(([childKey, child]) => flatten(child, [...path, childKey]));
  }
  return [];
}

function split(id: string, title: string, lines: string[]): Chunk[] {
  const chunks: Chunk[] = [];
  let buffer = "";
  for (const line of lines) {
    if (buffer && buffer.length + line.length > MAX_CHUNK) {
      chunks.push({ id: `${id}-${chunks.length}`, title, text: buffer.trim() });
      buffer = "";
    }
    buffer += `${line}\n`;
  }
  if (buffer.trim()) chunks.push({ id: `${id}-${chunks.length}`, title, text: buffer.trim() });
  return chunks;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function priceChunk(site: SiteSettings): Chunk {
  const lines = OFFER_IDS.map((id) => {
    const price = site.prices[id];
    const per = price.monthly ? " per month" : "";
    const timeline = id === "diagnostic" ? "1 week" : en.pricing.offers[id as keyof typeof en.pricing.offers]?.timeline ?? "";
    const range = (a: number, b: number, f: (n: number) => string) => (a === b ? f(a) : `${f(a)}–${f(b)}`);
    return `${en.common.offerNames[id]}: ${range(price.inr[0], price.inr[1], inr)}${per} in India; ${range(price.usd[0], price.usd[1], usd)}${per} internationally (EUR and AED are converted from USD)${timeline ? `; timeline ${timeline}` : ""}.`;
  });
  return {
    id: "prices",
    title: "Price list",
    core: true,
    text: `Published price ranges (every project gets one fixed price in a written proposal):\n${lines.join("\n")}\nPayment: 40% to start, 30% at the midpoint, 30% on delivery. Retainers are billed monthly in advance. GST is added for Indian clients where applicable.`,
  };
}

function contactChunk(site: SiteSettings): Chunk {
  return {
    id: "contact",
    title: "Contact and booking",
    core: true,
    text: [
      `Email: ${site.email}`,
      `Phone: ${site.phone}`,
      `WhatsApp: https://wa.me/${site.whatsapp}`,
      `Hours: ${site.hours}`,
      `Location: ${site.address}`,
      "Book a free 30-minute call: /book",
      "Contact form: /contact",
      "Replies within one working day.",
      site.acceptingProjects ? "Currently accepting new projects." : "Currently not taking new projects; new enquiries go on a waiting list.",
    ].join("\n"),
  };
}

function workChunks(): Chunk[] {
  const lines = projects.map((project) => {
    const copy = en.work.projects[project.slug];
    const kind = en.common.kinds[project.kind];
    return `${project.name} (${kind}; ${copy.sector}): ${copy.summary} Link: ${project.liveUrl}`;
  });
  return split("work", "Work and live projects", [`Live work and case studies: /work. Kinds: client builds are real client work; product demos run on sample data; concept builds are pitches; lab projects are our own AI and data builds.`, ...lines]);
}

function serviceChunks(): Chunk[] {
  return Object.entries(en.services.items).flatMap(([slug, item]) =>
    split(`service-${slug}`, `${en.common.serviceNames[slug as keyof typeof en.common.serviceNames]} service (/services/${slug})`, flatten(item)),
  );
}

/** Static website knowledge. Built once per isolate. */
let staticChunks: Chunk[] | null = null;
function websiteChunks(): Chunk[] {
  staticChunks ??= [
    ...split("about", "About CubicTech", flatten(en.about)),
    ...split("home", "What CubicTech does", flatten(en.home)),
    ...serviceChunks(),
    ...split("pricing-page", "How pricing works", flatten(en.pricing)),
    ...en.faq.categories.flatMap((category) => split(`faq-${category.id}`, `FAQ: ${category.title}`, flatten(category.items))),
    ...workChunks(),
  ];
  return staticChunks;
}

export function buildCorpus(site: SiteSettings, kb: KbEntry[]): Chunk[] {
  const taught = kb.filter((entry) => entry.active).map((entry) => ({ id: `kb-${entry.id}`, title: "Answer from the CubicTech team", text: `Q: ${entry.question}\nA: ${entry.answer}${entry.tags ? `\nTags: ${entry.tags}` : ""}` }));
  return [contactChunk(site), priceChunk(site), ...taught, ...websiteChunks()];
}
