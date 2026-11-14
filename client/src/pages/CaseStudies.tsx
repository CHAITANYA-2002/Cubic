import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { WorkCollage } from "@/components/visuals/WorkCollage";
import { CheckList, CtaBand, PageHero } from "@/components/site/blocks";
import { BrowserFrame, KindBadge, LiveLink } from "@/components/work/ProjectCard";
import { Testimonials } from "@/components/work/Testimonials";
import { projects, SERVICE_LINES, type Project, type ServiceLine } from "@/data/work";
import { useI18n } from "@/i18n";

function ProjectFeature({ project, index }: { project: Project; index: number }) {
  const { t } = useI18n();
  const copy = t.work.projects[project.slug];
  return (
    <article id={project.slug} className="project-feature group grid scroll-mt-32 items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className={index % 2 ? "lg:order-2" : ""}>
        <BrowserFrame project={project} eager={index === 0} />
      </a>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={project.kind} />
          <span className="text-xs t-secondary">{copy.sector}</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold t-primary md:text-3xl">{project.name}</h2>
        <p className="mt-4 text-lg leading-relaxed t-secondary">{copy.summary}</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed t-secondary"><span className="font-semibold t-secondary">{t.work.problem}.</span> {copy.problem}</p>
        <p className="mt-6 text-sm font-semibold t-primary">{t.work.built}</p>
        <CheckList items={copy.built} className="mt-3 text-[0.95rem]" />
        <p className="mt-6 text-xs t-secondary" dir="ltr">{t.work.stack}: {project.stack.join(" · ")}</p>
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--bg-subtle)] p-6 md:p-7">
          <p className="flex items-center gap-2 font-mono text-xs font-medium t-secondary">
            <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" /> {t.work.tryThis}
          </p>
          <p className="mt-1.5 text-sm t-secondary">{copy.tryThis}</p>
        </div>
        <LiveLink project={project} className="mt-6 text-base" />
      </div>
    </article>
  );
}

export default function CaseStudies() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<ServiceLine | "all">("all");
  const shown = filter === "all" ? projects : projects.filter((project) => project.lines.includes(filter));
  const tabs = [{ id: "all" as const, label: `${t.work.filterAll} (${projects.length})` }, ...SERVICE_LINES.map((line) => ({ id: line.id, label: t.work.lines[line.id] }))];

  return (
    <Layout>
      <PageHero eyebrow={t.work.eyebrow} title={t.work.title} subtitle={t.work.subtitle} art={<WorkCollage />} />
      <div className="sticky top-16 z-30 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl">
        <div className="container-w flex flex-wrap gap-2 py-3" role="group" aria-label={t.work.filterLabel}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`min-h-11 shrink-0 rounded-xl border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === tab.id ? "border-[var(--brand-line)] bg-[var(--brand-soft)] t-primary" : "border-[var(--line)] t-secondary hover:t-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <section className="section-pad">
        <div className="container-w space-y-24">
          {shown.map((project, index) => <ProjectFeature key={project.slug} project={project} index={index} />)}
        </div>
      </section>
      <Testimonials />
      <CtaBand title={t.work.ctaTitle} text={t.work.ctaText} />
    </Layout>
  );
}
