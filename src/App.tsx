import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Jobs } from "./pages/Jobs";
import { PricingPage } from "./pages/PricingPage";
import { PostJob } from "./pages/PostJob";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Dashboard from "./pages/Dashboard";
import JobsTable from "./components/dashboard/JobsTable";
import EmailVerified from "./pages/EmailVerified";
import CheckEmail from "./pages/CheckEmail";
import { Overview } from "./components/dashboard/Overview";

const queryClient = new QueryClient();

const PublicOrRedirect = () => {
  const { user, loading, checkoutPending } = useAuth();

  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Don't redirect if checkout is pending to avoid infinite loops
  if (user && !checkoutPending) {
    return <Navigate to="/jobs" replace />;
  }
  
  return <Index />;
};

const AppContent = () => {
  
  return (
    <Routes>
          <Route path="/" element={<PublicOrRedirect />} />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/admin-dashboard" element={<Dashboard />} >
             <Route index element={<Overview />} />
             <Route path="users" element={<Users />} />
             <Route path="jobs" element={<JobsTable />} />
          </Route>
          <Route path="/post-job" element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/check-inbox" element={<CheckEmail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
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
