import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { ContactForm } from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2, ChevronDown } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "Most marketing websites are delivered in 3–4 weeks. Complex web applications typically take 6–10 weeks depending on scope. We'll give you a precise timeline after your discovery call."
  },
  {
    q: "How much does a website cost?",
    a: "Landing pages start around ₹25,000. Full business websites range from ₹50,000–₹1,50,000. Web applications are scoped individually. All projects are fixed-price — no surprises."
  },
  {
    q: "Do you work with international clients?",
    a: "Absolutely. While we're based in Jaipur, we've worked with clients across India, UAE, UK, and the US. We communicate over Slack, WhatsApp, and scheduled video calls."
  },
  {
    q: "What do you need from me to get started?",
    a: "Just a clear idea of what you want to achieve. We'll guide you through the rest — from branding to content to technical requirements. A 30-min discovery call is all it takes."
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes, and we do it often. We'll audit what's working, preserve what's valuable, and completely elevate the design and performance. Redesigns are our speciality."
  },
];

function FAQ({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
      className="glass-card overflow-hidden"
    >
      <button
        className="w-full text-left p-6 flex items-start justify-between gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium t-secondary group-hover:t-primary transition-colors duration-300">{q}</span>
        <ChevronDown className={`w-4 h-4 t-muted shrink-0 mt-0.5 transition-transform duration-400 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6">
              <div className="h-px mb-4" style={{ background: "var(--glass-border)" }} />
              <p className="t-muted text-sm leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | CubicTech";
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        {/* ===== HERO ===== */}
        <section className="pt-44 pb-24 relative overflow-hidden">
          <HeroBackdrop image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80" position="center" intensity={0.5} />
          <div className="blob blob-blue w-[500px] h-[500px] -top-32 -right-32 opacity-[0.05]" />
          <div className="blob blob-purple w-[350px] h-[350px] bottom-0 -left-20 opacity-[0.04]" />
          <div className="container-w relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <p className="label mb-5">Contact Us</p>
              <h1 className="text-display-hero">
                Let's talk about<br /><span className="text-gradient">your project.</span>
              </h1>
              <p className="text-xl t-muted max-w-xl leading-relaxed font-normal mb-12">
                No pitch decks, no corporate speak. Just a real conversation about what you want to build and how we can help. First call is always free.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  "Free discovery call",
                  "Response in 2–4 hours",
                  "Fixed-price quotes",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 t-secondary" />
                    <span className="text-sm t-muted">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="divider" />

        {/* ===== MAIN CONTACT SECTION ===== */}
        <section className="section-pad">
          <div className="container-w">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Left — contact info */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <h2 className="text-2xl font-bold t-primary mb-6">Get in touch</h2>
                </motion.div>

                {[
                  { icon: Phone, title: "Phone", lines: ["+91 79769 89699", "Mon–Sat, 10am–7pm IST"] },
                  { icon: Mail, title: "Email", lines: ["chaitanyakhurana10@gmail.com", "chaitanyakhurana10@gmail.com"] },
                  { icon: Clock, title: "Response", lines: ["2–4 hours (Business days)", "24 hours max, always"] },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp}
                    className="flex items-start gap-5 p-5 rounded-3xl hover:bg-white/[0.025] border border-transparent hover:border-white/[0.05] transition-all duration-500 group"
                  >
                    <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="w-5 h-5 t-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold t-primary mb-1">{item.title}</h3>
                      {item.lines.map((l, j) => <p key={j} className="t-muted text-sm">{l}</p>)}
                    </div>
                  </motion.div>
                ))}

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5} variants={fadeUp} className="pt-2">
                  <a
                    href="https://wa.me/917976989699"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="button"
                    className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl transition-all duration-500 bg-green-500/10 border border-green-500/20 text-green-400 group hover:bg-green-500/20"
                  >
                    <SiWhatsapp className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold">Chat on WhatsApp</span>
                  </a>

                  <a
                    href="mailto:chaitanyakhurana10@gmail.com"
                    data-cursor="button"
                    className="ml-3 inline-flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-500 btn-ghost"
                  >
                    <MessageSquare className="w-4 h-4 t-muted" />
                    <span className="text-sm font-medium t-muted">Send Email</span>
                  </a>
                </motion.div>
              </div>

              {/* Right — form */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
                className="lg:col-span-3"
              >
                <div className="glass-card p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold t-primary mb-1">Send a Message</h2>
                    <p className="t-muted text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ===== FAQ ===== */}
        <section className="section-pad">
          <div className="container-w">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-xl mb-14">
              <p className="label mb-4">Before You Reach Out</p>
              <h2 className="text-3xl md:text-4xl t-primary">
                Frequently asked<br /><span className="text-gradient">questions.</span>
              </h2>
            </motion.div>
            <div className="max-w-2xl space-y-3">
              {faqs.map((f, i) => <FAQ key={i} q={f.q} a={f.a} i={i} />)}
            </div>
          </div>
        </section>

        {/* Map removed as requested */}

        <Footer />
      </div>
    </PageTransition>
  );
}
