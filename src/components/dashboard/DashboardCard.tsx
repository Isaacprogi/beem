// src/components/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: number | string;
}

const DashboardCard = ({ title, value }: DashboardCardProps) => {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col items-center">
      <h3 className="text-gray-500">{title}</h3>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};

export default DashboardCard;
