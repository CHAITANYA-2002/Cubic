import { Link } from "wouter";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ borderTop: "none" }}>
      {/* Cinematic top fade — blends previous section into footer */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, transparent 0%, var(--background) 100%)" }}
      />
      {/* Subtle atmospheric radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, hsla(var(--primary), 0.04) 0%, transparent 70%)" }}
      />
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 100%)" }}
      />

      <div className="container-w relative z-10 pt-32 pb-14">
        {/* Main grid — intentional asymmetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8 mb-24">

          {/* Brand — wider, anchoring presence */}
          <div className="md:col-span-4">
            <span className="text-3xl font-bold block mb-5 font-display">
              <span className="text-gradient italic">Cubic</span><span className="t-primary">Tech</span>
            </span>
            <p className="t-secondary text-sm leading-relaxed max-w-xs mb-10 font-light">
              Performance-driven digital experiences, built with intention.
            </p>
            {/* Contact details — spacious, clearly readable in both modes */}
            <div className="flex flex-col gap-6">
              <a
                href="mailto:info@cubictech.in"
                className="inline-flex items-center gap-3 text-sm font-medium t-secondary hover:t-primary transition-all duration-500 group"
              >
                <Mail className="w-4 h-4 t-deco group-hover:t-primary transition-colors" />
                info@cubictech.in
              </a>
              <a
                href="tel:+917976989699"
                className="inline-flex items-center gap-3 text-sm font-medium t-secondary hover:t-primary transition-all duration-500 group"
              >
                <Phone className="w-4 h-4 t-deco group-hover:t-primary transition-colors" />
                +91 79769 89699
              </a>
              <a
                href="https://wa.me/917976989699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm font-medium text-[#25D366] hover:text-[#128C7E] transition-all duration-500 group"
              >
                <SiWhatsapp className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Spacer for intentional rhythm */}
          <div className="md:col-span-1 hidden md:block" />

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="t-secondary text-[10px] font-bold uppercase tracking-[0.35em] mb-8 font-display opacity-60">Services</h4>
            <ul className="space-y-5">
              {[
                ["/services/web-development", "Web Development"],
                ["/services/ui-ux-design", "UI/UX Design"],
                ["/services/web-applications", "Web Applications"],
                ["/services/ai-solutions", "AI Solutions"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm t-secondary hover:t-primary transition-all duration-500 cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="t-secondary text-[10px] font-bold uppercase tracking-[0.35em] mb-8 font-display opacity-60">Company</h4>
            <ul className="space-y-5">
              {[["/about", "About"], ["/services", "Services"], ["/contact", "Contact"], ["/privacy", "Privacy"], ["/terms", "Terms"], ["/cookies", "Cookies"]].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm t-secondary hover:t-primary transition-all duration-500 cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h4 className="t-secondary text-[10px] font-bold uppercase tracking-[0.35em] mb-8 font-display opacity-60">Social</h4>
            <ul className="space-y-5">
              {[
                { label: "LinkedIn", href: "#" },
                { label: "Instagram", href: "#" },
                { label: "Dribbble", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm t-secondary hover:t-primary transition-all duration-500">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing signature */}
        <div className="mb-10">
          <p className="text-xs t-secondary opacity-40 tracking-[0.25em] uppercase font-light">Built with intention in Jaipur.</p>
        </div>

        {/* Bottom copyright row — theme-aware border */}
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-6">
          <p className="text-xs t-secondary opacity-50 font-light">© {new Date().getFullYear()} CubicTech. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-white/[0.07] t-secondary opacity-50 hover:opacity-100 hover:t-primary transition-all duration-500"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
