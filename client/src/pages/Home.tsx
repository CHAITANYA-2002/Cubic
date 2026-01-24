import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { ContactForm } from "@/components/ContactForm";
import { Link } from "wouter";
import { ArrowRight, Code, Monitor, Smartphone, Wrench, BrainCircuit, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        
        <div className="container-width grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Innovating Digital Solutions
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-foreground leading-[1.1] mb-6 tracking-tight">
              Transform Your <br />
              <span className="text-gradient">Digital Vision</span> <br />
              Into Reality
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              We build stunning websites, powerful applications, and AI solutions that drive growth for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="text-lg h-14 px-8 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  Request Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-lg h-14 px-8 rounded-xl bg-white hover:bg-slate-50 border-slate-200">
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Abstract visual composition using unsplash images */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                 {/* Modern office workspace abstract */}
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600" 
                  alt="Development" 
                  className="rounded-2xl shadow-2xl"
                />
                 {/* UI Design interface */}
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600" 
                  alt="Analytics" 
                  className="rounded-2xl shadow-2xl opacity-80"
                />
              </div>
              <div className="space-y-4">
                 {/* Code on screen */}
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600" 
                  alt="Coding" 
                  className="rounded-2xl shadow-2xl opacity-80"
                />
                 {/* Team meeting */}
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                  alt="Team" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
            {/* Decor elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="container-width">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Our Core Expertise</h2>
            <p className="text-muted-foreground text-lg">
              We leverage cutting-edge technology to deliver comprehensive digital solutions tailored to your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Monitor} 
              title="Web Development" 
              description="Custom, responsive websites built with modern frameworks for speed and SEO."
              delay={0}
            />
            <ServiceCard 
              icon={Smartphone} 
              title="UI/UX Design" 
              description="User-centric interfaces that engage visitors and drive conversion rates."
              delay={0.1}
            />
            <ServiceCard 
              icon={BrainCircuit} 
              title="AI Solutions" 
              description="Intelligent automation and AI integration to streamline your operations."
              delay={0.2}
            />
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
               {/* Team collaborating on whiteboard */}
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Team" 
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Why Partner With Cubic Technologies?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                We don't just write code; we build partnerships. Our approach combines technical expertise with deep business understanding.
              </p>
              
              <ul className="space-y-6">
                {[
                  "Agile Development Methodology",
                  "Dedicated Support & Maintenance",
                  "Scalable & Secure Architecture",
                  "Cost-Effective Solutions"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container-width text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Let's discuss how we can help transform your business with our digital solutions.
          </p>
          <Link href="/contact">
            <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-slate-100 border-none shadow-2xl">
              Get Free Consultation
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
