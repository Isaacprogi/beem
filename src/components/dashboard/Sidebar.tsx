// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Overview", path: "/dashboard" }, // index route
    { name: "Users", path: "/dashboard/users" },
    { name: "Jobs", path: "/dashboard/jobs" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/dashboard"} // ensures exact match for Overview
            className={({ isActive }) =>
              `p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
