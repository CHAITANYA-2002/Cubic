import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n";

export type SlotFeed = { enabled: boolean; callMinutes: number; channels: string[]; slots: string[] };

export const useSlots = () =>
  useQuery({
    queryKey: ["booking", "slots"],
    queryFn: async () => {
      const res = await fetch("/api/booking/slots", { cache: "no-store" });
      if (!res.ok) throw new Error("slots");
      return (await res.json()) as SlotFeed;
    },
    staleTime: 30_000,
  });

const visitorZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
};

/** Open times grouped by the visitor's own calendar day, shown in their timezone. */
export function SlotPicker({ slots, value, onPick }: { slots: string[]; value: string; onPick: (iso: string) => void }) {
  const { intl, t } = useI18n();
  const zone = visitorZone();
  const days = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const iso of slots) {
      const key = new Date(iso).toLocaleDateString("en-CA"); // YYYY-MM-DD in the visitor's zone
      groups.set(key, [...(groups.get(key) ?? []), iso]);
    }
    return Array.from(groups.entries());
  }, [slots]);
  const [day, setDay] = useState<string>(() => days[0]?.[0] ?? "");
  const activeDay = days.find(([key]) => key === day) ?? days[0];

  return (
    <div>
      <p className="mb-3 text-sm t-muted">{t.booking.timezone}{zone && `: ${zone.replace(/_/g, " ")}`}</p>
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="listbox" aria-label={t.booking.stepTime}>
        {days.map(([key, times]) => {
          const date = new Date(times[0]);
          const selected = key === activeDay?.[0];
          return (
            <button
              key={key}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => setDay(key)}
              className={`min-w-[76px] shrink-0 rounded-xl border px-3 py-2 text-center transition-colors ${selected ? "border-[var(--t-primary)] bg-[var(--surface)]" : "border-[var(--line)] hover:border-[var(--line-strong)]"}`}
            >
              <span className="block text-xs t-muted">{date.toLocaleDateString(intl, { weekday: "short" })}</span>
              <span className="block text-lg font-semibold t-primary">{date.toLocaleDateString(intl, { day: "numeric" })}</span>
              <span className="block text-xs t-muted">{date.toLocaleDateString(intl, { month: "short" })}</span>
            </button>
          );
        })}
      </div>
      {activeDay && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {activeDay[1].map((iso) => (
            <button
              key={iso}
              type="button"
              aria-pressed={iso === value}
              onClick={() => onPick(iso)}
              className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${iso === value ? "border-transparent bg-[var(--btn-bg)] text-[var(--btn-fg)]" : "border-[var(--line)] t-primary hover:border-[var(--line-strong)]"}`}
              dir="ltr"
            >
              {new Date(iso).toLocaleTimeString(intl, { hour: "numeric", minute: "2-digit" })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const formatSlot = (iso: string, intl: string) =>
  new Date(iso).toLocaleString(intl, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
