import { Link } from "wouter";
import { Linkedin, Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const WHATSAPP_NUMBER = "917976989699";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05060c] text-white pt-20 pb-10 overflow-hidden">
      {/* soft glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[40rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(120,150,255,0.10), transparent 60%)" }}
        aria-hidden
      />

      <div className="container-width relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#7896ff] to-[#4a63c9] text-[#05060c] font-black text-lg">
              C
            </span>
            <span className="font-display font-bold text-xl">
              <span className="text-white">Cubic</span>
              <span className="text-[#7896ff]">Tech</span>
            </span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            We design, engineer, and scale high-performance digital systems — where
            digital systems meet human intelligence.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#25D366] hover:bg-[#25D366]/15 transition-all"
              aria-label="WhatsApp"
            >
              <SiWhatsapp className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#7896ff] hover:bg-[#7896ff]/15 transition-all" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#7896ff] hover:bg-[#7896ff]/15 transition-all" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-6">Company</h4>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Capabilities", href: "/services" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7896ff]/0 group-hover:bg-[#7896ff] transition-all" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-6">Capabilities</h4>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { label: "Web Development", href: "/services/web-development" },
              { label: "UI/UX Design", href: "/services/ui-ux-design" },
              { label: "Web Applications", href: "/services/web-applications" },
              { label: "AI Solutions", href: "/services/ai-solutions" },
              { label: "Digital Marketing", href: "/services/digital-marketing" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-6">Get in Touch</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#7896ff] shrink-0 mt-0.5" />
              <span>Narayan Pura, Mansarovar, Jaipur, Rajasthan, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#7896ff] shrink-0" />
              <a href="tel:7976989699" className="hover:text-white transition-colors">+91 79769 89699</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#7896ff] shrink-0" />
              <a href="mailto:info@cubictech.com" className="hover:text-white transition-colors">info@cubictech.com</a>
            </li>
            <li>
              <Link href="/contact" className="ct-btn-ghost mt-2 text-xs">
                Book a strategy call <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-width relative pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} Cubic Technologies. All rights reserved.</p>
        <p>Systems engineered with clarity. Scaled with intent.</p>
      </div>
    </footer>
  );
}
