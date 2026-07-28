import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const KEY = "ct-cookie-consent";

/**
 * Lightweight cookie/consent banner. The site only uses functional local
 * storage (theme + this consent flag), but a clear consent notice keeps us
 * transparent and compliant (GDPR / India DPDP style). Choice is remembered
 * in localStorage so it never nags again.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable — don't block the page */
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[9997] bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div
            className="glass-card p-5 sm:p-6"
            style={{ boxShadow: "0 24px 60px -20px rgba(0,0,0,0.85)" }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="grid place-items-center w-9 h-9 rounded-xl shrink-0"
                style={{ background: "rgba(214,167,122,0.14)", border: "1px solid rgba(214,167,122,0.3)" }}
              >
                <Cookie className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
              </div>
              <p className="t-secondary text-sm leading-relaxed">
                We use only essential storage to remember your theme and this choice — no
                ad tracking. See our{" "}
                <Link href="/cookies" className="underline hover:t-primary transition-colors">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => decide("accepted")}
                className="btn-primary rounded-xl h-10 px-5 text-sm font-semibold flex-1"
                data-cursor="button"
              >
                Accept
              </button>
              <button
                onClick={() => decide("declined")}
                className="btn-ghost rounded-xl h-10 px-5 text-sm font-semibold"
                data-cursor="button"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
