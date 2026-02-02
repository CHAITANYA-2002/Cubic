import { Link } from "wouter";
import { Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const WHATSAPP_NUMBER = "917976989699";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-16 pb-8">
      <div className="container-width grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">
              <span className="text-blue-400">Cubic</span>
              <span className="text-white">Tech</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Building digital excellence through innovative web solutions, AI integration, and stunning design. Your partner in the digital transformation journey.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white transition-all duration-300"
              data-testid="link-footer-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 transition-all duration-300"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" }
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400/0 group-hover:bg-blue-400 transition-all" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-6 text-white">Services</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              { label: "Web Development", href: "/services/web-development" },
              { label: "UI/UX Design", href: "/services/ui-ux-design" },
              { label: "Web Applications", href: "/services/web-applications" },
              { label: "AI Solutions", href: "/services/ai-solutions" },
              { label: "Digital Marketing", href: "/services/digital-marketing" }
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-blue-400 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-6 text-white">Get in Touch</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span>Narayan Pura, Mansarovar, Jaipur, Rajasthan, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-400 shrink-0" />
              <a href="tel:7976989699" className="hover:text-blue-400 transition-colors">
                +91 79769 89699
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <a href="mailto:info@cubictech.com" className="hover:text-blue-400 transition-colors">
                info@cubictech.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-width pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Cubic Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}
