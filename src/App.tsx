import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import { Jobs } from "./pages/Jobs";
import { PricingPage } from "./pages/PricingPage";
import { PostJob } from "./pages/PostJob";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTracking();
  
  return (
    <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
