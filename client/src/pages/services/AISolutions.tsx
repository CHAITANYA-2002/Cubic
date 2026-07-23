import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  BrainCircuit, ArrowLeft, ArrowRight, ChevronDown,
  CheckCircle2, MessageSquare, Network, Lock, Workflow, Database, Bot
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

export default function AISolutions() {
  useEffect(() => {
    document.title = "AI & Machine Learning Solutions | Data Analytics | CubicTech";
  }, []);

  const [activeType, setActiveType] = useState<number | null>(null);
  const [activeTech, setActiveTech] = useState<string>("OpenAI / Anthropic");

  const aiTypes = [
    {
      title: "Intelligent Automation",
      bestFor: "High-volume operational workflows that require complex decision-making and data triage.",
      goal: "Reduce manual overhead by automating document parsing, support routing, and data entry.",
      complexity: "Medium",
      timeline: "5–8 Weeks",
      features: ["Custom prompt orchestration", "Self-healing workflow logic", "Human-in-the-loop gates"],
    },
    {
      title: "Predictive Analytics",
      bestFor: "Businesses with massive historical datasets seeking to forecast churn, demand, or risk.",
      goal: "Transform raw data into deterministic forecasts that drive proactive business decisions.",
      complexity: "High",
      timeline: "8–12 Weeks",
      features: ["Custom model training", "Feature engineering pipelines", "Real-time inference APIs"],
    },
    {
      title: "Custom RAG Systems",
      bestFor: "Knowledge-heavy organisations needing private, semantic search across internal docs.",
      goal: "Provide instant, citation-backed answers from your proprietary unstructured data.",
      complexity: "Medium",
      timeline: "6–10 Weeks",
      features: ["Vector database integration", "Semantic chunking logic", "Anti-hallucination layers"],
    },
    {
      title: "AI Agent Orchestration",
      bestFor: "Complex multi-step processes where AI needs to use tools (CRM, ERP, Web) autonomously.",
      goal: "Build autonomous agents that can plan, execute, and verify tasks across your stack.",
      complexity: "Critical",
      timeline: "12+ Weeks",
      features: ["Stateful agent memory", "Tool-use & Function calling", "Multi-agent coordination"],
    },
    {
      title: "Computer Vision",
      bestFor: "Industries requiring automated visual inspection, OCR, or object detection at scale.",
      goal: "Automate visual data processing with near-human accuracy and superhuman speed.",
      complexity: "High",
      timeline: "10–14 Weeks",
      features: ["Edge deployment readiness", "Custom dataset labelling", "High-speed inference"],
    },
  ];

  const engagementModels = [
    {
      tag: "Foundation",
      title: "Data & Strategy Audit",
      sub: "For companies exploring AI but lacking structured data or clear use cases.",
      points: ["Data pipeline assessment", "High-ROI workflow identification", "Security & compliance audit", "Proof-of-concept roadmap"],
      icon: Network,
      featured: false,
    },
    {
      tag: "Integration",
      title: "Intelligent Layer",
      sub: "For businesses ready to integrate LLMs or predictive models into workflows.",
      points: ["API-driven model integration", "Vector database architecture", "Custom RAG implementation", "Prompt evaluation frameworks"],
      icon: BrainCircuit,
      featured: true,
    },
    {
      tag: "Infrastructure",
      title: "Custom AI Systems",
      sub: "For organisations requiring private, compliant, and specific machine learning.",
      points: ["Fine-tuned open-source models", "Private cloud deployment", "Automated training pipelines", "Continuous model evaluation"],
      icon: Bot,
      featured: false,
    },
  ];

  const techStack: Record<string, string> = {
    "OpenAI / Anthropic": "We leverage state-of-the-art LLMs via highly optimized API pipelines, focusing on prompt engineering and output validation.",
    "Pinecone / Weaviate": "Vector databases act as the long-term memory for our AI systems, enabling semantic search and context-aware RAG.",
    "LangChain / LlamaIndex": "The orchestration framework for our AI agents, allowing us to chain models, tools, and memory into cohesive flows.",
    "PyTorch / TF": "Our foundations for custom deep learning and model fine-tuning when off-the-shelf models lack sufficient domain depth.",
    "FastAPI": "High-performance, type-safe API frameworks designed specifically for serving machine learning models with minimal latency.",
  };

  const faqs = [
    { q: "Is our data safe when using your AI solutions?", a: "Data privacy is our first engineering constraint. We use zero-data-retention APIs and can deploy private models on your infrastructure." },
    { q: "Do you build custom models or use existing ones?", a: "Both. We use state-of-the-art models for 80% of cases and fine-tune custom models only when highly specific domain logic is required." },
    { q: "How do you evaluate AI accuracy in production?", a: "We build automated evaluation pipelines using deterministic unit tests and LLM-as-a-judge frameworks to track response quality." },
    { q: "What is required from our engineering team?", a: "We can act autonomously or integrate with your team. At minimum, we require documentation of internal APIs and database schemas." },
    { q: "How do you handle AI hallucinations?", a: "Through multi-layered validation, citation-backed RAG, and deterministic fallback logic that ensures the system fails gracefully rather than confidently." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">

          {/* ===== HERO ===== */}
          <section className="pt-40 pb-32 relative overflow-hidden">
            <HeroBackdrop image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=80" position="center" intensity={0.6} />
            <div className="blob blob-purple w-[600px] h-[600px] -top-48 -right-24 opacity-[0.04]" />
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
                <p className="label mb-10 inline-flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> AI Solutions</p>
                <h1 className="text-display-hero">
                  Intelligence integrated<br />
                  <span className="text-gradient italic">into your production reality.</span>
                </h1>
                <p className="text-xl t-muted mb-12 max-w-2xl leading-relaxed font-normal">
                  We engineer AI not as a gimmick, but as core infrastructure. By integrating machine learning and large language models into your existing workflows, we automate high-friction processes securely.
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

          {/* ===== AI SELECTOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Strategic Choice</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">What type of intelligence?</h2>
                <p className="t-muted text-lg font-light mt-4 max-w-xl leading-relaxed">Select the implementation focus that matches your data maturity and operational goal.</p>
              </motion.div>

              <div className="space-y-3">
                {aiTypes.map((type, i) => (
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
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 80% 40% at 20% 60%, rgba(var(--primary-raw, 180 130 100), 0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">The Reality</p>
                  <h2 className="text-4xl md:text-5xl t-primary mb-12 font-display">What most AI projects<br />get wrong.</h2>
                  <ul className="space-y-8">
                    {[
                      { t: "Hype-Driven Implementation", d: "Adding chatbots without clear ROI or business logic integration, resulting in expensive toys rather than tools." },
                      { t: "Data Privacy Neglect", d: "Sending proprietary context to public training sets, risking massive compliance and security breaches." },
                      { t: "Unchecked Hallucinations", d: "Deploying purely probabilistic systems without deterministic validation layers, leading to unreliable business outputs." },
                      { t: "Isolated Chatbot Silos", d: "Treating AI as a sidebar conversation rather than a deeply integrated layer within existing product workflows." },
                      { t: "Lack of Scalable Infrastructure", d: "Building custom scripts instead of robust pipelines, making the system impossible to monitor or update." },
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
                  <h2 className="text-3xl t-secondary mb-12 font-display italic">How we engineer differently.</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Database, t: "Information Architecture First", d: "We vectorise and structure your data before choosing a model, ensuring AI reasoning is grounded in truth." },
                      { icon: Lock, t: "Zero-Data-Retention Pipelines", d: "We deploy private models and secure middleware to ensure your proprietary context never trains public LLMs." },
                      { icon: Workflow, t: "Deterministic Validation Layers", d: "Every model output is verified against your business rules and JSON schemas before reaching the user." },
                      { icon: Network, t: "Tool-Use & Function Orchestration", d: "Our agents don't just talk; they execute tasks inside your CRM, ERP, and databases securely." },
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
                    { icon: Database, t: "Information Architecture", d: "We vectorise and structure your data before choosing a model, ensuring AI reasoning is grounded in truth." },
                    { icon: Lock, t: "Zero-Data-Retention Pipelines", d: "We deploy private models and secure middleware to ensure your proprietary context never trains public LLMs." },
                    { icon: Workflow, t: "Deterministic Validation Layers", d: "Every model output is verified against your business rules and JSON schemas before reaching the user." },
                    { icon: Network, t: "Tool-Use & Function Orchestration", d: "Our agents don't just talk; they execute tasks inside your CRM, ERP, and databases securely." },
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
                  <h2 className="text-4xl t-primary font-display mb-6">AI as a node in your<br /><span className="text-gradient italic">larger ecosystem.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                    AI should not exist as an isolated silo. A model is only as intelligent as the data it has access to, and only as useful as the actions it is authorised to take.
                  </p>
                  <p className="t-muted text-base font-light leading-relaxed">
                    We approach AI integration as a data engineering challenge first. We ensure your databases can securely communicate with models, your APIs can trigger logic gracefully, and your infrastructure can handle probabilistic outputs without friction.
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
                    { title: "Define", items: ["Retrieval Strategy", "Model Selection", "Compliance Audit"] },
                    { title: "Architect", items: ["Vector Schema", "Prompt Engineering", "Validation Logic"] },
                    { title: "Engineer", items: ["Agent Pipelines", "Human-in-the-Loop", "Security Caching"] },
                    { title: "Scale", items: ["Latency Optimisation", "Hallucination Tracking", "Automated Evaluation"] },
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
                    We don't just connect APIs; we engineer intelligence. Every solution starts with data architecture and layers advanced reasoning based on scale.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { name: "Essential", items: ["Data Pipeline Audit", "LLM API Integration", "Custom Prompt Engineering", "Vector Search (Basic)", "Security Middleware"], color: "t-ghost" },
                    { name: "Growth", items: ["Advanced RAG Systems", "Agent Workflow Chaining", "Structured Data Extraction", "Human-in-the-loop Gates", "Usage & Cost Analytics"], color: "t-secondary" },
                    { name: "Infrastructure", items: ["Private Model Deployment", "Custom Fine-tuning", "Autonomous Tool-use", "Private Data Training", "SOC2 Compliant AI Stack"], color: "t-primary" },
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
                  Benchmarks we engineer for —<br /><span className="t-secondary italic">not afterthoughts.</span>
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {[
                  { label: "Model Accuracy", value: 98, suffix: "%", note: "Validated via custom evaluation sets and human-in-the-loop auditing." },
                  { label: "Request Latency", value: 450, suffix: "ms", prefix: "<", note: "Optimized inference pipelines for real-time application integration." },
                  { label: "Data Security", value: 100, suffix: "%", note: "SOC2-compliant architecture with zero-data-retention AI protocols." },
                  { label: "System Uptime", value: 99.9, suffix: "%", note: "Hardened infrastructure designed for mission-critical AI workloads." },
                ].map((stat, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    custom={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="text-4xl md:text-5xl font-bold font-display text-gradient mb-3 tracking-tight">
                      <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
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
                  <h2 className="text-4xl t-primary font-display mb-4">AI Frameworks —</h2>
                  <h2 className="text-4xl text-gradient italic font-display mb-10">and how we use them.</h2>
                  <p className="t-muted text-sm leading-relaxed mb-10 max-w-sm">
                    We select our AI stack based on security, latency, and the specific reasoning demands of the task. We avoid hype-led choices in favor of production-ready stability.
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
                  <h2 className="text-4xl t-primary font-display mb-6">Case Snapshot:<br /><span className="italic text-gradient">Legal Review Engine.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-6">
                    A legal tech platform where analysts spent 4 hours manually extracting 30+ specific clauses from 100-page commercial contracts.
                  </p>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">4h → 45s</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Extraction Time</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">99.8%</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Accuracy Rate</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-10 border-white/[0.05]">
                    <div className="space-y-8">
                      {[
                        { l: "The Situation", t: "Analysts manually reading 100+ page commercial contracts to identify complex risk clauses." },
                        { l: "The Challenge", t: "Required zero-data-retention (PII safety) and near-perfect accuracy with no hallucinated text." },
                        { l: "What We Engineered", t: "OCR-to-Vector pipeline running on a private, self-hosted Llama 3 70B model with JSON schema enforcement." },
                        { l: "The Outcome", t: "Extraction reduced to 45 seconds. Staff shifted from 'reading' to 'verifying' flagged edge cases." },
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
                  Strategic clarity is our standard. If you have a specific privacy or technical concern, our strategy call is the best place to address it.
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
            <div className="blob blob-purple w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" />
            <div className="container-w grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-6">Next Step</p>
                <h2 className="text-4xl md:text-5xl font-bold t-primary font-display mb-6 leading-tight">
                  Build intelligence<br /><span className="text-gradient italic">into your foundation.</span>
                </h2>
                <p className="text-lg t-muted font-light leading-relaxed max-w-md mb-8">
                  We start with an architecture assessment — analyzing your data readiness, security constraints, and operational bottlenecks before writing logic.
                </p>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] max-w-sm">
                  <p className="text-xs t-secondary leading-relaxed italic">
                    "We build AI systems designed to evolve over the next 3–5 years, ensuring your infrastructure stays at the cutting edge of what's possible."
                  </p>
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="flex flex-col gap-5 items-start lg:items-center justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button data-cursor="button" size="lg" className="h-16 px-10 rounded-2xl gap-3 btn-primary text-white border-0 text-lg shadow-2xl shadow-primary/20 w-full sm:w-auto">
                    Book an AI Strategy Call <MessageSquare className="w-5 h-5" />
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
