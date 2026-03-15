import { WorkerProfile } from '@/types/profile';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7167';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export interface HiredFreelancer {
  id: string;
  freelancerName: string;
  freelancerAlias: string;
  projectTitle: string;
  description: string;
  hiredDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'paused';
  hourlyRate: string;
  hoursWorked: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  rating?: number;
  skills: string[];
}

export interface ClientStats {
  totalSpent: number;
  paidAmount: number;
  pendingAmount: number;
  activeFreelancers: number;
  completedProjects: number;
  averageRating: number;
}

// Freelancer profile DTO from the filter API
export interface FreelancerProfileDto {
  freelancerId: number;
  id?: number;
  userId?: number;
  fullName: string;
  gender?: number;
  country: string;
  phoneNumber?: string;
  companyName?: string;
  experienceYears?: number;
  experience?: number;
  primarySkills: string;
  secondarySkills?: string;
  skillSetDesc?: string;
  anyFreelnacingExperience?: number;
  currentCompany?: string;
  currentCompanyRole?: string;
  languagesKnown: string;
  speakingLanguage?: string;
  hoursAvailablePerDay?: string;
  hourRate: string;
  isAvailbleInweeknds?: boolean;
  bioDescption?: string;
  linkedInProfile?: string;
  portfolioURL: string;
  freelancerUserStatus?: boolean;
  createdOn?: string;
  updatedOn?: string;
}

// Filter params for freelancer search
export interface FreelancerFilterParams {
  skill?: string;
  language?: string;
  country?: string;
  minExperience?: number;
}

// Get all freelancer profiles for client browse
export const getFreelancerProfiles = async (): Promise<FreelancerProfileDto[]> => {
  const res = await fetch(`${API_BASE}/api/freelancer/profiles`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch freelancer profiles');
  return res.json();
};

// Get filtered freelancer profiles
export const getFilteredFreelancers = async (filters: FreelancerFilterParams): Promise<FreelancerProfileDto[]> => {
  const params = new URLSearchParams();
  if (filters.skill) params.append('skill', filters.skill);
  if (filters.language) params.append('language', filters.language);
  if (filters.country) params.append('country', filters.country);
  if (filters.minExperience !== undefined) params.append('minExperience', String(filters.minExperience));
  const res = await fetch(`${API_BASE}/api/client/freelancers/filter?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch filtered freelancers');
  return res.json();
};

// Request demo DTO (for POST)
export interface RequestDemoDto {
  id: number;
  clientId: number;
  freelancerId: number;
  projectTitle: string;
  description: string;
  clientBudget: number;
  contactEmail: string;
  contactPhone: string;
  status: string;
  adminComments: string;
  createdOn: string;
}

// Demo request response DTO (from GET)
export interface DemoRequestResponse {
  demoId: number;
  freelancerId: number;
  freelancerName: string;
  projectTitle: string;
  budget: number;
  status: string;
  adminComments: string | null;
  requestedOn: string;
}

// POST request demo
export const requestDemo = async (data: RequestDemoDto): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/client/request-demo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit demo request');
};

// GET demo requests for a client
export const getDemoRequests = async (userId: string): Promise<DemoRequestResponse[]> => {
  const res = await fetch(`${API_BASE}/api/client/demo-requests?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch demo requests');
  return res.json();
};

// Get hired freelancers for a client
export const getHiredFreelancers = async (): Promise<HiredFreelancer[]> => {
  return [];
};

// Get client statistics
export const getClientStats = async (): Promise<ClientStats> => {
  return {
    totalSpent: 0, paidAmount: 0, pendingAmount: 0,
    activeFreelancers: 0, completedProjects: 0, averageRating: 0,
  };
};
