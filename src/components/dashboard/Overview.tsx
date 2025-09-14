import { useState, useEffect } from 'react';
import { Users, Briefcase, UserCheck, UserX } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import DashboardCard from '@/components/dashboard/DashboardCard';

interface User {
  id: string;
  display_name: string;
  user_id: string;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  is_active: boolean;
  created_at: string;
}

export const Overview = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, display_name, user_id, created_at")
        .order("created_at", { ascending: false });
      
      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, company, type, is_active, created_at")
        .order("created_at", { ascending: false });
      
      if (usersData && !usersError) setUsers(usersData);
      if (jobsData && !jobsError) setJobs(jobsData);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Calculate dynamic stats
  const totalUsers = users.length;
  const activeJobs = jobs.filter(job => job.is_active).length;
  const inactiveJobs = jobs.filter(job => !job.is_active).length;
  
  // Calculate recent activity (users created in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = users.filter(user => new Date(user.created_at) > thirtyDaysAgo).length;
  
  const stats = [
    { title: "Total Users", value: loading ? "..." : totalUsers, icon: Users, trend: `${recentUsers} this month`, color: "blue" as const },
    { title: "Active Jobs", value: loading ? "..." : activeJobs, icon: Briefcase, trend: `${jobs.length} total jobs`, color: "green" as const },
    { title: "Inactive Jobs", value: loading ? "..." : inactiveJobs, icon: UserX, trend: `${Math.round((inactiveJobs/jobs.length)*100) || 0}% of total`, color: "orange" as const },
    { title: "New Users", value: loading ? "..." : recentUsers, icon: UserCheck, trend: "Last 30 days", color: "purple" as const },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with your platform.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                  <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">User "{user.display_name}" registered</p>
                    <p className="text-xs text-slate-500">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-slate-500 text-center py-4">No recent activity</p>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h3>
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Jobs Posted</span>
                <span className="font-semibold text-slate-800">{jobs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Jobs This Week</span>
                <span className="font-semibold text-slate-800">
                  {jobs.filter(job => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(job.created_at) > weekAgo;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active Job Rate</span>
                <span className="font-semibold text-green-600">
                  {jobs.length > 0 ? Math.round((activeJobs / jobs.length) * 100) : 0}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};