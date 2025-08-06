import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

const ProtectedRoute = ({ children, requireSubscription = false }: ProtectedRouteProps) => {
  const { user, loading, subscriptionStatus, checkoutPending, setCheckoutPending } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutAttempts, setCheckoutAttempts] = useState(0);

  const handleSubscriptionRequired = () => {
    navigate("/pricing");
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/sign-in");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireSubscription && !subscriptionStatus.subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Subscription Required</h2>
            <p className="text-muted-foreground">
              This feature requires an active subscription to access premium visa-sponsored job listings.
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={handleSubscriptionRequired}
              className="w-full"
              size="lg"
            >
              View Pricing Plans
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;