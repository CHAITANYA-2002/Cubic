import type { SiteSettings, Testimonial } from "@shared/site";
import { dangerButton, Empty, Field, ghostButton, inputClass, Panel } from "../ui";
import type { SiteUpdate } from "./SiteView";

const MAX_TESTIMONIALS = 12;
const BLANK: Testimonial = { quote: "", name: "", role: "", company: "" };

export function TestimonialsEditor({ site, onChange }: { site: SiteSettings; onChange: SiteUpdate }) {
  const list = site.testimonials;
  const setList = (testimonials: Testimonial[]) => onChange({ ...site, testimonials });
  const edit = (index: number, patch: Partial<Testimonial>) => setList(list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const remove = (index: number) => setList(list.filter((_, i) => i !== index));

  return (
    <Panel
      title="Testimonials"
      action={
        <button
          type="button"
          disabled={list.length >= MAX_TESTIMONIALS}
          onClick={() => setList([...list, BLANK])}
          className={`${ghostButton} disabled:opacity-50`}
        >
          Add testimonial
        </button>
      }
    >
      <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
        Only real quotes, word for word, from clients who have approved publication. Never invent, combine or paraphrase a testimonial.
      </p>
      {list.length === 0 ? (
        <Empty>No testimonials yet. The site hides the section until one is added.</Empty>
      ) : (
        <ol className="space-y-5">
          {list.map((item, index) => (
            <li key={index} className="rounded-xl border border-white/10 p-4">
              <Field label="Quote" hint="10–600 characters">
                <textarea rows={3} value={item.quote} onChange={(e) => edit(index, { quote: e.target.value })} className={inputClass} />
              </Field>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Field label="Name">
                  <input value={item.name} onChange={(e) => edit(index, { name: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Role">
                  <input value={item.role} onChange={(e) => edit(index, { role: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Company">
                  <input value={item.company} onChange={(e) => edit(index, { company: e.target.value })} className={inputClass} />
                </Field>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => confirm(`Remove the testimonial from ${item.name || "this client"}?`) && remove(index)}
                  className={dangerButton}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
