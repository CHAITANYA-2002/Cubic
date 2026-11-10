import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Terminal, Globe, BrainCircuit, CheckCircle2, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

export default function About() {
  useEffect(() => {
    document.title = "Our Story | Machine Learning & Software Studio | CubicTech";
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">
          {/* ===== HERO ===== */}
          <section className="pt-44 pb-24 relative overflow-hidden">
            <HeroBackdrop image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80" position="center" intensity={0.55} />
            <div className="blob blob-purple w-[600px] h-[600px] -top-48 -right-32 opacity-[0.05]" />
            <div className="blob blob-blue w-[400px] h-[400px] bottom-0 left-[-15%] opacity-[0.04]" />

            <div className="container-w relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl"
              >
                <h1 className="text-display-hero">
                  Software and AI workflows<br /><span className="text-gradient italic">small teams can rely on.</span>
                </h1>
                <p className="text-xl md:text-2xl t-muted leading-relaxed font-normal mb-12 max-w-3xl">
                  CubicTech is an independent, remote-first software studio led by Chaitanya Khurana. We design and build practical web applications, AI workflows, and digital systems for teams that need more capability than an off-the-shelf tool can offer.
                </p>
                
                <div className="flex flex-wrap gap-10 mb-12">
                  {[
                    ["India", "Remote-first delivery"],
                    ["AI + Software", "Our lead capability"],
                    ["Two projects", "Maximum active capacity"]
                  ].map(([v, l]) => (
                    <div key={l}>
                      <span className="block text-2xl font-bold t-primary">{v}</span>
                      <span className="block text-[10px] t-deco mt-2 uppercase tracking-widest">{l}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== WHY WE EXIST ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-5">Why CubicTech Exists</p>
                  <h2 className="text-4xl md:text-5xl t-primary mb-8 leading-tight font-display">
                    Replacing agency chaos<br /><span className="text-gradient italic">with engineering discipline.</span>
                  </h2>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <p className="t-secondary text-lg leading-relaxed mb-8 font-medium">
                    Many teams are forced to choose between a beautiful interface, useful operations tooling, and a reliable technical foundation. We think those pieces should be designed together.
                  </p>
                  <p className="t-muted text-lg leading-relaxed font-light">
                    CubicTech brings product thinking, considered interface design, and engineering discipline into one engagement. We start with the workflow and the people using it, then build the smallest durable system that moves the work forward.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== OUR ENGINEERING PHILOSOPHY ===== */}
          <section className="section-pad relative overflow-hidden">
            <div className="blob blob-pink w-[400px] h-[400px] top-0 right-[-10%] opacity-[0.03]" />
            <div className="container-w relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-2xl mb-16">
                <p className="label mb-4">Our Philosophy</p>
                <h2 className="text-4xl md:text-5xl t-primary leading-[1.1] font-display">
                  How we think about<br /><span className="text-gradient italic">digital systems.</span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Terminal,
                    title: "Structure precedes scale",
                    desc: "We refuse to build on shaky foundations. Proper database modeling, caching strategies, and semantic architecture happen before a single aesthetic decision is finalized.",
                  },
                  {
                    icon: BrainCircuit,
                    title: "AI as native pluralism",
                    desc: "We don't bolt AI onto legacy systems as an afterthought. We design modern infrastructures where deterministic logic and probabilistic models coexist natively within data pipelines.",
                  },
                  {
                    icon: Shield,
                    title: "Intentional resistance",
                    desc: "We actively push back against short-term fixes. If a feature request introduces unmanageable technical debt, we will propose a structurally sound alternative. We engineer for the next 5 years.",
                  }
                ].map((v, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className="glass-card p-10 flex flex-col gap-6"
                  >
                    <v.icon className="w-8 h-8 t-secondary" />
                    <h3 className="text-xl font-bold t-primary">{v.title}</h3>
                    <p className="t-muted text-sm leading-relaxed">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== BUILT IN INDIA / GLOBAL SCALE ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="order-2 lg:order-1">
                  <div className="relative rounded-[2rem] overflow-hidden glass aspect-square border border-border/40 p-2">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="People collaborating in a studio"
                      className="w-full h-full object-cover rounded-3xl grayscale hover:grayscale-0 transition-all duration-1000 opacity-60 hover:opacity-100"
                    />
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="order-1 lg:order-2">
                  <p className="label mb-6">Global Mindset</p>
                  <h2 className="text-4xl md:text-5xl t-primary font-display mb-8 leading-tight">
                    Built in India.<br /><span className="text-gradient italic">Designed for global scale.</span>
                  </h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-6">
                  CubicTech is based in India and delivers remotely. The work is structured around clear written communication, sensible milestones, and decisions that can be understood by the people who have to live with the system.
                  </p>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                  We believe good digital work does not need inflated claims. It needs clear thinking, honest scope, and a build that remains useful after launch.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Remote-first collaboration from India (IST)",
                      "Written scope and milestone-based delivery",
                      "Practical documentation for handover and continuity",
                      "A maximum of two active projects at a time",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm t-muted">
                        <CheckCircle2 className="w-4 h-4 t-deco shrink-0 group-hover:t-secondary transition-colors" /> {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== WHERE WE'RE HEADED ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(180,130,100,0.04) 0%, transparent 70%)" }}>
            <div className="container-w text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-3xl mx-auto">
                <p className="label mb-6 mx-auto">The Future</p>
                <h2 className="text-4xl md:text-5xl t-primary mb-8 font-display">
                  Where we are headed.
                </h2>
                <p className="t-muted text-xl leading-relaxed font-normal mb-8">
                  CubicTech is building a focused services practice around software and AI workflows that make small teams more capable.
                </p>
                <p className="t-muted text-xl leading-relaxed font-normal">
                  We want every engagement to leave the client with a system they understand, can operate, and can improve. The goal is not to sell complexity; it is to remove it where it blocks useful work.
                </p>

                <div className="grid sm:grid-cols-3 gap-5 mt-16 text-left">
                  {[
                    ["Useful systems", "Software that earns its place in a team’s everyday work."],
                    ["Responsible AI", "Automation where it genuinely reduces repetitive knowledge work."],
                    ["Clear handover", "A build that does not leave the client dependent on mystery."],
                  ].map(([t, d]) => (
                    <div key={t} className="glass-card p-6">
                      <h3 className="text-base font-bold t-primary mb-2">{t}</h3>
                      <p className="t-muted text-sm leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ===== CTA ===== */}
          <section className="py-44 relative">
            <div className="blob blob-blue w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
            <div className="divider mb-20" />
            <div className="container-w text-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-5 mx-auto">Initiate Engagement</p>
                <h2 className="text-4xl md:text-6xl font-bold t-primary mb-6 leading-tight font-display">
                  Ready to engineer<br /><span className="text-gradient italic">your system?</span>
                </h2>
                <p className="t-muted text-lg max-w-md mx-auto mb-10 font-light">
                  We start with discovery. Share the workflow you want to improve, and we will help you decide whether a custom system is the right next step.
                </p>
                <Link href="/contact">
                  <Button data-cursor="button" size="lg" className="h-14 px-10 btn-primary text-white border-0 rounded-2xl text-base gap-2 shadow-xl shadow-primary/20">
                    Book a Strategy Call <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-xs t-deco tracking-widest uppercase mt-6">Remote-first · India (IST)</p>
              </motion.div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
