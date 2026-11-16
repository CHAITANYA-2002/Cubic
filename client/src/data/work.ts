// Live work shown on /work, the home page and service pages. Text lives in the i18n dictionaries
// (work.projects[slug]); this file holds what doesn't translate.
// Rule (firm/COMPANY.md): only real builds, labelled honestly. A product demo runs on sample
// data with placeholder brands; never present one as a paying client or quote its sample numbers.

export type ServiceLine = "websites" | "apps" | "ai" | "marketing";
export type ProjectKind = "client" | "demo" | "concept";

export const SERVICE_LINES: Array<{ id: ServiceLine; service: string }> = [
  { id: "websites", service: "web-development" },
  { id: "apps", service: "web-applications" },
  { id: "ai", service: "ai-solutions" },
  { id: "marketing", service: "digital-marketing" },
];

export type Project = {
  slug: ProjectSlug;
  name: string;
  kind: ProjectKind;
  lines: ServiceLine[];
  stack: string[];
  image: string;
  liveUrl: string;
};

export const PROJECT_SLUGS = [
  "superfox-roam",
  "humorah",
  "mani-doro",
  "alsisar-haveli",
  "aria-frontdesk",
  "flowops-sdr",
  "northwind-lifecycle",
  "helix-analytics",
] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const projects: Project[] = [
  {
    slug: "superfox-roam",
    name: "Superfox Roam",
    kind: "client",
    lines: ["websites", "apps", "ai", "marketing"],
    stack: ["React", "TypeScript", "Node API", "PostgreSQL", "Vercel"],
    image: "/images/work/superfox-roam.webp",
    liveUrl: "https://on-trip-holidays.vercel.app",
  },
  {
    slug: "humorah",
    name: "Humorah — AI room redesign",
    kind: "client",
    lines: ["apps", "ai"],
    stack: ["React", "Vite", "FastAPI", "Supabase", "Claude vision", "gpt-image-1", "Razorpay"],
    image: "/images/work/humorah.webp",
    liveUrl: "https://www.humora.io",
  },
  {
    slug: "mani-doro",
    name: "Mani D'Oro — jewellery storefront",
    kind: "client",
    lines: ["websites"],
    stack: ["React", "TypeScript"],
    image: "/images/work/mani-doro.webp",
    liveUrl: "https://manidoroofficial.com",
  },
  {
    slug: "alsisar-haveli",
    name: "Alsisar Haveli — heritage hotel system",
    kind: "concept",
    lines: ["websites", "apps"],
    stack: ["Next.js 15", "TypeScript", "Tailwind", "Neon Postgres", "Vercel"],
    image: "/images/work/alsisar-haveli.webp",
    liveUrl: "https://alsisar-haveli-demo.vercel.app",
  },
  {
    slug: "aria-frontdesk",
    name: "Aria — AI front desk",
    kind: "demo",
    lines: ["ai", "marketing"],
    stack: ["Next.js", "TypeScript", "Agent engine"],
    image: "/images/work/aria-frontdesk.webp",
    liveUrl: "https://chaitanya-2002.github.io/client-work/aria/demo/",
  },
  {
    slug: "flowops-sdr",
    name: "FlowOps — AI sales outreach agent",
    kind: "demo",
    lines: ["ai", "marketing"],
    stack: ["TypeScript", "LLM prompts", "Rules engine"],
    image: "/images/work/flowops-sdr.webp",
    liveUrl: "https://chaitanya-2002.github.io/client-work/sdr-email-agent-demo/sdr-client-demo.html",
  },
  {
    slug: "northwind-lifecycle",
    name: "Northwind — lifecycle email agent",
    kind: "demo",
    lines: ["ai", "marketing"],
    stack: ["HTML", "JavaScript", "Data validation"],
    image: "/images/work/northwind-lifecycle.webp",
    liveUrl: "https://chaitanya-2002.github.io/client-work/finance-email-agent-demo/client-demo.html",
  },
  {
    slug: "helix-analytics",
    name: "Helix — revenue dashboard",
    kind: "demo",
    lines: ["apps"],
    stack: ["React", "Vite", "Tailwind"],
    image: "/images/work/helix-analytics.webp",
    liveUrl: "https://chaitanya-2002.github.io/client-work/helix/",
  },
];

export const projectsFor = (line: ServiceLine) => projects.filter((project) => project.lines.includes(line));
export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
