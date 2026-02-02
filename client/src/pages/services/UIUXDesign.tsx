import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Layout, Palette, Users, MousePointer, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Users, title: "User Research", desc: "Deep understanding of your target audience through interviews and analytics" },
  { icon: Layout, title: "Wireframing", desc: "Low-fidelity prototypes to validate concepts before visual design" },
  { icon: Palette, title: "Visual Design", desc: "Stunning, brand-aligned interfaces that captivate users" },
  { icon: MousePointer, title: "Prototyping", desc: "Interactive prototypes for testing and stakeholder approval" },
];

const process = [
  { step: "01", title: "Research", desc: "User interviews, competitor analysis, and market research to understand the landscape." },
  { step: "02", title: "Ideate", desc: "Brainstorming sessions, user flows, and information architecture planning." },
  { step: "03", title: "Design", desc: "High-fidelity mockups with attention to every pixel and interaction." },
  { step: "04", title: "Test", desc: "Usability testing and iteration based on real user feedback." },
];

const pricing = [
  {
    name: "Essential",
    price: "₹20,000",
    description: "Basic UI design for simple projects",
    features: [
      { text: "Up to 5 screen designs", included: true },
      { text: "Mobile or desktop", included: true },
      { text: "2 revision rounds", included: true },
      { text: "Basic style guide", included: true },
      { text: "Figma source files", included: true },
      { text: "User research", included: false },
      { text: "Interactive prototype", included: false },
      { text: "Design system", included: false },
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "₹60,000",
    description: "Complete UI/UX for apps and websites",
    features: [
      { text: "Up to 20 screen designs", included: true },
      { text: "Mobile + desktop", included: true },
      { text: "5 revision rounds", included: true },
      { text: "Complete style guide", included: true },
      { text: "Figma source files", included: true },
      { text: "User research & personas", included: true },
      { text: "Interactive prototype", included: true },
      { text: "Design system", included: false },
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹1,25,000+",
    description: "Full-scale design for complex platforms",
    features: [
      { text: "Unlimited screens", included: true },
      { text: "All platforms", included: true },
      { text: "Unlimited revisions", included: true },
      { text: "Brand guidelines", included: true },
      { text: "All source files", included: true },
      { text: "Full UX research", included: true },
      { text: "Advanced prototypes", included: true },
      { text: "Complete design system", included: true },
    ],
    popular: false
  }
];

export default function UIUXDesign() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-950 dark:to-slate-900" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
          
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
                <Layout className="w-4 h-4" /> UI/UX Design
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Designs That Users <span className="text-gradient">Love</span> to Use
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                We craft intuitive, beautiful interfaces that delight users and drive business outcomes. Every pixel is purposeful, every interaction meaningful.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Start Your Project <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Design Services</h2>
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
            <h2 className="text-3xl font-bold mb-12 text-center">Design Process</h2>
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
                  <span className="text-6xl font-bold text-slate-200 dark:text-slate-800">{item.step}</span>
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
                Flexible design packages for projects of any size. All prices are one-time payments.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Design?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Let's create interfaces that your users will love.
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
