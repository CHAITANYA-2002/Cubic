import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/work";
import { useI18n } from "@/i18n";

const hostOf = (url: string) => new URL(url).host;

/** Screenshot inside a minimal browser chrome, so it reads as a real, running site. */
export function BrowserFrame({ project, eager = false, sizes = "(min-width: 1280px) 560px, (min-width: 1024px) 45vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2.5rem)" }: { project: Project; eager?: boolean; sizes?: string }) {
  const { t } = useI18n();
  return (
    <div className="browser-frame" dir="ltr">
      <div className="browser-bar">
        <span className="flex gap-1.5" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-url">{hostOf(project.liveUrl)}</span>
      </div>
      <div className="browser-view">
        <picture className="block h-full w-full">
          <source media="(max-width: 767px)" srcSet={project.image.replace(".webp", "-640.webp")} />
        <img
          src={project.image}
          srcSet={`${project.image.replace(".webp", "-640.webp")} 640w, ${project.image} 1280w`}
          sizes={sizes}
          alt={`${project.name} — ${t.common.accessibility.screenshot}`}
          width={1280}
          height={project.slug === "superfox-roam" ? 693 : 800}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
        </picture>
      </div>
    </div>
  );
}

export function KindBadge({ kind }: { kind: Project["kind"] }) {
  const { t } = useI18n();
  const tone = kind === "client" ? "bg-[var(--success-soft)] text-[var(--success)]" : "border border-[var(--line-strong)] t-secondary";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>{t.common.kinds[kind]}</span>;
}

export function LiveLink({ project, className = "" }: { project: Project; className?: string }) {
  const { t } = useI18n();
  return (
    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
      className={`link-more ${className}`}>
      {project.link === "writeup" ? t.common.cta.openWriteup : t.common.cta.openLive} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">— {project.name}</span>
    </a>
  );
}

/** Compact card for grids on the home and service pages. */
export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  const copy = t.work.projects[project.slug];
  return (
    <article className="reveal group flex flex-col">
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
        <BrowserFrame project={project} />
      </a>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <KindBadge kind={project.kind} />
        <span className="text-xs t-secondary">{copy.sector}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight t-primary">{project.name}</h3>
      <p className="mt-2 text-sm leading-relaxed t-secondary">{copy.summary}</p>
      <LiveLink project={project} className="mt-4" />
    </article>
  );
}
