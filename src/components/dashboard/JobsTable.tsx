import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Star,
  Mail,
  ExternalLink,
  X
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  country: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary_range: string;
  benefits: string;
  application_url: string;
  application_email: string;
  years_experience: string;
  is_active: boolean;
  featured: boolean;
  expires_at: string;
  posted_at: string;
  created_at: string;
  imported_at: string;
  updated_at: string;
}

interface FilterState {
  search: string;
  is_active: string;
  type: string;
  featured: string;
  country: string;
  years_experience: string;
}

const JobsTable = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    is_active: '',
    type: '',
    featured: '',
    country: '',
    years_experience: ''
  });

  // Available filter options (you can fetch these dynamically from DB)
  const jobTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
  const experienceLevels = ['entry-level', 'junior', 'mid-level', 'senior', 'lead', 'executive'];
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Remote'];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from("jobs")
        .select(`
          id,
          title,
          company,
          country,
          location,
          type,
          description,
          requirements,
          salary_range,
          benefits,
          application_url,
          application_email,
          years_experience,
          is_active,
          featured,
          expires_at,
          posted_at,
          created_at,
          imported_at,
          updated_at
        `, { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.is_active !== '') {
        query = query.eq('is_active', filters.is_active === 'true');
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.featured !== '') {
        query = query.eq('featured', filters.featured === 'true');
      }
      
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      
      if (filters.years_experience) {
        query = query.eq('years_experience', filters.years_experience);
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      query = query
        .range(from, to)
        .order("created_at", { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setJobs(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      is_active: '',
      type: '',
      featured: '',
      country: '',
      years_experience: ''
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Jobs Management</h2>
        <p className="text-slate-600">Monitor and manage job postings ({totalCount} total)</p>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="p-4 border-b border-slate-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.values(filters).some(v => v !== '') && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                Active
              </span>
            )}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or descriptions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Active Status */}
              <select
                value={filters.is_active}
                onChange={(e) => handleFilterChange('is_active', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              
              {/* Job Type */}
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              {/* Featured */}
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Jobs</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
              
              {/* Country */}
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              {/* Experience Level */}
              <select
                value={filters.years_experience}
                onChange={(e) => handleFilterChange('years_experience', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters */}
            {Object.values(filters).some(v => v !== '') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No jobs found matching your criteria</p>
            {Object.values(filters).some(v => v !== '') && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Clear filters to see all jobs
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Scrollable Table Container */}
            <div className="overflow-x-auto">
              <div className="min-w-[1400px]">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 w-16">
                        <Star className="w-4 h-4" />
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[250px]">Job Details</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[150px]">Company</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[120px]">Location</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[100px]">Type</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[120px]">Experience</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[150px]">Salary</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[100px]">Status</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[100px]">Posted</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[100px]">Expires</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700 min-w-[80px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Featured Star */}
                        <td className="px-4 py-4">
                          {job.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </td>
                        
                        {/* Job Details */}
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-medium text-slate-800 truncate">
                                {job.title}
                              </h3>
                              {job.description && (
                                <p className="text-xs text-slate-600 mt-1">
                                  {truncateText(job.description, 80)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        {/* Company */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-600 truncate">{job.company || 'N/A'}</span>
                          </div>
                        </td>
                        
                        {/* Location */}
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <div className="text-sm text-slate-600 truncate">{job.country || 'N/A'}</div>
                              {job.location && (
                                <div className="text-xs text-slate-500 truncate">{job.location}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        {/* Type */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {job.type || 'N/A'}
                          </span>
                        </td>
                        
                        {/* Experience */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-600">
                            {job.years_experience || 'N/A'}
                          </span>
                        </td>
                        
                        {/* Salary */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-600 truncate">
                              {job.salary_range ? truncateText(job.salary_range, 20) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            job.is_active 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {job.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {job.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        
                        {/* Posted Date */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-600">
                              {formatDate(job.posted_at || job.created_at)}
                            </span>
                          </div>
                        </td>
                        
                        {/* Expires Date */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-600">
                            {job.expires_at ? formatDate(job.expires_at) : 'N/A'}
                          </span>
                        </td>
                        
                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {job.application_url && (
                              <a
                                href={job.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                                title="View Application"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {job.application_email && (
                              <a
                                href={`mailto:${job.application_email}`}
                                className="text-green-600 hover:text-green-700"
                                title="Email Contact"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{' '}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} jobs
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobsTable;