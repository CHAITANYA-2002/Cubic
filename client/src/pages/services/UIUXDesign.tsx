import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Layout, ArrowLeft, ArrowRight, ChevronDown,
  CheckCircle2, MessageSquare, Users, Layers, Eye, TrendingUp,
  ShieldCheck, BarChart3
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

export default function UIUXDesign() {
  useEffect(() => {
    document.title = "UI/UX Design Systems | User Research & Prototyping | CubicTech";
  }, []);

  const [activeType, setActiveType] = useState<number | null>(null);
  const [activeTech, setActiveTech] = useState<string>("Figma");

  const designTypes = [
    {
      title: "SaaS Product",
      bestFor: "Software platforms that need to reduce churn and move users from complex data to clear action.",
      goal: "Minimise cognitive load, maximise workspace efficiency, and create a high-retention user journey.",
      complexity: "High",
      timeline: "6–10 Weeks",
      features: ["Behaviour-driven flow analysis", "Modular dashboard architecture", "Interactive state management"],
    },
    {
      title: "Data Dashboard",
      bestFor: "Analytics-heavy products where information density needs to be balanced with extreme clarity.",
      goal: "Turn raw metrics into digestible, actionable visual hierarchies that support fast decision-making.",
      complexity: "Very High",
      timeline: "5–8 Weeks",
      features: ["Custom data visualisation library", "Context-aware filters & states", "Real-time interactive patterns"],
    },
    {
      title: "Mobile Application",
      bestFor: "Native or cross-platform apps that demand a physical, tactile feel and platform-specific logic.",
      goal: "Leverage native patterns to create an effortless, thumb-driven experience that feels like 'hardware'.",
      complexity: "Medium",
      timeline: "4–7 Weeks",
      features: ["Platform-native interaction design", "Contextual navigation systems", "Offline-ready UI states"],
    },
    {
      title: "Marketing Experience",
      bestFor: "High-ticket brands that need a digital narrative to build trust and drive premium conversions.",
      goal: "Combine cinematic visual storytelling with conversion architecture that guides users to a clear CTA.",
      complexity: "Medium",
      timeline: "3–5 Weeks",
      features: ["Micro-interaction storytelling", "High-fidelity motion system", "Conversion-led visual hierarchy"],
    },
    {
      title: "Enterprise System",
      bestFor: "Internal tools or complex operational platforms where efficiency and scale are the only metrics.",
      goal: "Zero-friction workflows, robust design tokens, and a component-lead architecture that scales globally.",
      complexity: "Critical",
      timeline: "12+ Weeks",
      features: ["Full design system documentation", "Accessibility compliance (WCAG 2.1)", "Dev-ready design-to-code pipeline"],
    },
  ];

  const engagementModels = [
    {
      tag: "Foundation",
      title: "Essential Design",
      sub: "For products launching or validating their digital presence.",
      points: ["Core UX architecture & flows", "Design system (foundations)", "High-fidelity mockups (15 screens)", "Interactive prototype"],
      icon: Layout,
      featured: false,
    },
    {
      tag: "Scaling",
      title: "Growth Design System",
      sub: "For companies expanding their product with deeper systematic needs.",
      points: ["Full component library & tokens", "Interaction design system", "Usability testing & validation", "Accessibility (WCAG) audit"],
      icon: Layers,
      featured: true,
    },
    {
      tag: "Infrastructure",
      title: "Enterprise Partnership",
      sub: "For organisations requiring hardened, scalable, multi-product architecture.",
      points: ["Multi-product design language", "Ongoing design sprints", "Design-to-dev handoff pipeline", "Quarterly UX audits & iteration"],
      icon: Users,
      featured: false,
    },
  ];

  const techStack: Record<string, string> = {
    "Figma": "Our primary tool for interface design. We build everything with component-based logic to mirror development reality.",
    "Design Systems": "We build multi-layered systems using tokens, components, and documentation to ensure long-term design stability.",
    "Accessibility": "We use WCAG evaluation tools to ensure every component meets AA contrast and keyboard navigation standards.",
    "Prototyping": "We use Protopie and Principle for high-fidelity micro-interactions to validate logic before engineering.",
    "Research": "We use Maze and Dovetail for user testing and qualitative insight mapping to ground every decision in data.",
  };

  const faqs = [
    { q: "Do you use Figma for all design work?", a: "Yes — Figma is our standard. All files are handed over with full edit access at project completion." },
    { q: "How do you validate design decisions?", a: "We use heuristic evaluation, moderated usability testing, and behavioural analytics. Every decision is justified with research." },
    { q: "Can you work with our existing design system?", a: "Absolutely. We can audit, extend, or rebuild your existing system depending on its maturity." },
    { q: "What does 'design system' actually include?", a: "A component library, typography scale, color tokens, spacing system, and documented interaction states." },
    { q: "Do you handle the development transition?", a: "Yes. We provide structured handoff files, design specifications, and work closely with your engineers during build." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">

          {/* ===== HERO ===== */}
          <section className="pt-40 pb-32 relative overflow-hidden">
            <HeroBackdrop image="/images/ui_ux_design.png" position="70% 35%" intensity={0.5} />
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
                <p className="label mb-10 inline-flex items-center gap-2"><Layout className="w-4 h-4" /> UI/UX Design</p>
                <h1 className="text-display-hero">
                  Interfaces engineered<br />
                  <span className="text-gradient italic">for clarity and conversion.</span>
                </h1>
                <p className="text-xl t-muted mb-12 max-w-2xl leading-relaxed font-normal">
                  We design interfaces that don't just look premium — they are engineered to reduce friction and drive conversion through psychological design and behavioral science.
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

          {/* ===== DESIGN SELECTOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Strategic Choice</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">What are you designing?</h2>
                <p className="t-muted text-lg font-light mt-4 max-w-xl leading-relaxed">Select the architectural focus that most closely matches your product vision.</p>
              </motion.div>

              <div className="space-y-3">
                {designTypes.map((type, i) => (
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
                  <h2 className="text-4xl md:text-5xl t-primary mb-12 font-display">What most products<br />get wrong.</h2>
                  <ul className="space-y-8">
                    {[
                      { t: "Decoration over Function", d: "Prioritising aesthetic trends over actual task efficiency and user cognitive load." },
                      { t: "Fragmented Design Language", d: "Inconsistent components that create technical debt and user confusion as the product scales." },
                      { t: "Ignoring Accessibility", d: "Designing for the 'average' user, excluding millions and risking legal/compliance bottlenecks." },
                      { t: "Over-Complex Interactions", d: "Using fancy animations that slow down power users and frustrate occasional visitors." },
                      { t: "Weak Information Hierarchy", d: "Failing to guide the eye to the most important actions, killing conversion rates." },
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
                  <h2 className="text-3xl t-secondary mb-12 font-display italic">How we design differently.</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Layout, t: "Systematic Design Methodology", d: "We build atomic components that are documented for engineering. Consistency is engineered, not guessed." },
                      { icon: Eye, t: "Accessibility-First Standards", d: "WCAG 2.1 compliance is baked into our base theme. Contrast, hit zones, and screen readers are defaults." },
                      { icon: Users, t: "Behaviour-Led Architecture", d: "Every flow is mapped against user goals. We design for the mental model of your specific audience." },
                      { icon: Layers, t: "Dev-Ready Documentation", d: "Handoff isn't just a Figma link. It's a structured spec of tokens, logic, and component states." },
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
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 70% 50% at 20% 50%, rgba(180,130,100,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Systems Thinking</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Design within the<br /><span className="text-gradient italic">larger ecosystem.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                    UI/UX design is the primary interface between your infrastructure and your users. Done incorrectly, it becomes the most expensive part of your system to refactor.
                  </p>
                  <p className="t-muted text-base font-light leading-relaxed">
                    We architect interfaces with your data model, API latency, and business logic in mind. This ensures what we design can be implemented cleanly — without engineering debt accumulating at the design layer.
                  </p>
                </motion.div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Users, t: "User Behaviour → Data Flow", d: "We map user journeys to inform how data should be structured, not just how screens should look." },
                    { icon: Layers, t: "Component Systems → Dev Speed", d: "Design tokens and shared components reduce duplication across design and engineering teams." },
                    { icon: ShieldCheck, t: "Accessibility → Compliance", d: "WCAG-aware design opens your product to more users and satisfies enterprise procurement requirements." },
                    { icon: BarChart3, t: "Conversion Design → Revenue", d: "Page hierarchy, visual weight, and CTA placement are measurable levers on your business outcomes." },
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
                  <h2 className="text-4xl t-primary font-display mb-6">How we design.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    A rigorous, evidence-based approach to interface engineering.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { title: "Research", items: ["User interviews", "Heuristic audit", "Competitive mapping"] },
                    { title: "Structure", items: ["Information architecture", "User flow logic", "Wireframe systems"] },
                    { title: "Design System", items: ["Atomic components", "Design tokens", "Brand alignment"] },
                    { title: "Validation", items: ["Prototypes", "Usability testing", "Handoff specs"] },
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
                  Each scale level represents a depth of capability — not a price tier. We scope to your actual requirements.
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
                  <p className="label mb-4">Deliverables</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Scope & Capabilities.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    Every engagement starts with core UX foundations. We layer advanced design systems based on your product's lifecycle and scale.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { name: "Essential", items: ["User Flow Mapping", "Core UX Strategy", "Component Foundations", "15+ High-Fidelity Screens", "Single Platform focus"], color: "t-ghost" },
                    { name: "Growth", items: ["Full Design System", "Interaction Design", "Usability Testing", "Dark/Light Modes", "Multi-platform system"], color: "t-secondary" },
                    { name: "Enterprise", items: ["Multi-product design language", "Global Tokens system", "Accessibility (WCAG) compliance", "Design-to-dev handoff pipeline", "Ongoing UX Governance"], color: "t-primary" },
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
                <h2 className="text-display-hero">
                  Benchmarks we design for —<br /><span className="t-secondary italic">not afterthoughts.</span>
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {[
                  { label: "Usability Score", value: 95, suffix: "/100", note: "Validated via heuristic evaluation and user testing benchmarks." },
                  { label: "Design Consistency", value: 100, suffix: "%", note: "Strict adherence to atomic design systems and brand DNA." },
                  { label: "Accessibility", value: 0, suffix: " WCAG 2.1", note: "AA/AAA compliance across all critical user journeys and components." },
                  { label: "Interaction Speed", value: 100, suffix: "ms", prefix: "<", note: "Micro-interactions designed for zero perceived latency." },
                ].map((stat, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    custom={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="text-4xl md:text-5xl font-bold font-display text-gradient mb-3 tracking-tight">
                      {stat.label === "Accessibility" ? "✓" : <><CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} /></>}
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] t-deco font-bold mb-3">{stat.label}</p>
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
                  <h2 className="text-4xl t-primary font-display mb-4">Tools we use —</h2>
                  <h2 className="text-4xl text-gradient italic font-display mb-10">and why we use them.</h2>
                  <p className="t-muted text-sm leading-relaxed mb-10 max-w-sm">
                    We select our design stack to mirror engineering reality. We don't just create pictures; we create systems that are ready to be built.
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
                  <h2 className="text-4xl t-primary font-display mb-6">Case Snapshot:<br /><span className="italic text-gradient">System Consolidation.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-6">
                    A global employee management SaaS platform was suffering from high churn and low user engagement due to a fragmented interface.
                  </p>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">41%</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Task Speed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">120+</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Components</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-10 border-white/[0.05]">
                    <div className="space-y-8">
                      {[
                        { l: "The Situation", t: "A fragmented UI with 3 different design systems merged into one product through acquisitions." },
                        { l: "The Challenge", t: "Users spent 4× more time on basic tasks than industry benchmarks due to inconsistent navigation." },
                        { l: "What We Engineered", t: "A unified Design System with semantic tokens, consolidated navigation, and role-based dashboard variants." },
                        { l: "The Outcome", t: "41% reduction in task completion time. Enterprise procurement approved within 2 weeks of redesign." },
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
                  We believe in clarity from day one. If your question remains unanswered, our strategy call is designed to address it.
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
                  Map your design<br /><span className="text-gradient italic">architecture first.</span>
                </h2>
                <p className="text-lg t-muted font-light leading-relaxed max-w-md mb-8">
                  We begin with a structured discovery session — not a proposal. We understand your system constraints, user context, and product trajectory before recommending a path.
                </p>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] max-w-sm">
                  <p className="text-xs t-secondary leading-relaxed italic">
                    "We build systems designed to evolve over the next 3–5 years, ensuring your design debt remains low while your product value grows."
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
