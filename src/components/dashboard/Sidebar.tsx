import { Users, Briefcase, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const links = [
    { name: "Overview", key: "overview", icon: Eye },
    { name: "Users", key: "users", icon: Users },
    { name: "Jobs", key: "jobs", icon: Briefcase },
  ];

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
       <Link to="/">
       <span className="font-bold text-4xl bg-gradient-primary bg-clip-text text-transparent">
            BleemHire
          </span>
       </Link>
        <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="flex flex-col gap-2 p-4 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeView === link.key;
          
          return (
            <button
              key={link.name}
              onClick={() => setActiveView(link.key)}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 text-white" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="font-medium">{link.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-500 text-center">
          © 2024 Bleem Dashboard
        </div>
      </div>
    </div>
  );
};

export default Sidebar;