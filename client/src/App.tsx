import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingCTA } from "@/components/FloatingCTA";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import WebDevelopment from "@/pages/services/WebDevelopment";
import UIUXDesign from "@/pages/services/UIUXDesign";
import WebApplications from "@/pages/services/WebApplications";
import Maintenance from "@/pages/services/Maintenance";
import AISolutions from "@/pages/services/AISolutions";
import DigitalMarketing from "@/pages/services/DigitalMarketing";
import Admin from "@/pages/Admin";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Cookies from "@/pages/Cookies";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/services/web-development" component={WebDevelopment} />
        <Route path="/services/ui-ux-design" component={UIUXDesign} />
        <Route path="/services/web-applications" component={WebApplications} />
        <Route path="/services/maintenance" component={Maintenance} />
        <Route path="/services/ai-solutions" component={AISolutions} />
        <Route path="/services/digital-marketing" component={DigitalMarketing} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/cookies" component={Cookies} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

import { AdvancedCursor } from "@/components/AdvancedCursor";

function App() {
  return (
    <div className="relative min-h-screen">
      <div className="site-background" />
      <AdvancedCursor />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingCTA />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
