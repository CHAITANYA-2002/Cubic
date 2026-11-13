import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { projectsFor, type ServiceLine } from "@/data/work";
import { useI18n } from "@/i18n";
import { SectionHeader } from "@/components/site/blocks";
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
            <Link href="/work" className="inline-flex items-center gap-1.5 font-semibold t-brand hover:underline">
              {t.common.cta.allWork} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          }
        />
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}
