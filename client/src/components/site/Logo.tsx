export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} dir="ltr">
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25z" fill="#1c1c22" stroke="rgba(214,167,122,0.45)" strokeWidth="0.8" />
        <path d="M16 2.5 28 9.25 16 16 4 9.25z" fill="#e2b88e" />
        <path d="M16 16v13.5l12-6.75v-13.5z" fill="#b9875a" />
      </svg>
      <span className="text-[1.45rem] font-semibold leading-none tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        <span className="accent-text">Cubic</span>
        <span className="t-primary">Tech</span>
      </span>
    </span>
  );
}
