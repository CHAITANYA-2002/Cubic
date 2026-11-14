import { useI18n } from "@/i18n";
import { SectionHeader } from "@/components/site/blocks";

const PHOTOS = ["code-screens", "dashboard", "ui-design"] as const;

/** "Inside a project": three wide photographs with captions over a gradient. */
export function ImageStrip() {
  const { t } = useI18n();
  return (
    <section className="section-pad mesh mesh-teal">
      <div className="container-w">
        <SectionHeader eyebrow={t.visuals.insideEyebrow} title={t.visuals.insideTitle} />
        <div className="image-strip">
          {PHOTOS.map((photo, index) => (
            <figure key={photo} className="image-tile">
              <img
                src={`/images/photos/${photo}-800.webp`}
                srcSet={`/images/photos/${photo}-800.webp 800w, /images/photos/${photo}.webp 1600w`}
                sizes="(min-width: 768px) 40vw, 100vw"
                width={800}
                height={450}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <p className="font-mono text-xs t-brand">0{index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold t-primary">{t.visuals.inside[index].title}</h3>
                <p className="mt-2 text-sm leading-relaxed t-secondary">{t.visuals.inside[index].text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
