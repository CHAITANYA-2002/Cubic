import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

/** Renders nothing until a real, approved quote is added in /admin (Site → Testimonials). */
export function Testimonials() {
  const { t } = useI18n();
  const { site } = useSite();
  if (site.testimonials.length === 0) return null;
  return (
    <section className="section-pad">
      <div className="container-w">
        <p className="label mb-6">{t.work.testimonialsTitle}</p>
        <div className="grid gap-6 md:grid-cols-2">
          {site.testimonials.map((item) => (
            <figure key={`${item.name}-${item.company}`} className="card p-8">
              <blockquote className="text-xl leading-snug t-primary">“{item.quote}”</blockquote>
              <figcaption className="mt-6 text-sm t-secondary">
                <span className="font-semibold t-secondary">{item.name}</span>
                {item.role || item.company ? ` · ${[item.role, item.company].filter(Boolean).join(", ")}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
