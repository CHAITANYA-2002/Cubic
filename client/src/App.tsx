import { lazy, Suspense, useEffect } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ScrollToTop } from "@/components/ScrollToTop";
import { I18nProvider, LOCALE_META, type Locale } from "@/i18n";
import { localeBase } from "@/i18n/config";
import type { Dict } from "@/i18n";
import { SiteProvider } from "@/lib/site";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import CaseStudies from "@/pages/CaseStudies";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Cookies from "@/pages/Cookies";
import NotFound from "@/pages/not-found";
import Book from "@/pages/Book";

// The workspace (admin OS and client portals) is never prerendered and most visitors never
// open it, so it loads on demand.
const Admin = lazy(() => import("@/pages/Admin"));
const InvoicePrint = lazy(() => import("@/pages/os/InvoicePrint"));
const Portal = lazy(() => import("@/pages/Portal"));
const BookManage = lazy(() => import("@/pages/BookManage"));
const WorkspaceChrome = lazy(() => import("@/components/WorkspaceChrome"));

export const isWorkspacePath = (path: string) => path.startsWith("/admin") || path.startsWith("/portal");

function PublicRoutes() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={ServiceDetail} />
        <Route path="/work" component={CaseStudies} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/faq" component={Faq} />
        <Route path="/contact" component={Contact} />
        <Route path="/book" component={Book} />
        <Route path="/book/manage/:token">
          <Suspense fallback={<div className="min-h-screen" />}>
            <BookManage />
          </Suspense>
        </Route>
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/cookies" component={Cookies} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function Workspace() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <WorkspaceChrome />
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/admin/print/:id" component={InvoicePrint} />
        <Route path="/admin/:tab" component={Admin} />
        <Route path="/portal/:token" component={Portal} />
      </Switch>
    </Suspense>
  );
}

function Shell({ locale }: { locale: Locale }) {
  const [location] = useLocation();
  if (locale === "en" && isWorkspacePath(location)) return <Workspace />;
  return <PublicRoutes />;
}

type AppProps = { locale: Locale; dict: Dict; ssrPath?: string };

export default function App({ locale, dict, ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={locale} dict={dict}>
        <SiteProvider defaultCurrency={LOCALE_META[locale].currency}>
          <Router base={localeBase(locale)} ssrPath={ssrPath}>
            <Shell locale={locale} />
          </Router>
        </SiteProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
