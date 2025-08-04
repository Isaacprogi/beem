import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, Briefcase } from "lucide-react";

const allJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp UK",
    location: "London",
    country: "UK",
    salary: "£70,000 - £90,000",
    type: "Full-time",
    posted: "2 hours ago",
    visaType: "Tier 2 Visa",
    description: "We're looking for an experienced software engineer to join our growing team. You'll work on cutting-edge projects using React, Node.js, and cloud technologies.",
    featured: true,
  },
  {
    id: "2",
    title: "Data Scientist",
    company: "AI Innovations Inc",
    location: "San Francisco",
    country: "USA",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    posted: "4 hours ago",
    visaType: "H1-B Visa",
    description: "Join our data science team to develop machine learning models and extract insights from large datasets using Python, TensorFlow, and AWS.",
  },
  {
    id: "3",
    title: "Product Manager",
    company: "StartupX",
    location: "Manchester",
    country: "UK",
    salary: "£60,000 - £80,000",
    type: "Full-time",
    posted: "6 hours ago",
    visaType: "Skilled Worker Visa",
    description: "Lead product development and strategy for our innovative B2B platform. Experience with agile methodologies and user research required.",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin",
    country: "USA",
    salary: "$95,000 - $125,000",
    type: "Full-time",
    posted: "8 hours ago",
    visaType: "O-1 Visa",
    description: "Design and maintain cloud infrastructure, automate deployment processes using Kubernetes, Docker, and ensure system reliability.",
  },
  {
    id: "5",
    title: "UX Designer",
    company: "Design Studio Ltd",
    location: "Edinburgh",
    country: "UK",
    salary: "£45,000 - £65,000",
    type: "Full-time",
    posted: "1 day ago",
    visaType: "Tier 2 Visa",
    description: "Create intuitive user experiences for our digital products. Portfolio of mobile and web designs required. Figma and user testing experience preferred.",
  },
  {
    id: "6",
    title: "Machine Learning Engineer",
    company: "ML Research Corp",
    location: "Boston",
    country: "USA",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    posted: "1 day ago",
    visaType: "H1-B Visa",
    description: "Build and deploy ML models at scale. Experience with TensorFlow, PyTorch, and cloud platforms required. PhD in Computer Science preferred.",
  },
  {
    id: "7",
    title: "Frontend Developer",
    company: "WebFlow Agency",
    location: "Birmingham",
    country: "UK",
    salary: "£50,000 - £70,000",
    type: "Full-time",
    posted: "2 days ago",
    visaType: "Skilled Worker Visa",
    description: "Develop responsive web applications using React, TypeScript, and modern CSS frameworks. Experience with accessibility standards required.",
  },
  {
    id: "8",
    title: "Security Engineer",
    company: "CyberSafe Inc",
    location: "Seattle",
    country: "USA",
    salary: "$110,000 - $140,000",
    type: "Full-time",
    posted: "2 days ago",
    visaType: "H1-B Visa",
    description: "Implement security measures and conduct vulnerability assessments. Experience with penetration testing and security frameworks required.",
  },
  {
    id: "9",
    title: "Backend Developer",
    company: "API Solutions Ltd",
    location: "Bristol",
    country: "UK",
    salary: "£55,000 - £75,000",
    type: "Full-time",
    posted: "3 days ago",
    visaType: "Tier 2 Visa",
    description: "Build scalable backend services using Python/Django and PostgreSQL. Experience with microservices architecture and API design preferred.",
  },
];

export const Jobs = () => {
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
                    placeholder="Search jobs, companies, or skills..." 
                    className="pl-10 h-12 border-border/50"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Type
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
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
                <span className="font-semibold text-foreground">{allJobs.length}</span> jobs found
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
            {allJobs.map((job) => (
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
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all">
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