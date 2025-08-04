import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";

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
    logo?: string;
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const countryFlag = job.country === "UK" ? "🇬🇧" : "🇺🇸";
  
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-hero flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 ml-2">
            {countryFlag} {job.visaType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}, {job.country}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{job.posted}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-success" />
              <span className="text-success">{job.salary}</span>
            </div>
            <Badge variant="outline">{job.type}</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
          size="sm"
        >
          View Details & Apply
        </Button>
      </CardFooter>
    </Card>
  );
};