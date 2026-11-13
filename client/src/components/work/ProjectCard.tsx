import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/work";
import { useI18n } from "@/i18n";

const hostOf = (url: string) => new URL(url).host;

/** Screenshot inside a minimal browser chrome, so it reads as a real, running site. */
export function BrowserFrame({ project, eager = false }: { project: Project; eager?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]" dir="ltr">
      <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--bg-subtle)] px-3.5 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="truncate rounded bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] t-muted">{hostOf(project.liveUrl)}</span>
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--bg-subtle)]">
        <img
          src={project.image}
          srcSet={`${project.image.replace(".webp", "-640.webp")} 640w, ${project.image} 1280w`}
          sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, (min-width: 768px) 44vw, 100vw"
          alt={`${project.name} — screenshot`}
          width={1280}
          height={800}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

export function KindBadge({ kind }: { kind: Project["kind"] }) {
  const { t } = useI18n();
  const tone = kind === "client" ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--bg-subtle)] t-muted";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>{t.common.kinds[kind]}</span>;
}

export function LiveLink({ project, className = "" }: { project: Project; className?: string }) {
  const { t } = useI18n();
  return (
    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold t-brand hover:underline ${className}`}>
      {t.common.cta.openLive} <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
      <span className="sr-only">— {project.name}</span>
    </a>
  );
}

/** Compact card for grids on the home and service pages. */
export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  const copy = t.work.projects[project.slug];
  return (
    <article className="group flex flex-col">
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
        <BrowserFrame project={project} />
      </a>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <KindBadge kind={project.kind} />
        <span className="text-xs t-muted">{copy.sector}</span>
      </div>
      <h3 className="mt-3 text-xl font-bold t-primary">{project.name}</h3>
      <p className="mt-2 text-sm leading-relaxed t-muted">{copy.summary}</p>
      <LiveLink project={project} className="mt-4" />
    </article>
  );
}
