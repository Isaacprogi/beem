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
  const { user, loading, subscriptionStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const handleSubscriptionRequired = async () => {
    if (isCreatingCheckout) return;
    
    setIsCreatingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        navigate("/");
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
      
      if (requireSubscription && !subscriptionStatus.subscribed) {
        handleSubscriptionRequired();
        return;
      }
    }
  }, [user, loading, subscriptionStatus, navigate, requireSubscription]);

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

  if (requireSubscription && !subscriptionStatus.subscribed) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;