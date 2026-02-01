import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "917976989699";
const WHATSAPP_MESSAGE = "Hi! I'm interested in your services. Can we discuss my project?";

export default function Contact() {
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with our team to discuss your next big project. We're here to help."
      />
      
      <main className="flex-grow section-padding">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Whether you have a question about our services, pricing, or want to discuss a potential collaboration, our team is ready to answer all your questions. Reach out through any channel below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Our Location</h3>
                    <p className="text-muted-foreground">Jaipur, Rajasthan, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone Number</h3>
                    <p className="text-muted-foreground">+91 79769 89699</p>
                    <p className="text-xs text-muted-foreground mt-1">Mon-Sat from 9am to 7pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Address</h3>
                    <p className="text-muted-foreground">info@cubictech.com</p>
                    <p className="text-muted-foreground">support@cubictech.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-muted-foreground">We typically respond within 2-4 hours during business hours.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">Prefer instant messaging? Chat with us on WhatsApp:</p>
                <Button 
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="w-full gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white"
                  data-testid="button-whatsapp"
                >
                  <SiWhatsapp className="w-5 h-5" />
                  Chat on WhatsApp
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="p-8 rounded-2xl glass-card">
                <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                <ContactForm />
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
