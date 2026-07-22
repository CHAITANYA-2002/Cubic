import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Monitor, Zap, Search, ArrowLeft, ArrowRight,
  ChevronDown, CheckCircle2, Layers, ShieldCheck, BarChart3, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

function CountUp({ end, suffix = "", prefix = "", decimals = 0 }: { end: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Number(start.toFixed(decimals))); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, decimals]);
  return <span>{prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

function FAQItem({ f, i }: { f: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
      className="overflow-hidden border-b border-white/[0.06] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-6 flex items-center justify-between group">
        <span className="text-sm font-semibold t-secondary group-hover:t-primary transition-colors duration-300 pr-4">{f.q}</span>
        <ChevronDown className={`w-4 h-4 t-ghost shrink-0 transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="pb-6 text-sm t-muted leading-relaxed max-w-lg">{f.a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WebDevelopment() {
  useEffect(() => {
    document.title = "Premium Web Development | Performance Engineering | CubicTech";
  }, []);

  const [activeType, setActiveType] = useState<number | null>(null);
  const [activeTech, setActiveTech] = useState<string>("React");

  const websiteTypes = [
    {
      title: "Corporate Website",
      bestFor: "Established businesses that need a high-authority digital presence to match their market position.",
      goal: "Build trust, clearly communicate services, and convert high-value leads at the first impression.",
      complexity: "Medium",
      timeline: "4–6 Weeks",
      features: ["Professional brand identity system", "Lead capture forms with CRM integration", "Service pages structured for SEO"],
    },
    {
      title: "Landing Page Funnel",
      bestFor: "Product launches, paid campaigns, or offers that demand single-minded conversion focus.",
      goal: "Remove friction and direct every visitor toward one clear, measurable action.",
      complexity: "Low",
      timeline: "2–3 Weeks",
      features: ["Conversion-focused copywriting structure", "A/B testing-ready layout", "Fast-loading, pixel-perfect on mobile"],
    },
    {
      title: "E-commerce Store",
      bestFor: "Brands that are ready to move beyond generic platforms and take full ownership of their customer experience.",
      goal: "Create a shopping journey that converts, retains, and scales without compromise.",
      complexity: "High",
      timeline: "8–12 Weeks",
      features: ["Custom product filtering and catalog", "Secure payment gateway integration", "Order management & inventory logic"],
    },
    {
      title: "SaaS Website",
      bestFor: "Software companies that need to communicate complex value simply and move users from curious to signed-up.",
      goal: "Tell your product story through clear hierarchy, live demos, and a trust architecture that converts.",
      complexity: "Medium",
      timeline: "5–7 Weeks",
      features: ["Feature comparison and pricing sections", "Interactive product walkthroughs", "Auth-gated trial or freemium flows"],
    },
    {
      title: "Custom Platform",
      bestFor: "Businesses with unique operational requirements that no off-the-shelf product can adequately solve.",
      goal: "Automate workflows, manage complex data, and deliver a bespoke experience engineered entirely to your logic.",
      complexity: "Very High",
      timeline: "12+ Weeks",
      features: ["Role-based access control system", "Custom database schema design", "API integrations with third-party services"],
    },
  ];

  const techStack: Record<string, string> = {
    "React": "We use React because it gives us full compositional control — no framework constraints, no opinionated overrides. Just clean, maintainable UI architecture.",
    "Next.js": "Next.js is our deployment standard for any site that demands SEO performance combined with the speed of modern rendering strategies.",
    "Tailwind": "Tailwind enables us to build with extreme precision without the overhead of a bloated CSS framework. Every style is intentional.",
    "Node.js": "Our backend logic runs on Node.js because of its non-blocking I/O model — ideal for APIs under concurrent load.",
    "PostgreSQL": "PostgreSQL provides the relational integrity, query depth, and long-term stability that enterprise-grade data demands.",
  };

  const faqs = [
    { q: "How long does a project typically take?", a: "Timelines depend on scope. Most marketing websites take 4–6 weeks. After your discovery call, we'll provide a precise, itemized project roadmap — not a vague range." },
    { q: "Who owns the code at the end?", a: "You do. Fully, permanently, and without exception. Upon final payment, all source code, assets, and intellectual property transfer entirely to your company." },
    { q: "What happens in the 30 days after launch?", a: "We provide a structured post-launch period covering bug resolution, performance tuning, and small scope adjustments at no additional cost." },
    { q: "Can we add features after the initial build?", a: "Yes — and we engineer for it specifically. Our modular architecture means adding new systems is additive, not disruptive." },
    { q: "Do you offer ongoing maintenance and support?", a: "Yes. Our 'Performance Retainer' covers regular updates, security audits, and conversion testing. It's how most long-term client relationships are structured." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">

          {/* ===== 1. HERO ===== */}
          <section className="pt-40 pb-32 relative overflow-hidden">
            <div className="blob blob-blue w-[600px] h-[600px] -top-48 -right-24 opacity-[0.04]" />
            <div className="container-w relative z-10">
              <Link href="/services">
                <Button variant="ghost" className="mb-10 gap-2 t-muted hover:t-primary hover:bg-secondary/20 rounded-xl text-sm border border-border/20">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Capabilities
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <p className="label mb-10 inline-flex items-center gap-2"><Monitor className="w-4 h-4" /> Web Development</p>
                <h1 className="text-display-hero">
                  Websites that are fast,<br />
                  <span className="text-gradient italic">beautiful, and built to last.</span>
                </h1>
                <p className="text-xl t-muted mb-12 max-w-2xl leading-relaxed font-normal">
                  We engineer digital foundations designed to perform under pressure — generating trust, securing traffic, and producing measurable business outcomes. Nothing decorative. Everything deliberate.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link href="/contact">
                    <Button data-cursor="button" size="lg" className="h-14 px-8 rounded-2xl gap-2 btn-primary text-white border-0 text-base">
                      Start Your Project <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-xs t-deco tracking-widest uppercase font-bold opacity-70">No commitment required</p>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 2. WHO THIS IS FOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Strategic Filter</p>
                  <h2 className="text-4xl md:text-5xl t-primary font-display">Who this is for.</h2>
                </motion.div>
                <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                  className="text-sm t-muted max-w-xs text-right leading-relaxed hidden lg:block">
                  We work with a limited number of clients per quarter — prioritising those where we can make a genuine difference.
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: "Startups launching MVP", desc: "Founders who need a credible digital presence to attract users, partnerships, or early capital. First impressions compound." },
                  { title: "Growing businesses rebranding", desc: "Companies whose existing site no longer reflects the quality of their work — or the market position they've earned." },
                  { title: "E-commerce scaling operations", desc: "Brands ready to invest in a purpose-built store that converts and scales, rather than wrestling with platform constraints." },
                  { title: "Companies replacing legacy infrastructure", desc: "Teams whose current site is a bottleneck — slow, hard to update, and impossible to grow on. Time to rebuild properly." },
                ].map((item, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className="glass-card p-8 flex flex-col gap-4 hover:-translate-y-1.5 transition-transform duration-500 group">
                    <span className="text-[10px] t-deco tracking-widest uppercase font-bold opacity-60">0{i + 1}</span>
                    <h3 className="font-semibold t-primary text-lg leading-snug">{item.title}</h3>
                    <p className="text-sm t-muted leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Micro-transition */}
          <div className="container-w py-2">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="text-center text-xs t-deco tracking-[0.3em] uppercase">
              We don't just build pages. We build performance systems.
            </motion.p>
          </div>

          <div className="divider" />

          {/* ===== 3. WHAT MOST WEBSITES GET WRONG ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 80% 40% at 80% 60%, rgba(var(--primary-raw, 180 130 100), 0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">The Reality</p>
                  <h2 className="text-4xl md:text-5xl t-primary mb-12 font-display">What most websites<br />get wrong.</h2>
                  <ul className="space-y-6">
                    {[
                      { t: "Built for looks, not for load", d: "Heavy animations and unoptimised assets create beautiful pages that nobody waits for." },
                      { t: "SEO treated as an afterthought", d: "A structurally unsound site cannot rank, regardless of how good the content is." },
                      { t: "No defined conversion architecture", d: "Traffic without direction is just noise. Every page needs a purpose and a path." },
                      { t: "Weak content hierarchy", d: "Visitors form a judgement within 3 seconds. Most sites fail to communicate even the basics in that window." },
                      { t: "Unmaintainable backend systems", d: "A site your team can't update without external help is a liability, not an asset." },
                    ].map((item, i) => (
                      <li key={i} className="flex gap-5 items-start">
                        <div className="w-1 h-12 bg-border/40 mt-1 shrink-0 rounded-full" />
                        <div>
                          <h4 className="font-bold t-secondary text-base mb-1.5">{item.t}</h4>
                          <p className="text-sm t-muted leading-relaxed font-medium">{item.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="flex flex-col justify-center">
                  <p className="label mb-4">Our Standard</p>
                  <h2 className="text-3xl t-secondary mb-12 font-display italic">How we build differently.</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Zap, t: "Performance-first architecture", d: "Every technical decision made through the lens of speed and stability. Sub-2.5s load is our floor, not our ceiling." },
                      { icon: BarChart3, t: "Conversion-focused page structure", d: "Pages are designed as conversion systems — with deliberate hierarchy, clear CTAs, and friction minimised throughout." },
                      { icon: Search, t: "SEO-structured from day one", d: "Schema, metadata, semantic HTML, and crawl architecture are built in, not bolted on, at project kickoff." },
                      { icon: Layers, t: "Engineered to scale with you", d: "Modular codebase, documented systems, and clean separation of concerns mean growth never means a rebuild." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-5 p-5 glass-card group hover:bg-secondary/20 transition-all duration-500">
                        <item.icon className="w-5 h-5 t-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-500" />
                        <div>
                          <h4 className="font-semibold t-primary text-sm mb-1">{item.t}</h4>
                          <p className="text-xs t-muted leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Benchmarks - Moved to full-width row for space */}
              <div className="mt-32 pt-20 border-t border-border/20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  {[
                    { v: 99, s: "/100", l: "Lighthouse Score", d: "Near-perfect performance on core vitals." },
                    { v: 250, s: "ms", l: "Server Response", d: "Optimized TTFB for global edge delivery." },
                    { v: 99.9, s: "%", l: "Uptime SLA", d: "Hardened infrastructure with auto-failover." },
                    { v: 0, s: "", l: "Legacy Debt", d: "Zero dependencies on outdated frameworks." },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl font-bold t-primary mb-3 font-display tabular-nums tracking-tight">
                        <CountUp end={stat.v} suffix={stat.s} />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.2em] t-deco font-bold mb-4 opacity-100">{stat.l}</p>
                      <div className="h-px w-8 bg-primary/20 mb-4 mx-auto" />
                      <p className="text-[12px] t-muted leading-relaxed max-w-[180px] font-medium">{stat.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 4. WEBSITE TYPE SELECTOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Engagement Models</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">What are you building?</h2>
                <p className="t-muted text-lg font-light mt-4 max-w-xl leading-relaxed">Select the model that most closely matches your brief — or we'll help you define it on your first call.</p>
              </motion.div>

              <div className="space-y-3">
                {websiteTypes.map((type, i) => (
                  <motion.div
                    key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`overflow-hidden border transition-all duration-500 rounded-3xl ${activeType === i ? "border-border/60 bg-secondary/20 shadow-xl" : "border-border/10 bg-white/[0.01] hover:bg-white/[0.02]"}`}
                  >
                    <button
                      onClick={() => setActiveType(activeType === i ? null : i)}
                      className="w-full text-left px-8 py-7 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] t-deco tracking-widest font-black">0{i + 1}</span>
                        <span className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${activeType === i ? "t-primary" : "t-secondary group-hover:t-primary"}`}>
                          {type.title}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 t-ghost transition-transform duration-500 ${activeType === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {activeType === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-8 pb-8">
                            <div className="h-px bg-border/30 mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold opacity-70">Best For</p>
                                <p className="text-[13px] t-muted leading-relaxed font-medium">{type.bestFor}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold opacity-70">Strategic Goal</p>
                                <p className="text-[13px] t-muted leading-relaxed font-medium">{type.goal}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold opacity-70">Typical Features</p>
                                <ul className="space-y-2">
                                  {type.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-[12px] t-muted font-medium">
                                      <CheckCircle2 className="w-3 h-3 t-deco shrink-0 opacity-70" />{f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold opacity-70">Complexity / Timeline</p>
                                <p className="text-base t-primary font-bold">{type.complexity}</p>
                                <p className="text-xs t-secondary mt-1 font-semibold tracking-wide">{type.timeline}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 5. PROJECT SCALE EXAMPLES ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(180,130,100,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20">
                <p className="label mb-4 mx-auto">Strategic Framework</p>
                <h2 className="text-4xl t-primary font-display">Project Scale Examples.</h2>
                <p className="t-muted text-base font-light mt-4 leading-relaxed">
                  Each scale level represents a depth of capability — not a price tier. We scope to your actual requirements.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    tag: "Foundation",
                    title: "Essential Build",
                    sub: "For businesses launching or validating their digital presence.",
                    points: ["Responsive, fast-loading pages", "Core SEO architecture", "CMS for self-managed content", "Lead capture integration"],
                    icon: CheckCircle2,
                    featured: false,
                  },
                  {
                    tag: "Scaling",
                    title: "Growth Platform",
                    sub: "For companies expanding their digital operations with deeper integration needs.",
                    points: ["Advanced analytics setup", "Payment and API integrations", "Multilingual or multi-region ready", "Custom permission structures"],
                    icon: Zap,
                    featured: true,
                  },
                  {
                    tag: "Infrastructure",
                    title: "Enterprise System",
                    sub: "For organisations requiring hardened, scalable, security-critical architecture.",
                    points: ["Role-based access control", "Global CDN infrastructure", "Security hardening and auditing", "Load balancing and uptime SLA"],
                    icon: ShieldCheck,
                    featured: false,
                  },
                ].map((item, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`glass-card p-10 flex flex-col relative overflow-hidden ${item.featured ? "ring-1 ring-white/10 shadow-xl" : ""}`}
                    style={item.featured ? { background: "linear-gradient(135deg, rgba(180,130,100,0.06) 0%, rgba(255,255,255,0.01) 100%)" } : {}}
                  >
                    {/* Subtle top glow line for featured */}
                    {item.featured && (
                      <div className="absolute top-0 inset-x-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(180,130,100,0.6) 50%, transparent 100%)" }} />
                    )}
                    {/* Badge — clearly visible, inside card flow */}
                    {item.featured && (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
                          style={{ background: "rgba(180,130,100,0.15)", border: "1px solid rgba(180,130,100,0.4)", color: "rgba(220,180,150,0.9)" }}>
                          ✦ Most Common
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.25em] t-deco font-bold mb-5">{item.tag}</span>
                    <item.icon className={`w-8 h-8 mb-5 ${item.featured ? "t-secondary" : "t-ghost"}`} />
                    <h3 className="text-2xl font-bold t-primary mb-2 font-display">{item.title}</h3>
                    <p className="text-sm t-muted leading-relaxed mb-8">{item.sub}</p>
                    <div className="h-px bg-border/40 mb-6" />
                    <ul className="space-y-3 flex-1">
                      {item.points.map((pt, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm t-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 t-deco shrink-0" /> {pt}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 6. SCOPE & CAPABILITIES ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-1">
                  <p className="label mb-4">Deliverables</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Scope &<br />Capabilities.</h2>
                  <p className="t-muted text-sm leading-relaxed font-medium">
                    Every build starts with a strong technical foundation. We layer advanced systems based on your actual requirements — not assumptions.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
                  {[
                    { name: "Core", items: ["Responsive Design", "SEO Foundation", "CMS Integration", "Performance Optimisation"], color: "t-ghost" },
                    { name: "Advanced", items: ["Multilingual Support", "Payment Integration", "Custom Dashboard", "Animation System", "API Integrations"], color: "t-secondary" },
                    { name: "Enterprise", items: ["Role-Based Access", "Global CDN Setup", "Security Hardening", "Load Balancing", "Real-time Monitoring"], color: "t-primary" },
                  ].map((col, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp}>
                      <h3 className={`text-xl font-bold mb-10 ${col.color}`}>{col.name}</h3>
                      <ul className="space-y-6">
                        {col.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full shrink-0" />
                            <span className="text-sm t-muted font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Micro-transition */}
          <div className="container-w py-2">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="text-center text-xs t-deco tracking-[0.3em] uppercase">
              Every metric is engineered from day one — not chased after launch.
            </motion.p>
          </div>

          <div className="divider" />

          {/* ===== 7. PERFORMANCE AUTHORITY ===== */}
          <section className="py-32 relative" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(180,130,100,0.05) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-24">
                <p className="label mb-4 mx-auto">Technical Authority</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">
                  Benchmarks we engineer for —<br /><span className="t-secondary italic">not afterthoughts.</span>
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {[
                  { label: "Lighthouse Score", value: 90, suffix: "+", note: "Speed, SEO strength, and technical credibility — all in one number." },
                  { label: "Initial Load Time", value: 2.5, suffix: "s", prefix: "<", note: "First contentful paint under 2.5 seconds. Abandonment drops sharply above this." },
                  { label: "SEO Audit Score", value: 100, suffix: "", note: "Correct schema, canonical tags, metadata, and semantic structure — always." },
                  { label: "Core Web Vitals", value: 0, suffix: " Passed", note: "Layout stability, input delay, and load performance validated across all pages." },
                ].map((stat, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    custom={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="text-6xl md:text-8xl font-bold font-display text-gradient mb-3 tracking-tight">
                      {stat.value === 0 ? "✓" : <><CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} /></>}
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] t-deco font-bold mb-3">{stat.label}</p>
                    <p className="text-xs t-muted leading-relaxed max-w-[160px]">{stat.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 8. TECH STACK ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Technical Choices</p>
                  <h2 className="text-4xl t-primary font-display mb-4">Technology we use —</h2>
                  <h2 className="text-4xl text-gradient italic font-display mb-10">and why we chose it.</h2>
                  <p className="t-muted text-sm leading-relaxed mb-10 max-w-sm">
                    We don't have a fixed stack. We have considered defaults — chosen because they consistently produce the best outcomes for the types of products we build.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(techStack).map((tech) => (
                      <button
                        key={tech} onClick={() => setActiveTech(tech)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-500 border ${activeTech === tech
                          ? "bg-primary/10 border-primary/40 t-secondary"
                          : "bg-transparent border-white/[0.06] t-muted hover:border-white/[0.12] hover:t-primary"
                          }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-12 min-h-[200px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeTech}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h4 className="text-gradient italic font-display text-3xl mb-4">{activeTech}</h4>
                        <div className="h-px bg-white/[0.06] mb-4" />
                        <p className="t-muted text-base leading-relaxed">
                          {techStack[activeTech]}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 9. CASE SNAPSHOT ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-20">
                <p className="label mb-4">Evidence</p>
                <h2 className="text-4xl t-primary font-display">We measure success by outcomes,</h2>
                <h2 className="text-4xl text-gradient italic font-display">not deliverables.</h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    {
                      label: "The Situation",
                      content: "A Jaipur-based luxury real estate firm with an established offline reputation had built a digital presence that actively undermined their brand. High-resolution video assets loaded at 8+ seconds. On mobile, the experience broke entirely."
                    },
                    {
                      label: "The Challenge",
                      content: "Their audience — ultra-high-net-worth buyers — made decisions on first impression. A slow, dated website was losing qualified enquiries before a single word was read."
                    },
                    {
                      label: "What We Changed",
                      content: "We rebuilt the site on a headless Next.js architecture with edge-optimised media delivery, a bespoke property search engine, and a mobile-first experience designed for discerning users."
                    },
                  ].map((block, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                      className="glass-card p-8">
                      <p className="text-[10px] uppercase tracking-[0.25em] t-deco mb-3 font-bold">{block.label}</p>
                      <p className="text-sm t-muted leading-relaxed">{block.content}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp}
                  className="glass-card p-12 flex flex-col justify-center ring-1 ring-primary/15 relative overflow-hidden"
                  style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(180,130,100,0.04) 0%, transparent 80%)" }}
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] t-secondary mb-6 font-bold">The Outcome</p>
                  <div className="text-6xl md:text-8xl font-bold font-display text-gradient mb-4 tracking-tight">214%</div>
                  <h4 className="text-xl t-primary font-semibold mb-4">Increase in direct enquiries</h4>
                  <p className="text-sm t-muted leading-relaxed mb-8">Within 60 days of launch, measured against the prior 60-day baseline.</p>
                  <div className="h-px bg-white/[0.06] mb-6" />
                  <div className="space-y-3">
                    {[
                      "Lighthouse score improved from 41 → 96",
                      "Mobile session duration ×3",
                      "Bounce rate reduced by 58%",
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs t-muted">
                        <CheckCircle2 className="w-3.5 h-3.5 t-secondary shrink-0" /> {stat}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 10. CONSULTATIVE FAQ ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
                  className="lg:col-span-2">
                  <p className="label mb-4">Transparency</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Common questions,<br /><span className="italic t-secondary">direct answers.</span></h2>
                  <p className="t-muted text-sm leading-relaxed">
                    We prioritise honest conversation over polished sales copy. These are the questions serious clients usually ask before committing.
                  </p>
                </motion.div>
                <div className="lg:col-span-3">
                  {faqs.map((f, i) => <FAQItem key={i} f={f} i={i} />)}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== 11. FINAL STRATEGIC CTA ===== */}
          <section className="py-44 relative">
            <div className="blob blob-blue w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" />
            <div className="container-w grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-6">Start Here</p>
                <h2 className="text-4xl md:text-5xl font-bold t-primary font-display mb-6">
                  Let's map your<br /><span className="text-gradient italic">website properly.</span>
                </h2>
                <p className="text-lg t-muted font-light leading-relaxed max-w-md">
                  We explore your goals, audience, and requirements before recommending any scope. No assumptions. No upselling. Just a structured conversation that produces clarity.
                </p>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="flex flex-col gap-4 lg:items-start">
                <Link href="/contact">
                  <Button data-cursor="button" size="lg"
                    className="h-14 px-10 rounded-2xl gap-2 btn-primary text-white border-0 text-base shadow-xl shadow-primary/20 w-full sm:w-auto">
                    Book a Strategy Call <MessageSquare className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button data-cursor="button" variant="ghost" size="lg"
                    className="h-14 px-8 rounded-2xl gap-2 border border-border/40 hover:bg-secondary/10 hover:border-border/60 transition-all duration-500 w-full sm:w-auto t-muted hover:t-primary">
                    Request a Detailed Proposal <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-[10px] t-deco tracking-widest uppercase mt-2 font-bold opacity-60">Typically respond within 4 hours</p>
              </motion.div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
