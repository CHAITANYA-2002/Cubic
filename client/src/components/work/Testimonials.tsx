import { testimonials } from "@/data/work";

/** Renders nothing until a real, approved quote is added to data/work.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="section-pad">
      <div className="container-w">
        <p className="label mb-6">In their words</p>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <figure key={item.name} className="glass-card p-8 md:p-10">
              <blockquote className="font-display text-2xl leading-snug t-primary">“{item.quote}”</blockquote>
              <figcaption className="mt-6 text-sm t-muted">
                <span className="font-semibold t-secondary">{item.name}</span> · {item.role}, {item.company}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
