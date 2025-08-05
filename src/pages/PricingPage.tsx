import { Pricing } from "@/components/Pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Users, Clock, Shield, Zap } from "lucide-react";
import { analytics } from "@/utils/analytics";
import { useScrollTracking } from "@/hooks/useScrollTracking";

export const PricingPage = () => {
  useScrollTracking('Pricing');
  
  const handleTrialClick = () => {
    analytics.trackTrialStart('pricing_page');
    analytics.trackSignUpStart('pricing_page_trial');
  };

  const benefits = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Join 7,000+ Success Stories",
      description: "Professionals who found their dream visa-sponsored jobs"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Save 40+ Hours Weekly",
      description: "No more endless searching across multiple job boards"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Verified Employers",
      description: "Every company is verified for legitimate visa sponsorship"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Updates",
      description: "Get notified the moment new jobs are posted"
    }
  ];

  const faqs = [
    {
      question: "How does the 24-hour free trial work?",
      answer: "Get full access to all features for 24 hours. Card details will be required in order to access the free trial. After the trial, you can choose to subscribe for $9.99/month."
    },
    {
      question: "Are these real job opportunities?",
      answer: "Yes! Every job is verified and comes from legitimate employers actively seeking to sponsor visas for international candidates."
    },
    {
      question: "Which countries are covered?",
      answer: "We currently focus on the UK and USA, covering the most popular visa-sponsored job markets for international professionals."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely! You can cancel your subscription at any time with just one click. No questions asked."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-glow">
        <div className="container text-center">
          <Badge className="mb-6 bg-gradient-primary text-primary-foreground px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            24-Hour Free Trial
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Unlock Your Career
            <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
              For Less Than a Coffee
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to thousands of visa-sponsored job opportunities for just $9.99/month
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-gradient-surface border-0 shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pricing */}
      <Pricing />

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our visa-sponsored job platform
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-gradient-surface border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              className="bg-gradient-primary hover:shadow-glow transition-all px-8"
              size="lg"
              onClick={handleTrialClick}
            >
              Start Your 24hr Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};