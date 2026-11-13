import { useEffect, useState, type FormEvent } from "react";
import type { SiteSettings } from "@shared/site";
import { osFetch, useOsMutation, useSiteSettings } from "@/lib/os-api";
import { Actions, FormError, primaryButton } from "../ui";
import { ContactFields } from "./ContactFields";
import { RateCard } from "./RateCard";
import { TestimonialsEditor } from "./TestimonialsEditor";

export type SiteUpdate = (next: SiteSettings) => void;

/** Everything the public site reads from /api/site: contact details, socials, FX, rate card, testimonials. */
export default function SiteView() {
  const { data, isLoading, error } = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const save = useOsMutation((body: SiteSettings) => osFetch<SiteSettings>("PUT", "/api/admin/site", body));

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  if (error) return <FormError error={error} />;
  if (isLoading || !draft) return <p className="t-muted">Loading…</p>;

  const update: SiteUpdate = (next) => {
    setSaved(false);
    setDraft(next);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, {
      onSuccess: (stored) => {
        setDraft(stored);
        setSaved(true);
      },
    });
  };

  return (
    <form onSubmit={submit} className="max-w-5xl space-y-6">
      <header>
        <p className="label mb-2">Public website</p>
        <h1 className="text-3xl t-primary">Site</h1>
        <p className="mt-1 text-sm t-muted">Changes go live on the website within about a minute of saving.</p>
      </header>

      <ContactFields site={draft} onChange={update} />
      <RateCard site={draft} onChange={update} />
      <TestimonialsEditor site={draft} onChange={update} />

      <FormError error={save.error} />
      <Actions>
        <button disabled={save.isPending} className={primaryButton}>
          {saved ? "Saved ✓" : save.isPending ? "Saving…" : "Save site settings"}
        </button>
      </Actions>
    </form>
  );
}
