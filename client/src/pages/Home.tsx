import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { Particles } from "@/components/Particles";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, lazy, Suspense } from "react";

// Lazy-load 3D to avoid breaking if three.js not installed yet
const HeroObject = lazy(() => import("@/components/HeroObject").then(m => ({ default: m.HeroObject })));

/* ===== DATA ===== */
const systemsData = [
  {
    id: "websites",
    title: "Growth Websites",
    for: "Series A+ startups & established brands.",
    capabilities: ["Conversion Strategy", "High-Fidelity UI", "Technical SEO", "Speed Optimization"],
    scope: "8–12 weeks",
    stack: "React / Next.js, Framer Motion, TailWind",
    desc: "We don't build generic sites. We engineer growth engines that generate trust and securing high-value traffic."
  },
  {
    id: "saas",
    title: "SaaS Platforms",
    for: "Product founders & enterprise teams.",
    capabilities: ["Multi-tenant Architecture", "Dashboard Systems", "Subscription Logic", "Scalability Engineering"],
    scope: "12–24 weeks",
    stack: "Node.js, PostgreSQL, Cloud Infra, React",
    desc: "Full-cycle product engineering. We turn complex requirements into clean, scalable, production-grade platforms."
  },
  {
    id: "ai",
    title: "AI & Automation Systems",
    for: "Efficiency-focused companies.",
    capabilities: ["LLM Integration", "Workflow Automation", "Predictive Models", "Custom RAG Systems"],
    scope: "6–16 weeks",
    stack: "Python, OpenAI/Anthropic, Vector DBs, LangChain",
    desc: "AI integrated as core infrastructure—not a gimmick. Automate high-friction processes with secure, private models."
  },
  {
    id: "internal",
    title: "Internal Business Tools",
    for: "Operationally complex organizations.",
    capabilities: ["Custom CRMs", "Operational Dashboards", "Inventory Systems", "Legacy Integrations"],
    scope: "8–20 weeks",
    stack: "Modern Full-stack, Secure APIs, Cloud Sync",
    desc: "Tools designed to solve internal friction. We streamline operations by building software that fits your specific workflow."
  }
];

/* ===== SPOTLIGHT CARD ===== */
function SpotlightCard({ children, className = "", active = false }: { children: React.ReactNode; className?: string; active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const el = ref.current;
    if (el) {
      el.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    }
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`${className} ${active ? 'system-card-active' : ''}`}>
      {children}
    </div>
  );
}

/* ===== TILT CARD ===== */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    const el = ref.current;
    if (el) {
      el.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    }
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }} className={className}>
      {children}
    </motion.div>
  );
}

/* ===== TEXT MATERIALIZATION ===== */
const materialize = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)", letterSpacing: "0.05em" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "-0.03em",
    transition: { delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  })
};

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  })
};

/* ===== HOME ===== */
export default function Home() {
  // 3-stage scroll system
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  // Stage 1 (0–0.3): Arrival — full presence
  // Stage 2 (0.3–0.6): Depth — scale down text, zoom container
  // Stage 3 (0.6–1.0): Transition — blur fade out
  const textScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0.95]);
  const containerZoom = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 1.04]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0.6, 1], [0, 12]);
  const blobZ = useTransform(scrollYProgress, [0, 0.6], [0, -50]);
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => setScrollVal(v));
    return unsubscribe;
  }, [scrollProgress]);

  const [is3DReady, setIs3DReady] = useState(false);
  const [expandedSystem, setExpandedSystem] = useState<string | null>("saas");

  useEffect(() => {
    if (window.innerWidth >= 1024 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIs3DReady(true);
    }
    document.title = "CubicTech | Custom AI, Machine Learning & Software Systems";
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        {/* ===== HERO — 3-Stage Scroll ===== */}
        <section ref={heroRef} className="relative min-h-[140vh]">
          <motion.div
            className="sticky top-0 min-h-screen flex items-start justify-center overflow-hidden pt-32"
            style={{
              opacity: heroOpacity,
              filter: useTransform(heroBlur, v => `blur(${v}px)`),
            }}
          >
            {/* Ambient blobs — push back on scroll */}
            <motion.div style={{ translateZ: blobZ }} className="absolute inset-0">
              <div className="blob blob-blue w-[700px] h-[700px] -top-40 -left-40 breathe" />
              <div className="blob blob-purple w-[600px] h-[600px] top-[30%] right-[-15%] breathe" style={{ animationDelay: "-3s" }} />
              <div className="blob blob-pink w-[500px] h-[500px] bottom-[-20%] left-[30%] breathe" style={{ animationDelay: "-6s" }} />
            </motion.div>

            {/* Particles */}
            <Particles count={50} />

            {/* 3D Object */}
            {is3DReady && (
              <Suspense fallback={null}>
                <HeroObject scrollProgress={scrollVal} />
              </Suspense>
            )}

            {/* Content */}
            <motion.div
              style={{ scale: textScale }}
              className="container-w text-center relative z-10"
            >
              <motion.div style={{ scale: containerZoom }}>
                <motion.p
                  initial="hidden" animate="visible" custom={0} variants={materialize}
                  className="label mb-16 tracking-[0.2em] font-medium opacity-70"
                >
                  CUBICTECH — GLOBAL SYSTEMS STUDIO
                </motion.p>

                <div className="overflow-hidden mb-4">
                  <motion.h1 initial="hidden" animate="visible" custom={1} variants={materialize}
                    className="text-display-hero">
                    <span className="t-primary">Where digital systems</span>
                  </motion.h1>
                </div>
                <div className="overflow-hidden mb-12">
                  <motion.h1 initial="hidden" animate="visible" custom={2} variants={materialize}
                    className="text-display-hero">
                    <span className="text-gradient italic">meet human intelligence.</span>
                  </motion.h1>
                </div>

                <motion.p initial="hidden" animate="visible" custom={3} variants={fadeUp}
                  className="t-muted text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-normal">
                  We design, engineer, and scale high-performance Machine Learning platforms, Data Analytics systems, and custom Software Engineering for ambitious companies.
                </motion.p>

                <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
                  <Link href="/contact">
                    <Button data-cursor="button" size="lg"
                      className="h-14 px-10 rounded-2xl btn-primary text-white border-0 gap-2 text-base shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95">
                      Book Strategy Call <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button data-cursor="button" variant="outline" size="lg"
                      className="h-14 px-10 rounded-2xl btn-ghost t-muted text-base border-border/50 hover:bg-secondary/20 transition-all">
                      View Capabilities
                    </Button>
                  </Link>
                </motion.div>

                <motion.p initial="hidden" animate="visible" custom={5} variants={fadeUp}
                  className="t-deco text-sm tracking-wide opacity-50 font-medium">
                  Serving startups, funded teams, and growth-stage companies globally.
                </motion.p>

              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 2.5 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.div animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-8 rounded-full border border-white/8 flex items-start justify-center pt-1.5">
                <div className="w-1 h-1.5 rounded-full bg-primary/40" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-20 border-y border-border/40 bg-background/50 backdrop-blur-sm">
          <div className="container-w">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 items-center gap-8 lg:gap-16 opacity-70">
              <span className="col-span-2 md:col-span-3 lg:col-span-1 t-deco text-[10px] uppercase tracking-[0.4em] font-bold text-center lg:text-left mb-4 lg:mb-0">CubicTech Systems Built For:</span>
              {["SaaS", "Fintech", "E-commerce", "Real Estate", "Healthcare", "Internal Systems"].map((tag, i) => (
                <span key={i} className="t-primary text-sm font-medium tracking-wide hover:t-secondary transition-colors cursor-default text-center whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SYSTEMS SECTION ===== */}
        <section className="section-pad bg-background">
          <div className="container-w relative">
            {/* Subtle Brand Watermark */}
            <div className="absolute -top-24 -right-12 text-[12vw] font-display font-black t-ghost select-none pointer-events-none opacity-[0.03] uppercase tracking-tighter">
              CubicTech
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              custom={0} variants={fadeUp} className="mb-20">
              <p className="label mb-6">Capabilities</p>
              <h2 className="text-4xl md:text-7xl t-primary tracking-tighter font-display leading-[0.95]">
                We don’t build pages.<br />
                <span className="text-gradient italic">We build digital systems.</span>
              </h2>
            </motion.div>

            <div className="space-y-4">
              {systemsData.map((item, i) => (
                <SpotlightCard
                  key={item.id}
                  active={expandedSystem === item.id}
                  className={`glass-card overflow-hidden transition-all duration-700 ${expandedSystem === item.id ? '' : 'bg-white/[0.01] hover:bg-white/[0.02]'}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <button
                      onClick={() => setExpandedSystem(expandedSystem === item.id ? null : item.id)}
                      className="w-full text-left p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-8">
                        <span className="text-sm font-mono opacity-20 font-bold">0{i + 1}</span>
                        <h3 className={`text-2xl md:text-4xl font-display tracking-tight transition-colors ${expandedSystem === item.id ? 't-primary text-gradient' : 't-secondary'}`}>
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="t-deco text-sm opacity-40 hidden md:block">{item.for}</span>
                        <div className={`w-10 h-10 rounded-full border border-white/5 flex items-center justify-center transition-transform duration-500 ${expandedSystem === item.id ? 'rotate-180' : ''}`}>
                          <ChevronRight className="w-4 h-4 opacity-40 rotate-90" />
                        </div>
                      </div>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: expandedSystem === item.id ? 'auto' : 0, opacity: expandedSystem === item.id ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 md:p-12 pt-0 md:pt-0 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/[0.03]">
                        <div className="lg:col-span-12">
                          <p className="t-muted text-xl max-w-3xl leading-relaxed mb-12">
                            {item.desc}
                          </p>
                        </div>
                        
                        <div className="lg:col-span-3">
                          <p className="t-deco text-[10px] uppercase tracking-widest font-bold mb-4 opacity-40">Strategic Focus</p>
                          <ul className="space-y-2">
                            {item.capabilities.map((c, idx) => (
                              <li key={idx} className="t-primary text-sm font-medium">{c}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="lg:col-span-3">
                          <p className="t-deco text-[10px] uppercase tracking-widest font-bold mb-4 opacity-40">Delivery Scope</p>
                          <p className="t-primary text-sm font-medium">{item.scope}</p>
                        </div>

                        <div className="lg:col-span-3">
                          <p className="t-deco text-[10px] uppercase tracking-widest font-bold mb-4 opacity-40">Engineering Stack</p>
                          <p className="t-primary text-sm font-medium">{item.stack}</p>
                        </div>

                        <div className="lg:col-span-3 flex items-end">
                          <Link href="/contact">
                            <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 t-muted text-xs group py-6 px-8">
                              Internal Discussion <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ENGINEERING PHILOSOPHY ===== */}
        <section className="section-pad bg-background overflow-hidden">
          <div className="container-w">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-6">Our DNA</p>
                <h2 className="text-4xl md:text-7xl t-primary leading-[0.95] mb-8 tracking-tighter font-display">
                  Built with clarity.<br /><span className="text-gradient italic">Scaled with intent.</span>
                </h2>
                <p className="t-muted text-xl leading-relaxed font-normal opacity-80">
                  We don't just write code; we architect systems. Every decision is weighed against performance, durability, and long-term business alignment.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "Strategy before execution", desc: "No code is written without a deep understanding of the problem space and the target outcome." },
                  { title: "Architecture before UI", desc: "We build solid foundations first. A beautiful interface on a weak system is a liability, not an asset." },
                  { title: "Performance before polish", desc: "Speed and reliability are non-negotiable. Polish is the final layer on an already high-performing machine." },
                  { title: "Long-term partnership", desc: "We think in years, not sprints. Our goal is to be the technical foundation of your growth." },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }}
                    custom={i} 
                    variants={fadeUp}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-bold t-primary tracking-tight">{item.title}</h3>
                    <p className="t-muted text-sm leading-relaxed opacity-70">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== ARCHITECTURE VISUALIZATION ===== */}
        <section className="py-32 bg-background">
          <div className="container-w">
            <div className="glass-card p-12 md:p-20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <p className="label mb-12 text-center opacity-50">Systems Lifecycle</p>
                
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-4 relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden lg:block -translate-y-1/2" />
                  
                  {[
                    "Discovery", "Design", "Engineering", "AI Integration", "Scale & Optimization"
                  ].map((step, i, arr) => (
                    <motion.div 
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative z-10 flex flex-col items-center group/step w-full lg:w-auto"
                    >
                      <div className="w-4 h-4 rounded-full bg-background border border-primary/20 mb-6 group-hover/step:scale-150 group-hover/step:border-primary transition-all duration-500 shadow-lg shadow-primary/5" />
                      <span className="text-lg font-display tracking-tight t-primary group-hover/step:t-primary transition-colors duration-500">{step}</span>
                      {i < arr.length - 1 && (
                        <div className="w-px h-8 bg-white/5 lg:hidden mt-4" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <p className="t-muted text-sm font-normal opacity-40">Every system we build follows this lifecycle — from clarity to scale.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CAPABILITIES OVERVIEW ===== */}
        <section className="section-pad-lg bg-background">
          <div className="container-w">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div>
                <p className="label mb-6">Expertise</p>
                <h2 className="text-4xl md:text-6xl font-display t-primary tracking-tighter">Full-spectrum<br />capabilities.</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                {[
                  {
                    category: "Design & Experience",
                    items: ["UI/UX Systems", "Design Systems", "Product Research"]
                  },
                  {
                    category: "Engineering & Platforms",
                    items: ["Web Applications", "SaaS Architecture", "DevOps"]
                  },
                  {
                    category: "AI & Automation",
                    items: ["LLM Integrations", "Workflow Automation", "Predictive Systems"]
                  },
                  {
                    category: "Growth & Performance",
                    items: ["Conversion Engineering", "Analytics Infrastructure", "Marketing Systems"]
                  }
                ].map((group, i) => (
                  <div key={i} className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] t-deco opacity-40">{group.category}</h3>
                    <ul className="space-y-3">
                      {group.items.map((item, idx) => (
                        <li key={idx} className="text-lg t-primary font-medium tracking-tight hover:t-primary transition-all cursor-default">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SELECTED OUTCOMES ===== */}
        <section className="section-pad bg-background">
          <div className="container-w">
            <div className="mb-20">
              <p className="label mb-6">Case Previews</p>
              <h2 className="text-4xl md:text-6xl t-primary tracking-tighter font-display leading-[0.95]">
                Selected outcomes.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Case Preview Cards with Spotlight Effect */}
              {[
                {
                  industry: "AI Fintech",
                  challenge: "Preventing complex multi-vector financial fraud in real-time across global markets.",
                  engineered: "Self-evolving neural network architecture with real-time graph analysis for pattern recognition.",
                  outcome: "99.9% Fraud Detection Accuracy"
                },
                {
                  industry: "Global E-commerce",
                  challenge: "Engineering transactional infrastructure to support 300K+ concurrent users during peak flash sales.",
                  engineered: "Multi-region serverless mesh with intelligent edge-routing and distributed cache synchronization.",
                  outcome: "300K+ Concurrent Users with 0ms Downtime"
                },
                {
                  industry: "Healthcare AI",
                  challenge: "Data silos preventing real-time patient risk assessment.",
                  engineered: "Secure RAG-based AI system for clinical documentation analysis.",
                  outcome: "40% increase in early-stage diagnosis accuracy."
                }
              ].map((caseItem, i) => (
                <SpotlightCard key={i} className="glass-card p-10 flex flex-col justify-between group h-full">
                  <motion.article 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div className="space-y-8">
                      <h3 className="t-deco text-[10px] uppercase tracking-widest font-bold opacity-30">{caseItem.industry}</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider t-muted mb-2 font-bold opacity-40">Challenge</p>
                          <p className="t-secondary text-sm leading-relaxed">{caseItem.challenge}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider t-muted mb-2 font-bold opacity-40">What We Engineered</p>
                          <p className="t-primary text-sm font-medium leading-relaxed">{caseItem.engineered}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-white/[0.03]">
                      <p className="text-[10px] uppercase tracking-wider t-muted mb-3 font-bold opacity-40">Outcome</p>
                      <p className="text-3xl font-display text-gradient font-extrabold tracking-tight">{caseItem.outcome}</p>
                    </div>
                  </motion.article>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FUTURE PRODUCT TEASE ===== */}
        <section className="py-32 bg-background border-y border-white/[0.03]">
          <div className="container-w">
            <div className="max-w-3xl">
              <p className="label mb-6 text-primary">Internal Projects</p>
              <h2 className="text-4xl md:text-5xl t-primary tracking-tighter font-display mb-8">
                We’re also building internal products.
              </h2>
              <p className="t-muted text-xl leading-relaxed font-normal opacity-80">
                Alongside client systems, we develop proprietary AI-enabled operational tools focused on performance and automation. This dual focus ensures our client engineering remains at the absolute edge of what’s possible.
              </p>
              <p className="t-deco text-xs mt-6 opacity-30 font-medium italic">Currently in private development.</p>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="section-pad-lg relative overflow-hidden bg-background">
          <div className="container-w text-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
              <p className="label mb-6">Strategic Partnership</p>
              <h2 className="text-5xl md:text-8xl font-bold t-primary mb-8 tracking-tighter font-display">
                Let’s build something<br /><span className="text-gradient italic">that lasts.</span>
              </h2>
              <p className="t-muted text-xl max-w-xl mx-auto mb-16 font-normal">
                If you're thinking long-term about your digital infrastructure and product architecture, we should talk.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/contact">
                  <Button data-cursor="button" size="lg"
                    className="h-16 px-12 text-lg btn-primary text-white border-0 rounded-2xl gap-2 font-medium shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Book Strategy Call <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button data-cursor="button" variant="outline" size="lg"
                    className="h-16 px-12 text-lg rounded-2xl btn-ghost t-muted border-white/10 hover:bg-white/5 transition-all">
                    Request Capability Deck
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
