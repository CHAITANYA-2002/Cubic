import { useEffect, useLayoutEffect, useRef } from "react";

// Runs before paint in the browser so on-screen content never flashes hidden; no-op on the server.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Adds `.is-in` to `.reveal` / `.reveal-img` elements as they enter the viewport.
 * Hidden states only apply once this hook arms `html.reveal-armed`, so prerendered HTML is fully
 * visible without JS and nothing already on screen flickers out when it hydrates.
 */
export function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useBeforePaint(() => {
    const root = ref.current;
    const html = document.documentElement;
    if (!root || !html.classList.contains("motion-ok") || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    const pending = () => root.querySelectorAll<HTMLElement>(".reveal:not(.is-in), .reveal-img:not(.is-in)");
    // Anything already in or above the viewport stays shown; only content below the fold animates in.
    pending().forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add("is-in");
    });
    const watch = () => pending().forEach((node) => observer.observe(node));
    watch();
    // Content that appears later (filters, language switch) is picked up too.
    const mutations = new MutationObserver(watch);
    mutations.observe(root, { childList: true, subtree: true });
    html.classList.add("reveal-armed");
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
  return ref;
}
