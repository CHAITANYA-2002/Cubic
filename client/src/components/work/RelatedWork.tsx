import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { projectsFor, type ServiceLine } from "@/data/work";
import { ProjectCard } from "./ProjectCard";

/** "See it live" strip for a service page: the real builds behind that service line. */
export function RelatedWork({ line, title = "See it live" }: { line: ServiceLine; title?: string }) {
  const items = projectsFor(line).slice(0, 3);
  if (items.length === 0) return null;
  return (
    <section className="section-pad border-t border-white/[0.06]">
      <div className="container-w">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="label mb-4">Live work</p>
            <h2 className="font-display text-4xl t-primary md:text-5xl">{title}</h2>
          </div>
          <Link href="/work" className="inline-flex items-center gap-1.5 text-sm font-semibold t-primary hover:underline">
            All work <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}
