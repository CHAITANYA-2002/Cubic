import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      scrolled ? "glass py-3 shadow-lg" : "bg-transparent py-6"
    }`}>
      <div className="container-w flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold tracking-tight cursor-pointer font-display">
            <span className="text-gradient italic mr-1">Cubic</span>
            <span className="t-primary">Tech</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const active = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <span className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-2xl transition-all duration-700 cursor-pointer link-underline ${
                  active ? "t-secondary" : "t-muted hover:t-secondary"
                }`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link href="/contact">
            <Button data-cursor="button" className="btn-primary text-white border-0 rounded-2xl h-11 px-6 text-sm font-bold">
              Get in Touch
            </Button>
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button className="t-muted" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden glass overflow-hidden"
          >
            <div className="container-w py-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block px-4 py-3 rounded-xl text-sm transition-colors duration-300 ${
                      location === link.href ? "t-primary bg-secondary/50 font-bold" : "t-muted hover:bg-secondary/20"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/contact">
                <Button className="w-full mt-2 btn-primary text-white border-0 rounded-xl text-sm" onClick={() => setOpen(false)}>
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
