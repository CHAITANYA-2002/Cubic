import { useRef, useState, useCallback } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
}

export function useTilt(intensity = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (y - 0.5) * -intensity,
      rotateY: (x - 0.5) * intensity,
      glowX: x * 100,
      glowY: y * 100,
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  }, []);

  return { ref, tilt, handleMouseMove, handleMouseLeave };
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}

export function TiltCard({ children, className = "", intensity = 8, glowColor = "rgba(6, 182, 212, 0.15)" }: TiltCardProps) {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(intensity);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-container ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, ${glowColor}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
