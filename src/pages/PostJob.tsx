import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const PostJob = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: "",
    firstName: "",
    lastName: "",
    role: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Job posting submitted!",
      description: "We'll review your submission and get back to you soon.",
    });
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Submit a job and get exposure to 25,000+ vetted US and UK job seekers for free.
            </h1>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-8">Posting Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange("company")}
                  required
                  placeholder="Enter your company name"
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
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your role *</Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange("role")}
                  required
                  placeholder="Enter your role"
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
                  placeholder="Enter your work email"
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