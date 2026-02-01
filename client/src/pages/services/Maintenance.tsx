import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Wrench, Shield, Clock, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Clock, title: "24/7 Monitoring", desc: "Round-the-clock uptime monitoring with instant alerts" },
  { icon: Shield, title: "Security Updates", desc: "Regular patches and vulnerability assessments" },
  { icon: BarChart3, title: "Performance", desc: "Continuous optimization for speed and efficiency" },
  { icon: Wrench, title: "Quick Fixes", desc: "Rapid response to bugs and issues within SLA" },
];

const plans = [
  { name: "Basic", features: ["Monthly updates", "Email support", "Security patches", "Weekly backups"], price: "Starting at ₹15,000/mo" },
  { name: "Professional", features: ["Weekly updates", "Priority support", "Daily backups", "Performance reports"], price: "Starting at ₹35,000/mo" },
  { name: "Enterprise", features: ["24/7 monitoring", "Dedicated manager", "Real-time backups", "SLA guarantee"], price: "Custom pricing" },
];

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-950 dark:to-neutral-900" />
          <div className="absolute top-40 left-40 w-96 h-96 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-full blur-3xl" />
          
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" /> Maintenance & Support
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Keep Your Digital Assets <span className="text-gradient">Running Smoothly</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Proactive maintenance, security updates, and dedicated support to ensure your website and applications perform at their best 24/7.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2">
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
                  className="p-6 rounded-2xl glass-card hover-lift"
                >
                  <feature.icon className="w-10 h-10 mb-4 text-foreground" />
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-neutral-50 dark:bg-neutral-950">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Support Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-background hover-lift"
                >
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="font-bold text-lg">{plan.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-foreground text-background">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Reliable Support?</h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Let us handle the technical details while you focus on growing your business.
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
