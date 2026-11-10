import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MousePointerClick } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { PageMeta } from "@/components/PageMeta";
import { BrowserFrame, KindBadge, LiveLink } from "@/components/work/ProjectCard";
import { Testimonials } from "@/components/work/Testimonials";
import { projects, SERVICE_LINES, type Project, type ServiceLine } from "@/data/work";

const rise = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }) };

function ProjectFeature({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      id={project.slug}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={rise} custom={0}
      className="group grid scroll-mt-32 items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14"
    >
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} live`} className={index % 2 ? "lg:order-2" : ""}>
        <BrowserFrame project={project} eager={index === 0} />
      </a>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={project.kind} />
          <span className="text-xs t-muted">{project.sector}</span>
        </div>
        <h2 className="mt-4 font-display text-3xl t-primary md:text-4xl">{project.name}</h2>
        <p className="mt-4 text-lg leading-relaxed t-secondary">{project.summary}</p>
        <p className="mt-4 text-sm leading-relaxed t-muted"><span className="font-semibold t-secondary">The problem.</span> {project.problem}</p>

        <ul className="mt-6 space-y-2">
          {project.built.map((item) => (
            <li key={item} className="flex gap-3 text-sm t-secondary"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 t-deco" />{item}</li>
          ))}
        </ul>

        <p className="mt-6 text-xs t-muted">{project.stack.join(" · ")}</p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] t-deco"><MousePointerClick className="h-3.5 w-3.5" /> Try this</p>
          <p className="mt-1.5 text-sm t-secondary">{project.tryThis}</p>
        </div>

        <LiveLink project={project} className="mt-6 text-base" />
      </div>
    </motion.article>
  );
}

export default function CaseStudies() {
  const [filter, setFilter] = useState<ServiceLine | "all">("all");
  const shown = filter === "all" ? projects : projects.filter((project) => project.lines.includes(filter));

  return (
    <PageTransition>
      <PageMeta title="Work" description="Live builds by CubicTech — websites, web applications, AI agents and marketing automation you can open and use." />
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <section className="relative overflow-hidden pb-14 pt-44">
            <div className="container-w relative z-10">
              <motion.p initial="hidden" animate="visible" variants={rise} custom={0} className="label mb-6">Work</motion.p>
              <motion.h1 initial="hidden" animate="visible" variants={rise} custom={1} className="max-w-4xl font-display text-5xl t-primary md:text-7xl">
                Don't take our word for it. <span className="italic text-gradient">Open it.</span>
              </motion.h1>
              <motion.p initial="hidden" animate="visible" variants={rise} custom={2} className="mt-7 max-w-2xl text-lg leading-relaxed t-muted">
                Every project below is live. Click through it the way your customers would. Client builds are in production; product demos run on sample data so you can try every feature safely.
              </motion.p>
            </div>
          </section>

          <div className="sticky top-[68px] z-30 border-y border-white/[0.06] bg-background/85 backdrop-blur-md">
            <div className="container-w flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Filter by service">
              {[{ id: "all" as const, label: `All work (${projects.length})` }, ...SERVICE_LINES].map((line) => (
                <button
                  key={line.id}
                  role="tab"
                  aria-selected={filter === line.id}
                  onClick={() => setFilter(line.id)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${filter === line.id ? "border-transparent bg-[var(--accent-primary)] text-white" : "border-white/10 t-muted hover:t-primary"}`}
                >
                  {line.label}
                </button>
              ))}
            </div>
          </div>

          <section className="section-pad">
            <div className="container-w space-y-28">
              {shown.map((project, index) => <ProjectFeature key={project.slug} project={project} index={index} />)}
            </div>
          </section>

          <Testimonials />

          <section className="pb-28">
            <div className="container-w">
              <div className="glass-card flex flex-col items-start justify-between gap-8 p-10 md:flex-row md:items-center md:p-14">
                <div className="max-w-xl">
                  <p className="label mb-4">Your project</p>
                  <h2 className="font-display text-3xl t-primary md:text-4xl">Want something like this for your business?</h2>
                  <p className="mt-3 t-muted">A 30-minute call. We'll show you the closest build live and tell you honestly what yours would take.</p>
                </div>
                <Link href="/contact" className="btn-primary inline-flex shrink-0 items-center gap-2 rounded-2xl px-7 py-4 font-semibold text-white">
                  Book a discovery call <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
