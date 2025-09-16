import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/pricing", label: "Pricing" },
    { to: "/post-job", label: "Post a Job" },
    ...(profile?.role === "admin"
      ? [{ to: "/admin-dashboard", label: "Dashboard" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group">
          <span className="font-bold text-3xl md:text-4xl bg-gradient-primary bg-clip-text text-transparent">
            BleemHire
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-all hover:text-primary ${
                isActive(to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <>
              <Link
                to={`/profile/${profile?.id || user.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Welcome, {user.user_metadata?.display_name || user.email}
              </Link>
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
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary hover:shadow-glow transition-all text-sm font-medium px-6"
                asChild
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-accent"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Animated Sidebar for Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 bg-white lg:hidden left-0 z-50 h-screen  shadow-xl p-6 flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="self-end mb-6 p-2 rounded-md hover:bg-accent"
            >
              <X size={24} />
            </button>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-4">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-all hover:text-primary ${
                    isActive(to) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Auth Actions */}
            <div className="mt-auto pt-6 border-t border-border/30">
              {user ? (
                <>
                  <Link
                    to={`/profile/${profile?.id || user.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Welcome, {user.user_metadata?.display_name || user.email}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-sm font-medium"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    disabled={loading}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all text-sm font-medium mt-2"
                    asChild
                  >
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
};
