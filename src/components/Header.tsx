import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (linkName: string, destination: string) => {
  };

  const handleGetStartedClick = () => {
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex h-24 items-center justify-between">
        <Link 
          to="/" 
          className="group"
          onClick={() => handleNavClick('Logo', '/')}
        >
          <span className="font-bold text-4xl bg-gradient-primary bg-clip-text text-transparent">
            BleemHire
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-all hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => handleNavClick('Home', '/')}
          >
            Home
          </Link>
          <Link 
            to="/jobs" 
            className={`text-sm font-medium transition-all hover:text-primary ${
              isActive('/jobs') ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => handleNavClick('Browse Jobs', '/jobs')}
          >
            Browse Jobs
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-all hover:text-primary ${
              isActive('/pricing') ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => handleNavClick('Pricing', '/pricing')}
          >
            Pricing
          </Link>
          <Link 
            to="/post-job" 
            className={`text-sm font-medium transition-all hover:text-primary ${
              isActive('/post-job') ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => handleNavClick('Post a Job', '/post-job')}
          >
            Post a Job
          </Link>
          <Link 
            to="/admin-dashboard" 
            className={`text-sm font-medium transition-all hover:text-primary ${
              isActive('/post-job') ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => handleNavClick('Post a Job', '/post-job')}
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.display_name || user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium"
                onClick={signOut}
                disabled={loading}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium"
                asChild
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-primary hover:shadow-glow transition-all text-sm font-medium px-6" 
                asChild
              >
                <Link to="/signup" onClick={handleGetStartedClick}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};