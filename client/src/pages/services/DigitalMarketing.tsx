import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Megaphone, Target, TrendingUp, Users, ArrowRight, X } from "lucide-react";
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

const pricing = [
  {
    name: "Starter",
    price: "₹15,000",
    period: "/month",
    description: "Essential marketing for small businesses",
    features: [
      { text: "2 social media platforms", included: true },
      { text: "8 posts per month", included: true },
      { text: "Basic community management", included: true },
      { text: "Monthly report", included: true },
      { text: "Email support", included: true },
      { text: "Paid advertising", included: false },
      { text: "SEO optimization", included: false },
      { text: "Influencer outreach", included: false },
    ],
    popular: false
  },
  {
    name: "Growth",
    price: "₹40,000",
    period: "/month",
    description: "Comprehensive marketing for growing brands",
    features: [
      { text: "4 social media platforms", included: true },
      { text: "20 posts per month", included: true },
      { text: "Full community management", included: true },
      { text: "Weekly reports", included: true },
      { text: "Priority support", included: true },
      { text: "Ad management (₹50K budget)", included: true },
      { text: "Basic SEO", included: true },
      { text: "Influencer outreach", included: false },
    ],
    popular: true
  },
  {
    name: "Scale",
    price: "₹80,000",
    period: "/month",
    description: "Full-scale marketing for ambitious brands",
    features: [
      { text: "All social platforms", included: true },
      { text: "Daily content", included: true },
      { text: "24/7 community management", included: true },
      { text: "Real-time analytics", included: true },
      { text: "Dedicated manager", included: true },
      { text: "Ad management (₹2L budget)", included: true },
      { text: "Full SEO & content", included: true },
      { text: "Influencer partnerships", included: true },
    ],
    popular: false
  }
];

export default function DigitalMarketing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-slate-900" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          
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
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
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

        <section className="section-padding bg-slate-800 dark:bg-slate-900">
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
                  <p className="text-slate-300 mt-2">{item.label}</p>
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
                Monthly marketing packages designed to fit your growth stage. All plans are billed monthly.
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
                    <span className="text-muted-foreground">{plan.period}</span>
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
