import { Link } from "wouter";
import { Code2, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container-width grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">
              Cubic<span className="text-primary">Tech</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Building digital excellence through innovative web solutions, AI integration, and stunning design. Your partner in the digital transformation journey.
          </p>
          <div className="flex gap-4 pt-2">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {["Home", "About Us", "Services", "Careers", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6">Services</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Web Development",
              "UI/UX Design",
              "AI Solutions",
              "App Development",
              "Consultancy",
            ].map((item) => (
              <li key={item}>
                <a href="/services" className="hover:text-primary transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6">Get in Touch</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Jaipur, Rajasthan, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <a href="tel:7976989699" className="hover:text-primary transition-colors">
                +91 79769 89699
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <a href="mailto:info@cubictech.com" className="hover:text-primary transition-colors">
                info@cubictech.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-width pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Cubic Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}
