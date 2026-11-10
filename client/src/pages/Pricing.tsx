import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, LayoutDashboard, Receipt, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { PageMeta } from "@/components/PageMeta";

// Rate card mirrors firm/playbooks/pricing.md Part 2 (Tier B, INR). Change both together.
const offers = [
  { name: "Landing page / microsite", price: "₹60,000 – ₹1,20,000", duration: "~2 weeks", detail: "One focused conversion page with copy, analytics and a clear call to action." },
  { name: "Business website", price: "₹1,50,000 – ₹4,00,000", duration: "3–6 weeks", detail: "Multi-page site with a CMS, SEO foundation and the integrations you actually use." },
  { name: "Web application", price: "₹4,00,000 – ₹15,00,000", duration: "6–16 weeks", detail: "Auth, database, roles, dashboards and APIs — internal tools or customer-facing products." },
  { name: "AI workflow / automation", price: "₹2,00,000 – ₹8,00,000", duration: "3–10 weeks", detail: "LLM integrations, document pipelines and internal copilots, scoped to what AI can honestly do." },
  { name: "UI/UX engagement", price: "₹1,50,000 – ₹5,00,000", duration: "3–8 weeks", detail: "Research, flows, a design system and clickable prototypes your developers can build from." },
  { name: "Care plan", price: "₹40,000 – ₹80,000 / month", duration: "3-month minimum", detail: "Monitoring, patches, small changes and a guaranteed response time." },
];

const guarantees = [
  { icon: FileText, title: "Written scope first", text: "Deliverables, exclusions, timeline and price are agreed in writing before any build begins." },
  { icon: ShieldCheck, title: "Fixed price", text: "You pay for the outcome, not the hours. Scope changes are re-quoted in writing before work starts." },
  { icon: LayoutDashboard, title: "Your own client portal", text: "A private link showing milestones, progress updates and every quote and invoice — no chasing for status." },
  { icon: Receipt, title: "Proper invoices", text: "Numbered invoices against agreed milestones, with UPI and bank transfer details on every one." },
];

const steps = [
  { title: "Discovery call", text: "30 minutes. We learn the problem and the cost of leaving it unsolved. Free, no obligation." },
  { title: "Diagnostic or proposal", text: "For anything non-trivial, a paid one-week Diagnostic. Otherwise a written, fixed-price proposal." },
  { title: "Kickoff", text: "Signed scope, 40% advance, portal access and a milestone plan with dates." },
  { title: "Build in milestones", text: "Written weekly updates in your portal. 30% at the midpoint milestone." },
  { title: "Handover", text: "Final 30% on delivery. Documentation, credentials and a system your team can run." },
];

const rise = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }) };

export default function Pricing() {
  return (
    <PageTransition>
      <PageMeta title="Pricing" description="Transparent, fixed-price engagements in INR — rate card, payment terms and how a CubicTech project runs." />
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <section className="relative overflow-hidden pb-16 pt-44">
            <div className="container-w relative z-10 max-w-4xl">
              <motion.p initial="hidden" animate="visible" variants={rise} custom={0} className="label mb-6">Pricing</motion.p>
              <motion.h1 initial="hidden" animate="visible" variants={rise} custom={1} className="font-display text-5xl t-primary md:text-6xl">
                Clear prices. <span className="italic text-gradient">Written scope.</span>
              </motion.h1>
              <motion.p initial="hidden" animate="visible" variants={rise} custom={2} className="mt-6 max-w-2xl text-lg font-light t-muted">
                Every engagement is fixed-price and quoted in writing. These ranges are where most projects land — your proposal will name one number, with exactly what it includes and what it does not.
              </motion.p>
            </div>
          </section>

          <section className="pb-20">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rise} custom={0} className="glass-card grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
                <div>
                  <p className="label mb-4">Start here</p>
                  <h2 className="font-display text-3xl t-primary md:text-4xl">The Diagnostic</h2>
                  <p className="mt-4 t-muted">
                    One week. We map your current system and workflow, find the bottlenecks, and hand you a written plan with costed options. It is yours to keep whether or not you build with us.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm t-secondary">
                    {["Current-state map of your tools, data and manual steps", "Prioritised list of what to fix, automate or leave alone", "Costed build options with timelines", "Fully credited toward a project booked within 30 days"].map((item) => (
                      <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 t-deco" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center rounded-2xl border border-white/10 p-8 text-center">
                  <p className="font-display text-5xl text-gradient">₹35,000</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] t-deco">1 week · credited to your project</p>
                  <Link href="/contact" className="btn-primary mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm">
                    Book a discovery call <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="divider" />

          <section className="section-pad">
            <div className="container-w">
              <p className="label mb-4">Rate card</p>
              <h2 className="mb-12 font-display text-4xl t-primary">What projects typically cost</h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer, i) => (
                  <motion.div key={offer.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rise} custom={i} className="glass-card flex flex-col p-7">
                    <p className="text-sm font-semibold t-primary">{offer.name}</p>
                    <p className="mt-4 font-display text-2xl text-gradient">{offer.price}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] t-deco">{offer.duration}</p>
                    <p className="mt-4 text-sm t-muted">{offer.detail}</p>
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 text-sm t-muted">
                Prices exclude GST where applicable. Projects under ₹60,000 are usually better served by a template or a freelancer — we will tell you honestly and point you to one.
              </p>
            </div>
          </section>

          <div className="divider" />

          <section className="section-pad">
            <div className="container-w">
              <p className="label mb-4">How we work</p>
              <h2 className="mb-12 font-display text-4xl t-primary">What you can count on</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {guarantees.map(({ icon: Icon, title, text }, i) => (
                  <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rise} custom={i} className="glass-card flex gap-5 p-7">
                    <Icon className="h-6 w-6 shrink-0 t-deco" />
                    <div>
                      <p className="font-semibold t-primary">{title}</p>
                      <p className="mt-2 text-sm t-muted">{text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20">
                <p className="label mb-4">Payment terms</p>
                <h3 className="mb-10 font-display text-3xl t-primary">40 / 30 / 30, tied to milestones</h3>
                <ol className="grid gap-4 md:grid-cols-5">
                  {steps.map((step, i) => (
                    <li key={step.title} className="rounded-2xl border border-white/10 p-5">
                      <p className="text-xs t-deco">Step {i + 1}</p>
                      <p className="mt-2 font-semibold t-primary">{step.title}</p>
                      <p className="mt-2 text-sm t-muted">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="pb-28">
            <div className="container-w text-center">
              <h2 className="font-display text-4xl t-primary">Not sure which fits?</h2>
              <p className="mx-auto mt-4 max-w-xl t-muted">Tell us the problem. We will reply within one working day with an honest view of what it needs — including when the answer is "not us".</p>
              <Link href="/contact" className="btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
