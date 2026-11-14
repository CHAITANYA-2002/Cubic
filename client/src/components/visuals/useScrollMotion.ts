import { useEffect } from "react";

/** Smooth scrolling (Lenis) and light parallax on banner photos and photo bands. Desktop only. */
export function useScrollMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    let destroyed = false;
    let lenisStop: (() => void) | undefined;
    let raf = 0;

    if (desktop) {
      import("lenis")
        .then(({ default: Lenis }) => {
          if (destroyed) return;
          const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
          const loop = (time: number) => {
            lenis.raf(time);
            raf = window.requestAnimationFrame(loop);
          };
          raf = window.requestAnimationFrame(loop);
          lenisStop = () => lenis.destroy();
        })
        .catch(() => undefined);
    }

    let ticking = 0;
    const parallax = () => {
      if (ticking) return;
      ticking = window.requestAnimationFrame(() => {
        ticking = 0;
        const viewport = window.innerHeight;
        document.querySelectorAll<HTMLElement>(".banner-art img, .photo-band img").forEach((img) => {
          const box = img.parentElement?.getBoundingClientRect();
          if (!box || box.bottom < 0 || box.top > viewport) return;
          const progress = (box.top + box.height / 2 - viewport / 2) / viewport;
          img.style.setProperty("--parallax", (progress * -60).toFixed(1));
        });
      });
    };
    window.addEventListener("scroll", parallax, { passive: true });
    parallax();

    return () => {
      destroyed = true;
      window.removeEventListener("scroll", parallax);
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(ticking);
      lenisStop?.();
    };
  }, []);
}
