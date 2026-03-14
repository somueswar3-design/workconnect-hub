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

// Freelancer profile DTO from the browse API
export interface FreelancerProfileDto {
  id: number;
  userId: number;
  fullName: string;
  gender: number;
  country: string;
  phoneNumber: string;
  companyName: string;
  experienceYears: number;
  primarySkills: string;
  secondarySkills: string;
  skillSetDesc: string;
  anyFreelnacingExperience: number;
  currentCompany: string;
  currentCompanyRole: string;
  languagesKnown: string;
  speakingLanguage: string;
  hoursAvailablePerDay: string;
  hourRate: string;
  isAvailbleInweeknds: boolean;
  bioDescption: string;
  linkedInProfile: string;
  portfolioURL: string;
  freelancerUserStatus: boolean;
  createdOn: string;
  updatedOn: string;
}

// Get all freelancer profiles for client browse
export const getFreelancerProfiles = async (): Promise<FreelancerProfileDto[]> => {
  const res = await fetch(`${API_BASE}/api/freelancer/profiles`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch freelancer profiles');
  return res.json();
};

// Get hired freelancers for a client
export const getHiredFreelancers = async (): Promise<HiredFreelancer[]> => {
  // TODO: Replace with real API
  return [];
};

// Get client statistics
export const getClientStats = async (): Promise<ClientStats> => {
  return {
    totalSpent: 0,
    paidAmount: 0,
    pendingAmount: 0,
    activeFreelancers: 0,
    completedProjects: 0,
    averageRating: 0,
  };
};
