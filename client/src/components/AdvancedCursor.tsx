import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "button" | "text" | "card";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

let activeCursorInstances = 0;

export function AdvancedCursor() {
  const [isPrimary, setIsPrimary] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    activeCursorInstances++;
    if (activeCursorInstances === 1) {
      setIsPrimary(true);
    }
    return () => {
      activeCursorInstances--;
    };
  }, []);
  const [clicked, setClicked] = useState(false);

  const mousePos = useRef({ x: -300, y: -300 });
  const dotPos = useRef({ x: -300, y: -300 });
  const ringPos = useRef({ x: -300, y: -300 });
  const auraPos = useRef({ x: -300, y: -300 });
  const magnetTarget = useRef<{ x: number; y: number } | null>(null);

  const particles = useRef<Particle[]>([]);
  const ripples = useRef<Ripple[]>([]);

  const rafRef = useRef<number>(0);
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    if (!isPrimary) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = [
      "rgba(108, 140, 255, ",
      "rgba(34, 211, 238, ",
      "rgba(167, 139, 250, ",
      "rgba(212, 175, 55, "
    ];

    let lastX = -300;
    let lastY = -300;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Create glowing motion trail on movement
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        lastX = e.clientX;
        lastY = e.clientY;

        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2 - dx * 0.04,
          vy: (Math.random() - 0.5) * 1.2 - dy * 0.04,
          size: Math.random() * 3 + 2.5,
          alpha: 0.65,
          color: colorBase
        });

        if (particles.current.length > 26) {
          particles.current.shift();
        }
      }

      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
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
      } else if (target.closest("article, .glass-card, [role='article']")) {
        newMode = "card";
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

    const onMouseDown = (e: MouseEvent) => {
      setClicked(true);
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 45,
        alpha: 0.8
      });
    };

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
      const aura = auraRef.current;

      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (magnetTarget.current && modeRef.current === "button") {
        const dx = magnetTarget.current.x - mousePos.current.x;
        const dy = magnetTarget.current.y - mousePos.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const pull = Math.min(12, (100 - dist) * 0.14);
          targetX += (dx / dist) * pull;
          targetY += (dy / dist) * pull;
        }
      }

      // Smooth fluid movement
      dotPos.current.x += (targetX - dotPos.current.x) * 0.35;
      dotPos.current.y += (targetY - dotPos.current.y) * 0.35;

      ringPos.current.x += (targetX - ringPos.current.x) * 0.15;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.15;

      auraPos.current.x += (targetX - auraPos.current.x) * 0.06;
      auraPos.current.y += (targetY - auraPos.current.y) * 0.06;

      if (dot) dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      if (ring) ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      if (aura) aura.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0)`;

      // Render Canvas Particles & Ripples
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.95;
        p.alpha -= 0.022;

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.2;
        r.alpha -= 0.035;

        if (r.alpha <= 0) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(108, 140, 255, ${r.alpha.toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isPrimary]);

  if (!isPrimary) return null;

  const isText = mode === "text";
  const isLink = mode === "link";
  const isButton = mode === "button";
  const isCard = mode === "card";

  const dotW = isText ? 2 : clicked ? 5 : 9;
  const dotH = isText ? 22 : clicked ? 5 : 9;
  const ringSize = isButton ? 64 : isLink ? 54 : isCard ? 68 : isText ? 26 : 42;

  return (
    <>
      {/* Motion Canvas Trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[99995]"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
      />

      {/* Classy Ambient Light Aura */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 pointer-events-none z-[99996]"
        style={{
          width: 240,
          height: 240,
          marginLeft: -120,
          marginTop: -120,
          borderRadius: "50%",
          background: "radial-gradient(120px circle at center, rgba(108, 140, 255, 0.12), rgba(34, 211, 238, 0.05), transparent 70%)",
          opacity: visible ? 0.85 : 0,
          transition: "opacity 0.4s ease",
          willChange: "transform",
        }}
      />

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: dotW,
          height: dotH,
          marginLeft: -dotW / 2,
          marginTop: -dotH / 2,
          borderRadius: isText ? 2 : "50%",
          background: isText
            ? "rgba(108, 140, 255, 0.95)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(108, 140, 255, 0.9) 100%)",
          boxShadow: isText
            ? "none"
            : "0 0 16px rgba(108, 140, 255, 0.8), 0 0 6px rgba(255, 255, 255, 0.9)",
          opacity: visible ? 1 : 0,
          transition: [
            "width 0.25s cubic-bezier(0.16,1,0.3,1)",
            "height 0.25s cubic-bezier(0.16,1,0.3,1)",
            "border-radius 0.25s ease",
            "opacity 0.2s ease",
          ].join(","),
          willChange: "transform",
        }}
      />

      {/* Outer Magnetic Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderRadius: "50%",
          border: isLink || isButton || isCard
            ? "1.5px solid rgba(108, 140, 255, 0.65)"
            : "1px solid rgba(255, 255, 255, 0.15)",
          background: isButton
            ? "rgba(108, 140, 255, 0.14)"
            : isLink
            ? "rgba(34, 211, 238, 0.08)"
            : isCard
            ? "rgba(167, 139, 250, 0.06)"
            : "rgba(255, 255, 255, 0.02)",
          backdropFilter: isLink || isButton || isCard ? "blur(4px)" : "none",
          boxShadow: isButton || isLink
            ? "0 0 30px -4px rgba(108, 140, 255, 0.5), inset 0 0 15px rgba(108, 140, 255, 0.2)"
            : "none",
          opacity: visible ? 1 : 0,
          transition: [
            "width 0.35s cubic-bezier(0.16,1,0.3,1)",
            "height 0.35s cubic-bezier(0.16,1,0.3,1)",
            "margin 0.35s cubic-bezier(0.16,1,0.3,1)",
            "border 0.3s ease",
            "background 0.3s ease",
            "opacity 0.2s ease",
            "box-shadow 0.3s ease",
          ].join(","),
          willChange: "transform",
        }}
      />
    </>
  );
}
