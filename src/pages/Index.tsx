import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JobsList } from "@/components/JobsList";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <JobsList />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
