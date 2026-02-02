import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Globe, Database, Cloud, Lock, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Database, title: "Custom Solutions", desc: "Tailored applications built specifically for your business workflows" },
  { icon: Cloud, title: "Cloud-Native", desc: "Scalable architecture deployed on AWS, GCP, or Azure" },
  { icon: Lock, title: "Enterprise Security", desc: "Bank-grade security with encryption and compliance" },
  { icon: Globe, title: "Real-time Features", desc: "Live updates, collaboration, and instant notifications" },
];

const process = [
  { step: "01", title: "Analysis", desc: "Deep dive into your business processes to identify automation opportunities." },
  { step: "02", title: "Architecture", desc: "Design scalable, maintainable system architecture with future growth in mind." },
  { step: "03", title: "Build", desc: "Agile development with regular demos and feedback integration." },
  { step: "04", title: "Deploy", desc: "Seamless deployment, training, and ongoing support." },
];

const pricing = [
  {
    name: "Starter App",
    price: "₹1,00,000",
    description: "Simple web applications for specific tasks",
    features: [
      { text: "Single-purpose application", included: true },
      { text: "User authentication", included: true },
      { text: "Basic dashboard", included: true },
      { text: "Mobile responsive", included: true },
      { text: "3 months support", included: true },
      { text: "Third-party integrations", included: false },
      { text: "Real-time features", included: false },
      { text: "Advanced analytics", included: false },
    ],
    popular: false
  },
  {
    name: "Business App",
    price: "₹3,00,000",
    description: "Full-featured applications for businesses",
    features: [
      { text: "Multi-module application", included: true },
      { text: "Role-based access control", included: true },
      { text: "Advanced dashboards", included: true },
      { text: "Mobile responsive + PWA", included: true },
      { text: "6 months support", included: true },
      { text: "API integrations", included: true },
      { text: "Real-time notifications", included: true },
      { text: "Advanced analytics", included: false },
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹7,50,000+",
    description: "Complex enterprise-grade platforms",
    features: [
      { text: "Unlimited modules", included: true },
      { text: "Advanced security & SSO", included: true },
      { text: "Custom reporting", included: true },
      { text: "All platforms", included: true },
      { text: "12 months support", included: true },
      { text: "Unlimited integrations", included: true },
      { text: "Real-time everything", included: true },
      { text: "AI/ML analytics", included: true },
    ],
    popular: false
  }
];

export default function WebApplications() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-slate-900" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          
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
                <Globe className="w-4 h-4" /> Web Applications
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Powerful Apps That <span className="text-gradient">Scale</span> With Your Business
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                From CRMs to complex enterprise platforms, we build web applications that automate processes, improve efficiency, and drive growth.
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
            <h2 className="text-3xl font-bold mb-12 text-center">What We Build</h2>
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
            <h2 className="text-3xl font-bold mb-12 text-center">Development Process</h2>
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
                Investment levels for different application complexities. Custom quotes available for unique requirements.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Application?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can automate and streamline your business.
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
