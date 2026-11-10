import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BrainCircuit, CheckCircle2, FileText, Globe, LayoutDashboard,
  Layout, Megaphone, Monitor, Receipt, UserRound, Wrench, type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { PageMeta } from "@/components/PageMeta";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projects, type Project } from "@/data/work";

type Service = {
  icon: LucideIcon;
  title: string;
  href: string;
  forWho: string;
  outcome: string;
  includes: string[];
  // Starting points mirror the rate card on /pricing.
  from: string;
  proof: string[];
};

const services: Service[] = [
  {
    icon: Monitor, title: "Websites", href: "/services/web-development",
    forWho: "Businesses whose site is old, slow or not bringing enquiries.",
    outcome: "A fast, credible website that explains what you sell and turns visitors into calls and enquiries.",
    includes: ["Copy and page structure planned with you", "Mobile-first design and build", "SEO foundation, analytics and enquiry forms", "A CMS so your team can edit it"],
    from: "From ₹60,000", proof: ["mani-doro", "superfox-roam"],
  },
  {
    icon: Globe, title: "Web applications", href: "/services/web-applications",
    forWho: "Teams running work on WhatsApp, Excel and copy-paste.",
    outcome: "Custom software for the way your business actually runs: bookings, dashboards, portals and internal tools.",
    includes: ["Logins, roles and permissions", "Database, APIs and integrations", "Dashboards and admin panels", "Deployment, backups and handover docs"],
    from: "From ₹4,00,000", proof: ["helix-analytics", "superfox-roam"],
  },
  {
    icon: BrainCircuit, title: "AI agents & automation", href: "/services/ai-solutions",
    forWho: "Anyone with repetitive work: replying, qualifying, drafting, sorting.",
    outcome: "AI that takes the repetitive work off your team, with a human approving anything that matters.",
    includes: ["Booking and support agents", "Lead qualification and follow-up", "Document and email drafting", "Guardrails, approvals and audit logs"],
    from: "From ₹2,00,000", proof: ["aria-frontdesk", "flowops-sdr"],
  },
  {
    icon: Megaphone, title: "Digital marketing systems", href: "/services/digital-marketing",
    forWho: "Businesses whose traffic or leads have gone flat.",
    outcome: "The systems that bring in and follow up leads: SEO, outreach and lifecycle email that runs every day.",
    includes: ["Technical SEO and landing pages", "Outbound email sequences", "Lifecycle and re-engagement email", "Tracking so you see what works"],
    from: "Quoted after a free call", proof: ["flowops-sdr", "northwind-lifecycle"],
  },
  {
    icon: Layout, title: "UI/UX design", href: "/services/ui-ux-design",
    forWho: "Products that work but feel confusing to use.",
    outcome: "Clear flows and a design system your developers can build from, tested before any code is written.",
    includes: ["User flows and wireframes", "Clickable prototypes", "Design system and components", "Review of what ships"],
    from: "From ₹1,50,000", proof: ["aria-frontdesk"],
  },
  {
    icon: Wrench, title: "Care plan & support", href: "/services/maintenance",
    forWho: "Anyone who owns software and has no one to look after it.",
    outcome: "Someone accountable for keeping your site or app running, patched and improving every month.",
    includes: ["Uptime and error monitoring", "Security patches and updates", "Small changes every month", "Agreed response time"],
    from: "From ₹40,000 / month", proof: [],
  },
];

const promises: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: FileText, title: "Fixed price, in writing", text: "Scope, exclusions, timeline and one number agreed before work starts." },
  { icon: LayoutDashboard, title: "Your own project portal", text: "Milestones, weekly updates and every invoice on one private link." },
  { icon: Receipt, title: "Pay by milestone", text: "40% to start, 30% at the midpoint, 30% on delivery. Proper numbered invoices." },
  { icon: UserRound, title: "Talk to the builder", text: "You deal directly with the person designing and building your project." },
];

const steps = [
  { title: "Discovery call", text: "30 minutes, free. We understand the problem and show you the closest thing we've built." },
  { title: "Written proposal", text: "Fixed price, deliverables, exclusions and dates. Nothing starts until you sign." },
  { title: "Build in milestones", text: "You see progress in your portal every week, and test each milestone before paying for the next." },
  { title: "Launch and handover", text: "Deployed, documented, and handed over with every login. Optional care plan after." },
];

const rise = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }) };

const bySlug = (slug: string) => projects.find((project) => project.slug === slug);

function ProofLinks({ slugs }: { slugs: string[] }) {
  const items = slugs.map(bySlug).filter((project): project is Project => Boolean(project));
  if (items.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="text-xs uppercase tracking-[0.15em] t-deco">See it live</span>
      {items.map((project) => (
        <a key={project.slug} href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 t-secondary underline decoration-white/20 underline-offset-4 hover:t-primary">
          {project.name.split(" — ")[0]} <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  return (
    <motion.article
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={rise} custom={0}
      className="grid gap-8 border-t border-white/[0.08] py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
    >
      <div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs t-deco">0{index + 1}</span>
          <service.icon className="h-5 w-5" style={{ color: "var(--accent-primary)" }} />
        </div>
        <h3 className="mt-4 font-display text-3xl t-primary md:text-4xl">{service.title}</h3>
        <p className="mt-3 text-sm t-muted">{service.forWho}</p>
        <p className="mt-6 font-display text-xl t-primary">{service.from}</p>
      </div>
      <div>
        <p className="text-lg leading-relaxed t-secondary">{service.outcome}</p>
        <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {service.includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm t-secondary"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 t-deco" />{item}</li>
          ))}
        </ul>
        <ProofLinks slugs={service.proof} />
        <Link href={service.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold t-primary hover:underline">
          How we deliver {service.title.toLowerCase()} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function Services() {
  const featured = ["superfox-roam", "aria-frontdesk", "helix-analytics"].map(bySlug).filter((project): project is Project => Boolean(project));

  return (
    <PageTransition>
      <PageMeta title="Services" description="Websites, web applications, AI agents and digital marketing systems — fixed-price, built in milestones, with live work you can open." />
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <section className="relative overflow-hidden pb-16 pt-44">
            <div className="container-w relative z-10">
              <motion.p initial="hidden" animate="visible" variants={rise} custom={0} className="label mb-6">Services</motion.p>
              <motion.h1 initial="hidden" animate="visible" variants={rise} custom={1} className="max-w-4xl font-display text-5xl leading-[1.02] t-primary md:text-7xl">
                Websites, software and AI <span className="italic text-gradient">that do real work.</span>
              </motion.h1>
              <motion.p initial="hidden" animate="visible" variants={rise} custom={2} className="mt-7 max-w-2xl text-lg leading-relaxed t-muted">
                We design and build the website your customers see and the systems your team runs on. Every engagement is fixed-price, delivered in milestones, and backed by work you can open right now.
              </motion.p>
              <motion.div initial="hidden" animate="visible" variants={rise} custom={3} className="mt-10 flex flex-wrap gap-4">
                <Link href="/work" className="btn-primary inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-semibold text-white">
                  See live work <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-7 py-4 font-semibold t-primary hover:bg-white/[0.04]">
                  Book a discovery call
                </Link>
              </motion.div>
            </div>
          </section>

          <section className="border-y border-white/[0.06] py-10">
            <div className="container-w grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {promises.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                  <div>
                    <p className="text-sm font-semibold t-primary">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed t-muted">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-pad">
            <div className="container-w">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <h2 className="font-display text-4xl t-primary md:text-5xl">What we do</h2>
                <Link href="/pricing" className="text-sm t-muted hover:t-primary">Full rate card →</Link>
              </div>
              {services.map((service, index) => <ServiceRow key={service.title} service={service} index={index} />)}
            </div>
          </section>

          <section className="section-pad border-t border-white/[0.06]">
            <div className="container-w">
              <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="label mb-4">Recent work</p>
                  <h2 className="font-display text-4xl t-primary md:text-5xl">Click through it yourself.</h2>
                </div>
                <Link href="/work" className="inline-flex items-center gap-1.5 text-sm font-semibold t-primary hover:underline">All {projects.length} projects <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {featured.map((project) => <ProjectCard key={project.slug} project={project} />)}
              </div>
            </div>
          </section>

          <section className="section-pad border-t border-white/[0.06]">
            <div className="container-w">
              <p className="label mb-4">How a project runs</p>
              <h2 className="max-w-2xl font-display text-4xl t-primary md:text-5xl">No black boxes. You see every step.</h2>
              <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                  <li key={step.title}>
                    <span className="font-mono text-sm t-deco">0{index + 1}</span>
                    <p className="mt-3 text-lg font-semibold t-primary">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed t-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="pb-28">
            <div className="container-w">
              <div className="glass-card flex flex-col items-start justify-between gap-8 p-10 md:flex-row md:items-center md:p-14">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl t-primary md:text-4xl">Not sure which one you need?</h2>
                  <p className="mt-3 t-muted">Tell us what's slowing the business down. In 30 minutes you'll know what to build, what it costs, and what to leave alone.</p>
                </div>
                <Link href="/contact" className="btn-primary inline-flex shrink-0 items-center gap-2 rounded-2xl px-7 py-4 font-semibold text-white">
                  Book a free call <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
