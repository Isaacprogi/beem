import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51QgSnoJWxVNz1KYZXqg8aMHlv7xOnyEBm78HG6SJ8Bb77Vm2k3C2Gx9yIf0fMW6XbRJXfZlP2PsQmk9xhiuZ9iYA006b8VKLRO');

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { user } = useAuth();

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

            {/* Right Side - Payment Form */}
            <div className="bg-card rounded-lg p-8 shadow-sm border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Payment Details
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Secure payment powered by Stripe. 24-hour free trial included.
                  </p>
                </div>

                {user ? (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm selectedPlan={selectedPlan} />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Please sign in to continue with checkout
                    </p>
                    <a 
                      href="/sign-in" 
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Sign In
                    </a>
                  </div>
                )}

                <div className="text-center text-xs text-muted-foreground space-y-1 pt-4 border-t">
                  <p>
                    By subscribing, you authorize BleemHire to charge your payment method.
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