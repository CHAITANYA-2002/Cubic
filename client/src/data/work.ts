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
  "aria-frontdesk",
  "flowops-sdr",
  "northwind-lifecycle",
  "helix-analytics",
  "mani-doro",
] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const projects: Project[] = [
  {
    slug: "superfox-roam",
    name: "Superfox Roam",
    kind: "client",
    lines: ["websites", "apps", "ai", "marketing"],
    stack: ["React", "TypeScript", "Node API", "PostgreSQL", "Vercel"],
    image: "/images/work/superfox-roam.jpg",
    liveUrl: "https://on-trip-holidays.vercel.app",
  },
  {
    slug: "aria-frontdesk",
    name: "Aria — AI front desk",
    kind: "demo",
    lines: ["ai", "marketing"],
    stack: ["Next.js", "TypeScript", "Agent engine"],
    image: "/images/work/aria-frontdesk.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/aria/demo/",
  },
  {
    slug: "flowops-sdr",
    name: "FlowOps — AI sales outreach agent",
    kind: "demo",
    lines: ["ai", "marketing"],
    stack: ["TypeScript", "LLM prompts", "Rules engine"],
    image: "/images/work/flowops-sdr.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/sdr-email-agent-demo/sdr-client-demo.html",
  },
  {
    slug: "northwind-lifecycle",
    name: "Northwind — lifecycle email agent",
    kind: "demo",
    lines: ["ai", "marketing"],
    stack: ["HTML", "JavaScript", "Data validation"],
    image: "/images/work/northwind-lifecycle.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/finance-email-agent-demo/client-demo.html",
  },
  {
    slug: "helix-analytics",
    name: "Helix — revenue dashboard",
    kind: "demo",
    lines: ["apps"],
    stack: ["React", "Vite", "Tailwind"],
    image: "/images/work/helix-analytics.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/helix/",
  },
  {
    slug: "mani-doro",
    name: "Mani D'Oro — jewellery storefront",
    kind: "concept",
    lines: ["websites"],
    stack: ["React", "TypeScript", "Netlify"],
    image: "/images/work/mani-doro.jpg",
    liveUrl: "https://mdoro.netlify.app",
  },
];

export const projectsFor = (line: ServiceLine) => projects.filter((project) => project.lines.includes(line));
export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
