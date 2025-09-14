import { useState } from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { Overview } from '@/components/dashboard/Overview';
import UsersTable from "@/components/dashboard/UsersTable";
import JobsTable from "@/components/dashboard/JobsTable";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UsersTable />;
      case 'jobs':
        return <JobsTable />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="sticky top-0 h-screen">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;