import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubscriptionRequired = async () => {
    // Prevent multiple simultaneous checkout attempts
    if (isCreatingCheckout || checkoutPending) return;
    
    // Rate limiting: max 3 attempts per session
    if (checkoutAttempts >= 3) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again or contact support.",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }
    
    setIsCreatingCheckout(true);
    setCheckoutAttempts(prev => prev + 1);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Set checkout pending state instead of navigating
        setCheckoutPending(true);
        window.open(data.url, '_blank');
        
        // Show waiting screen - don't navigate away
        toast({
          title: "Redirected to Stripe",
          description: "Complete your subscription in the new tab to access premium jobs.",
        });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
      navigate("/pricing");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/sign-in");
        return;
      }
      
      if (requireSubscription && !subscriptionStatus.subscribed && !checkoutPending) {
        handleSubscriptionRequired();
        return;
      }
    }
  }, [user, loading, subscriptionStatus, navigate, requireSubscription, checkoutPending]);

  if (loading || isCreatingCheckout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            {isCreatingCheckout ? "Setting up checkout..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show checkout waiting screen if checkout is pending
  if (requireSubscription && !subscriptionStatus.subscribed && checkoutPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Checkout in Progress</h2>
          <p className="text-muted-foreground">
            Please complete your subscription in the Stripe checkout tab to access premium jobs.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/pricing")}
              className="w-full px-4 py-2 text-sm border rounded-md hover:bg-muted"
            >
              Return to Pricing Page
            </button>
            <button
              onClick={() => {
                setCheckoutPending(false);
                navigate("/");
              }}
              className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel and Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requireSubscription && !subscriptionStatus.subscribed) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;