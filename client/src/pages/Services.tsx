import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { Monitor, Layout, Globe, Wrench, BrainCircuit, Megaphone } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Website Development",
    description: "Full-stack development services creating robust, scalable, and high-performance websites using the latest technologies.",
    features: [
      "Custom responsive websites",
      "E-commerce solutions",
      "SEO optimization included",
      "Fast loading & mobile-first"
    ],
    examples: ["Corporate Sites", "Landing Pages", "Portfolios", "Blogs"]
  },
  {
    icon: Layout,
    title: "UI/UX Designs",
    description: "Creating intuitive and engaging user experiences through research-driven design that users love to interact with.",
    features: [
      "User research & personas",
      "Wireframing & prototyping",
      "Interactive mockups",
      "Usability testing"
    ],
    examples: ["Mobile Apps", "Dashboards", "SaaS Platforms", "Brand Identity"]
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Complex web-based software solutions tailored to your specific business processes to improve efficiency and revenue.",
    features: [
      "Custom CRM systems",
      "Inventory management",
      "Booking & scheduling apps",
      "Real-time collaboration tools"
    ],
    examples: ["Healthcare Portals", "HR Management", "E-Learning Platforms", "POS Systems"]
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Reliable support to keep your digital assets running smoothly with regular updates and performance monitoring.",
    features: [
      "24/7 monitoring",
      "Security patches & updates",
      "Backup & disaster recovery",
      "Performance optimization"
    ],
    examples: ["Monthly Retainers", "Emergency Support", "Server Management", "Bug Fixes"]
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions",
    description: "Integration of Artificial Intelligence and Machine Learning to automate tasks, analyze data, and personalize experiences.",
    features: [
      "Chatbots & virtual assistants",
      "Predictive analytics",
      "Image & text recognition",
      "Process automation"
    ],
    examples: ["Customer Service Bots", "Recommendation Engines", "Data Insights", "Document Processing"]
  },
  {
    icon: Megaphone,
    title: "Digital & Social Media Marketing",
    description: "Comprehensive digital marketing strategies to boost your online presence, engage audiences, and drive conversions.",
    features: [
      "Social media management",
      "Paid advertising (Google, Meta)",
      "Content creation & strategy",
      "Analytics & reporting"
    ],
    examples: ["Instagram Campaigns", "Google Ads", "Influencer Marketing", "Email Marketing"]
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
