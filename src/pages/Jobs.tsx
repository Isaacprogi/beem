import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Briefcase, GraduationCap, Clock } from "lucide-react";

const allJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Google",
    location: "London",
    country: "UK",
    salary: "£70,000 - £90,000",
    type: "Full-time",
    posted: "2 hours ago",
    visaType: "Tier 2 Visa",
    description: "We're looking for an experienced software engineer to join our growing team. You'll work on cutting-edge projects using React, Node.js, and cloud technologies.",
    featured: true,
    logo: "/src/assets/google-logo.png",
    url: "https://careers.google.com/",
    tags: ["Senior", "Full-time", "Bachelor's", "5+ Years"]
  },
  {
    id: "2",
    title: "Data Scientist",
    company: "Meta",
    location: "San Francisco",
    country: "USA",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    posted: "4 hours ago",
    visaType: "H1-B Visa",
    description: "Join our data science team to develop machine learning models and extract insights from large datasets using Python, TensorFlow, and AWS.",
    logo: "/src/assets/meta-logo.png",
    url: "https://www.metacareers.com/",
    tags: ["Mid-level", "Full-time", "Master's", "Python"]
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Apple",
    location: "Manchester",
    country: "UK",
    salary: "£60,000 - £80,000",
    type: "Full-time",
    posted: "6 hours ago",
    visaType: "Skilled Worker Visa",
    description: "Lead product development and strategy for our innovative B2B platform. Experience with agile methodologies and user research required.",
    logo: "/src/assets/apple-logo.png",
    url: "https://www.apple.com/careers/us/",
    tags: ["Senior", "Full-time", "Bachelor's", "Management"]
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "Microsoft",
    location: "Austin",
    country: "USA",
    salary: "$95,000 - $125,000",
    type: "Full-time",
    posted: "8 hours ago",
    visaType: "O-1 Visa",
    description: "Design and maintain cloud infrastructure, automate deployment processes using Kubernetes, Docker, and ensure system reliability.",
    logo: "/src/assets/microsoft-logo.png",
    url: "https://careers.microsoft.com/",
    tags: ["Mid-level", "Full-time", "Bachelor's", "DevOps"]
  },
  {
    id: "5",
    title: "UX Designer",
    company: "Tesla",
    location: "Edinburgh",
    country: "UK",
    salary: "£45,000 - £65,000",
    type: "Full-time",
    posted: "1 day ago",
    visaType: "Tier 2 Visa",
    description: "Create intuitive user experiences for our digital products. Portfolio of mobile and web designs required. Figma and user testing experience preferred.",
    logo: "/src/assets/tesla-logo.png",
    url: "https://www.tesla.com/careers",
    tags: ["Mid-level", "Full-time", "Bachelor's", "Design"]
  },
  {
    id: "6",
    title: "Machine Learning Engineer",
    company: "Amazon",
    location: "Boston",
    country: "USA",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    posted: "1 day ago",
    visaType: "H1-B Visa",
    description: "Build and deploy ML models at scale. Experience with TensorFlow, PyTorch, and cloud platforms required. PhD in Computer Science preferred.",
    logo: "/src/assets/amazon-logo.png",
    url: "https://www.amazon.jobs/",
    tags: ["Senior", "Full-time", "Master's", "AI/ML"]
  },
  {
    id: "7",
    title: "Frontend Developer",
    company: "Goldman Sachs",
    location: "Birmingham",
    country: "UK",
    salary: "£50,000 - £70,000",
    type: "Full-time",
    posted: "2 days ago",
    visaType: "Skilled Worker Visa",
    description: "Develop responsive web applications using React, TypeScript, and modern CSS frameworks. Experience with accessibility standards required.",
    logo: "/src/assets/goldman-sachs-logo.png",
    url: "https://www.goldmansachs.com/careers",
    tags: ["Mid-level", "Full-time", "Bachelor's", "Frontend"]
  },
  {
    id: "8",
    title: "Security Engineer",
    company: "Microsoft",
    location: "Seattle",
    country: "USA",
    salary: "$110,000 - $140,000",
    type: "Full-time",
    posted: "2 days ago",
    visaType: "H1-B Visa",
    description: "Implement security measures and conduct vulnerability assessments. Experience with penetration testing and security frameworks required.",
    logo: "/src/assets/microsoft-logo.png",
    url: "https://careers.microsoft.com/",
    tags: ["Senior", "Full-time", "Bachelor's", "Security"]
  },
  {
    id: "9",
    title: "Backend Developer",
    company: "BNY Mellon",
    location: "Bristol",
    country: "UK",
    salary: "£55,000 - £75,000",
    type: "Full-time",
    posted: "3 days ago",
    visaType: "Tier 2 Visa",
    description: "Build scalable backend services using Python/Django and PostgreSQL. Experience with microservices architecture and API design preferred.",
    logo: "/src/assets/bny-mellon-logo.png",
    url: "https://www.bny.com/corporate/global/en/careers/work-with-us.html",
    tags: ["Mid-level", "Full-time", "Bachelor's", "Backend"]
  },
];

export const Jobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [yearsExperienceFilter, setYearsExperienceFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === "" || 
        (locationFilter === "uk" && job.country === "UK") ||
        (locationFilter === "usa" && job.country === "USA");

      return matchesSearch && matchesLocation;
    });
  }, [searchTerm, locationFilter, yearsExperienceFilter, experienceLevelFilter]);

  return (
    <div className="min-h-screen bg-background">
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
                      <SelectItem value="mid-senior">Mid-Senior level</SelectItem>
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

      {/* Job Stats */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs found
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Card className="max-w-md mx-auto bg-gradient-surface border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Want to see more jobs?</h3>
                <p className="text-muted-foreground mb-6">
                  Get access to additional visa-sponsored positions updated daily
                </p>
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                  onClick={() => navigate('/signup')}
                >
                  Start 24hr Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};