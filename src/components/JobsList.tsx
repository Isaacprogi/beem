import { JobCard } from "./JobCard";
import { Button } from "@/components/ui/button";

const mockJobs = [
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
    description: "We're looking for an experienced software engineer to join our growing team. You'll work on cutting-edge projects and help build scalable solutions.",
    logo: "/src/assets/google-logo.png",
    tags: ["Senior", "Full-time", "Bachelor's", "5+ Years"]
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
    description: "Join our data science team to develop machine learning models and extract insights from large datasets.",
    logo: "/src/assets/microsoft-logo.png",
    tags: ["Mid-level", "Full-time", "Master's", "Python"]
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
    description: "Lead product development and strategy for our innovative B2B platform. Experience with agile methodologies required.",
    logo: "/src/assets/amazon-logo.png",
    tags: ["Senior", "Full-time", "Bachelor's", "Management"]
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
    description: "Design and maintain cloud infrastructure, automate deployment processes, and ensure system reliability.",
    logo: "/src/assets/tesla-logo.png",
    tags: ["Mid-level", "Full-time", "Bachelor's", "DevOps"]
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
    description: "Create intuitive user experiences for our digital products. Portfolio of mobile and web designs required.",
    logo: "/src/assets/apple-logo.png",
    tags: ["Mid-level", "Full-time", "Bachelor's", "Design"]
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
    description: "Build and deploy ML models at scale. Experience with TensorFlow, PyTorch, and cloud platforms required.",
    logo: "/src/assets/meta-logo.png",
    tags: ["Senior", "Full-time", "Master's", "AI/ML"]
  },
];

export const JobsList = () => {
  return (
    <section id="jobs" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Visa-Sponsored Jobs</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover opportunities with verified employers ready to sponsor your visa. Updated daily with new positions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Access to 250,000+ visa-sponsored jobs in the premium access list.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-hero hover:opacity-90 transition-opacity px-8"
          >
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </section>
  );
};