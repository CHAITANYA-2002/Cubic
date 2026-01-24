import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="About Us" 
        subtitle="We are a team of passionate developers, designers, and strategists committed to digital excellence."
      />
      
      <main className="flex-grow">
        <section className="section-padding">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-display">Who We Are</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cubic Technologies is a premier software development company based in Jaipur, India. Since our inception, we have been dedicated to delivering top-tier digital solutions to businesses worldwide.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to bridge the gap between complex technology and business goals. We believe in creating software that is not just functional, but also intuitive, beautiful, and impactful.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-4xl font-bold text-primary mb-2">50+</h4>
                    <p className="text-sm font-medium text-slate-600">Projects Completed</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-4xl font-bold text-primary mb-2">100%</h4>
                    <p className="text-sm font-medium text-slate-600">Client Satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 transform rotate-6 rounded-3xl"></div>
                 {/* Modern office environment */}
                <img 
                  src="https://pixabay.com/get/g02894e40222a56fdb63e22a50ad8640fd7ca96190857173fb476a78d2e0ea87574c195ffb30c327b49cc05ed46360bd672c29d9feb9fee9b24d2e5b4a30bdb21_1280.jpg" 
                  alt="Our Office" 
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-900 text-white">
          <div className="container-width">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Our Values</h2>
              <p className="text-slate-300 text-lg">
                The core principles that guide every project we undertake.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  desc: "We constantly explore new technologies to provide the best solutions."
                },
                {
                  title: "Integrity",
                  desc: "Transparent communication and honest pricing are the foundations of our trust."
                },
                {
                  title: "Quality",
                  desc: "We never compromise on code quality, performance, or user experience."
                }
              ].map((value, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-slate-300">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
