import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Apple, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'sixMonth'>('monthly');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    country: 'US',
    address: ''
  });
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
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0">
        {/* Left Side - Subscription Details */}
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">Subscribe to BleemHire</h1>
            <div className="text-5xl font-bold mb-6">US$9.99 <span className="text-lg font-normal text-muted-foreground">per month</span></div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-3">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlan === 'monthly' ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">BleemHire</div>
                  <div className="text-sm text-muted-foreground">Cancel anytime. Billed monthly</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">US$9.99</div>
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ml-auto ${
                    selectedPlan === 'monthly' ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {selectedPlan === 'monthly' && <div className="w-2 h-2 bg-background rounded-full mx-auto mt-0.5" />}
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${
                selectedPlan === 'sixMonth' ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPlan('sixMonth')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">Save US$15 with 6-month billing</div>
                    <div className="text-sm text-muted-foreground">Billed every 6 months</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">US$44.99</div>
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ml-auto ${
                    selectedPlan === 'sixMonth' ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {selectedPlan === 'sixMonth' && <div className="w-2 h-2 bg-background rounded-full mx-auto mt-0.5" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtotal */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{selectedPlan === 'monthly' ? 'US$9.99' : 'US$44.99'}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total due today</span>
              <span>{selectedPlan === 'monthly' ? 'US$9.99' : 'US$44.99'}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="border-l bg-muted/30 p-8">
          <h2 className="text-xl font-semibold mb-6">Payment details</h2>
          
          <div className="space-y-4">
            {/* Apple Pay Button */}
            <Button className="w-full bg-black text-white hover:bg-black/90 py-3">
              <Apple className="w-5 h-5 mr-2" />
              Pay
            </Button>
            
            {/* Or Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone number</label>
              <div className="flex gap-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-background">
                  <span className="text-lg mr-1">🇺🇸</span>
                  <Phone className="w-4 h-4" />
                </div>
                <Input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment method</label>
              <div className="space-y-3">
                {/* Card Number */}
                <div className="relative">
                  <Input 
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full pr-20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                  <Input 
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cardholder name</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Billing Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing address</label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                  <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full"
              />
              
              <button className="text-sm text-primary hover:underline">
                Enter address manually
              </button>
            </div>

            {/* Pay Button */}
            <Button 
              onClick={handleStartTrial}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-6"
            >
              {loading ? "Processing..." : "Pay and subscribe"}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Legal Text */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="max-w-5xl mx-auto">
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