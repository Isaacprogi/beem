import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Building2, ExternalLink } from "lucide-react";

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
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const countryFlag = job.country === "UK" ? "🇬🇧" : "🇺🇸";
  
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-surface border-0 ${
      job.featured ? 'ring-2 ring-primary/20 shadow-glow' : 'shadow-md'
    }`}>
      {job.featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-primary" />
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
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-gradient-primary hover:shadow-glow transition-all group"
          size="sm"
        >
          <span>View Details & Apply</span>
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};