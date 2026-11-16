import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import type { PublicBooking } from "@shared/crm";
import { Layout } from "@/components/site/Layout";
import { formatSlot, SlotPicker, useSlots } from "@/components/booking/SlotPicker";
import { useI18n } from "@/i18n";

/** The visitor's own booking: see it, add it to a calendar, move it or cancel it. Never indexed. */
export default function BookManage() {
  const { t, intl } = useI18n();
  const b = t.booking;
  const { token = "" } = useParams<{ token: string }>();
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");
  const slots = useSlots();

  useEffect(() => {
    const meta = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex,nofollow" });
    document.head.appendChild(meta);
    fetch(`/api/booking/manage/${token}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        setBooking((await res.json()) as PublicBooking);
        setState("ready");
      })
      .catch(() => setState("missing"));
    return () => meta.remove();
  }, [token]);

  async function act(path: "cancel" | "reschedule", body?: unknown) {
    setError("");
    const res = await fetch(`/api/booking/manage/${token}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.message === "string" ? data.message : b.failed);
      return;
    }
    setBooking(data as PublicBooking);
    setMoving(false);
    void slots.refetch();
  }

  return (
    <Layout>
      <section className="section-pad pt-36">
        <div className="container-w max-w-3xl">
          <h1 className="display-2 mb-8">{b.manageTitle}</h1>
          {state === "loading" && <p className="t-muted">{b.loading}</p>}
          {state === "missing" && (
            <div className="space-y-4">
              <p className="t-secondary">{b.notFound}</p>
              <Link href="/book" className="btn btn-primary">{b.bookAgain}</Link>
            </div>
          )}
          {state === "ready" && booking && (
            <div className="card space-y-6 p-6 md:p-10">
              <div>
                <p className="text-2xl font-semibold t-primary">{formatSlot(booking.startAt, intl)}</p>
                <p className="mt-1 t-secondary">{booking.channel} · {b.withHost} {booking.hostName}</p>
                <p className="mt-1 text-sm t-muted">{b.statusLabel}: {booking.status}</p>
              </div>
              {booking.status === "Cancelled" ? (
                <div className="space-y-4">
                  <p className="t-secondary">{b.cancelled}</p>
                  <Link href="/book" className="btn btn-primary">{b.bookAgain}</Link>
                </div>
              ) : booking.status === "Scheduled" ? (
                <>
                  <div className="flex flex-wrap gap-3">
                    <a href={`/api/booking/manage/${token}/ics`} className="btn btn-primary">{b.addToCalendar}</a>
                    {booking.meetingLink && <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{b.join}</a>}
                    <button onClick={() => setMoving(!moving)} className="btn btn-outline">{b.reschedule}</button>
                    <button onClick={() => confirm(b.cancelConfirm) && act("cancel")} className="btn btn-outline">{b.cancel}</button>
                  </div>
                  {moving && slots.data && <SlotPicker slots={slots.data.slots} value="" onPick={(start) => act("reschedule", { start })} />}
                </>
              ) : null}
              {error && <p role="alert" className="text-sm text-[hsl(var(--destructive))]">{error}</p>}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
