import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const PostJob = () => {

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    applicationLink: "",
    country: "",
    location: "",
    type: "",
    description: "",
    requirements: "",
    salaryRange: "",
    benefits: "",
    yearsExperience: "",
    expiresAt: "",
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a job.",
        variant: "destructive",
      });
      navigate("/sign-in");
    }
  }, [user, navigate]);

  const handleChange =
    (field: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | string
    ) => {
      const value = typeof e === "string" ? e : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const jobRow = {
      user_id: user.id,
      title: formData.role,
      company: formData.company,
      country: formData.country || null,
      location: formData.location || null,
      type: formData.type || null,
      description: formData.description || null,
      requirements: formData.requirements || null,
      salary_range: formData.salaryRange || null,
      benefits: formData.benefits || null,
      application_url: formData.applicationLink || null,
      application_email: formData.email || null,
      years_experience: formData.yearsExperience || null,
      is_active: true,
      featured: false,
      expires_at: formData.expiresAt || null,
      posted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobRow),
      });

      if (!res.ok) throw new Error("Failed to post job");

      toast({
        title: "Job posting submitted!",
        description: "We'll review your submission and get back to you soon.",
      });

      navigate("/jobs");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Submit a job and get exposure to 25,000+ vetted US and UK job
              seekers for free.
            </h1>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Posting Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange("company")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Your first name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Your last name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Job Title / Role *</Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange("role")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your work email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationLink">Job application link</Label>
                <Input
                  id="applicationLink"
                  type="url"
                  value={formData.applicationLink}
                  onChange={handleChange("applicationLink")}
                  placeholder="https://example.com/apply"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange("country")}
                  placeholder="e.g., UK, USA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange("location")}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleChange("type")}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Describe the job"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={handleChange("requirements")}
                  placeholder="List key requirements"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input
                  id="salaryRange"
                  type="text"
                  value={formData.salaryRange}
                  onChange={handleChange("salaryRange")}
                  placeholder="e.g., USD 50,000 - 70,000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Input
                  id="benefits"
                  type="text"
                  value={formData.benefits}
                  onChange={handleChange("benefits")}
                  placeholder="e.g., Health insurance, PTO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="text"
                  value={formData.yearsExperience}
                  onChange={handleChange("yearsExperience")}
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleChange("expiresAt")}
                />
              </div>

              <Button type="submit" className="w-full mt-8">
                Submit Job Posting
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
