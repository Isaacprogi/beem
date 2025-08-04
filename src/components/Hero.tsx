import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Hero = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="px-4 py-2">
            🎯 Daily Updated Job Listings
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Find Your Dream Job with
            <span className="bg-gradient-hero bg-clip-text text-transparent block mt-2">
              Visa Sponsorship
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Access thousands of visa-sponsored job opportunities in the UK and USA. 
            Updated daily with verified positions from top employers ready to sponsor international talent.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:opacity-90 transition-opacity text-lg px-8 py-6 h-auto"
            >
              Start 7-Day Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              View Sample Jobs
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span>3,247+ Active Jobs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Daily Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span>Verified Sponsors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};