import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Capabilities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#070912]/80 border-b border-white/10 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-width flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" data-cursor="link">
          <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#7896ff] to-[#4a63c9] text-[#05060c] font-black text-lg shadow-[0_8px_24px_-8px_rgba(120,150,255,0.7)]">
            C
          </span>
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-white">Cubic</span>
            <span className="text-[#7896ff]">Tech</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="link"
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive(l.href) ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{l.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            data-cursor="button"
            className="grid place-items-center w-10 h-10 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link href="/contact" className="hidden md:inline-flex ct-btn-primary" data-cursor="button">
            Get in Touch <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-white/10 text-white"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#070912]/95 backdrop-blur-xl"
          >
            <div className="container-width py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive(l.href) ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="ct-btn-primary mt-2 justify-center"
              >
                Get in Touch <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
