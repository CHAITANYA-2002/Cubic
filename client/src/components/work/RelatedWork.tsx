import { projectsFor, type ServiceLine } from "@/data/work";
import { useI18n } from "@/i18n";
import { MoreLink, SectionHeader } from "@/components/site/blocks";
import { ProjectCard } from "./ProjectCard";

/** "Related live work" strip for a service page: the real builds behind that service line. */
export function RelatedWork({ line }: { line: ServiceLine }) {
  const { t } = useI18n();
  const items = projectsFor(line).slice(0, 3);
  if (items.length === 0) return null;
  return (
    <section className="section-pad section-subtle">
      <div className="container-w">
        <SectionHeader
          eyebrow={t.work.eyebrow}
          title={t.services.detail.relatedTitle}
          action={
<MoreLink href="/work">{t.common.cta.allWork}</MoreLink>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}
