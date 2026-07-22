import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <AdvancedCursor />
        <div className="blob blob-blue w-[400px] h-[400px] top-[20%] right-[20%] opacity-[0.04]" />

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10 px-4"
        >
          <span className="text-8xl md:text-9xl font-bold text-gradient block mb-4 opacity-30">404</span>
          <h1 className="text-xl font-bold t-secondary mb-3">Page not found</h1>
          <p className="t-muted mb-8 max-w-sm mx-auto text-sm font-light">
            This page doesn't exist or has moved.
          </p>
          <Link href="/">
            <Button data-cursor="button" className="gap-2 btn-primary text-white border-0 rounded-xl text-sm">
              <Home className="w-3.5 h-3.5" /> Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
