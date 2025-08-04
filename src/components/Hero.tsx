import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Globe, Shield } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <Badge 
            variant="secondary" 
            className="px-6 py-2 text-sm font-medium bg-gradient-surface border border-border/50 shadow-sm"
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span className="text-emerald-500 font-semibold">3,247+</span>{" "}Jobs Updated Daily
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-none">
            Find Your Next
            <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
              Visa-Sponsored
            </span>
            <span className="block text-foreground">Career</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-light">
            Access thousands of verified visa-sponsored opportunities in the UK & USA. 
            Real positions, real employers, real results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6 h-auto group"
              asChild
            >
              <Link to="/jobs">
                Start 24hr Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto border-border/50 hover:bg-muted/50"
              asChild
            >
              <Link to="/jobs">
                Browse Jobs
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Trusted by</p>
              <p className="text-2xl font-bold text-emerald-500">Join 7,000+ professionals who found their dream job</p>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>UK & USA</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                <span>Verified Employers</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};