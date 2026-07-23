import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Monitor, Layout, Globe, BrainCircuit, Wrench, Megaphone,
  ArrowRight, Zap, Shield, Code2, Users, BarChart3, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const services = [
  {
    icon: Monitor,
    title: "Web Development",
    desc: "Pixel-perfect, high-performance websites using React, Next.js, and Tailwind CSS. We build sites that not only look stunning but load fast, rank high, and convert visitors.",
    link: "/services/web-development",
    tags: ["React", "Next.js", "TypeScript"],
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    desc: "Research-backed, user-first design that transforms complex workflows into delightful experiences. From wireframes to polished design systems.",
    link: "/services/ui-ux-design",
    tags: ["Figma", "User Research", "Prototyping"],
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Globe,
    title: "Web Applications",
    desc: "Complex, scalable platforms built for the real world — real-time features, enterprise security, robust APIs, and seamless integrations.",
    link: "/services/web-applications",
    tags: ["Node.js", "PostgreSQL", "REST API"],
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions",
    desc: "Intelligent automation that transforms how your business operates. Custom LLM integrations, chatbots, recommendation engines, and predictive analytics.",
    link: "/services/ai-solutions",
    tags: ["OpenAI", "LangChain", "ML"],
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Proactive 24/7 monitoring, regular updates, security patches, and performance optimization so you can focus on your business, not your website.",
    link: "/services/maintenance",
    tags: ["24/7 Monitoring", "Security", "Uptime"],
    img: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven campaigns that reach the right people at the right time. SEO, paid social, content marketing, and email that actually converts.",
    link: "/services/digital-marketing",
    tags: ["SEO", "Google Ads", "Analytics"],
    img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80",
  },
];

const process = [
  { icon: Users, step: "01", title: "Discovery & Strategy", desc: "We start with a deep-dive conversation to understand your business, your customers, and what success looks like for you. No templates, no assumptions." },
  { icon: Code2, step: "02", title: "Design & Prototype", desc: "High-fidelity designs and interactive prototypes before a single line of code. You see exactly what you're getting before we build it." },
  { icon: Zap, step: "03", title: "Build & Iterate", desc: "Agile sprints with regular check-ins. You're never left wondering what's happening — weekly updates keep you in the loop every step of the way." },
  { icon: BarChart3, step: "04", title: "Launch & Grow", desc: "Deployment, QA testing, handover documentation, and post-launch monitoring. We don't disappear after launch — we're here for the long run." },
];

const whyUs = [
  { icon: CheckCircle2, title: "Senior-level quality", desc: "Every project is led by an experienced engineer or designer — not handed off to a junior." },
  { icon: Shield, title: "Fixed-price projects", desc: "Know your budget upfront. No scope creep surprises, no hidden fees." },
  { icon: Zap, title: "Fast turnaround", desc: "Most websites delivered in 3–4 weeks. Complex apps in 6–10 weeks, not months." },
  { icon: Users, title: "Direct communication", desc: "You talk to the people actually building your product. Always." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

export default function Services() {
  useEffect(() => {
    document.title = "Our Capabilities | Machine Learning & Software Engineering | CubicTech";
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        {/* ===== HERO ===== */}
        <section className="pt-44 pb-24 relative overflow-hidden">
          <HeroBackdrop image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80" position="center" intensity={0.55} />
          <div className="blob blob-blue w-[600px] h-[600px] -top-48 right-[-15%] opacity-[0.05]" />
          <div className="blob blob-purple w-[400px] h-[400px] bottom-[-10%] left-[-10%] opacity-[0.04]" />
          <div className="container-w relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <p className="label mb-5">Our Services</p>
              <h1 className="text-5xl md:text-8xl font-bold t-primary mb-8 leading-[0.85] tracking-tighter">
                Everything your<br />
                brand needs to<br />
                <span className="text-gradient">win online.</span>
              </h1>
              <p className="text-xl md:text-2xl t-muted leading-relaxed font-light max-w-2xl">
                End-to-end digital solutions — from strategy and design to development and continuous growth. We handle the tech so you can focus on your business.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-end gap-x-12 gap-y-6 mt-14 pt-8 border-t border-white/[0.07] max-w-2xl"
            >
              {[["20+", "Projects Delivered"], ["100%", "Client Commitment"], ["Startup", "Phase & Agility"], ["24/7", "Support Available"]].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-gradient font-display leading-none">{val}</span>
                  <span className="text-[11px] t-muted mt-2 uppercase tracking-[0.18em]">{lbl}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="divider" />

        {/* ===== SERVICES GRID ===== */}
        <section className="pt-20 pb-28 relative overflow-hidden">
          <div className="aurora" />
          <div className="container-w relative z-10">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="label mb-4">What We Build</p>
              <h2 className="text-3xl md:text-5xl t-primary mb-4">Six disciplines,<br /><span className="text-gradient-flow">one team.</span></h2>
              <p className="t-muted text-lg font-light">We're cross-disciplinary by design — so you never have to piece together multiple vendors.</p>
            </motion.div>

            {/* Immersive bento grid — varied widths, full-bleed imagery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {services.map((s, i) => {
                const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];
                const accents = ["#6C8CFF", "#E879C7", "#22D3EE", "#A78BFA", "#34D399", "#FB923C"];
                const accent = accents[i];
                return (
                  <motion.div
                    key={i}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={spans[i]}
                  >
                    <Link href={s.link}>
                      <article
                        onMouseMove={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                          e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                        }}
                        className="group relative h-[380px] lg:h-[420px] rounded-[1.75rem] overflow-hidden border border-white/[0.06] cursor-pointer transition-all duration-500 hover:-translate-y-2"
                        style={{ boxShadow: "0 22px 60px -30px rgba(0,0,0,0.95)" }}
                      >
                        {/* full-bleed image */}
                        <img
                          src={s.img}
                          alt={s.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-[0.7] group-hover:opacity-95 group-hover:scale-105 transition-all duration-[1400ms] ease-out"
                        />
                        {/* base dark gradient */}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,11,12,0.97) 6%, rgba(11,11,12,0.5) 48%, rgba(11,11,12,0.1) 100%)" }} />
                        {/* accent colour wash rising from the bottom */}
                        <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `linear-gradient(to top, ${accent}33 0%, transparent 46%)` }} />
                        {/* cursor spotlight */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(360px circle at var(--mx,50%) var(--my,50%), ${accent}38, transparent 62%)` }} />

                        <span className="absolute top-6 right-7 text-xs font-mono tracking-[0.35em]" style={{ color: accent, opacity: 0.75 }}>0{i + 1}</span>

                        {/* content pinned to bottom */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-8">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border transition-all duration-500 group-hover:scale-110"
                            style={{ background: `${accent}1f`, borderColor: `${accent}59`, boxShadow: `0 0 26px -6px ${accent}70` }}
                          >
                            <s.icon className="w-5 h-5" style={{ color: accent }} />
                          </div>
                          <h3 className="text-2xl font-bold t-primary mb-2 font-display">{s.title}</h3>
                          <p className="t-secondary text-sm leading-relaxed max-w-md mb-4">{s.desc}</p>
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {s.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border font-medium" style={{ borderColor: `${accent}44`, background: "rgba(0,0,0,0.4)", color: "rgba(245,245,245,0.85)" }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all duration-500" style={{ color: accent }}>
                            <span>Explore service</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                          </div>
                        </div>

                        {/* accent hover ring + glow */}
                        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `inset 0 0 0 1px ${accent}77, 0 0 44px -8px ${accent}55` }} />
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ===== OUR PROCESS ===== */}
        <section className="py-24 relative overflow-hidden">
          <div className="blob blob-purple w-[500px] h-[500px] top-0 right-[-15%] opacity-[0.04]" />
          <div className="container-w relative z-10">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="label mb-4">How We Work</p>
              <h2 className="text-3xl md:text-5xl t-primary mb-4">A process built for <span className="text-gradient">transparency.</span></h2>
              <p className="t-muted text-lg font-light">No black boxes. You'll know exactly where your project is at every stage.</p>
            </motion.div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* connecting timeline line */}
              <div className="hidden lg:block absolute top-9 left-[12%] right-[12%] h-px" style={{ background: "linear-gradient(90deg, transparent, var(--divider-color), var(--divider-color), transparent)" }} />
              {process.map((p, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="glass-card p-7 flex flex-col relative"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                      <p.icon className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
                    </div>
                    <span className="text-3xl font-bold font-mono" style={{ color: "var(--t-ghost)" }}>{p.step}</span>
                  </div>
                  <h3 className="text-base font-bold t-primary mb-2">{p.title}</h3>
                  <p className="t-muted text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ===== WHY US ===== */}
        <section className="py-24 relative overflow-hidden">
          <div className="blob blob-blue w-[500px] h-[500px] bottom-0 left-[-15%] opacity-[0.04]" />
          <div className="container-w relative z-10">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14"
            >
              <div className="max-w-xl">
                <p className="label mb-4">Why CubicTech</p>
                <h2 className="text-3xl md:text-5xl t-primary leading-[1.1] mb-5">
                  We treat your business like <span className="text-gradient">our own.</span>
                </h2>
                <p className="t-muted text-lg leading-relaxed font-light">
                  Lots of agencies promise quality. We deliver it consistently — because we care about long-term relationships, not one-off transactions.
                </p>
              </div>
              <Link href="/contact">
                <Button data-cursor="button" className="btn-primary text-white border-0 rounded-2xl h-12 px-8 gap-2 shrink-0">
                  Start a Project <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyUs.map((w, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="glass-card p-7 flex flex-col gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <w.icon className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
                  </div>
                  <h3 className="text-base font-bold t-primary">{w.title}</h3>
                  <p className="t-muted text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-28 relative overflow-hidden">
          <div className="blob blob-blue w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" />
          <div className="divider mb-16" />
          <div className="container-w text-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
              <p className="label mb-5">Ready to Start?</p>
              <h1 className="text-5xl md:text-8xl font-bold t-primary mb-8 leading-[0.85] tracking-tighter font-display">
                The craft of<br /><span className="text-gradient italic">modern digital.</span>
              </h1>
              <p className="t-muted text-lg max-w-md mx-auto mb-10 font-light">
                Book a free 30-minute discovery call. No obligations, just a conversation.
              </p>
              <Link href="/contact">
                <Button data-cursor="button" size="lg" className="h-14 px-10 btn-primary text-white border-0 rounded-2xl text-base gap-2">
                  Book Free Call <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
