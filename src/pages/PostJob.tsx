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
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const PostJob = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    applicationLink: "",
    applicationEmail: "",
    country: "United States",
    location: "",
    type: "",
    description: "",
    requirements: "",
    salaryCurrency: "USD",
    salaryMin: "",
    salaryMax: "",
    salaryUnit: "per year",
    benefits: "",
    yearsExperience: "",
    expiresAt: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.role.trim()) newErrors.role = "Job Title / Role is required";

    if (!formData.applicationLink.trim() && !formData.applicationEmail.trim()) {
      newErrors.applicationLink =
        "Provide at least an application link or email";
    }

    if (
      formData.applicationLink &&
      !/^https?:\/\//.test(formData.applicationLink)
    ) {
      newErrors.applicationLink = "Application link must be a valid URL";
    }

    if (
      formData.applicationEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicationEmail)
    ) {
      newErrors.applicationEmail = "Application email must be valid";
    }

    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.type.trim()) newErrors.type = "Job type is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.requirements.trim())
      newErrors.requirements = "Requirements are required";

    if (!formData.salaryMin.trim() && !formData.salaryMax.trim())
      newErrors.salaryRange = "Provide at least min or max salary";

    if (!formData.benefits.trim())
      newErrors.benefits = "Benefits are required";
    if (!formData.yearsExperience.trim())
      newErrors.yearsExperience = "Years of experience is required";
    if (!formData.expiresAt.trim())
      newErrors.expiresAt = "Expiration date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields.",
        variant: "destructive",
      });
      return;
    }

    const expiresAtIso = new Date(formData.expiresAt).toISOString();

    const salaryRange =
      formData.salaryMin || formData.salaryMax
        ? `${formData.salaryCurrency} ${formData.salaryMin ?? ""} - ${
            formData.salaryMax ?? ""
          } ${formData.salaryUnit}`
        : null;

    const jobRow = {
      user_id: user.id,
      system: false,
      title: formData.role,
      company: formData.company,
      country: formData.country,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: formData.requirements,
      salary_range: salaryRange,
      benefits: formData.benefits,
      application_url: formData.applicationLink || null,
      application_email: formData.applicationEmail || null,
      years_experience: formData.yearsExperience,
      is_active: true,
      featured: false,
      expires_at: expiresAtIso,
      posted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      imported_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("jobs").insert(jobRow);
      if (error) throw error;

      toast({
        title: "Job posting submitted!",
        description: "Your job is now live.",
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
              {/* Text Inputs */}
              {[
                { id: "company", label: "Company *", type: "text" },
                { id: "role", label: "Job Title / Role *", type: "text" },
                {
                  id: "applicationLink",
                  label: "Job application link",
                  type: "url",
                  placeholder: "https://example.com/apply",
                },
                {
                  id: "applicationEmail",
                  label: "Application email (optional)",
                  type: "email",
                  placeholder: "hr@example.com",
                },
                { id: "location", label: "Location *", type: "text" },
                { id: "benefits", label: "Benefits *", type: "text" },
                {
                  id: "expiresAt",
                  label: "Expiration Date *",
                  type: "date",
                },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={(formData as any)[field.id]}
                    placeholder={field.placeholder}
                    onChange={handleChange(field.id)}
                  />
                  {errors[field.id] && (
                    <p className="text-sm text-red-500">{errors[field.id]}</p>
                  )}
                </div>
              ))}

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={handleChange("country")}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label>Salary Range *</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Select
                    value={formData.salaryCurrency}
                    onValueChange={handleChange("salaryCurrency")}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={formData.salaryMin}
                    onChange={handleChange("salaryMin")}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={formData.salaryMax}
                    onChange={handleChange("salaryMax")}
                  />
                  <Select
                    value={formData.salaryUnit}
                    onValueChange={handleChange("salaryUnit")}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per year">per year</SelectItem>
                      <SelectItem value="per month">per month</SelectItem>
                      <SelectItem value="per week">per week</SelectItem>
                      <SelectItem value="per hour">per hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.salaryRange && (
                  <p className="text-sm text-red-500">{errors.salaryRange}</p>
                )}
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select value={formData.type} onValueChange={handleChange("type")}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-time</SelectItem>
                    <SelectItem value="PART_TIME">Part-time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="TEMPORARY">Temporary</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                    <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                    <SelectItem value="PER_DIEM">Per-diem</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience *</Label>
                <Select
                  value={formData.yearsExperience}
                  onValueChange={handleChange("yearsExperience")}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0–2 years</SelectItem>
                    <SelectItem value="2-5">2–5 years</SelectItem>
                    <SelectItem value="5-10">5–10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.yearsExperience && (
                  <p className="text-sm text-red-500">{errors.yearsExperience}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={handleChange("requirements")}
                />
                {errors.requirements && (
                  <p className="text-sm text-red-500">{errors.requirements}</p>
                )}
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
