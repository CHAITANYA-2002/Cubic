import { projects } from "@/data/work";

/** Angled, layered screenshots of the real builds — the Work page's hero art. */
export function WorkCollage() {
  const shots = projects.slice(0, 4);
  return (
    <div className="work-collage">
      {shots.map((project, index) => (
        <img
          key={project.slug}
          src={project.image.replace(".webp", "-640.webp")}
          width={640}
          height={400}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          style={{ "--n": index } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
