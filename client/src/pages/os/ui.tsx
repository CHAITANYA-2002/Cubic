import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.02] ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/5">
          {title && <h2 className="text-sm font-semibold tracking-wide t-primary">{title}</h2>}
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint, tone = "default" }: { label: string; value: string | number; hint?: string; tone?: "default" | "warn" | "good" }) {
  const toneClass = tone === "warn" ? "text-amber-300" : tone === "good" ? "text-emerald-300" : "t-primary";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] t-muted">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs t-muted">{hint}</p>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium t-secondary">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] t-muted">{hint}</span>}
    </label>
  );
}

export const inputClass = "glow-input !py-2.5 !text-sm";

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto border-white/10 bg-[#111113] ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"}`}>
        <DialogHeader>
          <DialogTitle className="t-primary">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "good" | "warn" | "bad" | "info" }) {
  const tones = {
    default: "bg-white/5 text-white/70 border-white/10",
    good: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    warn: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    bad: "bg-red-500/10 text-red-300 border-red-500/20",
    info: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm t-muted">{children}</p>;
}

export function FormError({ error }: { error: unknown }) {
  if (!error) return null;
  return <p className="text-sm text-red-400">{error instanceof Error ? error.message : "Something went wrong"}</p>;
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-end gap-2 pt-2">{children}</div>;
}

export const primaryButton = "btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-50";
export const ghostButton = "btn-ghost rounded-xl px-4 py-2 text-sm";
export const dangerButton = "rounded-xl px-4 py-2 text-sm text-red-300 hover:bg-red-500/10";
