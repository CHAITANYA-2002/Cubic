import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "button" | "text";

export function AdvancedCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const mousePos = useRef({ x: -200, y: -200 });
  const dotPos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const magnetTarget = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    // Disable on mobile
    const isMobile = window.innerWidth < 1024;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    // Note: We no longer hide the system cursor as per user request
    // document.documentElement.style.cursor = "none";
    // document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      const closest = target.closest("[data-cursor]") as HTMLElement | null;

      let newMode: CursorMode = "default";

      if (closest) {
        const attr = closest.getAttribute("data-cursor") as CursorMode;
        newMode = attr || "default";
        if (attr === "button") {
          const rect = closest.getBoundingClientRect();
          magnetTarget.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        } else {
          magnetTarget.current = null;
        }
      } else if (target.closest("a, button, [role='button'], [tabindex]")) {
        newMode = "link";
        magnetTarget.current = null;
      } else if (target.closest("p, span, h1, h2, h3, h4, h5, h6, li, label, input, textarea")) {
        newMode = "text";
        magnetTarget.current = null;
      } else {
        magnetTarget.current = null;
      }

      if (newMode !== modeRef.current) {
        modeRef.current = newMode;
        setMode(newMode);
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) { rafRef.current = requestAnimationFrame(animate); return; }

      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (magnetTarget.current && modeRef.current === "button") {
        const dx = magnetTarget.current.x - mousePos.current.x;
        const dy = magnetTarget.current.y - mousePos.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const pull = Math.min(10, (100 - dist) * 0.12);
          targetX += (dx / dist) * pull;
          targetY += (dy / dist) * pull;
        }
      }

      dotPos.current.x += (targetX - dotPos.current.x) * 0.25;
      dotPos.current.y += (targetY - dotPos.current.y) * 0.25;
      dot.style.transform = `translate3d(${dotPos.current.x}px,${dotPos.current.y}px,0)`;

      ringPos.current.x += (targetX - ringPos.current.x) * 0.1;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.1;
      ring.style.transform = `translate3d(${ringPos.current.x}px,${ringPos.current.y}px,0)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  const isText = mode === "text";
  const isLink = mode === "link";
  const isButton = mode === "button";
  const isClicked = clicked;

  const dotW = isText ? 2 : isClicked ? 4 : 8;
  const dotH = isText ? 22 : isClicked ? 4 : 8;
  const ringSize = isLink ? 52 : isButton ? 60 : isText ? 24 : 36;

  return (
    <>
      {/* Inner dot — sharp, always visible */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99999,
          width: dotW,
          height: dotH,
          marginLeft: -dotW / 2,
          marginTop: -dotH / 2,
          borderRadius: isText ? 2 : "50%",
          background: isText
            ? "rgba(120,150,255,0.95)"
            : "rgba(255, 255, 255, 0.8)",
          boxShadow: isText
            ? "none"
            : "0 0 15px rgba(120,150,255,0.6), 0 0 5px rgba(255,255,255,0.4)",
          opacity: visible ? 1 : 0,
          transition: [
            "width 0.25s cubic-bezier(0.16,1,0.3,1)",
            "height 0.25s cubic-bezier(0.16,1,0.3,1)",
            "border-radius 0.25s ease",
            "opacity 0.2s ease",
            "box-shadow 0.25s ease",
          ].join(","),
          willChange: "transform",
        }}
      />

      {/* Outer ring — glowing halo */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99998,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderRadius: "50%",
          border: isLink || isButton
            ? "1.5px solid rgba(120,150,255,0.5)"
            : "1px solid rgba(255,255,255,0.1)",
          background: isButton
            ? "rgba(120,150,255,0.1)"
            : isLink
            ? "rgba(120,150,255,0.05)"
            : "rgba(255,255,255,0.03)",
          backdropFilter: isLink || isButton ? "blur(4px)" : "none",
          opacity: visible ? 1 : 0,
          transition: [
            "width 0.4s cubic-bezier(0.16,1,0.3,1)",
            "height 0.4s cubic-bezier(0.16,1,0.3,1)",
            "margin 0.4s cubic-bezier(0.16,1,0.3,1)",
            "border 0.3s ease",
            "background 0.3s ease",
            "opacity 0.2s ease",
          ].join(","),
          willChange: "transform",
        }}
      />
    </>
  );
}
