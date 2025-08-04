export const Footer = () => {
  return (
    <footer className="bg-gradient-surface border-t border-border/50 mt-16">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
                VisaJobs
              </span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              The most comprehensive platform for finding visa-sponsored job opportunities 
              in the UK and USA. Updated daily with verified positions from real employers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-xl">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              Find your dream role in your dream location more efficiently
            </p>
          </div>
          
        </div>
        
        {/* Customer Reviews */}
        <div className="border-t border-border/50 mt-12 pt-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">What Our Job Seekers Say</h3>
            <p className="text-muted-foreground">Real reviews from professionals who found their dream jobs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Review 1 */}
            <div className="bg-gradient-surface p-6 rounded-xl border border-border/50">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face" 
                  alt="Sarah Chen" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-muted-foreground">London, UK • 2024</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Found my software engineer role through VisaJobs in just 3 weeks! The visa sponsorship listings were exactly what I needed."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-gradient-surface p-6 rounded-xl border border-border/50">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=64&h=64&fit=crop&crop=face" 
                  alt="Marcus Johnson" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Marcus Johnson</p>
                  <p className="text-sm text-muted-foreground">New York, USA • 2024</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Incredible platform! Landed a data scientist position with H1-B sponsorship. The daily updates made all the difference."
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-gradient-surface p-6 rounded-xl border border-border/50">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face" 
                  alt="Priya Patel" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Priya Patel</p>
                  <p className="text-sm text-muted-foreground">Manchester, UK • 2025</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
                <span className="text-gray-300 text-lg">★</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Great selection of UX design roles. The premium membership paid for itself when I got my Skilled Worker visa job."
              </p>
            </div>

            {/* Review 4 - New Review */}
            <div className="bg-gradient-surface p-6 rounded-xl border border-border/50">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" 
                  alt="David Kim" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">David Kim</p>
                  <p className="text-sm text-muted-foreground">San Francisco, USA • 2024</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Amazing platform! Found my machine learning engineer role with L-1 visa sponsorship in 6 weeks. Highly recommended!"
              </p>
            </div>

            {/* Review 5 */}
            <div className="bg-gradient-surface p-6 rounded-xl border border-border/50 md:col-start-1 lg:col-start-auto">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" 
                  alt="Ahmed Hassan" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Ahmed Hassan</p>
                  <p className="text-sm text-muted-foreground">Boston, USA • 2024</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Finally found a DevOps role that sponsors O-1 visas. The search filters made it so easy to find relevant positions."
              </p>
            </div>

            {/* Review 6 */}
            <div className="bg-gradient-surface p-6 rounded-xl border border-border/50 md:col-start-2 lg:col-start-auto">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" 
                  alt="Elena Rodriguez" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Elena Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Edinburgh, UK • 2025</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Excellent customer support and verified job listings. Got my frontend developer position within 2 months!"
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>&copy; 2024 VisaJobs. All rights reserved. Made with 💜 for international professionals.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:info@bleemhire.com" className="hover:text-primary transition-colors">info@bleemhire.com</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};