import DashboardCard from "@/components/dashboard/DashboardCard";

export const Overview = () => {
  // Placeholder values; replace with Supabase queries
  const stats = [
    { title: "Total Users", value: 123 },
    { title: "Active Jobs", value: 45 },
    { title: "Subscribers", value: 12 },
    { title: "Trial Users", value: 5 },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};



// src/App.tsx
import {Routes, Route, Outlet } from "react-router-dom";
import Users from "./Users";
import Jobs from "./DashboardJobs";
import Sidebar from "@/components/dashboard/Sidebar";

const Dashboard = () => {
  return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100 min-h-screen">
          <Outlet/>
        </div>
      </div>
  );
};

export default Dashboard;

