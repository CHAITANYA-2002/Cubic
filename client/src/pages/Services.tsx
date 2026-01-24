import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { Monitor, Layout, Globe, Wrench, BrainCircuit, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Website Development",
    description: "Full-stack development services creating robust, scalable, and high-performance websites. We use the latest technologies like React, Next.js, and Node.js to ensure your web presence is future-proof."
  },
  {
    icon: Layout,
    title: "UI/UX Designs",
    description: "Creating intuitive and engaging user experiences. Our design process focuses on user research, wireframing, and prototyping to deliver interfaces that users love to interact with."
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Complex web-based software solutions tailored to your specific business processes. From CRMs to E-commerce platforms, we build tools that improve efficiency and revenue."
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Reliable support to keep your digital assets running smoothly. We offer regular updates, security patches, backups, and performance monitoring services."
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions",
    description: "Integration of Artificial Intelligence and Machine Learning models to automate tasks, analyze data, and provide personalized experiences for your customers."
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Protecting your digital infrastructure with robust security measures. We implement best practices to safeguard your data and prevent potential threats."
  }
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Our Services" 
        subtitle="Comprehensive digital solutions designed to help your business thrive in the modern economy."
      />
      
      <main className="flex-grow section-padding bg-slate-50 dark:bg-slate-950">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
