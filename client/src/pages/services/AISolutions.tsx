import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, BrainCircuit, MessageSquare, TrendingUp, FileSearch, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: MessageSquare, title: "AI Chatbots", desc: "Intelligent conversational agents that handle customer queries 24/7" },
  { icon: TrendingUp, title: "Predictive Analytics", desc: "ML models that forecast trends and optimize decisions" },
  { icon: FileSearch, title: "Document Processing", desc: "Automated extraction and analysis of documents at scale" },
  { icon: BrainCircuit, title: "Custom AI Models", desc: "Tailored machine learning solutions for your unique needs" },
];

const useCases = [
  { title: "Customer Support Bot", desc: "Reduced support tickets by 70% for an e-commerce client", industry: "E-commerce" },
  { title: "Fraud Detection", desc: "ML model detecting suspicious transactions with 99% accuracy", industry: "Fintech" },
  { title: "Content Generation", desc: "AI-powered product descriptions for 10,000+ SKUs", industry: "Retail" },
];

const pricing = [
  {
    name: "AI Starter",
    price: "₹50,000",
    description: "Simple AI integrations for your business",
    features: [
      { text: "Basic chatbot integration", included: true },
      { text: "Pre-trained models", included: true },
      { text: "Simple automation", included: true },
      { text: "API integration", included: true },
      { text: "1 month support", included: true },
      { text: "Custom training", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Multi-language support", included: false },
    ],
    popular: false
  },
  {
    name: "AI Professional",
    price: "₹1,50,000",
    description: "Advanced AI solutions for growing businesses",
    features: [
      { text: "Advanced chatbot/assistant", included: true },
      { text: "Fine-tuned models", included: true },
      { text: "Process automation", included: true },
      { text: "Multiple integrations", included: true },
      { text: "3 months support", included: true },
      { text: "Custom model training", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Multi-language support", included: false },
    ],
    popular: true
  },
  {
    name: "AI Enterprise",
    price: "₹4,00,000+",
    description: "Full-scale AI transformation for enterprises",
    features: [
      { text: "Custom AI agents", included: true },
      { text: "Custom ML models", included: true },
      { text: "End-to-end automation", included: true },
      { text: "Unlimited integrations", included: true },
      { text: "12 months support", included: true },
      { text: "Continuous learning", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Multi-language + voice", included: true },
    ],
    popular: false
  }
];

export default function AISolutions() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-950 dark:to-slate-900" />
          <div className="absolute top-20 right-40 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
          
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
                <BrainCircuit className="w-4 h-4" /> AI Solutions
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Harness the Power of <span className="text-gradient">Artificial Intelligence</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                From intelligent chatbots to predictive analytics, we integrate AI into your business to automate tasks, gain insights, and create personalized experiences.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Explore AI Solutions <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">AI Capabilities</h2>
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
            <h2 className="text-3xl font-bold mb-12 text-center">Real-World Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover-lift"
                >
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">{item.industry}</span>
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
                AI solutions for every budget. Custom quotes available for complex requirements.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Implement AI?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Let's explore how AI can transform your business operations.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Free Consultation <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
