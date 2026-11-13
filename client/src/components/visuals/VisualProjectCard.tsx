import type { Project } from "@/data/work";
import { useI18n } from "@/i18n";
import { DeviceComposition } from "./Devices";
import { KindBadge, LiveLink } from "@/components/work/ProjectCard";
export function VisualProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  const copy = t.work.projects[project.slug];
  return <article className="visual-project"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true"><DeviceComposition compact project={project}/></a><div className="work-caption"><KindBadge kind={project.kind}/><h3 className="mt-4 text-2xl font-semibold">{project.name}</h3><p className="mt-3 t-secondary">{copy.summary}</p><LiveLink project={project} className="mt-4"/></div></article>;
}
