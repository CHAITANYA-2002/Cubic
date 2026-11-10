import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/work";

const hostOf = (url: string) => new URL(url).host;

/** Screenshot inside a minimal browser chrome, so it reads as a real, running site. */
export function BrowserFrame({ project, eager = false }: { project: Project; eager?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f12] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/55">{hostOf(project.liveUrl)}</span>
      </div>
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={`${project.name} — screenshot of the live build`}
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

export function KindBadge({ kind }: { kind: Project["kind"] }) {
  const tone = kind === "Client build" ? "border-emerald-400/30 text-emerald-300" : "border-white/15 t-muted";
  return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tone}`}>{kind}</span>;
}

export function LiveLink({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold t-primary hover:underline ${className}`}
    >
      Open live <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

/** Compact card for grids on the home and service pages. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col">
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} live`}>
        <BrowserFrame project={project} />
      </a>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <KindBadge kind={project.kind} />
        <span className="text-xs t-muted">{project.sector}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl t-primary">{project.name}</h3>
      <p className="mt-2 text-sm leading-relaxed t-muted">{project.summary}</p>
      <LiveLink project={project} className="mt-4" />
    </article>
  );
}
