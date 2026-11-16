import { useEffect, useState, type RefObject } from "react";

/**
 * Index of the child (matched by `selector` inside `ref`) currently crossing the middle band of the viewport.
 * Used for sticky storytelling and scroll-spy navigation.
 */
export function useActiveIndex<T extends HTMLElement>(ref: RefObject<T | null>, selector: string, band = "-42% 0px -48% 0px") {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(items.indexOf(hit.target as HTMLElement));
      },
      { rootMargin: band },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [ref, selector, band]);
  return active;
}
