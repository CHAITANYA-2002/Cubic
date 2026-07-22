import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Feature { icon: LucideIcon; title: string; desc: string; }
interface ProcessStep { step: string; title: string; desc: string; }
interface ExtraSection { title: string; items: { title: string; desc: string; badge?: string }[]; }

interface ServiceDetailProps {
  icon: LucideIcon;
  badge: string;
  headline: React.ReactNode;
  description: string;
  ctaText: string;
  features: Feature[];
  featuresTitle: string;
  processSteps?: ProcessStep[];
  processTitle?: string;
  extraSection?: ExtraSection;
  ctaHeadline: string;
  ctaDescription: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  })
};

export function ServiceDetailTemplate(props: ServiceDetailProps) {
  const { icon: Icon, badge, headline, description, ctaText, features, featuresTitle, processSteps, processTitle, extraSection, ctaHeadline, ctaDescription } = props;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">
          <section className="pt-40 pb-28 relative overflow-hidden">
            <div className="blob blob-blue w-[500px] h-[500px] -top-48 right-[-10%] opacity-[0.06]" />
            <div className="container-w relative z-10">
              <Link href="/services">
                <Button variant="ghost" className="mb-10 gap-2 t-muted hover:t-primary hover:bg-secondary/20 rounded-xl text-sm border border-border/20">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Capabilities
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <p className="label mb-6 inline-flex items-center gap-2"><Icon className="w-4 h-4" /> {badge}</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 t-primary leading-[1]">{headline}</h1>
                <p className="text-lg t-muted mb-10 max-w-2xl leading-relaxed font-light">{description}</p>
                <Link href="/contact">
                  <Button data-cursor="button" size="lg" className="h-14 px-8 rounded-2xl gap-2 btn-primary text-white border-0 text-base">
                    {ctaText} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          <div className="divider" />

          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-4">Capabilities</p>
                <h2 className="text-3xl md:text-4xl t-primary mb-14 mt-2">{featuresTitle}</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((f, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="glass-card p-7 group">
                    <f.icon className="w-7 h-7 t-ghost mb-5 group-hover:t-primary transition-colors duration-500" />
                    <h3 className="font-semibold t-primary mb-2">{f.title}</h3>
                    <p className="text-sm t-muted leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {processSteps && processTitle && (
            <>
              <div className="divider" />
              <section className="section-pad relative">
                <div className="container-w relative z-10">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                    <p className="label mb-4">Process</p>
                    <h2 className="text-3xl md:text-4xl t-primary mb-14 mt-2">{processTitle}</h2>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {processSteps.map((s, i) => (
                      <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                        <span className="text-5xl font-bold text-gradient block mb-4 opacity-70">{s.step}</span>
                        <h3 className="text-base font-semibold t-secondary mb-2">{s.title}</h3>
                        <p className="t-muted text-sm leading-relaxed">{s.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {extraSection && (
            <>
              <div className="divider" />
              <section className="section-pad">
                <div className="container-w">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                    <p className="label mb-4">Impact</p>
                    <h2 className="text-3xl md:text-4xl t-primary mb-14 mt-2">{extraSection.title}</h2>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {extraSection.items.map((item, i) => (
                      <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="glass-card p-7">
                        {item.badge && <span className="text-[10px] font-semibold tracking-widest uppercase t-deco mb-3 block">{item.badge}</span>}
                        <h3 className="font-semibold t-primary mb-2">{item.title}</h3>
                        <p className="text-sm t-muted leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          <div className="divider" />

          <section className="py-32 relative">
            <div className="blob blob-purple w-[400px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]" />
            <div className="container-w text-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <h2 className="text-3xl md:text-5xl font-bold t-primary mb-5">{ctaHeadline}</h2>
                <p className="text-lg t-muted mb-10 max-w-md mx-auto font-light">{ctaDescription}</p>
                <Link href="/contact">
                  <Button data-cursor="button" size="lg" className="h-14 px-8 rounded-2xl gap-2 btn-primary text-white border-0 text-base">
                    Get Free Quote <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
