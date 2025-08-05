import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Building2, ExternalLink } from "lucide-react";
import { analytics } from "@/utils/analytics";
import { useEffect, useRef } from "react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    salary: string;
    type: string;
    posted: string;
    visaType: string;
    description: string;
    featured?: boolean;
    logo?: string;
    url?: string;
    tags?: string[];
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const countryFlag = job.country === "UK" ? "🇬🇧" : "🇺🇸";
  const cardRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);

  // Track job view when card comes into viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewTracked.current) {
          viewTracked.current = true;
          analytics.trackJobView(job.id, job.title, job.company);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [job.id, job.title, job.company]);

  const handleJobClick = () => {
    analytics.trackJobClick(job.id, job.title, job.company, job.location);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    analytics.trackJobApply(job.id, job.title, job.company);
    analytics.trackSignUpStart('job_card');
    window.location.href = '/signup';
  };
  
  return (
    <Card 
      ref={cardRef}
      onClick={handleJobClick}
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-surface border-0 cursor-pointer ${
        job.featured ? 'ring-2 ring-primary/20 shadow-glow' : 'shadow-md'
      }`}>
      {job.featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-12 w-12 rounded-xl bg-white border border-border/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.logo ? (
                <img 
                  src={job.logo} 
                  alt={`${job.company} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors leading-tight">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium text-sm">{job.company}</p>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-success/10 text-success border-success/20 hover:bg-success/20 flex-shrink-0"
          >
            {countryFlag} {job.visaType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}, {job.country}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{job.posted}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="text-success">{job.salary}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {job.type}
          </Badge>
        </div>
        
        
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {job.description}
        </p>
        
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-muted/50 border-border/30 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
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
  );
};