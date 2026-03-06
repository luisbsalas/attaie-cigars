import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { AgeGate } from "@/components/AgeGate";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { HelpWidget } from "@/components/HelpWidget";
import { CompareProvider } from "@/components/CompareContext";
import { CompareDrawer } from "@/components/CompareDrawer";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import Heritage from "@/pages/Heritage";
import CigarGuide from "@/pages/CigarGuide";
import Accessories from "@/pages/Accessories";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import Retailers from "@/pages/Retailers";
import Shipping from "@/pages/Shipping";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import TermsOfUse from "@/pages/TermsOfUse";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";
import { 
  AdminLogin, 
  AdminDashboard, 
  AdminOrders, 
  AdminProducts, 
  AdminPromoCodes, 
  AdminSettings,
  AdminCustomers,
  AdminReviews,
  AdminNewsletter,
  AdminReports,
  AdminContent,
  AdminEmailTemplates,
  AdminNotifications
} from "@/pages/admin";

function CustomerRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/accessories" component={Accessories} />
      <Route path="/heritage" component={Heritage} />
      <Route path="/guide" component={CigarGuide} />
      <Route path="/retailers" component={Retailers} />
      <Route path="/contact" component={Contact} />
      <Route path="/cart" component={Cart} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/terms" component={TermsOfUse} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/orders/:id" component={AdminOrders} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/promo-codes" component={AdminPromoCodes} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route path="/admin/reviews" component={AdminReviews} />
      <Route path="/admin/newsletter" component={AdminNewsletter} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/email-templates" component={AdminEmailTemplates} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AdminRouter />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CompareProvider>
          <AgeGate>
            <ScrollToTop />
            <ScrollProgressBar />
            <div className="flex flex-col min-h-screen font-sans">
              <Navigation />
              <main className="flex-grow">
                <PageTransition>
                  <CustomerRouter />
                </PageTransition>
              </main>
              <Footer />
            </div>
            <BackToTop />
            <HelpWidget />
            <CompareDrawer />
          </AgeGate>
        </CompareProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
