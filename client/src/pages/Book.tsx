import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import type { PublicBooking } from "@shared/crm";
import { Layout } from "@/components/site/Layout";
import { CheckList, PageHero } from "@/components/site/blocks";
import { formatSlot, SlotPicker, useSlots } from "@/components/booking/SlotPicker";
import { useI18n } from "@/i18n";

type Done = { token: string; booking: PublicBooking };

function BookingForm({ start, channels, onDone, onChange }: { start: string; channels: string[]; onDone: (done: Done) => void; onChange: () => void }) {
  const { t, locale, intl } = useI18n();
  const b = t.booking;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, start, locale }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof body.message === "string" ? body.message : b.failed);
      onDone(body as Done);
    } catch (err) {
      setError(err instanceof Error ? err.message : b.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-4">
        <p className="flex items-center gap-2 font-medium t-primary"><CalendarCheck className="h-5 w-5" aria-hidden="true" />{formatSlot(start, intl)}</p>
        <button type="button" onClick={onChange} className="text-sm underline t-secondary">{b.change}</button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b-name" className="mb-1.5 block text-sm font-medium t-primary">{b.name}</label>
          <input id="b-name" name="name" required minLength={2} autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="b-email" className="mb-1.5 block text-sm font-medium t-primary">{b.email}</label>
          <input id="b-email" name="email" type="email" required autoComplete="email" className="field" dir="ltr" />
        </div>
        <div>
          <label htmlFor="b-phone" className="mb-1.5 block text-sm font-medium t-primary">{b.phone}</label>
          <input id="b-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" dir="ltr" />
        </div>
        <div>
          <label htmlFor="b-company" className="mb-1.5 block text-sm font-medium t-primary">{b.company}</label>
          <input id="b-company" name="company" autoComplete="organization" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="b-topic" className="mb-1.5 block text-sm font-medium t-primary">{b.topic}</label>
        <textarea id="b-topic" name="topic" rows={3} maxLength={1000} placeholder={b.topicPlaceholder} className="field" />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium t-primary">{b.channel}</legend>
        <div className="flex flex-wrap gap-2">
          {channels.map((channel, index) => (
            <label key={channel} className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm t-secondary has-[:checked]:border-[var(--t-primary)] has-[:checked]:t-primary">
              <input type="radio" name="channel" value={channel} defaultChecked={index === 0} className="sr-only" />
              {channel}
            </label>
          ))}
        </div>
      </fieldset>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && <p role="alert" className="text-sm text-[hsl(var(--destructive))]">{error}</p>}
      <button disabled={busy} className="btn btn-primary btn-lg w-full sm:w-auto">{busy ? b.submitting : b.submit}</button>
    </form>
  );
}

export function Confirmation({ done }: { done: Done }) {
  const { t, intl, base } = useI18n();
  const b = t.booking;
  const manage = `${base}/book/manage/${done.token}`;
  return (
    <div role="status" className="rounded-xl border border-[var(--line)] bg-[var(--success-soft)] p-8">
      <CheckCircle2 className="h-8 w-8 text-[var(--success)]" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-bold t-primary">{b.confirmedTitle}</h2>
      <p className="mt-2 text-lg t-primary">{formatSlot(done.booking.startAt, intl)} · {done.booking.channel}</p>
      <p className="mt-1 t-secondary">{b.withHost} {done.booking.hostName}</p>
      <p className="mt-4 t-secondary">{b.confirmedText}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`/api/booking/manage/${done.token}/ics`} className="btn btn-primary">{b.addToCalendar}</a>
        {done.booking.meetingLink && <a href={done.booking.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{b.join}</a>}
      </div>
      <p className="mt-6 text-sm t-muted">{b.manageHint}</p>
      <a href={manage} className="break-all text-sm underline t-secondary" dir="ltr">{typeof window === "undefined" ? manage : `${window.location.origin}${manage}`}</a>
    </div>
  );
}

export default function Book() {
  const { t } = useI18n();
  const b = t.booking;
  const { data, isLoading, isError } = useSlots();
  const [start, setStart] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  const body = () => {
    if (done) return <Confirmation done={done} />;
    if (isLoading) return <p className="t-muted">{b.loading}</p>;
    if (isError || !data) return <p className="t-secondary">{b.failed}</p>;
    if (!data.enabled) return <p className="t-secondary">{b.closed}</p>;
    if (data.slots.length === 0) return <p className="t-secondary">{b.noSlots}</p>;
    if (start) return <BookingForm start={start} channels={data.channels} onDone={setDone} onChange={() => setStart("")} />;
    return <SlotPicker slots={data.slots} value={start} onPick={setStart} />;
  };

  return (
    <Layout>
      <PageHero eyebrow={b.eyebrow} title={b.title} subtitle={b.subtitle} />
      <section className="section-pad">
        <div className="container-w grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="card min-w-0 p-6 md:p-10">
            {!done && <h2 className="display-3 mb-6">{start ? b.stepDetails : b.stepTime}</h2>}
            {body()}
          </div>
          <aside className="space-y-6">
            <CheckList items={b.points} />
            <div className="rule-top pt-6">
              <p className="text-sm t-muted">{b.orMessage}</p>
              <Link href="/contact" className="mt-2 inline-flex min-h-11 items-center font-medium underline t-primary">{b.messageUs}</Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
