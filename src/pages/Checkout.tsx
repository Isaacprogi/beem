import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'sixMonth'>('monthly');
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Left Side - Subscription Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subscribe to BleemHire</h1>
            <p className="text-muted-foreground">Get unlimited access to premium job listings</p>
          </div>

          {/* Pricing Options */}
          <div className="space-y-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Monthly billing</div>
                  <div className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === 'monthly' ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {selectedPlan === 'monthly' && <div className="w-2 h-2 bg-background rounded-full mx-auto mt-0.5" />}
                </div>
              </div>
            </div>

            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${
                selectedPlan === 'sixMonth' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPlan('sixMonth')}
            >
              <Badge className="absolute -top-2 left-4 bg-green-500 text-white">Save US$15</Badge>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">6-month billing</div>
                  <div className="text-2xl font-bold">$49.99<span className="text-sm font-normal text-muted-foreground">/6 months</span></div>
                  <div className="text-sm text-muted-foreground">$8.33 per month</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === 'sixMonth' ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {selectedPlan === 'sixMonth' && <div className="w-2 h-2 bg-background rounded-full mx-auto mt-0.5" />}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-semibold">What's included:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Access to all premium job listings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Advanced search and filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Direct contact with employers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority application status</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trial Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-semibold text-green-800">24-Hour Free Trial</div>
              <div className="text-sm text-green-700">
                No charge for the first 24 hours. Cancel anytime during your trial.
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-semibold">
                  {selectedPlan === 'monthly' ? 'Monthly' : '6-Month'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-semibold">
                  {selectedPlan === 'monthly' ? '$9.99/month' : '$49.99/6 months'}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total due now</span>
                  <span className="text-green-600">FREE (24-hour trial)</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartTrial}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? "Setting up..." : "Start Free Trial"}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Legal Text */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-center text-muted-foreground mb-2">
            By subscribing, you authorise BleemHire. to charge you according to the terms until you cancel.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://stripe.com/legal/end-users" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Terms
            </a>
            <a 
              href="https://stripe.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;