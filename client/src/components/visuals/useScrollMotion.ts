import { useEffect, type RefObject } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth wheel scrolling (Lenis) on desktop pointers. Native scroll everywhere else. */
export function useScrollMotion() {
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
    let destroyed = false;
    let stop: (() => void) | undefined;
    let raf = 0;
    import("lenis")
      .then(({ default: Lenis }) => {
        if (destroyed) return;
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
        const loop = (time: number) => {
          lenis.raf(time);
          raf = window.requestAnimationFrame(loop);
        };
        raf = window.requestAnimationFrame(loop);
        stop = () => lenis.destroy();
      })
      .catch(() => undefined);
    return () => {
      destroyed = true;
      window.cancelAnimationFrame(raf);
      stop?.();
    };
  }, []);
}

/**
 * Writes the element's scroll progress (0 → 1) to the CSS variable `--p`.
 * `start` / `end` are viewport fractions for the element's top at progress 0 and its bottom at progress 1.
 */
export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>, start = 0.85, end = 0.45) {
  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const from = viewport * start;
      const to = viewport * end - box.height;
      const progress = Math.min(1, Math.max(0, (from - box.top) / Math.max(1, from - to)));
      node.style.setProperty("--p", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [ref, start, end]);
}
