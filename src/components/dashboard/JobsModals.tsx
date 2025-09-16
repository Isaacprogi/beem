// ===== COMPONENTS/MODAL.TSX =====
import { createPortal } from "react-dom";
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, children, title, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// ===== COMPONENTS/JOB-DROPDOWN.TSX =====
import { createPortal } from "react-dom";
import { Eye, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Job } from '../types/job';

interface DropdownProps {
  job: Job;
  buttonRect: DOMRect;
  onClose: () => void;
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onToggleStatus: (job: Job) => void;
}

export const JobDropdown = ({ job, buttonRect, onClose, onView, onEdit, onDelete, onToggleStatus }: DropdownProps) => {
  const style = {
    position: "fixed" as const,
    top: buttonRect.bottom + window.scrollY,
    left: buttonRect.right - 140 + window.scrollX,
    width: "140px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 9999,
  };

  return createPortal(
    <div style={style}>
      <button 
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm" 
        onClick={() => { onView(job); onClose(); }}
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      <button 
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm" 
        onClick={() => { onEdit(job); onClose(); }}
      >
        <Edit className="w-4 h-4" />
        Edit Job
      </button>
      <button 
        className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm ${job.is_active ? 'text-orange-600' : 'text-green-600'}`}
        onClick={() => { onToggleStatus(job); onClose(); }}
      >
        {job.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        {job.is_active ? 'Deactivate' : 'Activate'}
      </button>
      <button 
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-600" 
        onClick={() => { onDelete(job); onClose(); }}
      >
        <Trash2 className="w-4 h-4" />
        Delete Job
      </button>
    </div>,
    document.body
  );
};

// ===== COMPONENTS/VIEW-JOB-MODAL.TSX =====
import { Building2, MapPin, Briefcase, Star, Calendar, DollarSign, Users, ExternalLink, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Job } from '../types/job';

interface ViewJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewJobModal = ({ job, isOpen, onClose }: ViewJobModalProps) => {
  if (!job) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Job Details" size="xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                  {job.featured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600">{job.company}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{job.country} {job.location && `• ${job.location}`}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    job.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {job.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {job.type}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-slate-900">{job.years_experience}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-slate-900">{job.salary_range || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Posted Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-900">{formatDate(job.posted_at || job.created_at)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expires</label>
              <span className="text-slate-900">{job.expires_at ? formatDate(job.expires_at) : 'No expiration'}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact</label>
              <div className="flex items-center gap-3">
                {job.application_url && (
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Online
                  </a>
                )}
                {job.application_email && (
                  <a
                    href={`mailto:${job.application_email}`}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {job.description && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-line">{job.description}</p>
            </div>
          </div>
        )}

        {/* Requirements Section */}
        {job.requirements && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Requirements</label>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-line">{job.requirements}</p>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {job.benefits && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Benefits</label>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-line">{job.benefits}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ===== COMPONENTS/EDIT-JOB-MODAL.TSX =====
import { useEffect, useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Job } from '../types/job';

interface EditJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Job, formData: Partial<Job>) => void;
}

export const EditJobModal = ({ job, isOpen, onClose, onSave }: EditJobModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    country: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
    salary_range: '',
    benefits: '',
    application_url: '',
    application_email: '',
    years_experience: '',
    expires_at: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const jobTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
  const experienceLevels = ['entry-level', 'junior', 'mid-level', 'senior', 'lead', 'executive'];

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        country: job.country || '',
        location: job.location || '',
        type: job.type || '',
        description: job.description || '',
        requirements: job.requirements || '',
        salary_range: job.salary_range || '',
        benefits: job.benefits || '',
        application_url: job.application_url || '',
        application_email: job.application_email || '',
        years_experience: job.years_experience || '',
        expires_at: job.expires_at ? job.expires_at.split('T')[0] : ''
      });
    }
  }, [job]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (job && formData.title.trim()) {
      setShowConfirmation(true);
    }
  };

  const confirmSave = () => {
    if (job) {
      const updatedData = {
        ...formData,
        expires_at: formData.expires_at ? `${formData.expires_at}T23:59:59.999Z` : null
      };
      onSave(job, updatedData);
      setShowConfirmation(false);
      onClose();
    }
  };

  if (!job) return null;

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={() => setShowConfirmation(false)} title="Confirm Changes">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h4 className="text-lg font-semibold text-slate-800">Save Changes?</h4>
          <p className="text-slate-600">
            Are you sure you want to update this job posting?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job" size="xl">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter job title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter country"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter specific location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expires On</label>
            <input
              type="date"
              value={formData.expires_at}
              onChange={(e) => handleChange('expires_at', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
            <select
              value={formData.years_experience}
              onChange={(e) => handleChange('years_experience', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select level</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
            <input
              type="text"
              value={formData.salary_range}
              onChange={(e) => handleChange('salary_range', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., $50k - $70k"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application URL</label>
            <input
              type="url"
              value={formData.application_url}
              onChange={(e) => handleChange('application_url', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Email</label>
            <input
              type="email"
              value={formData.application_email}
              onChange={(e) => handleChange('application_email', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="jobs@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the job role and responsibilities..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Requirements</label>
          <textarea
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="List the job requirements and qualifications..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Benefits</label>
          <textarea
            value={formData.benefits}
            onChange={(e) => handleChange('benefits', e.target.value)}
            rows={3}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="List the benefits and perks..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== COMPONENTS/DELETE-JOB-MODAL.TSX =====
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Job } from '../types/job';

interface DeleteJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (job: Job) => void;
}

export const DeleteJobModal = ({ job, isOpen, onClose, onConfirm }: DeleteJobModalProps) => {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Job">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h4 className="text-lg font-semibold text-slate-800">Delete Job Posting?</h4>
        <div className="text-left bg-slate-50 p-4 rounded-lg">
          <p className="font-medium text-slate-800">{job.title}</p>
          <p className="text-sm text-slate-600">{job.company}</p>
        </div>
        <p className="text-slate-600">
          Are you sure you want to delete this job posting? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(job)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Job
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== COMPONENTS/TOGGLE-STATUS-MODAL.TSX =====
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Job } from '../types/job';

interface ToggleStatusModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (job: Job) => void;
}

export const ToggleStatusModal = ({ job, isOpen, onClose, onConfirm }: ToggleStatusModalProps) => {
  if (!job) return null;

  const isActivating = !job.is_active;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isActivating ? "Activate Job" : "Deactivate Job"}>
      <div className="text-center space-y-4">
        <AlertTriangle className={`w-12 h-12 mx-auto ${isActivating ? 'text-green-500' : 'text-orange-500'}`} />
        <h4 className="text-lg font-semibold text-slate-800">
          {isActivating ? 'Activate Job?' : 'Deactivate Job?'}
        </h4>
        <div className="text-left bg-slate-50 p-4 rounded-lg">
          <p className="font-medium text-slate-800">{job.title}</p>
          <p className="text-sm text-slate-600">{job.company}</p>
        </div>
        <p className="text-slate-600">
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'} this job posting?
          {!isActivating && ' This will hide it from public view.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(job)}
            className={`px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center gap-2 ${
              isActivating ? 'bg-green-600' : 'bg-orange-600'
            }`}
          >
            {isActivating ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {isActivating ? 'Activate Job' : 'Deactivate Job'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== TYPES/JOB.TS =====
export interface Job {
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

export interface FilterState {
  search: string;
  is_active: string;
  type: string;
  featured: string;
  country: string;
  years_experience: string;
}

// ===== MAIN COMPONENT: JOBS-TABLE.TSX =====
import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  Mail,
  ExternalLink,
  X,
  MoreVertical
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Import all the components (you'll need to adjust paths based on your structure)
// import { Modal } from