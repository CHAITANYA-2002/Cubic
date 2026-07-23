import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Megaphone, ArrowLeft, ArrowRight, ChevronDown,
  CheckCircle2, MessageSquare, BarChart3, Database, Target, Search
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

export default function DigitalMarketing() {
  useEffect(() => {
    document.title = "Growth Engineering & Data-Driven Marketing | CubicTech";
  }, []);

  const [activeType, setActiveType] = useState<number | null>(0);
  const [activeTech, setActiveTech] = useState<string>("Data Infrastructure");

  const marketingTypes = [
    {
      title: "SaaS Growth Engine",
      bestFor: "Software platforms focusing on CAC/LTV & trial-to-paid.",
      goal: "User Acquisition & Retention",
      complexity: "High",
      timeline: "Ongoing Sprints",
      features: ["Product-Led Growth (PLG)", "Multi-touch Attribution", "Churn Reduction Emails", "LinkedIn ABM Ads", "Trial Conversion Ops"],
    },
    {
      title: "E-Commerce Scaling",
      bestFor: "D2C brands ready to scale spend past $20k/mo.",
      goal: "ROAS & Scale",
      complexity: "Medium-High",
      timeline: "Weekly Optimisation",
      features: ["Meta/Google Shopping", "Feed Management", "Dynamic Remarketing", "Retention Flows", "UGC Directing"],
    },
    {
      title: "B2B Lead Generation",
      bestFor: "Enterprise services requiring high-intent, vetted leads.",
      goal: "MQL to SQL Velocity",
      complexity: "Critical",
      timeline: "Ongoing Governance",
      features: ["Server-Side CAPI", "CRM Lead Routing", "Gated Content SEO", "Webinar Automations", "Lead Scoring Logic"],
    },
    {
      title: "Technical SEO & PR",
      bestFor: "Companies investing in long-term organic authority.",
      goal: "Organic Market Share",
      complexity: "Advanced",
      timeline: "6-month Horizon",
      features: ["Programmatic SEO", "Schema Engineering", "Content Clustering", "Foundational PR", "Speed Optimisation"],
    },
  ];

  const engagementModels = [
    {
      tag: "Foundation",
      title: "Audience & Analytics Setup",
      sub: "Strategic tracking infrastructure and foundational SEO before scaling spend.",
      points: ["GTM/GA4 Configuration", "Conversion Event Mapping", "Technical SEO Audit", "Competitor Gap Analysis", "Basic Email Hygiene"],
      icon: Database,
      featured: false,
    },
    {
      tag: "Scaling",
      title: "Growth Marketing Engine",
      sub: "Aggressive user acquisition targeting high ROAS through engineered funnels.",
      points: ["Cross-channel Media Buying", "Automated Email Sequences", "Content Clustering Strategy", "Weekly Performance Sprints", "Creative Direction"],
      icon: Target,
      featured: true,
    },
    {
      tag: "Enterprise",
      title: "Full-Funnel Lead Systems",
      sub: "Complex, multi-touch attribution and ABM for high-ticket enterprise orgs.",
      points: ["ABM Campaign Setup", "CRM & Backend Sync", "Server-side CAPI Logic", "Predictive Lead Scoring", "Custom Data Dashboards"],
      icon: BarChart3,
      featured: false,
    },
  ];

  const techStack: Record<string, string> = {
    "Data Infrastructure": "We don't trust browser-side pixels. We build server-side Google Tag Manager (sGTM) containers that send zero-party data directly to Meta and Google, ensuring 100% signal accuracy.",
    "Bidding Algorithms": "We feed converted CRM data back into advertising platforms, allowing the AI-driven bidding algorithms to optimize for actual revenue rather than cheap 'link clicks'.",
    "Creative Ops": "We treat creative as the new targeting. We use automated testing frameworks to run hundreds of iterations of hooks and visual styles, selecting winners based on statistically significant conversion data.",
    "Technical SEO Engine": "Our SEO is engineered, not just written. We implement programmatic page architectures and schema.org injection that makes your site essentially 'read itself' to Google's bots.",
  };

  const faqs = [
    { q: "How do you track ROI across different channels?", a: "We implement server-side tracking and custom attribution modeling in GA4 to understand the true multi-touch journey. We don't rely on platform-reported metrics which often double-count conversions." },
    { q: "Do you handle creative as well as media buying?", a: "Yes. Campaign architecture and creative direction are inseparable. Our design team executes ad creatives tightly aligned with the strategic hypotheses our media buyers are testing." },
    { q: "What is your typical management fee structure?", a: "We operate on a transparent flat-fee + performance incentive model. This aligns our goals: we only scale your spend when we've proven the unit economics work and the system is profitable." },
    { q: "How long until we see measurable growth?", a: "Paid engines (ADS) generate actionable data within 14 days. Organic engines (SEO) are a structural investment that typically shows compound visibility growth starting in month 3-4." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">

          {/* ===== HERO ===== */}
          <section className="pt-40 pb-32 relative overflow-hidden">
            <HeroBackdrop image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80" position="center" intensity={0.55} accent="#FB923C" />
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
                <p className="label mb-10 inline-flex items-center gap-2" style={{ color: "#FB923C" }}><Megaphone className="w-4 h-4" /> Growth Engineering</p>
                <h1 className="text-display-hero">
                  Marketing engines built<br />
                  <span className="text-gradient italic">on data architecture.</span>
                </h1>
                <p className="text-xl t-muted mb-12 max-w-2xl leading-relaxed font-normal">
                  We don't do "digital marketing" as a surface layer. We build growth engines based on data infrastructure, server-side attribution, and performance engineering.
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

          {/* ===== GROWTH SELECTOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Strategic Filter</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">What are you growing?</h2>
                <p className="t-muted text-lg font-light mt-4 max-w-xl leading-relaxed">Select your vertical to see how we engineer your specific acquisition architecture.</p>
              </motion.div>

              <div className="space-y-3">
                {marketingTypes.map((type, i) => (
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
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Priority Goal</p>
                                <p className="text-sm t-muted leading-relaxed">{type.goal}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Key Focus</p>
                                <ul className="space-y-2">
                                  {type.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-xs t-muted">
                                      <CheckCircle2 className="w-3.5 h-3.5 t-deco shrink-0" />{f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Scale Tier</p>
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
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 80% 40% at 20% 60%, rgba(var(--primary-raw, 70 130 180), 0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">The Reality</p>
                  <h2 className="text-4xl md:text-5xl t-primary mb-12 font-display">What most marketing<br />agencies get wrong.</h2>
                  <ul className="space-y-8">
                    {[
                      { t: "The Vanity Metric Trap", d: "Optimizing for clicks and impressions while ignoring the actual unit economics of your business (CAC/LTV)." },
                      { t: "Pixel-Only Attribution", d: "Relying on broken browser-side pixels that lose 30%+ of data to ad-blockers and privacy restrictions." },
                      { t: "Generic Creative Burn", d: "Running the same generic hooks for months without statistically significant creative testing and iteration." },
                      { t: "Disconnected Silos", d: "Marketing spend that isn't connected to your CRM or product database, leading to over-bidding on low-intent users." },
                      { t: "Short-Term 'Hacks'", d: "Focusing on aggressive tactics that burn out your audience rather than engineering a sustainable acquisition engine." },
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
                  <h2 className="text-3xl t-secondary mb-12 font-display italic">How we growth differently.</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Database, t: "Server-Side CAPI Architecture", d: "We send conversion data directly from your server to ad platforms, bypassing browser limits for 100% data integrity." },
                      { icon: Target, t: "Unit-Economic Bidding", d: "We feed actual purchase and lifetime-value data back into bidding algorithms to optimize for revenue, not traffic." },
                      { icon: BarChart3, t: "Creative Velocity Framework", d: "We iterate on ad creative through a rigorous testing loop, making creative decisions based on data, not 'vibes'." },
                      { icon: Search, t: "Structural SEO Engineering", d: "We treat SEO as an infrastructure play, building programmatic page architectures and schema for high-intent organic scaling." },
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
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(70,130,180,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Database, t: "CRM & Database Sync", d: "We connect lead-gen directly into Salesforce/HubSpot, ensuring sales data loops back to ad algorithms securely." },
                    { icon: Target, t: "Server-Side Architecture", d: "We bypass ad-blockers and browser privacy limits by sending deterministic conversion data via server APIs." },
                    { icon: BarChart3, t: "Closed-Loop Analytics", d: "We construct dashboards that unite ad spend, cohort analysis, and customer lifetime value (LTV)." },
                    { icon: Search, t: "SEO Infrastructure", d: "Content isn't enough; we ensure your platform's technical core (schema, rendering, speed) is built for crawlability." },
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
                  <h2 className="text-4xl t-primary font-display mb-6">Marketing as the topmost<br /><span className="text-gradient italic">layer of your data ecosystem.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                    Marketing does not exist in a vacuum. If marketing is disconnected from the product database or CRM, scaling is largely guesswork.
                  </p>
                  <p className="t-muted text-base font-light leading-relaxed">
                    We engineer the connection between your ad platforms, your website front-end, and your backend conversion systems. This ensures every dollar spent is tracked against actual business revenue, not just "clicks" or "impressions."
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
                  <h2 className="text-4xl t-primary font-display mb-6">How we execute.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    Engineered precision over vanity metrics. We treat marketing as a technical engineering challenge.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { title: "Audit", items: ["Tracking Gaps", "Pixel Health", "Funnel Leakage"] },
                    { title: "Engineer", items: ["Server-Side CAPI", "sGTM Container", "CRM Webhooks"] },
                    { title: "Optimise", items: ["Bidding Models", "Creative Velocity", "ROAS Scaling"] },
                    { title: "Scale", items: ["Budget Pacing", "Audience Expansion", "LTV Forecasting"] },
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
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(70,130,180,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20">
                <p className="label mb-4 mx-auto">Strategic Framework</p>
                <h2 className="text-4xl t-primary font-display">Project Scale Examples.</h2>
                <p className="t-muted text-base font-light mt-4 leading-relaxed">
                  Each scale level represents a depth of operational commitment — not a fixed price tier.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {engagementModels.map((item, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`glass-card p-10 flex flex-col relative overflow-hidden ${item.featured ? "ring-1 ring-white/10 shadow-xl" : ""}`}
                    style={item.featured ? { background: "linear-gradient(135deg, rgba(70,130,180,0.06) 0%, rgba(255,255,255,0.01) 100%)" } : {}}
                  >
                    {item.featured && (
                      <div className="absolute top-0 inset-x-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(70,130,180,0.6) 50%, transparent 100%)" }} />
                    )}
                    {item.featured && (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
                          style={{ background: "rgba(70,130,180,0.15)", border: "1px solid rgba(70,130,180,0.4)", color: "rgba(150,180,220,0.9)" }}>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Functional Depth</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Scope &<br /><span className="text-gradient italic">Growth Capabilities.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                    We don't just "manage ads." We engineer growth by combining performance media with rigorous tracking and strategic creative testing.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { t: "Performance Search", d: "High-intent Google & Bing ads with complex bidding models." },
                      { t: "Social Acquisitions", d: "Hypothesis-driven Meta, LinkedIn, and TikTok campaigns." },
                      { t: "Lifecycle Automation", d: "Trigger-based email and SMS sequences centered on retention." },
                      { icon: Search, t: "Programmatic SEO", d: "Engineering search authority at scale through data-driven content." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 border border-white/[0.05] rounded-xl">
                        <CheckCircle2 className="w-4 h-4 t-deco shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold t-primary text-sm mb-1">{item.t}</h4>
                          <p className="text-xs t-muted leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                      <Megaphone className="w-32 h-32" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest t-deco font-bold mb-6">Technical Benchmark</p>
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-end mb-3">
                          <p className="text-sm font-semibold t-primary">Tracking Fidelity (CAPI)</p>
                          <p className="text-2xl font-bold text-gradient">98.4%</p>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: "98.4%" }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-3">
                          <p className="text-sm font-semibold t-primary">Creative Testing Velocity</p>
                          <p className="text-2xl font-bold text-gradient">24/mo</p>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} transition={{ duration: 1.5, delay: 0.7 }} className="h-full bg-primary" />
                        </div>
                      </div>
                      <p className="text-xs t-muted leading-relaxed italic border-t border-white/[0.05] pt-6">
                        "Clean data is the primary competitive advantage in the AI-bidding era. Without 95%+ signal match, your algorithms are learning from noise."
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== PERFORMANCE AUTHORITY ===== */}
          <section className="py-32 relative" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(70,130,180,0.05) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-24">
                <p className="label mb-4 mx-auto">Measurable Impact</p>
                <h2 className="text-display-hero">
                  Benchmarks we drive for —<br /><span className="t-secondary italic">not afterthoughts.</span>
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {[
                  { label: "CAC Reduction", value: 40, suffix: "%", prefix: "-", note: "Average decrease in acquisition costs through database-led targeting." },
                  { label: "Conversion Rate", value: 3.2, suffix: "x", note: "Multiplier in lead-to-opportunity conversion after system integration." },
                  { label: "Data Attribution", value: 100, suffix: "%", note: "Deterministic tracking from first touch to final close — no guessing." },
                  { label: "ROAS Increment", value: 2.5, suffix: "x", note: "Average return on ad spend improvement within first 90 days." },
                ].map((stat, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    custom={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="text-4xl md:text-5xl font-bold font-display text-gradient mb-3 tracking-tight">
                      <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] t-deco font-bold mb-3">{stat.label}</p>
                    <p className="text-xs t-muted leading-relaxed max-w-[160px]">{stat.note}</p>
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
                  <h2 className="text-4xl t-primary font-display mb-4">Growth Stack —</h2>
                  <h2 className="text-4xl text-gradient italic font-display mb-10">and why it matters.</h2>
                  <p className="t-muted text-sm leading-relaxed mb-10 max-w-sm">
                    We select our marketing toolset based on data integrity and automation potential. We don't 'run ads' — we build acquisition engines.
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
                  <div className="glass-card p-12 min-h-[220px] flex flex-col justify-center border-white/[0.05]">
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
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Evidence</p>
                <h2 className="text-4xl t-primary font-display mb-6">The SaaS Scaling Sprint.</h2>
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-10 space-y-8">
                    {[
                      { l: "Situation", t: "A FinTech scale-up with $40k monthly ad spend plateaued at a 1.2x ROAS and rising CAC due to poor tracking." },
                      { l: "Challenge", t: "iOS14 privacy updates lost 40% of their conversion data, causing Meta's bidding algorithm to drift into low-intent segments." },
                      { l: "Engineering", t: "We implemented a full server-side GTM container and connected their back-end payment system (Stripe) directly to Meta CAPI." },
                      { l: "Outcome", t: "ROAS increased to 2.6x within 45 days. CAC dropped by 38% as the algorithm gained clean deterministic signals to find actual buyers." },
                    ].map((step, i) => (
                      <div key={i} className="group cursor-default">
                        <p className="text-[10px] uppercase tracking-widest t-deco font-bold mb-2 group-hover:t-secondary transition-colors duration-300">{step.l}</p>
                        <p className="text-sm t-muted leading-relaxed">{step.t}</p>
                        {i < 3 && <div className="h-px bg-white/[0.04] mt-6" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp} className="relative aspect-video rounded-3xl overflow-hidden glass-card flex items-center justify-center p-12">
                   <div className="text-center">
                      <div className="text-6xl font-bold text-gradient mb-4 font-display">+116%</div>
                      <p className="text-base t-secondary font-medium tracking-wide">Increase in Revenue from Paid Acquisition</p>
                      <p className="text-xs t-muted mt-4">In the first 90 days after sGTM implementation.</p>
                   </div>
                   <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none" />
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
              </motion.div>
              <div className="lg:col-span-3">
                <div className="border-t border-white/[0.06]">
                  {faqs.map((f, i) => <FAQItem key={i} f={f} i={i} />)}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== FUTURE READINESS + CTA ===== */}
          <section className="py-44 relative">
            <div className="blob blob-blue w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" />
            <div className="container-w grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-6">Start Here</p>
                <h2 className="text-4xl md:text-5xl font-bold t-primary font-display mb-6">
                  Build analytics<br /><span className="text-gradient italic">into your foundation.</span>
                </h2>
                <p className="text-lg t-muted font-light leading-relaxed max-w-md mb-6">
                  Before we spend a dollar on advertising, we execute a rigorous tracking and infrastructure audit to ensure we can measure exactly what works.
                </p>
                <p className="text-xs t-deco tracking-[0.2em] uppercase font-light">
                  We build systems designed to evolve over the next 3–5 years.
                </p>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="flex flex-col gap-4">
                <Link href="/contact">
                  <Button data-cursor="button" size="lg" className="h-14 px-10 rounded-2xl gap-2 btn-primary text-white border-0 text-base shadow-xl shadow-primary/20 w-full sm:w-auto">
                    Book a Strategy Call <MessageSquare className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button data-cursor="button" variant="ghost" size="lg" className="h-14 px-8 rounded-2xl gap-2 border border-white/[0.08] hover:bg-white/[0.03] transition-all duration-500 w-full sm:w-auto">
                    Request Detailed Proposal <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-xs t-deco tracking-widest uppercase">Typically respond within 4 hours</p>
              </motion.div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
