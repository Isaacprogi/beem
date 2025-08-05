import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CompanyLogos } from "@/components/CompanyLogos";
import { JobsList } from "@/components/JobsList";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { useScrollTracking } from "@/hooks/useScrollTracking";

const Index = () => {
  useScrollTracking('Home');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CompanyLogos />
        <JobsList />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
