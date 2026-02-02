import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Wrench, Shield, Clock, BarChart3, ArrowRight, X, Zap, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Clock, title: "24/7 Monitoring", desc: "Round-the-clock uptime monitoring with instant alerts via email and SMS" },
  { icon: Shield, title: "Security Updates", desc: "Weekly security patches, vulnerability assessments, and firewall management" },
  { icon: BarChart3, title: "Performance", desc: "Continuous optimization for speed, Core Web Vitals, and server efficiency" },
  { icon: Wrench, title: "Quick Fixes", desc: "Bug fixes and issue resolution within guaranteed SLA timeframes" },
];

const plans = [
  { 
    name: "Starter", 
    price: "₹8,999",
    period: "/month",
    description: "Perfect for small businesses with basic website maintenance needs",
    features: [
      { text: "Monthly security updates", included: true },
      { text: "Email support (48hr response)", included: true },
      { text: "Weekly backups", included: true },
      { text: "Basic uptime monitoring", included: true },
      { text: "1 hour of changes/month", included: true },
      { text: "Performance reports", included: false },
      { text: "Priority support", included: false },
      { text: "Dedicated manager", included: false },
    ],
    popular: false
  },
  { 
    name: "Professional", 
    price: "₹24,999",
    period: "/month",
    description: "Ideal for growing businesses requiring regular updates and faster support",
    features: [
      { text: "Weekly security updates", included: true },
      { text: "Priority support (12hr response)", included: true },
      { text: "Daily backups", included: true },
      { text: "Advanced uptime monitoring", included: true },
      { text: "5 hours of changes/month", included: true },
      { text: "Monthly performance reports", included: true },
      { text: "SEO monitoring", included: true },
      { text: "Dedicated manager", included: false },
    ],
    popular: true
  },
  { 
    name: "Enterprise", 
    price: "₹49,999",
    period: "/month",
    description: "Complete care for mission-critical applications and large-scale platforms",
    features: [
      { text: "Daily security updates", included: true },
      { text: "24/7 support (2hr response)", included: true },
      { text: "Real-time backups", included: true },
      { text: "Multi-region monitoring", included: true },
      { text: "Unlimited changes", included: true },
      { text: "Weekly performance reports", included: true },
      { text: "Full SEO management", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    popular: false
  }
];

const additionalServices = [
  { icon: Zap, title: "Emergency Support", desc: "Critical issue resolution within 1 hour, available 24/7", price: "₹5,000/incident" },
  { icon: Shield, title: "Security Audit", desc: "Comprehensive security assessment with detailed report", price: "₹15,000/audit" },
  { icon: BarChart3, title: "Performance Audit", desc: "Full performance analysis with optimization recommendations", price: "₹10,000/audit" },
  { icon: HeadphonesIcon, title: "Extra Support Hours", desc: "Additional development/change hours beyond your plan", price: "₹2,000/hour" },
];

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-slate-900" />
          <div className="absolute top-40 left-40 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          
          <div className="container-width relative z-10">
            <Link href="/services">
              <Button variant="ghost" className="mb-8 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Services
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" /> Maintenance & Support
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Keep Your Digital Assets <span className="text-gradient">Running Smoothly</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Proactive maintenance, security updates, and dedicated support to ensure your website and applications perform at their best 24/7. Choose a plan that fits your needs.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Get Support <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover-lift shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
          <div className="container-width">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Support Plans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect maintenance plan for your business. All plans include our core features with varying levels of support and response times.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl bg-white dark:bg-slate-900 hover-lift relative ${
                    plan.popular ? "border-2 border-blue-500 shadow-xl shadow-blue-500/10" : "border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        {feature.included ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground/60"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button 
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Need something extra? These add-on services are available to complement any plan.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover-lift"
                >
                  <service.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">{service.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Custom Support?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Have unique requirements? Let's discuss a tailored support solution for your business.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="gap-2">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
