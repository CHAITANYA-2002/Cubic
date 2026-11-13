import { useEffect, useRef } from "react";
/** No hidden initial state: native HTML and CSS stay usable without JavaScript. */
export function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed"); observer.unobserve(entry.target);
      }
    }, { threshold: .08 });
    root.querySelectorAll<HTMLElement>(".card, .visual-project, .process-steps").forEach((el,i) => {
      el.style.setProperty("--reveal-delay", `${i % 3 * 70}ms`); observer.observe(el);
    });
    let frame = 0;
    const moveGlow = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        root.querySelector<HTMLElement>(".device-glow")?.style.setProperty("transform", `translateY(${Math.min(window.scrollY * .035, 20)}px)`);
        frame = 0;
      });
    };
    window.addEventListener("scroll", moveGlow, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", moveGlow); window.cancelAnimationFrame(frame); };
  }, []);
  return ref;
}
