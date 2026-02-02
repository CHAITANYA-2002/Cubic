import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Monitor, Layout, Globe, Wrench, BrainCircuit, Megaphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Monitor,
    title: "Website Development",
    description: "Full-stack development creating robust, scalable, high-performance websites using React, Next.js, and Node.js. From corporate sites to complex e-commerce platforms.",
    features: ["Custom responsive websites", "E-commerce solutions", "SEO optimization", "Fast loading times"],
    link: "/services/web-development"
  },
  {
    icon: Layout,
    title: "UI/UX Designs",
    description: "Research-driven design that creates intuitive, engaging user experiences. We focus on user personas, wireframing, and prototyping to deliver interfaces users love.",
    features: ["User research", "Wireframing & prototyping", "Interactive mockups", "Usability testing"],
    link: "/services/ui-ux-design"
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Complex web-based software solutions tailored to your specific business processes. From CRMs to inventory systems, we build tools that improve efficiency.",
    features: ["Custom CRM systems", "Booking platforms", "Inventory management", "Real-time dashboards"],
    link: "/services/web-applications"
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Reliable 24/7 support to keep your digital assets running smoothly. Regular updates, security patches, backups, and performance monitoring.",
    features: ["24/7 monitoring", "Security patches", "Daily backups", "Performance optimization"],
    link: "/services/maintenance"
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions",
    description: "Integration of Artificial Intelligence and Machine Learning to automate tasks, analyze data, and provide personalized experiences for your customers.",
    features: ["Chatbots & assistants", "Predictive analytics", "Document processing", "Custom AI models"],
    link: "/services/ai-solutions"
  },
  {
    icon: Megaphone,
    title: "Digital & Social Media Marketing",
    description: "Comprehensive digital marketing strategies to boost your online presence, engage audiences, and drive measurable conversions across all platforms.",
    features: ["Social media management", "Paid advertising", "Content strategy", "Influencer marketing"],
    link: "/services/digital-marketing"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader 
        title="Our Services" 
        subtitle="Comprehensive digital solutions designed to help your business thrive in the modern economy. Click on any service to learn more."
      />
      
      <main className="flex-grow section-padding">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover-lift shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-blue-600 group-hover:text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={service.link}>
                  <Button variant="outline" className="w-full gap-2 border-slate-300 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
