import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { insertConsultationRequestSchema } from "@shared/schema";
import { priceIn, type Currency } from "@shared/site";
import { useSubmitContact } from "@/hooks/use-contact";
import { SERVICE_SLUGS } from "@/data/services";
import { useI18n } from "@/i18n";
import { formatMoney, useSite } from "@/lib/site";

// Budget bands per market. INR follows the Indian rate card; others derive from USD.
const BANDS = { INR: [150_000, 400_000, 1_000_000], USD: [5_000, 15_000, 40_000] } as const;

function budgetOptions(currency: Currency, fx: { EUR: number; AED: number }) {
  const edges = currency === "INR"
    ? [...BANDS.INR]
    : BANDS.USD.map((usd) => priceIn({ inr: [0, 0], usd: [usd, usd], monthly: false }, currency, fx)[0]);
  const money = (value: number) => formatMoney(value, currency);
  return [`< ${money(edges[0])}`, `${money(edges[0])} – ${money(edges[1])}`, `${money(edges[1])} – ${money(edges[2])}`, `${money(edges[2])}+`];
}

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium t-primary">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-[hsl(var(--destructive))]">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const { t } = useI18n();
  const { site, currency } = useSite();
  const mutation = useSubmitContact();
  const [errors, setErrors] = useState<Errors>({});
  const f = t.common.form;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const parsed = insertConsultationRequestSchema.safeParse(data);
    if (!parsed.success) {
      const fields = new Set(parsed.error.errors.map((issue) => String(issue.path[0])));
      setErrors({
        name: fields.has("name") ? f.required : undefined,
        email: fields.has("email") ? f.invalidEmail : undefined,
        message: fields.has("message") ? f.tooShort : undefined,
      });
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  if (mutation.isSuccess) {
    return (
      <div role="status" className="rounded-xl border border-[var(--line)] bg-[var(--success-soft)] p-8">
        <CheckCircle2 className="h-8 w-8 text-[var(--success)]" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-bold t-primary">{f.successTitle}</h3>
        <p className="mt-2 t-secondary">{f.successText}</p>
      </div>
    );
  }

  const describedBy = (key: keyof Errors) => (errors[key] ? `${key}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={f.name} error={errors.name}>
          <input id="name" name="name" autoComplete="name" required className="field" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
        </Field>
        <Field id="email" label={f.email} error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required className="field" dir="ltr" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
        </Field>
        <Field id="phone" label={f.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" dir="ltr" />
        </Field>
        <Field id="company" label={f.company}>
          <input id="company" name="company" autoComplete="organization" className="field" />
        </Field>
        <Field id="service" label={f.service}>
          <select id="service" name="service" className="field" defaultValue="">
            <option value="">—</option>
            {SERVICE_SLUGS.map((slug) => <option key={slug} value={t.common.serviceNames[slug]}>{t.common.serviceNames[slug]}</option>)}
          </select>
        </Field>
        <Field id="budget" label={`${f.budget} (${currency})`}>
          <select id="budget" name="budget" className="field" defaultValue="">
            <option value="">{f.budgetUnsure}</option>
            {budgetOptions(currency, site.fx).map((band) => <option key={band} value={band}>{band}</option>)}
          </select>
        </Field>
      </div>
      <Field id="message" label={f.message} error={errors.message}>
        <textarea id="message" name="message" rows={5} required className="field" placeholder={f.messageHint} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message")} />
      </Field>
      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="botcheck">Leave empty</label>
        <input id="botcheck" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {mutation.isError && <p role="alert" className="text-sm text-[hsl(var(--destructive))]">{f.error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs t-secondary">{f.privacy}</p>
        <button type="submit" className="btn btn-primary btn-lg" disabled={mutation.isPending}>
          {mutation.isPending ? f.sending : f.submit}
        </button>
      </div>
    </form>
  );
}
