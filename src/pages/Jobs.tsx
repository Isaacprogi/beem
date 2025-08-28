import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, MapPin, Briefcase, GraduationCap, Clock, Eye, Timer } from "lucide-react";
import { analytics } from "@/utils/analytics";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];

const JOBS_PER_PAGE = 15;

const JobCardSkeleton = () => (
  <Card className="bg-gradient-surface border-0 shadow-lg hover:shadow-glow transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
);

export const Jobs = () => {
  useScrollTracking('Browse Jobs');
  
  const navigate = useNavigate();
  const { 
    isTrialActive, 
    isTrialExpired, 
    hasViewedMaxTrialPages, 
    trialInfo, 
    startTrial, 
    incrementTrialPageView 
  } = useAuth();
  
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [yearsExperienceFilter, setYearsExperienceFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setAllJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = locationFilter === "" || 
        (locationFilter === "uk" && job.location?.toLowerCase().includes("uk")) ||
        (locationFilter === "usa" && job.location?.toLowerCase().includes("usa"));

      return matchesSearch && matchesLocation;
    });
  }, [allJobs, searchTerm, locationFilter, yearsExperienceFilter, experienceLevelFilter]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      await incrementTrialPageView();
    }
  };

  // Track search events
  useEffect(() => {
    if (searchTerm.length > 2) {
      const timeoutId = setTimeout(() => {
        analytics.trackJobSearch(searchTerm, filteredJobs.length);
      }, 500); // Debounce search tracking
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, filteredJobs.length]);

  // Track filter usage
  useEffect(() => {
    if (locationFilter) {
      analytics.trackFilterUse('location', locationFilter, filteredJobs.length);
    }
  }, [locationFilter, filteredJobs.length]);

  const handleTrialClick = async () => {
    if (!isTrialActive && !isTrialExpired) {
      await startTrial();
      analytics.trackTrialStart('jobs_page');
    } else {
      analytics.trackSignUpStart('jobs_page_trial');
      navigate('/pricing');
    }
  };

  const handleJobInteraction = () => {
    if (isTrialActive && !hasViewedMaxTrialPages) {
      incrementTrialPageView();
    }
  };

  // Calculate remaining time in hours
  const getRemainingTime = () => {
    if (!isTrialActive || !trialInfo.trialStartedAt) return 0;
    const elapsed = Date.now() - trialInfo.trialStartedAt.getTime();
    const remaining = Math.max(0, 24 - Math.floor(elapsed / (1000 * 60 * 60)));
    return remaining;
  };

  const shouldBlurContent = isTrialActive && hasViewedMaxTrialPages;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-glow">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Browse <span className="bg-gradient-primary bg-clip-text text-transparent">Visa-Sponsored</span> Jobs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your next career opportunity with verified employers ready to sponsor your visa
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="max-w-4xl mx-auto bg-gradient-surface border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search jobs, companies, skills, or cities..." 
                    className="pl-10 h-12 border-border/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[140px] h-12">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">🇬🇧 UK</SelectItem>
                      <SelectItem value="usa">🇺🇸 USA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px] h-12">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associates">Associate's</SelectItem>
                      <SelectItem value="bachelors">Bachelor's</SelectItem>
                      <SelectItem value="masters">Master's</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearsExperienceFilter} onValueChange={setYearsExperienceFilter}>
                    <SelectTrigger className="w-[180px] h-12">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Years Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1">&lt;1 years</SelectItem>
                      <SelectItem value="1-2-years">1-2 years</SelectItem>
                      <SelectItem value="3-4-years">3-4 years</SelectItem>
                      <SelectItem value="5-7-years">5-7 years</SelectItem>
                      <SelectItem value="8-14-years">8-14 years</SelectItem>
                      <SelectItem value="15-plus-years">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
                    <SelectTrigger className="w-[180px] h-12">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="entry-level">Entry level</SelectItem>
                      <SelectItem value="associate">Associate</SelectItem>
                      <SelectItem value="senior-associate">Senior Associate</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trial Status */}
      {isTrialActive && (
        <section className="py-4 bg-muted/30 border-b">
          <div className="container">
            <Card className="bg-gradient-surface border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-primary" />
                      <span className="font-medium">Trial Active:</span>
                      <span className="text-muted-foreground">
                        {trialInfo.trialPageViews}/3 pages viewed
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="font-medium">Time left:</span>
                      <span className="text-muted-foreground">
                        {getRemainingTime()}h remaining
                      </span>
                    </div>
                  </div>
                  {hasViewedMaxTrialPages && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Trial limit reached
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Job Stats */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length.toLocaleString()}
                </span> jobs found
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  🇬🇧 UK Jobs: {allJobs.filter(job => job.country === 'UK').length}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  🇺🇸 USA Jobs: {allJobs.filter(job => job.country === 'USA').length}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Updated 2 hours ago
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-12">
        <div className="container">
          <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${shouldBlurContent ? 'blur-sm' : ''}`}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => <JobCardSkeleton key={index} />)
            ) : (
              currentJobs.map((job) => (
                <div key={job.id} onClick={handleJobInteraction}>
                  <JobCard job={job} />
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          {shouldBlurContent && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="max-w-md mx-auto bg-gradient-surface border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">Trial Limit Reached</h3>
                  <p className="text-muted-foreground mb-6">
                    You've viewed 3 job pages during your free trial. Upgrade to continue browsing visa-sponsored jobs.
                  </p>
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                    onClick={handleTrialClick}
                  >
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="text-center mt-16">
            <Card className="max-w-md mx-auto bg-gradient-surface border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                {!isTrialActive && !isTrialExpired ? (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Start Your Free Trial</h3>
                    <p className="text-muted-foreground mb-6">
                      Get 24 hours of free access to browse visa-sponsored jobs
                    </p>
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                      onClick={handleTrialClick}
                    >
                      Start 24hr Free Trial
                    </Button>
                  </>
                ) : isTrialExpired ? (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Trial Expired</h3>
                    <p className="text-muted-foreground mb-6">
                      Your free trial has ended. Upgrade to continue accessing visa-sponsored jobs.
                    </p>
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                      onClick={handleTrialClick}
                    >
                      Upgrade to Premium
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Want to see more jobs?</h3>
                    <p className="text-muted-foreground mb-6">
                      Get access to additional visa-sponsored positions updated daily
                    </p>
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                      onClick={handleTrialClick}
                    >
                      Upgrade to Premium
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};