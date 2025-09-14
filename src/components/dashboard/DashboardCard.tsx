import { TrendingUp, LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

const DashboardCard = ({ title, value, icon: Icon, trend, color = "blue" }: DashboardCardProps) => {
  const colorVariants = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
    green: "from-green-500 to-green-600 shadow-green-500/25",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/25",
    orange: "from-orange-500 to-orange-600 shadow-orange-500/25"
  };

  return (
    <div className="group relative overflow-hidden">
      <div className={`bg-gradient-to-br ${colorVariants[color]} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && (
              <div className="flex items-center mt-2 text-white/90">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">{trend}</span>
              </div>
            )}
          </div>
          <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <Icon className="w-8 h-8" />
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Icon className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;