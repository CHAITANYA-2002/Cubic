import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Monitor, Code, Zap, Shield, ArrowRight, X } from "lucide-react";
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

const pricing = [
  {
    name: "Starter",
    price: "₹25,000",
    description: "Perfect for small businesses and personal websites",
    features: [
      { text: "Up to 5 pages", included: true },
      { text: "Mobile responsive design", included: true },
      { text: "Contact form integration", included: true },
      { text: "Basic SEO setup", included: true },
      { text: "1 month free support", included: true },
      { text: "Custom animations", included: false },
      { text: "CMS integration", included: false },
      { text: "E-commerce features", included: false },
    ],
    popular: false
  },
  {
    name: "Business",
    price: "₹75,000",
    description: "Ideal for growing businesses needing more features",
    features: [
      { text: "Up to 15 pages", included: true },
      { text: "Mobile responsive design", included: true },
      { text: "Advanced contact forms", included: true },
      { text: "Full SEO optimization", included: true },
      { text: "3 months free support", included: true },
      { text: "Custom animations", included: true },
      { text: "CMS integration", included: true },
      { text: "E-commerce features", included: false },
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹1,50,000+",
    description: "Complete solution for large-scale projects",
    features: [
      { text: "Unlimited pages", included: true },
      { text: "Mobile responsive design", included: true },
      { text: "Advanced forms & integrations", included: true },
      { text: "Full SEO & analytics", included: true },
      { text: "6 months free support", included: true },
      { text: "Custom animations", included: true },
      { text: "Headless CMS", included: true },
      { text: "Full e-commerce", included: true },
    ],
    popular: false
  }
];

export default function WebDevelopment() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-slate-900" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          
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
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
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
                  <span className="text-6xl font-bold text-slate-200 dark:text-slate-800">{item.step}</span>
                  <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transparent pricing for every budget. All prices are one-time payments for the complete project.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricing.map((plan, i) => (
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

        <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white">
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
