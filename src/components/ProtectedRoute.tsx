import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

const ProtectedRoute = ({ children, requireSubscription = false }: ProtectedRouteProps) => {
  const { user, loading, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/sign-in");
        return;
      }
      
      if (requireSubscription && !subscriptionStatus.subscribed) {
        window.open('https://buy.stripe.com/aFa28k6qfdqf7EX0KFcMM00', '_blank');
        return;
      }
    }
  }, [user, loading, subscriptionStatus, navigate, requireSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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