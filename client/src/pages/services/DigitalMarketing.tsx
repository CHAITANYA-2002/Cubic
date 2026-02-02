import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Megaphone, Target, TrendingUp, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Megaphone, title: "Social Media", desc: "Strategic content and community management across all platforms" },
  { icon: Target, title: "Paid Advertising", desc: "High-ROI campaigns on Google, Meta, LinkedIn, and more" },
  { icon: TrendingUp, title: "SEO & Content", desc: "Organic growth through optimized content and technical SEO" },
  { icon: Users, title: "Influencer Marketing", desc: "Partnerships with relevant influencers to amplify your brand" },
];

const results = [
  { metric: "500%", label: "Average ROI on ad spend" },
  { metric: "10M+", label: "Social impressions delivered" },
  { metric: "150+", label: "Successful campaigns" },
  { metric: "50+", label: "Happy clients" },
];

const campaigns = [
  { name: "Fashion Brand Launch", platform: "Instagram & Facebook", result: "2M reach, 50K followers in 3 months" },
  { name: "SaaS Lead Generation", platform: "LinkedIn & Google", result: "300% increase in qualified leads" },
  { name: "Local Business Growth", platform: "Google My Business", result: "Top 3 rankings for key terms" },
];

export default function DigitalMarketing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-800/30 rounded-full blur-3xl" />
          
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <Megaphone className="w-4 h-4" /> Digital & Social Media Marketing
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Grow Your Brand <span className="text-gradient">Online</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Data-driven digital marketing strategies that boost your online presence, engage your audience, and drive measurable business results.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    Start Marketing <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Marketing Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 hover-lift shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-emerald-600 dark:bg-emerald-800">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {results.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-white"
                >
                  <span className="text-4xl md:text-5xl font-bold">{item.metric}</span>
                  <p className="text-emerald-100 mt-2">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Campaign Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {campaigns.map((campaign, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-emerald-100 dark:border-emerald-800 hover-lift"
                >
                  <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{campaign.platform}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {campaign.result}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Grow Your Online Presence?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Let's create a marketing strategy that delivers real results.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Free Strategy Call <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
