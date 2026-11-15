import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/site/Layout";
import { Render3D } from "@/components/visuals/Render3D";
import { FaqList, PageHero } from "@/components/site/blocks";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

const pad = (value: number) => String(value).padStart(2, "0");

/** Tracks which FAQ category is currently in the reading zone of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");
  useEffect(() => {
    const sections = key.split("|").map((id) => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);
  return active;
}

export default function Faq() {
  const { t } = useI18n();
  const { site } = useSite();
  const f = t.faq;
  const total = f.categories.length;
  const active = useActiveSection(f.categories.map((category) => category.id));

  return (
    <Layout>
      <PageHero eyebrow={f.eyebrow} title={f.title} subtitle={f.subtitle} art={<Render3D name="faq" float eager />} />
      <section className="section-pad mesh mesh-teal">
        <div className="container-w grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          <nav aria-label={f.eyebrow} className="faq-chips lg:hidden">
            {f.categories.map((category) => (
              <a key={category.id} href={`#${category.id}`} aria-current={active === category.id ? "true" : undefined}>{category.title}</a>
            ))}
          </nav>
          <nav aria-label={f.eyebrow} className="hidden lg:block">
            <ul className="faq-nav glass-panel sticky top-24 space-y-0.5">
              {f.categories.map((category, index) => (
                <li key={category.id}>
                  <a href={`#${category.id}`} aria-current={active === category.id ? "true" : undefined}>
                    <span className="faq-nav-num" aria-hidden="true">{pad(index + 1)}</span>
                    <span>{category.title}</span>
                    <span className="faq-nav-count" aria-hidden="true">{category.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-16">
            {f.categories.map((category, index) => (
              <section key={category.id} id={category.id} className="scroll-mt-24" aria-labelledby={`${category.id}-title`}>
                <div className="faq-cat-head">
                  <div>
                    <p className="faq-cat-index" aria-hidden="true" dir="ltr">{pad(index + 1)} / {pad(total)}</p>
                    <h2 id={`${category.id}-title`} className="mt-2 font-display text-3xl font-semibold t-primary md:text-4xl">{category.title}</h2>
                  </div>
                  <span className="faq-cat-rule" aria-hidden="true" />
                </div>
                <FaqList items={category.items} />
              </section>
            ))}
            <div className="glass-panel mesh mesh-gold relative overflow-hidden p-7 md:p-10">
              <div className="grid items-center gap-6 md:grid-cols-[1fr_180px]">
                <div>
                  <h2 className="font-display text-3xl font-semibold t-primary">{f.stillTitle}</h2>
                  <p className="mt-3 max-w-xl t-secondary">{f.stillText}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/contact" className="btn btn-primary">{t.common.cta.contactUs}</Link>
                    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{t.common.cta.whatsapp}</a>
                  </div>
                </div>
                <Render3D name="cta" float className="hidden md:block" sizes="180px" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
