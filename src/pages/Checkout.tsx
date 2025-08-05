import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { user } = useAuth();

  const handleStartTrial = async () => {
    if (!user) {
      window.location.href = '/sign-in';
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error starting checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 min-h-[80vh]">
            {/* Left Side - Subscription Details */}
            <div className="bg-card rounded-lg p-8 shadow-sm border">
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Subscribe to BleemHire
                  </h1>
                  <p className="text-3xl font-bold text-foreground">
                    US${selectedPlan === 'monthly' ? '9.99' : '44.99'} 
                    <span className="text-lg font-normal text-muted-foreground">
                      {selectedPlan === 'monthly' ? ' per month' : ' every 6 months'}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === 'monthly' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPlan === 'monthly' 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {selectedPlan === 'monthly' && (
                          <div className="w-2 h-2 bg-background rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">BleemHire</div>
                        <div className="text-sm text-muted-foreground">Cancel anytime. Billed monthly</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">US$9.99</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors relative ${
                      selectedPlan === '6month' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedPlan('6month')}
                  >
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 left-4 bg-primary text-primary-foreground"
                    >
                      Save US$15
                    </Badge>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPlan === '6month' 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {selectedPlan === '6month' && (
                          <div className="w-2 h-2 bg-background rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Save US$15 with 6-month billing</div>
                        <div className="text-sm text-muted-foreground">Billed every 6 months</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">US$44.99</div>
                        <div className="text-sm text-muted-foreground">every 6 months</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {selectedPlan === 'monthly' ? 'US$9.99' : 'US$44.99'}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total due today</span>
                    <span className="text-foreground">US$0.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    24-hour free trial, then {selectedPlan === 'monthly' ? 'US$9.99/month' : 'US$44.99 every 6 months'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Action */}
            <div className="bg-card rounded-lg p-8 shadow-sm border flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Start Your Free Trial
                  </h2>
                  <p className="text-muted-foreground">
                    Get 24 hours free access to all premium features. 
                    No payment required during trial period.
                  </p>
                </div>

                <Button 
                  onClick={handleStartTrial}
                  disabled={loading || !user}
                  className="w-full h-12 text-lg font-medium"
                  size="lg"
                >
                  {loading ? 'Setting up...' : 'Start Free Trial'}
                </Button>

                {!user && (
                  <p className="text-center text-sm text-muted-foreground">
                    Please <a href="/sign-in" className="text-primary hover:underline">sign in</a> to continue
                  </p>
                )}

                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <p>
                    By subscribing, you authorize BleemHire to charge your payment method at the current rate.
                  </p>
                  <p>
                    You may cancel at any time via your account settings or by contacting support.
                  </p>
                  <p>
                    Read our <a href="/terms" className="text-primary hover:underline">Terms</a> and{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}