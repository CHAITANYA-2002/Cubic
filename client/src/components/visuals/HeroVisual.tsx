import { useEffect, useRef } from "react";

/** Live WebGL only where it is cheap: wide screens, fine pointer, motion allowed, enough memory. */
function canUseWebGL() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && (memory === undefined || memory >= 4);
}

/** Hero 3D: the pre-rendered still is the LCP image; capable desktops upgrade to live WebGL. */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || !canUseWebGL()) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("@/components/three/loadScene")
      .then(({ mountHeroScene }) => {
        if (cancelled) return;
        cleanup = mountHeroScene(host);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
  return (
    <div ref={ref} className="hero-visual render-stage">
      <img
        src="/images/3d/hero-cube-640.webp"
        srcSet="/images/3d/hero-cube-640.webp 640w, /images/3d/hero-cube.webp 1100w"
        sizes="(min-width: 1024px) 560px, 92vw"
        width={1100}
        height={900}
        alt=""
        aria-hidden="true"
        decoding="async"
        {...{ fetchpriority: "high" }}
      />
    </div>
  );
}
