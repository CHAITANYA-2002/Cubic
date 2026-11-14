import { useEffect } from "react";

const MAX_TILT = 6;

/**
 * Pointer-driven depth for desktop: spotlight + 3D tilt on `.card-hover`, and a small
 * magnetic pull on primary buttons. Off for touch and reduced motion.
 */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let lastCard: HTMLElement | null = null;
    let lastButton: HTMLElement | null = null;

    const reset = (el: HTMLElement | null, props: string[]) => el && props.forEach((prop) => el.style.removeProperty(prop));

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const target = event.target as Element | null;
        const card = target?.closest?.<HTMLElement>(".card-hover") ?? null;
        if (card !== lastCard) reset(lastCard, ["--rx", "--ry"]);
        lastCard = card;
        if (card) {
          const box = card.getBoundingClientRect();
          const x = event.clientX - box.left;
          const y = event.clientY - box.top;
          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);
          if (!reduce) {
            card.style.setProperty("--ry", `${((x / box.width) - 0.5) * MAX_TILT * 2}deg`);
            card.style.setProperty("--rx", `${(0.5 - (y / box.height)) * MAX_TILT * 2}deg`);
          }
        }
        if (reduce) return;
        const button = target?.closest?.<HTMLElement>(".btn-primary") ?? null;
        if (button !== lastButton) reset(lastButton, ["--bx", "--by"]);
        lastButton = button;
        if (button) {
          const box = button.getBoundingClientRect();
          button.style.setProperty("--bx", `${(event.clientX - box.left - box.width / 2) * 0.18}px`);
          button.style.setProperty("--by", `${(event.clientY - box.top - box.height / 2) * 0.3}px`);
        }
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);
}
