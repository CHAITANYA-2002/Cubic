import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";

const WHATSAPP_NUMBER = "917976989699";
const MESSAGE = encodeURIComponent(
  "Hi CubicTech, I'd like to discuss a project.",
);

/**
 * Fixed WhatsApp quick-contact button (bottom-right). Appears after a small
 * scroll so it doesn't cover the hero. A direct, high-intent conversion path.
 */
export function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CubicTech on WhatsApp"
      data-cursor="button"
      className={`fixed z-[9998] bottom-6 right-6 flex items-center gap-3 rounded-full pl-4 pr-5 py-3 font-semibold text-white shadow-2xl transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        boxShadow: "0 12px 40px -8px rgba(37,211,102,0.6)",
      }}
    >
      <span className="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style={{ background: "#25D366" }} aria-hidden />
      <SiWhatsapp className="relative w-5 h-5 shrink-0" />
      <span className="relative text-sm hidden sm:inline">Chat with us</span>
    </a>
  );
}
