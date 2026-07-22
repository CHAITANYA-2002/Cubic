import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Particles } from "@/components/Particles";
import { HeroObject } from "@/components/HeroObject";
import { TiltCard } from "@/components/MouseTracker";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Boxes,
  BrainCircuit,
  Wrench,
  Compass,
  Building2,
  Gauge,
  HeartHandshake,
  Search,
  PenTool,
  Code2,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Clock,
} from "lucide-react";

const industries = ["SaaS", "Fintech", "E-commerce", "Real Estate", "Healthcare", "Internal Systems"];

const capabilities = [
  {
    icon: Globe,
    title: "Growth Websites",
    audience: "Series A+ startups & established brands.",
    desc: "We don't build generic sites. We engineer growth engines that generate trust and secure high-value clients.",
    focus: ["Conversion Strategy", "High-Fidelity UI", "Technical SEO", "Speed Optimization"],
    scope: "8–12 weeks",
    stack: "React / Next.js, Framer Motion, Tailwind",
  },
  {
    icon: Boxes,
    title: "SaaS Platforms",
    audience: "Product founders & enterprise teams.",
    desc: "Full-cycle product engineering. We turn complex requirements into clean, scalable, production-grade software.",
    focus: ["Multi-tenant Architecture", "Dashboard Systems", "Subscription Logic", "Scalability Engineering"],
    scope: "12–24 weeks",
    stack: "Node.js, PostgreSQL, Cloud Infra, React",
  },
  {
    icon: BrainCircuit,
    title: "AI & Automation Systems",
    audience: "Efficiency-focused companies.",
    desc: "AI integrated as core infrastructure — not a gimmick. Automate high-friction processes with secure, private systems.",
    focus: ["LLM Integration", "Workflow Automation", "Predictive Models", "Custom RAG Systems"],
    scope: "6–16 weeks",
    stack: "Python, OpenAI/Anthropic, Vector DBs, LangChain",
  },
  {
    icon: Wrench,
    title: "Internal Business Tools",
    audience: "Operationally complex organizations.",
    desc: "Tools designed to solve internal friction. We streamline operations by building software that fits your workflow.",
    focus: ["Custom CRMs", "Operational Dashboards", "Inventory Systems", "Legacy Integrations"],
    scope: "8–20 weeks",
    stack: "Modern Full-stack, Secure APIs, Cloud Sync",
  },
];

const dna = [
  { icon: Compass, title: "Strategy before execution", desc: "No code is written without a deep understanding of the problem space and the target outcome." },
  { icon: Building2, title: "Architecture before UI", desc: "We build solid foundations first. A beautiful interface on a weak system is a liability, not an asset." },
  { icon: Gauge, title: "Performance before polish", desc: "Speed and reliability are non-negotiable. Polish is the final layer on an already high-performing machine." },
  { icon: HeartHandshake, title: "Long-term partnership", desc: "We think in years, not sprints. Our goal is to be the technical foundation of your growth." },
];

const lifecycle = [
  { icon: Search, label: "Discovery" },
  { icon: PenTool, label: "Design" },
  { icon: Code2, label: "Engineering" },
  { icon: Cpu, label: "AI Integration" },
  { icon: TrendingUp, label: "Scale & Optimization" },
];

const expertise = [
  { group: "Design & Experience", items: ["UI/UX Systems", "Design Systems", "Product Research"] },
  { group: "Engineering & Platforms", items: ["Web Applications", "SaaS Architecture", "DevOps"] },
  { group: "AI & Automation", items: ["LLM Integration", "Workflow Automation", "Custom RAG Systems"] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="relative bg-background text-foreground">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
        <Particles count={60} />
        <HeroObject />
        <div className="ct-grid" />

        <div className="container-width relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="max-w-4xl">
            <span className="ct-eyebrow mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d6a77a]" />
              CUBICTECH — GLOBAL SYSTEMS STUDIO
            </span>

            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <span className="text-white">Where digital systems</span>
              <br />
              <span className="ct-gradient-text">meet human intelligence.</span>
            </h1>

            <p className="mt-8 text-lg text-white/60 max-w-2xl leading-relaxed">
              We design, engineer, and scale high-performance Machine Learning platforms,
              Data Analytics systems, and AI-driven products for teams that refuse to settle.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="ct-btn-primary" data-cursor="button">
                Book Strategy Call <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="ct-btn-ghost" data-cursor="button">
                View Capabilities <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="mt-8 text-sm text-white/40">
              Serving startups, funded teams, and growth-stage companies globally.
            </p>
          </motion.div>
        </div>

        {/* fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="relative z-10 border-y border-white/5 py-8">
        <div className="container-width flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <span className="text-xs uppercase tracking-[0.2em] text-white/35 shrink-0">
            CubicTech systems built for:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {industries.map((i) => (
              <span key={i} className="ct-chip">{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="relative z-10 section-padding">
        <div className="container-width">
          <Reveal>
            <span className="ct-eyebrow">Capabilities</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
              We don't build pages.{" "}
              <span className="text-white/40">We build digital systems.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {capabilities.map((c, idx) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.title} delay={idx * 0.05}>
                  <TiltCard className="group ct-card p-8 h-full overflow-hidden" glowColor="rgba(120,150,255,0.18)">
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between">
                        <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#9db4ff]">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="ct-chip">
                          <Clock className="w-3 h-3" /> {c.scope}
                        </span>
                      </div>

                      <h3 className="mt-6 text-2xl font-bold text-white">{c.title}</h3>
                      <p className="mt-1 text-sm text-[#d6a77a]">{c.audience}</p>
                      <p className="mt-4 text-sm text-white/55 leading-relaxed">{c.desc}</p>

                      <div className="mt-6 grid grid-cols-2 gap-2">
                        {c.focus.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-xs text-white/70">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#7896ff] shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-6">
                        <div className="ct-hairline mb-4" />
                        <p className="text-[11px] uppercase tracking-widest text-white/30">Engineering stack</p>
                        <p className="mt-1 text-sm text-white/70">{c.stack}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= OUR DNA ================= */}
      <section className="relative z-10 section-padding border-t border-white/5">
        <div className="container-width">
          <Reveal>
            <span className="ct-eyebrow">Our DNA</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
              Built with clarity. <span className="ct-gradient-text">Scaled with intent.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-white/55">
              We don't just write code — we architect systems. Every decision is weighed against
              performance, durability, and the outcome it drives.
            </p>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dna.map((d, idx) => {
              const Icon = d.icon;
              return (
                <Reveal key={d.title} delay={idx * 0.05}>
                  <div className="ct-card p-6 h-full">
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-[#9db4ff]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{d.title}</h3>
                    <p className="mt-2 text-sm text-white/50 leading-relaxed">{d.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SYSTEMS LIFECYCLE ================= */}
      <section className="relative z-10 section-padding border-t border-white/5">
        <div className="container-width">
          <Reveal>
            <span className="ct-eyebrow">Systems Lifecycle</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white/80 max-w-2xl">
              Every system we build follows this lifecycle — from clarity to scale.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {lifecycle.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.label} delay={idx * 0.06}>
                  <div className="ct-card p-6 h-full flex flex-col items-center text-center gap-3">
                    <span className="text-xs font-mono text-white/30">0{idx + 1}</span>
                    <div className="grid place-items-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[#9db4ff]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-white">{s.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= EXPERTISE ================= */}
      <section className="relative z-10 section-padding border-t border-white/5">
        <div className="container-width">
          <Reveal>
            <span className="ct-eyebrow">Expertise</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
              Full-spectrum <span className="ct-gradient-text">capabilities.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {expertise.map((e, idx) => (
              <Reveal key={e.group} delay={idx * 0.05}>
                <div className="ct-card p-8 h-full">
                  <h3 className="text-lg font-semibold text-white">{e.group}</h3>
                  <ul className="mt-5 space-y-3">
                    {e.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-sm text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7896ff]" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 section-padding">
        <div className="container-width">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-10 sm:p-16 text-center">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(60rem 30rem at 50% -20%, rgba(120,150,255,0.18), transparent 60%)" }}
                aria-hidden
              />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  Let's engineer your next system.
                </h2>
                <p className="mt-5 max-w-xl mx-auto text-white/55">
                  Book a strategy call and we'll map the fastest path from idea to a scalable,
                  production-grade product.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="ct-btn-primary" data-cursor="button">
                    Book Strategy Call <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/services" className="ct-btn-ghost" data-cursor="button">
                    Explore Capabilities <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
