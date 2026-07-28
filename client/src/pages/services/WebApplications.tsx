import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Globe, ArrowLeft, ArrowRight, ChevronDown,
  CheckCircle2, MessageSquare, ShieldCheck, Zap, Database, Cloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

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

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

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

export default function WebApplications() {
  useEffect(() => {
    document.title = "Custom SaaS & Web Application Engineering | CubicTech";
  }, []);

  const [activeType, setActiveType] = useState<number | null>(null);
  const [activeTech, setActiveTech] = useState<string>("Next.js");

  const appTypes = [
    {
      title: "SaaS Platform",
      bestFor: "Multi-tenant software products that require high availability and sub-second performance.",
      goal: "Build a secure, scalable foundation that handles user growth and complex permission logic.",
      complexity: "Critical",
      timeline: "10–16 Weeks",
      features: ["Multi-tenant architecture", "Subscription & Billing logic", "Role-based access (RBAC)"],
    },
    {
      title: "Marketplace / E-commerce",
      bestFor: "High-transaction platforms connecting buyers and sellers with real-time data needs.",
      goal: "Zero-friction transactions, robust search/filtering, and high-concurrency order processing.",
      complexity: "High",
      timeline: "8–12 Weeks",
      features: ["Payment gateway integration", "Real-time inventory sync", "Vendor management systems"],
    },
    {
      title: "Custom ERP / CRM",
      bestFor: "Internal operations tools that need to replace legacy spreadsheets with structured logic.",
      goal: "Centralise data, automate manual workflows, and provide actionable business intelligence.",
      complexity: "High",
      timeline: "7–11 Weeks",
      features: ["Custom data model architecture", "Third-party API sync", "Advanced reporting dashboards"],
    },
    {
      title: "Fintech / Payments",
      bestFor: "Applications handling sensitive financial data and high-security transaction volumes.",
      goal: "Uncompromising security, full audit logs, and deterministic financial calculations.",
      complexity: "Critical",
      timeline: "12+ Weeks",
      features: ["PCI-compliant integrations", "Double-entry ledger systems", "Fraud detection layers"],
    },
    {
      title: "Internal Operations Tool",
      bestFor: "Workflow automation systems designed for specific department-level efficiency.",
      goal: "Reduce operational overhead by automating repetitive data entry and approval loops.",
      complexity: "Medium",
      timeline: "5–8 Weeks",
      features: ["SSO / Enterprise Auth", "Process automation hooks", "Bulk data processing"],
    },
  ];

  const engagementModels = [
    {
      tag: "Foundation",
      title: "Core Application",
      sub: "For businesses building their first structured digital product.",
      points: ["Full-stack web application", "User authentication system", "Database schema design", "Admin dashboard"],
      icon: Globe,
      featured: false,
    },
    {
      tag: "Scaling",
      title: "Integrated Platform",
      sub: "For scaling businesses needing multi-system integration and deeper logic.",
      points: ["Multi-role access control", "Third-party API integrations", "Analytics pipeline", "Automated workflows"],
      icon: Zap,
      featured: true,
    },
    {
      tag: "Infrastructure",
      title: "Enterprise System",
      sub: "For organisations with complex requirements, compliance, and scale.",
      points: ["Microservices architecture", "SSO and enterprise auth", "Multi-region deployment", "SLA-backed support"],
      icon: Database,
      featured: false,
    },
  ];

  const techStack: Record<string, string> = {
    "Next.js": "Our standard for production-grade web applications. It provides best-in-class performance and SEO readiness.",
    "Node.js": "The engine for our server-side logic — chosen for its asynchronous execution and massive ecosystem.",
    "PostgreSQL": "The relational database of choice for enterprise data integrity and complex queries.",
    "Cloud Native": "We deploy on AWS/Azure with multi-region redundancy and automated scaling protocols.",
    "DevOps": "Containerisation with Docker and CI/CD pipelines ensure safe, rapid, and reproducible deployments.",
  };

  const faqs = [
    { q: "What kind of web applications do you build?", a: "SaaS platforms, internal tools, marketplaces, and fintech systems. Our focus is on structured, scalable engineering." },
    { q: "Do you handle both frontend and backend?", a: "Yes. Our teams work across the full stack — React/Next.js frontend, Node.js APIs, and cloud infrastructure backend." },
    { q: "How do you handle security?", a: "Auth flows, role-based access, input sanitisation, and HTTPS are built in from day one. We follow OWASP security standards." },
    { q: "Can you build on our existing codebase?", a: "Yes, after a technical audit to assess extendability. We don't carry technical debt forward unnecessarily." },
    { q: "How do you ensure performance at scale?", a: "Through caching layers, database indexing, and horizontal scaling design. We build for growth from the first commit." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">

          {/* ===== HERO ===== */}
          <section className="pt-40 pb-32 relative overflow-hidden">
            <HeroBackdrop image="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1920&q=80" position="center" intensity={0.55} accent="#22D3EE" />
            <div className="blob blob-blue w-[600px] h-[600px] -top-48 -right-24 opacity-[0.04]" />
            <div className="container-w relative z-10">
              <Link href="/services">
                <Button variant="ghost" className="mb-10 gap-2 t-muted hover:t-primary hover:bg-secondary/20 rounded-xl text-sm border border-border/20">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <p className="label mb-10 inline-flex items-center gap-2" style={{ color: "#22D3EE" }}><Globe className="w-4 h-4" /> Web Applications</p>
                <h1 className="text-display-hero">
                  Application engineering<br />
                  <span className="text-gradient italic">for enterprise scale.</span>
                </h1>
                <p className="text-xl t-muted mb-12 max-w-2xl leading-relaxed font-normal">
                  We design and engineer web applications with production-grade architecture — structured for security, built for performance, and ready to scale as your business demands change.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link href="/contact">
                    <Button data-cursor="button" size="lg" className="h-14 px-8 rounded-2xl gap-2 btn-primary text-white border-0 text-base">
                      Start Your Project <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-xs t-deco tracking-widest uppercase font-medium">Typically respond within 4 hours</p>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== APP SELECTOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Strategic Choice</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">What type of system?</h2>
                <p className="t-muted text-lg font-light mt-4 max-w-xl leading-relaxed">Select the architectural focus that most closely matches your operational vision.</p>
              </motion.div>

              <div className="space-y-3">
                {appTypes.map((type, i) => (
                  <motion.div
                    key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`overflow-hidden border transition-all duration-500 rounded-2xl ${activeType === i ? "border-border/60 bg-secondary/20 shadow-xl" : "border-border/10 bg-white/[0.01] hover:bg-white/[0.02]"}`}
                  >
                    <button
                      onClick={() => setActiveType(activeType === i ? null : i)}
                      className="w-full text-left px-8 py-7 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-xs t-deco tracking-widest font-bold">0{i + 1}</span>
                        <span className={`text-xl font-semibold transition-colors duration-300 ${activeType === i ? "t-primary" : "t-secondary group-hover:t-primary"}`}>
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
                            <div className="h-px bg-border/40 mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Best For</p>
                                <p className="text-sm t-muted leading-relaxed">{type.bestFor}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Strategic Goal</p>
                                <p className="text-sm t-muted leading-relaxed">{type.goal}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Key Features</p>
                                <ul className="space-y-2">
                                  {type.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-xs t-muted">
                                      <CheckCircle2 className="w-3 h-3 t-deco shrink-0" />{f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Complexity / Timeline</p>
                                <p className="text-base t-primary font-semibold">{type.complexity}</p>
                                <p className="text-xs t-secondary mt-1 font-medium tracking-wide">{type.timeline}</p>
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

          {/* ===== PAIN POINTS ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 80% 40% at 80% 60%, rgba(var(--primary-raw, 180 130 100), 0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">The Reality</p>
                  <h2 className="text-4xl md:text-5xl t-primary mb-12 font-display">What most systems<br />get wrong.</h2>
                  <ul className="space-y-8">
                    {[
                      { t: "Monolithic Constraints", d: "Building singular, tightly-coupled systems that become impossible to scale or update without global failure." },
                      { t: "Security as Afterthought", d: "Treating authentication and data protection as layers added at the end, rather than baked into the core architecture." },
                      { t: "Poor Data Integrity", d: "Inconsistent database schemas and lack of transactional logic leading to data corruption as volume grows." },
                      { t: "High Latency Architecture", d: "Failing to account for concurrent load, resulting in applications that slow down as more users join." },
                      { t: "Lack of Test Coverage", d: "Zero automated testing protocols, making every new feature a potential breaking change for existing logic." },
                    ].map((item, i) => (
                      <li key={i} className="flex gap-5 items-start">
                        <div className="w-px h-12 bg-border/50 mt-1 shrink-0" />
                        <div>
                          <h4 className="font-semibold t-secondary text-base mb-1.5">{item.t}</h4>
                          <p className="text-sm t-muted leading-relaxed">{item.d}</p>
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
                      { icon: Database, t: "Modular Service Architecture", d: "We decouple logic to ensure individual components can be updated, scaled, or replaced without system downtime." },
                      { icon: ShieldCheck, t: "Infrastructure-Level Security", d: "Auth and encryption are handled at the gateway and database layers. Security is a structural default." },
                      { icon: Zap, t: "Performance-Driven Engineering", d: "Query optimisation and caching are mandatory. We engineer for sub-200ms response times at scale." },
                      { icon: Cloud, t: "Production-Grade DevOps", d: "Automated pipelines, containerisation, and multi-region redundancy are standard for every build." },
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
            </div>
          </section>

          <div className="divider" />

          {/* ===== SYSTEMS PERSPECTIVE ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(180,130,100,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Database, t: "Information Architecture", d: "We design data models and API services that are decoupled from the UI, ensuring each layer scales independently." },
                    { icon: ShieldCheck, t: "Infrastructure Security", d: "RBAC, rate limiting, and encryption are structural defaults, baked into the system from the first commit." },
                    { icon: Zap, t: "Performance Engineering", d: "Caching layers and database optimisation ensure sub-200ms response times even under high concurrent load." },
                    { icon: Cloud, t: "DevOps & Continuity", d: "Containerised deployments with automated CI/CD and multi-region redundancy ensure 99.9% availability." },
                  ].map((item, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                      className="flex gap-5 p-5 glass-card group hover:bg-white/[0.02] transition-all duration-500">
                      <item.icon className="w-5 h-5 t-secondary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold t-primary text-sm mb-1">{item.t}</h4>
                        <p className="text-xs t-muted leading-relaxed">{item.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <p className="label mb-4">Systems Thinking</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Applications as nodes in a<br /><span className="text-gradient italic">larger ecosystem.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                    A web application is not a standalone product — it is a primary node in your operational system. Decisions made at the architecture level today determine your agility for years.
                  </p>
                  <p className="t-muted text-base font-light leading-relaxed">
                    We build with AI-readiness, third-party integration capacity, and long-term data evolution in mind — so that as your requirements change, your infrastructure can accommodate them cleanly.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== ARCHITECTURE / PROCESS ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-1">
                  <p className="label mb-4">Authority</p>
                  <h2 className="text-4xl t-primary font-display mb-6">How we build.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    Production-grade engineering from the first commit. No technical debt carried forward.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { title: "Define", items: ["Domain modelling", "System requirements", "Technical audit"] },
                    { title: "Architect", items: ["Service schema", "API contracts", "Cloud infrastructure"] },
                    { title: "Engineer", items: ["Test-driven dev", "Security hardening", "CI/CD setup"] },
                    { title: "Scale", items: ["Load testing", "SLA monitoring", "Iterative growth"] },
                  ].map((block, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp} className="glass-card p-6 border-white/[0.05]">
                      <h4 className="font-semibold t-primary mb-4 text-xs uppercase tracking-widest">{block.title}</h4>
                      <ul className="space-y-3">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2.5 text-xs t-muted">
                            <div className="w-1 h-1 rounded-full bg-secondary opacity-40" /> {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== ENGAGEMENT MODELS ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(180,130,100,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20">
                <p className="label mb-4 mx-auto">Strategic Framework</p>
                <h2 className="text-4xl t-primary font-display">Project Scale Examples.</h2>
                <p className="t-muted text-base font-light mt-4 leading-relaxed">
                  Each scale level represents a depth of engineering capability — not a fixed price tier.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {engagementModels.map((item, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`glass-card p-10 flex flex-col relative overflow-hidden ${item.featured ? "ring-1 ring-white/10 shadow-xl" : ""}`}
                    style={item.featured ? { background: "linear-gradient(135deg, rgba(180,130,100,0.06) 0%, rgba(255,255,255,0.01) 100%)" } : {}}
                  >
                    {item.featured && (
                      <div className="absolute top-0 inset-x-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(180,130,100,0.6) 50%, transparent 100%)" }} />
                    )}
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
                    <div className="h-px bg-white/[0.05] mb-6" />
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

          {/* ===== SCOPE & CAPABILITIES ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-1">
                  <p className="label mb-4">Engineering Depth</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Scope & Capabilities.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    We don't just write code; we engineer systems. Every build starts with structured architecture and layers advanced logic based on scale.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { name: "Essential", items: ["Database Schema Design", "Responsive Web Frontend", "Standard API Services", "User Management", "Basic Admin Panel"], color: "t-ghost" },
                    { name: "Growth", items: ["Multi-system Integration", "Advanced Permission Logic", "Performance Caching Layer", "Automated Workflow Hooks", "Analytics Dashboard"], color: "t-secondary" },
                    { name: "Enterprise", items: ["Microservices Architecture", "High-Concurrency Engine", "Compliance Documentation", "SSO / Enterprise Auth", "Global Cloud Deployment"], color: "t-primary" },
                  ].map((col, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp}>
                      <h3 className={`text-lg font-bold mb-8 ${col.color}`}>{col.name}</h3>
                      <ul className="space-y-5">
                        {col.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-white/[0.08] rounded-full shrink-0" />
                            <span className="text-sm t-muted">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== PERFORMANCE AUTHORITY ===== */}
          <section className="py-32 relative" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(180,130,100,0.05) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-24">
                <p className="label mb-4 mx-auto">Technical Authority</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">
                  Benchmarks we engineer for —<br /><span className="t-secondary italic">not afterthoughts.</span>
                </h2>
              </motion.div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                {[
                  { label: "Uptime SLA", value: 99.9, decimals: 1, suffix: "%", note: "Guaranteed availability for mission-critical enterprise applications." },
                  { label: "API Latency", value: 200, suffix: "ms", prefix: "<", note: "Optimised response times for core API endpoints under concurrent load." },
                  { label: "Security Score", value: 100, suffix: "%", note: "A+ rating on industry-standard security verification and audit tools." },
                  { label: "Stability Delta", value: 0, suffix: " Regressions", note: "Automated CI/CD and unit testing ensure zero-regression deployments." },
                ].map((stat, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    custom={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gradient mb-3 tracking-tight whitespace-nowrap">
                      {stat.value === 0 ? "✓" : <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} decimals={stat.decimals || 0} />}
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] t-deco font-bold mb-3">{stat.label}</p>
                    <p className="text-xs t-muted leading-relaxed max-w-[200px]">{stat.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== TECH STACK ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Technical Choices</p>
                  <h2 className="text-4xl t-primary font-display mb-4">Technology we use —</h2>
                  <h2 className="text-4xl text-gradient italic font-display mb-10">and why we chose it.</h2>
                  <p className="t-muted text-sm leading-relaxed mb-10 max-w-sm">
                    Our stack is selected for long-term stability and performance. We build infrastructure that allows your business to scale without technical limits.
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

          {/* ===== CASE SNAPSHOT ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Real World Impact</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Case Snapshot:<br /><span className="italic text-gradient">Logistics Engine.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-6">
                    A regional logistics provider was managing 2,000+ daily operations through spreadsheets, resulting in massive data silos and manual overhead.
                  </p>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">340%</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Volume Growth</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">4m</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Reporting Time</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-10 border-white/[0.05]">
                    <div className="space-y-8">
                      {[
                        { l: "The Situation", t: "Delivery operations managed across fragmented spreadsheets and WhatsApp groups." },
                        { l: "The Challenge", t: "Zero real-time visibility into field status; client updates took 48 hours to compile manually." },
                        { l: "What We Engineered", t: "A custom operations platform with driver management, live tracking, and role-based analytics." },
                        { l: "The Outcome", t: "Reporting reduced from 48h to 4 minutes. Handled 3.4× volume with the same staff size." },
                      ].map((block, i) => (
                        <div key={i}>
                          <p className="text-[10px] uppercase tracking-widest t-deco font-bold mb-2">{block.l}</p>
                          <p className="text-sm t-muted leading-relaxed">{block.t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== FAQ ===== */}
          <section className="section-pad">
            <div className="container-w grid grid-cols-1 lg:grid-cols-5 gap-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-2">
                <p className="label mb-4">Transparency</p>
                <h2 className="text-4xl t-primary font-display mb-6">Common questions,<br /><span className="italic t-secondary">direct answers.</span></h2>
                <p className="t-muted text-sm leading-relaxed max-w-sm">
                  Strategic clarity is our standard. If you have a specific architectural concern, our strategy call is the best place to address it.
                </p>
              </motion.div>
              <div className="lg:col-span-3">
                <div className="border-t border-white/[0.06]">
                  {faqs.map((f, i) => <FAQItem key={i} f={f} i={i} />)}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== FINAL CTA ===== */}
          <section className="py-44 relative overflow-hidden">
            <div className="blob blob-blue w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" />
            <div className="container-w grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-6">Next Step</p>
                <h2 className="text-4xl md:text-5xl font-bold t-primary font-display mb-6 leading-tight">
                  Let's scope your<br /><span className="text-gradient italic">system properly.</span>
                </h2>
                <p className="text-lg t-muted font-light leading-relaxed max-w-md mb-8">
                  We start with a technical discovery session — not a quote. We need to understand your data model, integration requirements, and scale expectations before proposing a path.
                </p>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] max-w-sm">
                  <p className="text-xs t-secondary leading-relaxed italic">
                    "We build systems designed to evolve over the next 3–5 years, ensuring your infrastructure scales seamlessly with your business ambitions."
                  </p>
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="flex flex-col gap-5 items-start lg:items-center justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button data-cursor="button" size="lg" className="h-16 px-10 rounded-2xl gap-3 btn-primary text-white border-0 text-lg shadow-2xl shadow-primary/20 w-full sm:w-auto">
                    Book a Strategy Call <MessageSquare className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs t-deco tracking-widest uppercase font-semibold">Typically respond within 4 hours</p>
              </motion.div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
