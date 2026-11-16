import { useEffect, useRef, type ReactNode } from "react";

// The CSS fallback opens the lid this long after load if JavaScript never takes over (see motion.css).
const AUTO_OPEN_MS = 3500;

/**
 * A laptop whose lid swings open, then whose screen lights up, when it comes into view.
 * Without JavaScript or with reduced motion it is simply shown open.
 */
export function Laptop({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !document.documentElement.classList.contains("motion-ok")) return;
    const lid = node.querySelector<HTMLElement>(".laptop-lid");
    const auto = lid?.getAnimations()[0];
    const autoStarted = auto !== undefined && (auto.playState === "finished" || Number(auto.currentTime ?? 0) >= AUTO_OPEN_MS);
    const box = node.getBoundingClientRect();
    const visible = box.top < window.innerHeight * 0.85 && box.bottom > 0;

    // The CSS fallback is already opening it on screen: let it finish rather than snapping shut.
    if (autoStarted && visible) return;
    // Held shut until a good part of it is on screen, so the opening is seen rather than missed below the fold.
    node.classList.add("is-waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        // On the first visit the intro may still be lifting; open once it has gone.
        node.style.setProperty("--lid-delay", document.getElementById("intro") ? "0.9s" : "0.1s");
        node.classList.replace("is-waiting", "is-open");
        observer.disconnect();
      },
      { threshold: 0.35, rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="laptop" dir="ltr">
      <div className="laptop-lid">
        <div className="laptop-bezel">
          <div className="laptop-screen">{children}</div>
        </div>
      </div>
      <div className="laptop-base" aria-hidden="true" />
    </div>
  );
}
