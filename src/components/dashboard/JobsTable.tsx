// src/components/JobsTable.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  is_active: boolean;
}

const JobsTable = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("id, title, company, type, is_active")
        .order("created_at", { ascending: false });
      if (data) setJobs(data as Job[]);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Jobs</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Active</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="border p-2">{job.id}</td>
              <td className="border p-2">{job.title}</td>
              <td className="border p-2">{job.company}</td>
              <td className="border p-2">{job.type}</td>
              <td className="border p-2">{job.is_active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
