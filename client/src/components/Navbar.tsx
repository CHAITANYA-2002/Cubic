import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900 py-4 shadow-sm">
      <div className="container-width flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-bold text-xl md:text-2xl tracking-tight" data-testid="link-logo">
            <span className="text-emerald-600 dark:text-emerald-400">Cubic</span>
            <span className="text-foreground">Tech</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative"
            >
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </span>
              {isActive(link.href) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/contact">
            <Button className="rounded-lg bg-emerald-600 hover:bg-emerald-700" data-testid="button-nav-cta">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg"
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-emerald-950 border-t border-emerald-100 dark:border-emerald-900 overflow-hidden"
          >
            <div className="container-width py-4 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href) ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
