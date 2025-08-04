import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VS</span>
            </div>
            <span className="font-bold text-xl">VisaJobs</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#jobs" className="text-foreground/80 hover:text-foreground transition-colors">
            Jobs
          </a>
          <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm" className="bg-gradient-hero hover:opacity-90 transition-opacity">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};