import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Monitor, Code, Zap, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Code, title: "Clean Code", desc: "Modern, maintainable code using React, Next.js, and TypeScript" },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized performance with 90+ Lighthouse scores" },
  { icon: Shield, title: "Secure", desc: "Built-in security best practices and SSL encryption" },
  { icon: Monitor, title: "Responsive", desc: "Flawless experience on all devices and screen sizes" },
];

const process = [
  { step: "01", title: "Discovery", desc: "We analyze your requirements, target audience, and competitors to create a strategic roadmap." },
  { step: "02", title: "Design", desc: "Our designers craft pixel-perfect mockups that align with your brand identity." },
  { step: "03", title: "Development", desc: "We build your website using cutting-edge technologies for optimal performance." },
  { step: "04", title: "Launch", desc: "Rigorous testing, SEO optimization, and seamless deployment to production." },
];

const projects = [
  { name: "TechStart SaaS", type: "SaaS Platform", result: "300% increase in conversions" },
  { name: "Artisan E-commerce", type: "Online Store", result: "50K+ monthly visitors" },
  { name: "FinanceHub", type: "Corporate Website", result: "40% reduced bounce rate" },
];

export default function WebDevelopment() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-800/30 rounded-full blur-3xl" />
          
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <Monitor className="w-4 h-4" /> Website Development
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Websites That <span className="text-gradient">Convert</span> Visitors Into Customers
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                We create high-performance, visually stunning websites that not only look great but drive real business results. From landing pages to complex web platforms.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    Start Your Project <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">What We Deliver</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 hover-lift shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-emerald-50 dark:bg-emerald-950/50">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <span className="text-6xl font-bold text-emerald-200 dark:text-emerald-900">{item.step}</span>
                  <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-emerald-100 dark:border-emerald-800 hover-lift"
                >
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.type}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {project.result}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Website?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Let's create something exceptional together. Get a free consultation and quote.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Free Quote <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
