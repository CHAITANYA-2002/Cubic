import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdvancedCursor } from "@/components/AdvancedCursor";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Wrench, ArrowLeft, ArrowRight, ChevronDown,
  CheckCircle2, MessageSquare, Shield, Clock, HeartPulse, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function CountUp({ end, suffix = "", prefix = "", decimals = 0 }: { end: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Number(start.toFixed(decimals))); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, decimals]);
  return <span>{prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }),
};

function FAQItem({ f, i }: { f: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
      className="overflow-hidden border-b border-white/[0.06] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-6 flex items-center justify-between group">
        <span className="text-sm font-semibold t-secondary group-hover:t-primary transition-colors duration-300 pr-4">{f.q}</span>
        <ChevronDown className={`w-4 h-4 t-ghost shrink-0 transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="pb-6 text-sm t-muted leading-relaxed max-w-lg">{f.a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Maintenance() {
  useEffect(() => {
    document.title = "Infrastructure Maintenance & Cloud Governance | CubicTech";
  }, []);

  const [activeType, setActiveType] = useState<number | null>(0);
  const [activeTech, setActiveTech] = useState<string>("Infrastructure Governance");

  const maintenanceTypes = [
    {
      title: "Legacy System Takeover",
      bestFor: "Complex apps with technical debt or lost developers.",
      goal: "Stabilisation & Documentation",
      complexity: "High",
      timeline: "4-week audit + onboarding",
      features: ["Full Technical Audit", "Codebase Documentation", "Dependency Patching", "Cloud Migration", "Stability Fixes"],
    },
    {
      title: "High-Traffic Platforms",
      bestFor: "Scaling SaaS and E-commerce with global users.",
      goal: "Uptime & Performance",
      complexity: "Medium-High",
      timeline: "Ongoing Governance",
      features: ["Real-time APM Monitoring", "Auto-scaling Config", "CDN Optimization", "Database Tuning", "DDoS Mitigation"],
    },
    {
      title: "Compliance-Heavy Systems",
      bestFor: "Fintech, Healthcare, and Gov-tech requiring privacy.",
      goal: "Security & Adherence",
      complexity: "Critical",
      timeline: "Ongoing Audit",
      features: ["PII Encryption", "SOC2/GDPR Patching", "VPN/VPC Management", "Access Log Audits", "Disaster Recovery"],
    },
    {
      title: "Infrastructure & DevOps",
      bestFor: "Cloud-native apps focusing on CI/CD efficiency.",
      goal: "Automation & Velocity",
      complexity: "Continuous",
      timeline: "Weekly Sprints",
      features: ["IaC (Terraform/Ansible)", "CI/CD Pipeline Ops", "Docker/K8s Management", "Cost Optimization", "Security Scans"],
    },
  ];

  const engagementModels = [
    {
      tag: "Foundation",
      title: "Essential Care",
      sub: "Strategic maintenance for established landing pages and simple marketing systems.",
      points: ["Daily Encrypted Backups", "SLA: 24h Response", "Automated Security Scans", "Plugin/Lib Updates", "Uptime Monitoring"],
      icon: Shield,
      featured: false,
    },
    {
      tag: "Scaling",
      title: "Growth Operations",
      sub: "Active governance for high-ticket SaaS platforms and active e-commerce ecosystems.",
      points: ["SLA: 4h Critical Response", "Staging Environment Sync", "Active Performance Tuning", "Monthly Security Audit", "Priority Feature Spikes"],
      icon: Activity,
      featured: true,
    },
    {
      tag: "Enterprise",
      title: "Infrastructure Ops",
      sub: "Dedicated DevOps and SRE for mission-critical systems requiring zero-downtime.",
      points: ["SLA: 1h Immediate Action", "Multi-region Replication", "Dedicated Support Lead", "SOC2/HIPAA Compliance", "Unlimited Patching"],
      icon: HeartPulse,
      featured: false,
    },
  ];

  const techStack: Record<string, string> = {
    "Infrastructure Governance": "We manage your cloud environment using Terraform and Ansible, treats servers as cattle, not pets—ensuring every piece of infrastructure is documented, reproducible, and immutable.",
    "Observability Stack": "We deploy Sentry for error tracking and Datadog for APM metrics, giving us real-time visibility into CPU spikes, memory leaks, and API latency before they impact users.",
    "Security Layers": "We configure Cloudflare WAF and AWS Shield to mitigate DDoS attacks, while implementing SOC2-aware IAM policies and end-to-end PII encryption at rest.",
    "Pipeline Discipline": "Our GitHub Actions CI/CD pipelines ensure that 100% of security patches are tested in a staging environment and verified by automated regression suites before hitting production.",
  };

  const faqs = [
    { q: "Do you maintain systems built by other agencies?", a: "Yes. We begin every takeover with a deep technical audit ($1,500) to map your current architecture, document technical debt, and establish our baseline before we assume liability for the platform's stability." },
    { q: "What happens if a critical vulnerability is discovered?", a: "For automated security issues, our CI/CD pipelines patch dependencies immediately. For architectural vulnerabilities, Growth and Enterprise tiers include priority hot-fixing outside of standard sprint cycles." },
    { q: "Is there a minimum commitment?", a: "Maintenance is a partnership, not a one-off fix. We require a 3-month initial commitment to establish stability, after which we move to a monthly rolling agreement." },
    { q: "How do you handle backups?", a: "We run multi-layer backups: daily filesystem snapshots and real-time/hourly database replication, stored off-site in geographically isolated S3 buckets with strict 30-day retention policies." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background relative">
        <AdvancedCursor />
        <Navbar />

        <main className="flex-grow">

          {/* ===== HERO ===== */}
          <section className="pt-40 pb-32 relative overflow-hidden">
            <div className="blob blob-blue w-[600px] h-[600px] -top-48 -right-24 opacity-[0.04]" />
            <div className="container-w relative z-10">
              <Link href="/services">
                <Button variant="ghost" className="mb-10 gap-2 t-muted hover:t-primary hover:bg-secondary/20 rounded-xl text-sm border border-border/20">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Capabilities
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <p className="label mb-10 inline-flex items-center gap-2"><Wrench className="w-4 h-4" /> Infrastructure Maintenance</p>
                <h1 className="text-display-hero">
                  Engineering systems<br />
                  <span className="text-gradient italic">that never stop evolving.</span>
                </h1>
                <p className="text-xl t-muted mb-12 max-w-2xl leading-relaxed font-normal">
                  We treat maintenance as active infrastructure management. We don't just react to downtime; we engineer environments that prevent it through rigorous monitoring and proactive security.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link href="/contact">
                    <Button data-cursor="button" size="lg" className="h-14 px-8 rounded-2xl gap-2 btn-primary text-white border-0 text-base">
                      Start Your Project <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-xs t-deco tracking-widest uppercase font-medium">Typically respond within 4 hours</p>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== MAINTENANCE SELECTOR ===== */}
          <section className="section-pad">
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
                <p className="label mb-4">Strategic Filter</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">What are we maintaining?</h2>
                <p className="t-muted text-lg font-light mt-4 max-w-xl leading-relaxed">Select the infrastructure focus that matches your platform's maturity and operational scale.</p>
              </motion.div>

              <div className="space-y-3">
                {maintenanceTypes.map((type, i) => (
                  <motion.div
                    key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`overflow-hidden border transition-all duration-500 rounded-2xl ${activeType === i ? "border-border/60 bg-secondary/20 shadow-xl" : "border-border/10 bg-white/[0.01] hover:bg-white/[0.02]"}`}
                  >
                    <button
                      onClick={() => setActiveType(activeType === i ? null : i)}
                      className="w-full text-left px-8 py-7 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-xs t-deco tracking-widest font-bold">0{i + 1}</span>
                        <span className={`text-xl font-semibold transition-colors duration-300 ${activeType === i ? "t-primary" : "t-secondary group-hover:t-primary"}`}>
                          {type.title}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 t-ghost transition-transform duration-500 ${activeType === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {activeType === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-8 pb-8">
                            <div className="h-px bg-border/40 mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Best For</p>
                                <p className="text-sm t-muted leading-relaxed">{type.bestFor}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Priority Goal</p>
                                <p className="text-sm t-muted leading-relaxed">{type.goal}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Key Focus</p>
                                <ul className="space-y-2">
                                  {type.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-xs t-muted">
                                      <CheckCircle2 className="w-3 h-3 t-deco shrink-0" />{f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] t-deco mb-3 font-bold">Complexity / SLA</p>
                                <p className="text-base t-primary font-semibold">{type.complexity}</p>
                                <p className="text-xs t-secondary mt-1 font-medium tracking-wide">{type.timeline}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== PAIN POINTS ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 80% 40% at 20% 60%, rgba(var(--primary-raw, 70 130 180), 0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">The Reality</p>
                  <h2 className="text-4xl md:text-5xl t-primary mb-12 font-display">What most maintenance<br />plans get wrong.</h2>
                  <ul className="space-y-8">
                    {[
                      { t: "Reactive 'Fix-it' Culture", d: "Waiting for servers to crash or users to report bugs before taking action, leading to expensive downtime." },
                      { t: "The Black Box Trap", d: "Agencies maintaining code they didn't write without performing a deep audit, leaving critical zero-day vulnerabilities." },
                      { t: "Silent Code Rot", d: "Ignoring dependency updates and library deprecations until the entire foundation becomes incompatible and breaks." },
                      { t: "Manual Patching Errors", d: "Updating live systems without automated testing or staging environments, risking human error on every change." },
                      { t: "Zero Resource Visibility", d: "Not monitoring API latency or memory leaks, resulting in a 'slow' platform that frustrates users long before it crashes." },
                    ].map((item, i) => (
                      <li key={i} className="flex gap-5 items-start">
                        <div className="w-px h-12 bg-border/50 mt-1 shrink-0" />
                        <div>
                          <h4 className="font-semibold t-secondary text-base mb-1.5">{item.t}</h4>
                          <p className="text-sm t-muted leading-relaxed">{item.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="flex flex-col justify-center">
                  <p className="label mb-4">Our Standard</p>
                  <h2 className="text-3xl t-secondary mb-12 font-display italic">How we govern differently.</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Activity, t: "Real-Time Observability", d: "We deploy Sentry and Datadog to track every error and resource spike, catching issues before they impact a single user." },
                      { icon: Shield, t: "Proactive Security Patches", d: "Dependency updates are automated and verified through staging pipelines, maintaining a 100% security health score." },
                      { icon: Clock, t: "SLA-Backed Response", d: "We provide guaranteed response times for critical platform outages, backed by a transparent post-mortem protocol." },
                      { icon: HeartPulse, t: "Health-First Continuous Ops", d: "Every system under our care undergoes a monthly technical audit to identify and resolve performance degradation." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-5 p-5 glass-card group hover:bg-secondary/20 transition-all duration-500">
                        <item.icon className="w-5 h-5 t-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-500" />
                        <div>
                          <h4 className="font-semibold t-primary text-sm mb-1">{item.t}</h4>
                          <p className="text-xs t-muted leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== SYSTEMS PERSPECTIVE ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(70,130,180,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Activity, t: "Application Monitoring", d: "Tracking API latency, error rates, and memory spikes in real-time, not just checking if the server is 'up'." },
                    { icon: Shield, t: "Security Architecture", d: "Enforcing firewall rules, managing WAF configurations, and ensuring data encryption standards remain compliant." },
                    { icon: Clock, t: "Performance Auditing", d: "Regularly evaluating database load times and frontend rendering to catch degradation before users notice." },
                    { icon: Activity, t: "Disaster Recovery", d: "Designing and testing the protocol for worst-case scenarios, ensuring data can be restored within minutes." },
                  ].map((item, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                      className="flex gap-5 p-5 glass-card group hover:bg-white/[0.02] transition-all duration-500">
                      <item.icon className="w-5 h-5 t-secondary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold t-primary text-sm mb-1">{item.t}</h4>
                        <p className="text-xs t-muted leading-relaxed">{item.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <p className="label mb-4">Systems Thinking</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Maintenance as a node in your<br /><span className="text-gradient italic">larger ecosystem.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-8">
                    Maintenance is not "fixing things when they break." It is continuous infrastructure governance. Left alone, code rots and dependencies decay.
                  </p>
                  <p className="t-muted text-base font-light leading-relaxed">
                    We manage the invisible layers of your business — the database queries, the memory leaks, the SSL renewals — so your product team can focus entirely on growth without worrying about the foundation crumbling beneath them.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== ARCHITECTURE / PROCESS ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-1">
                  <p className="label mb-4">Authority</p>
                  <h2 className="text-4xl t-primary font-display mb-6">How we govern.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    Rigorous adherence to Site Reliability Engineering (SRE) and DevOps protocols.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { title: "Audit", items: ["Technical Debt Map", "Security Scan", "Dependency Audit"] },
                    { title: "Govern", items: ["CI/CD Hardening", "Alert Thresholds", "Backup Protocols"] },
                    { title: "Optimise", items: ["Database Tuning", "Cache Strategy", "Logic Refactors"] },
                    { title: "Protect", items: ["Zero-Day Patching", "DDoS Mitigation", "Disaster Recovery"] },
                  ].map((block, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp} className="glass-card p-6 border-white/[0.05]">
                      <h4 className="font-semibold t-primary mb-4 text-xs uppercase tracking-widest">{block.title}</h4>
                      <ul className="space-y-3">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2.5 text-xs t-muted">
                            <div className="w-1 h-1 rounded-full bg-secondary opacity-40" /> {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== ENGAGEMENT MODELS ===== */}
          <section className="section-pad" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(70,130,180,0.04) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20">
                <p className="label mb-4 mx-auto">Strategic Framework</p>
                <h2 className="text-4xl t-primary font-display">Project Scale Examples.</h2>
                <p className="t-muted text-base font-light mt-4 leading-relaxed">
                  Each scale level represents a depth of operational commitment — not a fixed price tier.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {engagementModels.map((item, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className={`glass-card p-10 flex flex-col relative overflow-hidden ${item.featured ? "ring-1 ring-white/10 shadow-xl" : ""}`}
                    style={item.featured ? { background: "linear-gradient(135deg, rgba(70,130,180,0.06) 0%, rgba(255,255,255,0.01) 100%)" } : {}}
                  >
                    {item.featured && (
                      <div className="absolute top-0 inset-x-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(70,130,180,0.6) 50%, transparent 100%)" }} />
                    )}
                    {item.featured && (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
                          style={{ background: "rgba(70,130,180,0.15)", border: "1px solid rgba(70,130,180,0.4)", color: "rgba(150,180,220,0.9)" }}>
                          ✦ Most Common
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.25em] t-deco font-bold mb-5">{item.tag}</span>
                    <item.icon className={`w-8 h-8 mb-5 ${item.featured ? "t-secondary" : "t-ghost"}`} />
                    <h3 className="text-2xl font-bold t-primary mb-2 font-display">{item.title}</h3>
                    <p className="text-sm t-muted leading-relaxed mb-8">{item.sub}</p>
                    <div className="h-px bg-white/[0.05] mb-6" />
                    <ul className="space-y-3 flex-1">
                      {item.points.map((pt, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm t-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 t-deco shrink-0" /> {pt}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== SCOPE & CAPABILITIES ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-1">
                  <p className="label mb-4">Operational Depth</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Scope & Capabilities.</h2>
                  <p className="t-muted text-sm leading-relaxed">
                    We don't just 'fix bugs'; we engineer operational resilience. Every plan starts with a technical audit and layers active governance based on mission-criticality.
                  </p>
                </motion.div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { name: "Essential", items: ["Daily Encrypted Backups", "SLA: 24h Response", "Automated Security Scans", "Plugin/Lib Updates", "Uptime Monitoring"], color: "t-ghost" },
                    { name: "Growth", items: ["SLA: 4h Critical Response", "Staging Environment Sync", "Active Performance Tuning", "Monthly Security Audit", "Priority Feature Spikes"], color: "t-secondary" },
                    { name: "Infrastructure", items: ["SLA: 1h Immediate Action", "Multi-region Replication", "Dedicated Support Lead", "SOC2/HIPAA Compliance", "Unlimited Patching"], color: "t-primary" },
                  ].map((col, i) => (
                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1} variants={fadeUp}>
                      <h3 className={`text-lg font-bold mb-8 ${col.color}`}>{col.name}</h3>
                      <ul className="space-y-5">
                        {col.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-white/[0.08] rounded-full shrink-0" />
                            <span className="text-sm t-muted">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== PERFORMANCE AUTHORITY ===== */}
          <section className="py-32 relative" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(70,130,180,0.05) 0%, transparent 70%)" }}>
            <div className="container-w">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-24">
                <p className="label mb-4 mx-auto">Operational Authority</p>
                <h2 className="text-4xl md:text-5xl t-primary font-display">
                  Benchmarks we maintain for —<br /><span className="t-secondary italic">not afterthoughts.</span>
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {[
                  { label: "Uptime SLA", value: 99.9, suffix: "%", note: "Guaranteed availability through automated recovery and redundancy." },
                  { label: "Reaction Time", value: 15, suffix: "min", prefix: "<", note: "Critical incident response triggered by automated observability." },
                  { label: "Security Updates", value: 24, suffix: "h", prefix: "<", note: "Zero-day vulnerabilities patched within 24 hours of disclosure." },
                  { label: "System Health", value: 100, suffix: "%", note: "Continuous monitoring of CPU, memory, and database integrity." },
                ].map((stat, i) => (
                  <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    custom={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="text-4xl md:text-5xl font-bold font-display text-gradient mb-3 tracking-tight">
                      <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] t-deco font-bold mb-3">{stat.label}</p>
                    <p className="text-xs t-muted leading-relaxed max-w-[160px]">{stat.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== TECH STACK ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Technical Choices</p>
                  <h2 className="text-4xl t-primary font-display mb-4">Operations Stack —</h2>
                  <h2 className="text-4xl text-gradient italic font-display mb-10">and how we use it.</h2>
                  <p className="t-muted text-sm leading-relaxed mb-10 max-w-sm">
                    We select our operations stack for observability, security, and rapid recovery. We don't just 'watch' servers — we engineer operational resilience.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(techStack).map((tech) => (
                      <button
                        key={tech} onClick={() => setActiveTech(tech)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-500 border ${activeTech === tech
                          ? "bg-primary/10 border-primary/40 t-secondary"
                          : "bg-transparent border-white/[0.06] t-muted hover:border-white/[0.12] hover:t-primary"
                          }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-12 min-h-[200px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeTech}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h4 className="text-gradient italic font-display text-3xl mb-4">{activeTech}</h4>
                        <div className="h-px bg-white/[0.06] mb-4" />
                        <p className="t-muted text-base leading-relaxed">
                          {techStack[activeTech]}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== CASE SNAPSHOT ===== */}
          <section className="section-pad">
            <div className="container-w">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                  <p className="label mb-4">Real World Impact</p>
                  <h2 className="text-4xl t-primary font-display mb-6">Case Snapshot:<br /><span className="italic text-gradient">Legacy ERP Recovery.</span></h2>
                  <p className="t-muted text-lg font-light leading-relaxed mb-6">
                    A custom ERP system for a manufacturing firm that suffered 4 severity-1 outages within a single quarter under their previous agency.
                  </p>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">0</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">Emergency Outages</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold t-primary tracking-tight font-display">99.99%</p>
                      <p className="text-[10px] uppercase tracking-widest t-deco">12-Month Uptime</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                  <div className="glass-card p-10 border-white/[0.05]">
                    <div className="space-y-8">
                      {[
                        { l: "The Situation", t: "Original dev team dissolved. Codebase had zero docs, 400+ unpatched dependencies, and a critical memory leak." },
                        { l: "The Challenge", t: "Stabilising a live system without causing regression in high-ticket manufacturing logistics." },
                        { l: "What We Engineered", t: "Containerized the app, instituted CI/CD pipelines, and deployed Datadog APM to isolate the leak." },
                        { l: "The Outcome", t: "Memory leak resolved. System achieved perfect stability for 12 months with proactive governance." },
                      ].map((block, i) => (
                        <div key={i}>
                          <p className="text-[10px] uppercase tracking-widest t-deco font-bold mb-2">{block.l}</p>
                          <p className="text-sm t-muted leading-relaxed">{block.t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== FAQ ===== */}
          <section className="section-pad">
            <div className="container-w grid grid-cols-1 lg:grid-cols-5 gap-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-2">
                <p className="label mb-4">Transparency</p>
                <h2 className="text-4xl t-primary font-display mb-6">Common questions,<br /><span className="italic t-secondary">direct answers.</span></h2>
                <p className="t-muted text-sm leading-relaxed max-w-sm">
                  Operational clarity is our standard. If you have a specific SLA requirement or security concern, our strategy call is the best place to address it.
                </p>
              </motion.div>
              <div className="lg:col-span-3">
                <div className="border-t border-white/[0.06]">
                  {faqs.map((f, i) => <FAQItem key={i} f={f} i={i} />)}
                </div>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ===== FINAL CTA ===== */}
          <section className="py-44 relative overflow-hidden">
            <div className="blob blob-blue w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" />
            <div className="container-w grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <p className="label mb-6">Next Step</p>
                <h2 className="text-4xl md:text-5xl font-bold t-primary font-display mb-6 leading-tight">
                  Secure your<br /><span className="text-gradient italic">infrastructure properly.</span>
                </h2>
                <p className="text-lg t-muted font-light leading-relaxed max-w-md mb-8">
                  We start with a comprehensive technical audit — mapping your architecture, identifying vulnerabilities, and assessing codebase health.
                </p>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] max-w-sm">
                  <p className="text-xs t-secondary leading-relaxed italic">
                    "We govern systems designed to evolve over the next 3–5 years, ensuring your foundation stays secure while your business scales."
                  </p>
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="flex flex-col gap-5 items-start lg:items-center justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button data-cursor="button" size="lg" className="h-16 px-10 rounded-2xl gap-3 btn-primary text-white border-0 text-lg shadow-2xl shadow-primary/20 w-full sm:w-auto">
                    Book a Support Audit <Shield className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs t-deco tracking-widest uppercase font-semibold">Typically respond within 4 hours</p>
              </motion.div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
