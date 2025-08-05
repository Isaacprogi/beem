import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Shield, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleStartTrial = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start your trial",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Start Your Free Trial</CardTitle>
          <CardDescription>
            Complete your setup to access premium job listings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold">24-Hour Free Trial</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Full access to all job listings and features. No charge for the first 24 hours.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              What's included:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Access to all premium job listings
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Advanced search and filtering
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Direct contact with employers
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Priority application status
              </li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Trial Period</span>
              <span className="font-semibold text-green-600">FREE for 24 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>After trial</span>
              <span className="font-semibold">$9.99/month</span>
            </div>
          </div>

          <Button 
            onClick={handleStartTrial}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {loading ? "Setting up..." : "Add Payment Method & Start Trial"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Secure payment powered by Stripe</span>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can cancel anytime during your trial. No charges until after 24 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;