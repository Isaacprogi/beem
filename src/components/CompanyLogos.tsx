import bnyMellonLogo from "@/assets/bny-mellon-logo.png";
import goldmanSachsLogo from "@/assets/goldman-sachs-logo.png";
import metaLogo from "@/assets/meta-logo.png";
import amazonLogo from "@/assets/amazon-logo.png";
import teslaLogo from "@/assets/tesla-logo.png";
import appleLogo from "@/assets/apple-logo.png";
import microsoftLogo from "@/assets/microsoft-logo.png";
import googleLogo from "@/assets/google-logo.png";

export const CompanyLogos = () => {
  const companies = [
    { name: "BNY Mellon", logo: bnyMellonLogo },
    { name: "Goldman Sachs", logo: goldmanSachsLogo },
    { name: "Meta", logo: metaLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Tesla", logo: teslaLogo },
    { name: "Apple", logo: appleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Google", logo: googleLogo },
  ];

  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="container">
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-12 items-center">
            {/* First set of logos */}
            {companies.map((company, index) => (
              <div 
                key={`first-${index}`}
                className="flex items-center justify-center min-w-[160px] group hover-scale"
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div 
                key={`second-${index}`}
                className="flex items-center justify-center min-w-[160px] group hover-scale"
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};