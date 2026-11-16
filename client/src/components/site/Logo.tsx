import { useId } from "react";

/** The CubicTech mark: an isometric cube in gold, amber and deep teal, used as a solid brand mark. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 40" className={`shrink-0 ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-top`} x1="6" y1="4" x2="34" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6dcbc" />
          <stop offset="1" stopColor="#d6a77a" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="34" y1="14" x2="21" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c48c5c" />
          <stop offset="1" stopColor="#8a5a35" />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="6" y1="14" x2="19" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2b8f83" />
          <stop offset="1" stopColor="#123d38" />
        </linearGradient>
      </defs>
      <path d="M20 4 34 12 20 20 6 12z" fill={`url(#${id}-top)`} />
      <path d="M6 14.2 18.9 21.6v15.2L6 29.4z" fill={`url(#${id}-left)`} />
      <path d="M34 14.2 21.1 21.6v15.2L34 29.4z" fill={`url(#${id}-right)`} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo inline-flex items-center gap-2.5 ${className}`} dir="ltr">
      <LogoMark className="logo-mark h-7 w-7" />
      <span className="text-[1.2rem] font-semibold leading-none tracking-[-0.03em] t-primary" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        CubicTech
      </span>
    </span>
  );
}
