import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/blocks";
import { ContactForm } from "@/components/ContactForm";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

export default function Contact() {
  const { t } = useI18n();
  const { site } = useSite();
  const c = t.contact;
  const direct = [
    { icon: Mail, label: c.email, value: site.email, href: `mailto:${site.email}` },
    { icon: MessageCircle, label: c.whatsapp, value: site.phone, href: `https://wa.me/${site.whatsapp}`, external: true },
    { icon: Phone, label: c.phone, value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: Clock, label: c.hours, value: site.hours },
  ];

  return (
    <Layout>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <section className="section-pad">
        <div className="container-w grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="card reveal order-2 p-6 md:p-10 lg:order-1">
            <h2 className="display-3 mb-8">{c.formTitle}</h2>
            <ContactForm />
          </div>
          <aside className="order-1 space-y-8 lg:order-2">
            <div>
              <h2 className="text-lg font-semibold t-primary">{c.directTitle}</h2>
              <ul className="mt-5 space-y-4">
                {direct.map(({ icon: Icon, label, value, href, external }) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="mt-1 h-[18px] w-[18px] shrink-0 t-muted" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm t-muted">{label}</p>
                      {href ? (
                        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-11 items-center break-all font-medium t-primary hover:underline" dir="ltr">{value}</a>
                      ) : (
                        <p className="font-medium t-primary">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rule-top pt-8">
              <h2 className="text-lg font-semibold t-primary">{c.nextTitle}</h2>
              <ol className="mt-4 space-y-3">
                {c.next.map((step, index) => (
                  <li key={step} className="flex gap-3 text-[0.95rem] t-secondary">
                    <span className="step-dot !h-6 !w-6 !text-xs">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-[var(--line)] pt-4 text-sm t-secondary">{c.ndaNote}</p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
