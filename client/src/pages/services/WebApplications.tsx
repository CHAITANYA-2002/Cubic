import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Globe, Database, Cloud, Lock, ArrowRight } from "lucide-react";
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

const projects = [
  { name: "InventoryPro", type: "Inventory Management", result: "80% reduction in stock discrepancies" },
  { name: "BookMaster", type: "Booking Platform", result: "10K+ bookings processed monthly" },
  { name: "TeamSync", type: "Project Management", result: "35% productivity improvement" },
];

export default function WebApplications() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-950 dark:to-neutral-900" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-full blur-3xl" />
          
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
                  <Button size="lg" className="gap-2">
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
                  <span className="text-6xl font-bold text-neutral-200 dark:text-neutral-800">{item.step}</span>
                  <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover-lift"
                >
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.type}</p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {project.result}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-foreground text-background">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Application?</h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
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
