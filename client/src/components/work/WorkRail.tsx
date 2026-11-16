import { useEffect, useRef } from "react";
import type { Project } from "@/data/work";
import { useI18n } from "@/i18n";
import { KindBadge, LiveLink } from "./ProjectCard";

const shot = (project: Project) => project.image.replace(".webp", "-640.webp");

/**
 * Horizontal gallery of live work. On wide screens with a fine pointer it pins to the viewport and
 * scrolls sideways as the page scrolls down; elsewhere it is a native swipeable row with snap points.
 */
export function WorkRail({ projects }: { projects: Project[] }) {
  const { t } = useI18n();
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = outer.current;
    const list = track.current;
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!root || !list) return;
    let frame = 0;
    const rtl = document.documentElement.dir === "rtl";

    const measure = () => {
      frame = 0;
      if (!query.matches) return;
      const distance = Math.max(0, list.scrollWidth - window.innerWidth);
      root.style.setProperty("--rail-height", `${window.innerHeight + distance}px`);
      const box = root.getBoundingClientRect();
      const travel = Math.max(1, box.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -box.top / travel));
      list.style.transform = `translate3d(${(rtl ? 1 : -1) * progress * distance}px, 0, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    // Keyboard users: tabbing into an off-screen slide scrolls the page so the track brings it into view.
    const onFocus = (event: FocusEvent) => {
      if (!query.matches) return;
      const slide = (event.target as HTMLElement).closest<HTMLElement>(".work-slide");
      const distance = list.scrollWidth - window.innerWidth;
      if (!slide || distance <= 0) return;
      const offset = rtl ? list.scrollWidth - slide.offsetLeft - slide.offsetWidth : slide.offsetLeft;
      const progress = Math.min(1, Math.max(0, (offset - window.innerWidth * 0.2) / distance));
      const top = root.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + progress * (root.offsetHeight - window.innerHeight) });
    };
    const toggle = () => {
      root.classList.toggle("is-pinned", query.matches);
      if (!query.matches) list.style.transform = "";
      schedule();
    };

    toggle();
    list.addEventListener("focusin", onFocus);
    query.addEventListener("change", toggle);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      list.removeEventListener("focusin", onFocus);
      query.removeEventListener("change", toggle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={outer} className="work-rail">
      <div className="work-rail-sticky">
        <ul ref={track} className="work-rail-track">
          {projects.map((project) => {
            const copy = t.work.projects[project.slug];
            return (
              <li key={project.slug} className="work-slide">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="work-shot">
                  <img
                    src={shot(project)}
                    srcSet={`${shot(project)} 640w, ${project.image} 1280w`}
                    sizes="(min-width: 1024px) 720px, 86vw"
                    width={1280}
                    height={project.slug === "superfox-roam" ? 693 : 800}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <KindBadge kind={project.kind} />
                  <span className="text-sm t-muted">{copy.sector}</span>
                </div>
                <h3 className="display-3 mt-3">{project.name}</h3>
                <p className="mt-3 max-w-xl t-secondary">{copy.summary}</p>
                <LiveLink project={project} className="mt-2" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
