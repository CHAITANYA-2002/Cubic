import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const team = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    bio: "10+ years in software development. Former tech lead at major startups. Passionate about building products that matter.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Priya Patel",
    role: "Lead Designer",
    bio: "Award-winning UI/UX designer with a focus on creating beautiful, user-centric digital experiences.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Amit Kumar",
    role: "Technical Director",
    bio: "Full-stack architect specializing in scalable systems. Expert in React, Node.js, and cloud infrastructure.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Sneha Gupta",
    role: "Marketing Head",
    bio: "Digital marketing strategist with expertise in growth hacking, SEO, and social media campaigns.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300"
  }
];

const values = [
  {
    title: "Innovation",
    desc: "We constantly explore new technologies and methodologies to deliver cutting-edge solutions that give our clients a competitive advantage."
  },
  {
    title: "Integrity",
    desc: "Transparent communication, honest pricing, and ethical practices are the foundations of every client relationship we build."
  },
  {
    title: "Quality",
    desc: "We never compromise on code quality, performance, or user experience. Every project receives our full attention and expertise."
  }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader 
        title="About Us" 
        subtitle="We are a team of passionate developers, designers, and strategists committed to digital excellence."
      />
      
      <main className="flex-grow">
        <section className="section-padding">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold">Who We Are</h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cubic Technologies is a premier software development company based in Jaipur, India. Since our inception, we have been dedicated to delivering top-tier digital solutions to businesses worldwide—from ambitious startups to established enterprises.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to bridge the gap between complex technology and business goals. We believe in creating software that is not just functional, but also intuitive, beautiful, and impactful. Every line of code we write is crafted with purpose.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</h4>
                    <p className="text-sm font-medium text-muted-foreground">Projects Completed</p>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</h4>
                    <p className="text-sm font-medium text-muted-foreground">Client Satisfaction</p>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5+</h4>
                    <p className="text-sm font-medium text-muted-foreground">Years Experience</p>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</h4>
                    <p className="text-sm font-medium text-muted-foreground">Support Available</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 transform rotate-6 rounded-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Our Team" 
                  className="relative rounded-3xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white">
          <div className="container-width">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-white/80 text-lg">
                The core principles that guide every project we undertake and every relationship we build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-white/80">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The talented individuals behind Cubic Technologies who bring your vision to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover-lift">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover-lift">
                        <Twitter className="w-5 h-5 text-blue-600" />
                      </a>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
