// Live work shown on /work, the home page and service pages.
// Rule (firm/COMPANY.md): only real builds, labelled honestly. A "Product demo" runs on sample
// data with placeholder brands; never present one as a paying client or quote its sample numbers.

export type ServiceLine = "websites" | "apps" | "ai" | "marketing";

export const SERVICE_LINES: Array<{ id: ServiceLine; label: string; href: string }> = [
  { id: "websites", label: "Websites", href: "/services/web-development" },
  { id: "apps", label: "Web apps", href: "/services/web-applications" },
  { id: "ai", label: "AI & automation", href: "/services/ai-solutions" },
  { id: "marketing", label: "Digital marketing", href: "/services/digital-marketing" },
];

export type Project = {
  slug: string;
  name: string;
  kind: "Client build" | "Product demo" | "Concept build";
  sector: string;
  lines: ServiceLine[];
  summary: string;
  problem: string;
  built: string[];
  stack: string[];
  image: string;
  liveUrl: string;
  /** What to click first when showing it to a prospect. */
  tryThis: string;
};

export const projects: Project[] = [
  {
    slug: "superfox-roam",
    name: "Superfox Roam",
    kind: "Client build",
    sector: "Travel",
    lines: ["websites", "apps", "ai", "marketing"],
    summary: "A complete travel business online: packages, an AI trip planner, bookings and payments, and the back office that runs it.",
    problem: "A travel company needed one platform that sells holidays online and gives its sales team a place to work every enquiry.",
    built: [
      "Public website with 30 searchable holiday packages and a travel blog",
      "AI trip planner that drafts a day-by-day itinerary in about two minutes",
      "Online booking, payments and a customer account",
      "Sales workspace and admin console with roles",
      "SEO pre-rendering so every package page can rank",
    ],
    stack: ["React", "TypeScript", "Node API", "PostgreSQL", "Vercel"],
    image: "/images/work/superfox-roam.jpg",
    liveUrl: "https://on-trip-holidays.vercel.app",
    tryThis: "Open the AI Planner from the top menu and ask for a 5-day Kerala trip.",
  },
  {
    slug: "aria-frontdesk",
    name: "Aria — AI front desk",
    kind: "Product demo",
    sector: "Clinics & med spas",
    lines: ["ai", "marketing"],
    summary: "An AI receptionist that books appointments around the clock, fills last-minute cancellations and follows up with leads that went quiet.",
    problem: "Clinics lose bookings after hours and to no-shows, and nobody has time to chase old enquiries.",
    built: [
      "Chat agent that books, reschedules and answers questions",
      "Automatic waitlist offers when a slot is cancelled",
      "Re-engagement messages for leads that never booked",
      "Owner dashboard with the week's calendar and what the agent did",
    ],
    stack: ["Next.js", "TypeScript", "Agent engine"],
    image: "/images/work/aria-frontdesk.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/aria/demo/",
    tryThis: "Chat with Aria as a patient and book a treatment, then open the Owner Dashboard.",
  },
  {
    slug: "flowops-sdr",
    name: "FlowOps — AI sales outreach agent",
    kind: "Product demo",
    sector: "B2B sales",
    lines: ["ai", "marketing"],
    summary: "An AI sales development rep that researches prospects, writes personal outreach, follows up and books meetings for a human to close.",
    problem: "Founders know outbound works but cannot spend hours a day researching, writing and following up.",
    built: [
      "Prospect research and fit scoring",
      "Personalised multi-step email sequences",
      "Reply classification: interested, objection, not now, referral",
      "11 deliverability and compliance checks before every send",
    ],
    stack: ["TypeScript", "LLM prompts", "Rules engine"],
    image: "/images/work/flowops-sdr.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/sdr-email-agent-demo/sdr-client-demo.html",
    tryThis: "Open “The outreach” tab to see a researched prospect and the email written for them.",
  },
  {
    slug: "northwind-lifecycle",
    name: "Northwind — lifecycle email agent",
    kind: "Product demo",
    sector: "Lending & finance",
    lines: ["ai", "marketing"],
    summary: "An email agent for a lender that writes the right message at every stage, from first enquiry to win-back, with a human approving each send.",
    problem: "Regulated businesses need timely customer emails but cannot risk a single non-compliant message.",
    built: [
      "Seven lifecycle stages mapped end to end",
      "10-check compliance gate before anything is sent",
      "One-click human approval with the reasoning shown",
      "Guided five-minute walkthrough for decision makers",
    ],
    stack: ["HTML", "JavaScript", "Data validation"],
    image: "/images/work/northwind-lifecycle.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/finance-email-agent-demo/client-demo.html",
    tryThis: "Start the guided client walkthrough and click through the five decisions.",
  },
  {
    slug: "helix-analytics",
    name: "Helix — revenue dashboard",
    kind: "Product demo",
    sector: "SaaS & subscriptions",
    lines: ["apps"],
    summary: "One dashboard for a subscription business: revenue, customers, sales pipeline, invoices, email and live chat.",
    problem: "Founders check five tools to answer “how are we doing this month?”.",
    built: [
      "Revenue and customer metrics with date ranges and comparisons",
      "Multi-pipeline CRM and lead inbox",
      "Invoicing, trials and billing views in USD and INR",
      "Email and live chat operations in the same app",
    ],
    stack: ["React", "Vite", "Tailwind"],
    image: "/images/work/helix-analytics.jpg",
    liveUrl: "https://chaitanya-2002.github.io/client-work/helix/",
    tryThis: "Switch the billing filter and currency, then open Pipeline Demo.",
  },
  {
    slug: "mani-doro",
    name: "Mani D'Oro — jewellery storefront",
    kind: "Concept build",
    sector: "D2C retail",
    lines: ["websites"],
    summary: "A luxury storefront for handmade gold jewellery, designed to feel like a boutique rather than a marketplace.",
    problem: "High-value products need a site that earns trust before the customer ever speaks to the seller.",
    built: [
      "Editorial product pages with swipeable gallery and zoom",
      "Cart drawer with sizes and live subtotal",
      "One-tap WhatsApp enquiry with the product details filled in",
      "Bespoke commission request form",
    ],
    stack: ["React", "TypeScript", "Netlify"],
    image: "/images/work/mani-doro.jpg",
    liveUrl: "https://mdoro.netlify.app",
    tryThis: "Open any piece, swipe the gallery, then tap the WhatsApp enquiry button.",
  },
];

export const projectsFor = (line: ServiceLine) => projects.filter((project) => project.lines.includes(line));

export type Testimonial = { quote: string; name: string; role: string; company: string };

// Real, approved quotes only. The section stays hidden while this is empty.
export const testimonials: Testimonial[] = [];
