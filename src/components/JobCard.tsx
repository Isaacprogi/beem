import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Building2, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { PoundSterling } from "lucide-react";


export default function Example() {
  return (
    <div>
      <FaPoundSign size={24} />
      <span> GBP</span>
    </div>
  );
}


type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);
  const {
    isTrialRunning,
    isTrialExpired,
    hasViewedMaxTrialPages,
    canStartTrial,
    startTrial,
    subscriptionStatus
  } = useAuth();
  
  const [showBlur, setShowBlur] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewTracked.current) {
          viewTracked.current = true;
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [job.id]);

  const handleJobClick = () => {
    // Check if user is allowed
    if (
      !subscriptionStatus.subscribed &&
      (!isTrialRunning || hasViewedMaxTrialPages)
    ) {
      setShowBlur(true);
      return;
    }

    // Otherwise open job link
    window.open(job.application_url || "#", "_blank");
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleJobClick();
  };

  const handleStartTrial = async () => {
    await startTrial();
    setShowBlur(false);
  };

  const postedAt = job.created_at
    ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true })
    : "N/A";

  function formatSalaryRange(salary: string | null, country?: string): string {
  if (!salary) return "Not specified";

  // Detect currency label
  let currency = "";
  if (country === "United States") currency = "USD";
  if (country === "United Kingdom") currency = "GBP";

  // Extract numbers (supports range or single value)
  const match = salary.match(/(\d+)\s*-\s*(\d+)/);
  const single = salary.match(/(\d+)/);

  if (match) {
    const min = parseInt(match[1], 10).toLocaleString();
    const max = parseInt(match[2], 10).toLocaleString();
    return `${currency} ${min} - ${max} YEAR`;
  }

  if (single) {
    const value = parseInt(single[1], 10).toLocaleString();
    return `${currency} ${value} YEAR`;
  }

  // Fallback (like "Negotiable")
  return salary;
}



  return (
    <>
      <Card 
        ref={cardRef}
        onClick={handleJobClick}
        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-surface border-0 cursor-pointer ${
          job.featured ? "ring-2 ring-primary/20 shadow-glow" : "shadow-md"
        }`}
      >
        {job.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />}
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-12 w-12 rounded-xl bg-white border border-border/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
               
                {
                  job.logo_url?
                  <img className="w-12 h-12 min-w12 min-h-12 object-cover" src={job.logo_url} alt="job logo" />: <Building2 className="h-6 w-6 text-primary" />
                }
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors leading-tight truncate">
                  {job.title}
                </h3>
                <p className="text-muted-foreground font-medium text-sm truncate">{job.company}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{postedAt}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-semibold">
             {
              job.country === "United States"?
               <DollarSign className="h-4 w-4 text-success" />
               : job.country === "United Kingdom" ?<PoundSterling className="h-4 w-4 text-success" />:""
             }
             <span className="text-success">{formatSalaryRange(job.salary_range,job.country)}</span>
            </div>
            {job.type && <Badge variant="outline" className="text-xs">{job.type}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {job.description}
          </p>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className="w-full bg-gradient-primary hover:shadow-glow transition-all group"
            size="sm"
            onClick={handleApplyClick}
          >
            <span>View Details & Apply</span>
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>

      {/* Dynamic Blur Overlay */}
      {showBlur && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="max-w-md mx-auto bg-gradient-surface border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              {canStartTrial && !isTrialRunning ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">Start Your Free Trial</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 24 hours of free access to browse jobs
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                    onClick={handleStartTrial}
                  >
                    Start 24hr Free Trial
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">Upgrade to View Job</h3>
                  <p className="text-muted-foreground mb-6">
                    You've reached your free trial limit. Upgrade to a premium plan to view this job.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                    onClick={() => window.location.href = "/pricing"}
                  >
                    Upgrade to Premium
                  </Button>
                </>
              )}
              <Button
                className="w-full mt-3 border border-border hover:bg-background/20"
                variant="outline"
                onClick={() => setShowBlur(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
