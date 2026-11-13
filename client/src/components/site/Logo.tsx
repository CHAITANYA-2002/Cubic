export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25z" fill="var(--ink, #0b1220)" />
        <path d="M16 2.5 28 9.25 16 16 4 9.25z" fill="#1d4ed8" />
        <path d="M16 16v13.5l12-6.75v-13.5z" fill="#1e3a8a" />
      </svg>
      <span className="font-display text-[1.15rem] font-bold tracking-tight t-primary">
        Cubic<span className="t-brand">Tech</span>
      </span>
    </span>
  );
}
