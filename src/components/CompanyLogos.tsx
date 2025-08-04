export const CompanyLogos = () => {
  const companies = [
    { name: "BNY Mellon", logo: "💰" },
    { name: "Goldman Sachs", logo: "🏦" },
    { name: "Meta", logo: "📘" },
    { name: "Amazon", logo: "📦" },
    { name: "Tesla", logo: "⚡" },
    { name: "Apple", logo: "🍎" },
    { name: "Microsoft", logo: "💻" },
    { name: "Google", logo: "🔍" },
  ];

  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground mb-2">Trusted by</p>
          <h3 className="text-2xl font-semibold text-foreground">
            Companies hiring visa-sponsored talent
          </h3>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-[scroll_30s_linear_infinite] gap-12 items-center">
            {/* First set of logos */}
            {companies.map((company, index) => (
              <div 
                key={`first-${index}`}
                className="flex flex-col items-center gap-3 min-w-[120px] group hover-scale"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-surface border border-border/50 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-all">
                  {company.logo}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {company.name}
                </span>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div 
                key={`second-${index}`}
                className="flex flex-col items-center gap-3 min-w-[120px] group hover-scale"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-surface border border-border/50 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-all">
                  {company.logo}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};