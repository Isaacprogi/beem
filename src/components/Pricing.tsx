import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Pricing = () => {
  const navigate = useNavigate();
  const features = [
    "Access to 3,000+ visa-sponsored jobs",
    "Real-time job updates every hour",
    "UK & USA positions exclusively",
    "Verified employer information",
    "Direct application links",
    "Instant email notifications",
    "Advanced search & filters",
    "Priority customer support",
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-glow">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-primary text-primary-foreground px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Most Popular
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Get unlimited access to all visa-sponsored opportunities for one low monthly price.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="relative bg-gradient-surface border-0 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
            
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-3xl font-bold">Premium Access</CardTitle>
              <div className="mt-6">
                <span className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">$9.99</span>
                <span className="text-xl text-muted-foreground ml-2">/month</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>24-hour free trial • Cancel anytime</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                  </div>
                  <span className="text-sm text-card-foreground">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter className="pt-8 pb-8 px-8">
              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all text-lg py-6 h-auto font-semibold"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Start 24hr Free Trial
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            Join 7,000+ professionals who found their dream job
          </p>
          <p className="text-xs text-muted-foreground">
            No setup fees • No hidden costs
          </p>
        </div>
      </div>
    </section>
  );
};