import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, BrainCircuit, MessageSquare, TrendingUp, FileSearch, ArrowRight } from "lucide-react";
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

export default function AISolutions() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-950 dark:to-neutral-900" />
          <div className="absolute top-20 right-40 w-96 h-96 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-full blur-3xl" />
          
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
                  <Button size="lg" className="gap-2">
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
            <h2 className="text-3xl font-bold mb-12 text-center">Real-World Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-background hover-lift"
                >
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">{item.industry}</span>
                  <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-foreground text-background">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Implement AI?</h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
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
