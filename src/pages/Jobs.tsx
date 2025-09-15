import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Eye,
  Timer,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";


type Job = Database["public"]["Tables"]["jobs"]["Row"];

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
  const navigate = useNavigate();
  const {
    subscriptionStatus,
  } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [yearsExperienceFilter, setYearsExperienceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch jobs from Supabase whenever filters or page change
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("jobs")
          .select("*", { count: "exact" })
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(
            (currentPage - 1) * JOBS_PER_PAGE,
            currentPage * JOBS_PER_PAGE - 1
          );

        if (searchTerm) {
          query = query.ilike("title", `%${searchTerm}%`);
        }

        if (locationFilter) {
          query = query.eq("country", locationFilter);
        }

        if (yearsExperienceFilter && yearsExperienceFilter !== "all") {
          // Example filtering based on min experience
          const minExpMap: Record<string, number> = {
            "0-2": 0,
            "2-5": 2,
            "5-10": 5,
            "10+": 10,
          };
          query = query.gte(
            "years_experience_min",
            minExpMap[yearsExperienceFilter]
          );
        }

        const { data, count, error } = await query;

        if (error) throw error;

        setJobs(data || []);
        setTotalJobs(count || 0);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, searchTerm, locationFilter, yearsExperienceFilter]);

  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (!subscriptionStatus.subscribed && page > 1) {
        navigate("/pricing");
        return;
      }
      setCurrentPage(page);
    }
  };

  const handleUpgradeClick = () => {
    navigate("/pricing");
  };

  const shouldBlurContent = !subscriptionStatus.subscribed && currentPage > 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-glow">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Browse{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Visa-Sponsored
              </span>{" "}
              Jobs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your next career opportunity with verified employers ready to
              sponsor your visa
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
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-[140px] h-12">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United Kingdom">🇬🇧 UK</SelectItem>
                      <SelectItem value="United States">🇺🇸 USA</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Select>
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
                  </Select> */}
                  <Select
                    value={yearsExperienceFilter}
                    onValueChange={setYearsExperienceFilter}
                  >
                    <SelectTrigger className="w-[180px] h-12">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Years Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                      <SelectItem value="all">All Jobs</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
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
                  </Select> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Job Stats */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Showing {(currentPage - 1) * JOBS_PER_PAGE + 1}-
                  {Math.min(currentPage * JOBS_PER_PAGE, totalJobs)} of{" "}
                  {totalJobs.toLocaleString()}
                </span>{" "}
                jobs found
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  🇬🇧 UK Jobs:{" "}
                  {
                    jobs.filter(
                      (job) =>
                        job.country?.trim().toLowerCase() === "united kingdom"
                    ).length
                  }
                </Badge>
                <Badge variant="outline" className="gap-1">
                  🇺🇸 USA Jobs:{" "}
                  {
                    jobs.filter(
                      (job) =>
                        job.country?.trim().toLowerCase() === "united states"
                    ).length
                  }
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
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${
              shouldBlurContent ? "blur-sm" : ""
            }`}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <JobCardSkeleton key={idx} />
                ))
              : jobs.map((job) => (
                  <div key={job.id}>
                    <JobCard job={job} />
                  </div>
                ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
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
                  <h3 className="text-xl font-semibold mb-4">
                    Upgrade to View More
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You've reached the free limit. Upgrade to a premium plan to
                    view all jobs.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                    onClick={handleUpgradeClick}
                  >
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};
