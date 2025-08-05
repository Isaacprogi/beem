import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const { checkSubscription } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Give Stripe a moment to process the subscription
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check subscription status
        await checkSubscription();
        setVerified(true);
      } catch (error) {
        console.error("Error verifying subscription:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    if (sessionId) {
      verifySubscription();
    } else {
      setIsVerifying(false);
    }
  }, [sessionId, checkSubscription]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <CardTitle>Verifying Your Subscription</CardTitle>
            <CardDescription>
              Please wait while we confirm your payment...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Welcome to Premium!</CardTitle>
          <CardDescription>
            Your subscription has been successfully activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              You now have access to all premium features including:
            </p>
            <ul className="text-sm space-y-1">
              <li>• Priority job listings</li>
              <li>• Advanced search filters</li>
              <li>• Direct company contact</li>
              <li>• Unlimited applications</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link to="/jobs">Browse Premium Jobs</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-muted-foreground text-center">
              Session ID: {sessionId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;