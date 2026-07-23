interface HeroBackdropProps {
  /** Public image path, e.g. "/images/team.png" or a full URL */
  image: string;
  /** object-position for the image, e.g. "center", "top", "70% 40%" */
  position?: string;
  /** 0–1, how visible the raw image is under the overlays */
  intensity?: number;
  /** hex accent colour for the ambient glow; defaults to brand rose-gold */
  accent?: string;
}

/**
 * Full-bleed cinematic banner image for a page hero.
 * Sits at z-0 behind hero content (which should be z-10). Layers dark
 * gradients so any headline stays readable and the image melts into the
 * near-black theme, with a rose-gold ambient glow to match the brand.
 */
export function HeroBackdrop({ image, position = "center", intensity = 0.45, accent }: HeroBackdropProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ objectPosition: position, opacity: intensity }}
        loading="eager"
      />
      {/* left-to-right darkening keeps headline copy legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,11,12,0.96) 0%, rgba(11,11,12,0.82) 38%, rgba(11,11,12,0.45) 100%)",
        }}
      />
      {/* top + bottom fade so the banner blends into the page background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,11,12,0.85) 0%, transparent 22%, transparent 55%, var(--bg-primary) 100%)",
        }}
      />
      {/* ambient glow — accent-tinted when provided, else brand rose-gold */}
      <div
        className="absolute inset-0"
        style={{
          background: accent
            ? `radial-gradient(ellipse 58% 55% at 74% 32%, ${accent}3a, transparent 62%)`
            : "radial-gradient(ellipse 55% 50% at 72% 38%, rgba(214,167,122,0.14), transparent 60%)",
        }}
      />
      {/* faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse 70% 60% at 60% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 60% 30%, #000 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
