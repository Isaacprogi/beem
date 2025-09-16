import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import { Overview } from "@/components/dashboard/Overview";
import UsersTable from "@/components/dashboard/UsersTable";
import JobsTable from "@/components/dashboard/JobsTable";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return <UsersTable />;
      case "jobs":
        return <JobsTable />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar for large screens */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar with animation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg md:hidden flex flex-col"
          >
            {/* Sidebar content */}
            <Sidebar
              activeView={activeView}
              setActiveView={(view) => {
                setActiveView(view);
                setIsSidebarOpen(false); // close sidebar when selecting
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
