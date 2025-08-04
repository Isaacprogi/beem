import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const Pricing = () => {
  const features = [
    "Access to 3,247+ visa-sponsored jobs",
    "Daily job list updates",
    "UK & USA positions",
    "Verified employer information",
    "Direct application links",
    "Email notifications for new jobs",
    "Advanced search filters",
    "Priority customer support",
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get unlimited access to all visa-sponsored job opportunities for one low monthly price.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative bg-gradient-card border-2 border-primary/20 shadow-hover">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-accent text-success-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Premium Access</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Cancel anytime • 7-day free trial
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter className="pt-6">
              <Button 
                className="w-full bg-gradient-hero hover:opacity-90 transition-opacity text-lg py-6 h-auto"
                size="lg"
              >
                Start Free Trial
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Join 1,247+ professionals who found their dream job with visa sponsorship
          </p>
        </div>
      </div>
    </section>
  );
};