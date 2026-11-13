import type { SiteSettings } from "@shared/site";
import { Field, inputClass, Panel } from "../ui";
import type { SiteUpdate } from "./SiteView";

type TextKey = "email" | "phone" | "whatsapp" | "hours" | "address";
type SocialKey = keyof SiteSettings["socials"];

const contactFields: Array<[TextKey, string, string?]> = [
  ["email", "Email"],
  ["phone", "Phone (as displayed)", "For example +91 79769 89699"],
  ["whatsapp", "WhatsApp number", "Digits only with country code, for example 917976989699"],
  ["hours", "Working hours"],
  ["address", "Address / location line"],
];

const socialFields: Array<[SocialKey, string]> = [
  ["linkedin", "LinkedIn URL"],
  ["instagram", "Instagram URL"],
  ["github", "GitHub URL"],
  ["x", "X (Twitter) URL"],
];

export function ContactFields({ site, onChange }: { site: SiteSettings; onChange: SiteUpdate }) {
  const setFx = (currency: "EUR" | "AED", value: string) => onChange({ ...site, fx: { ...site.fx, [currency]: Number(value) } });

  return (
    <>
      <Panel title="Contact details">
        <div className="grid gap-4 sm:grid-cols-2">
          {contactFields.map(([key, label, hint]) => (
            <Field key={key} label={label} hint={hint}>
              <input value={site[key]} onChange={(e) => onChange({ ...site, [key]: e.target.value })} className={inputClass} />
            </Field>
          ))}
        </div>
        <label className="mt-5 flex items-center gap-3 text-sm t-secondary">
          <input
            type="checkbox"
            checked={site.acceptingProjects}
            onChange={(e) => onChange({ ...site, acceptingProjects: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-primary)]"
          />
          Accepting new projects (shown on the site)
        </label>
      </Panel>

      <Panel title="Social links">
        <p className="mb-4 text-xs t-muted">Full https:// URLs. Leave blank to hide an icon.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialFields.map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type="url"
                value={site.socials[key]}
                onChange={(e) => onChange({ ...site, socials: { ...site.socials, [key]: e.target.value.trim() } })}
                className={inputClass}
                placeholder="https://"
              />
            </Field>
          ))}
        </div>
      </Panel>

      <Panel title="Exchange rates">
        <p className="mb-4 text-xs t-muted">Units per 1 US dollar. EUR and AED prices are derived from the USD card with these rates.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="EUR per USD">
            <input type="number" step="0.01" min="0.01" max="10" value={site.fx.EUR} onChange={(e) => setFx("EUR", e.target.value)} className={inputClass} />
          </Field>
          <Field label="AED per USD">
            <input type="number" step="0.01" min="0.01" max="10" value={site.fx.AED} onChange={(e) => setFx("AED", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Panel>
    </>
  );
}
