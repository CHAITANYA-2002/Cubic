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
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    desc: "Research-backed, user-first design that transforms complex workflows into delightful experiences. From wireframes to polished design systems.",
    link: "/services/ui-ux-design",
    tags: ["Figma", "User Research", "Prototyping"],
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Globe,
    title: "Web Applications",
    desc: "Complex, scalable platforms built for the real world — real-time features, enterprise security, robust APIs, and seamless integrations.",
    link: "/services/web-applications",
    tags: ["Node.js", "PostgreSQL", "REST API"],
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions",
    desc: "Intelligent automation that transforms how your business operates. Custom LLM integrations, chatbots, recommendation engines, and predictive analytics.",
    link: "/services/ai-solutions",
    tags: ["OpenAI", "LangChain", "ML"],
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Proactive 24/7 monitoring, regular updates, security patches, and performance optimization so you can focus on your business, not your website.",
    link: "/services/maintenance",
    tags: ["24/7 Monitoring", "Security", "Uptime"],
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven campaigns that reach the right people at the right time. SEO, paid social, content marketing, and email that actually converts.",
    link: "/services/digital-marketing",
    tags: ["SEO", "Google Ads", "Analytics"],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
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
        <section className="pt-20 pb-28 relative">
          <div className="container-w">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="label mb-4">What We Build</p>
              <h2 className="text-3xl md:text-5xl t-primary mb-4">Six disciplines,<br /><span className="text-gradient">one team.</span></h2>
              <p className="t-muted text-lg font-light">We're cross-disciplinary by design — so you never have to piece together multiple vendors.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                >
                  <Link href={s.link}>
                    <article
                      className="group relative h-full flex flex-col rounded-[1.75rem] overflow-hidden border border-white/[0.06] bg-white/[0.02] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-[rgba(214,167,122,0.35)]"
                      style={{ boxShadow: "0 18px 50px -26px rgba(0,0,0,0.9)" }}
                    >
                      {/* Image */}
                      <div className="relative h-52">
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={s.img}
                            alt={s.title}
                            loading="lazy"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1200ms] ease-out"
                          />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary) 2%, rgba(11,11,12,0.25) 55%, transparent 100%)" }} />
                        </div>
                        <span className="absolute top-4 right-5 text-xs font-mono t-deco tracking-[0.3em]">0{i + 1}</span>
                        <div className="absolute -bottom-7 left-6 z-10 w-14 h-14 rounded-2xl glass flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                          <s.icon className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
                        </div>
                      </div>

                      <div className="p-7 pt-11 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold t-primary mb-3 group-hover:text-gradient transition-all duration-500">{s.title}</h3>
                        <p className="t-muted text-sm leading-relaxed flex-grow mb-5">{s.desc}</p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {s.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border t-secondary font-medium" style={{ borderColor: "var(--divider-color)", background: "rgba(255,255,255,0.02)" }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold mt-auto" style={{ color: "var(--accent-primary)" }}>
                          <span>Explore service</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" />
                        </div>
                      </div>

                      {/* hover glow */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(600px circle at 50% -10%, rgba(214,167,122,0.10), transparent 55%)" }} />
                    </article>
                  </Link>
                </motion.div>
              ))}
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
