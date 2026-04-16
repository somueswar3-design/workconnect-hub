import { WorkerProfile } from '@/types/profile';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://support360api-gnbxffdbdvemcjan.canadacentral-01.azurewebsites.net';

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

// Client requirement response from GET API
export interface ClientRequirementResponse {
  id: number;
  title: string;
  description: string;
  skillsRequired: string;
  minExperience: number;
  budget: number;
  country: string;
  language: string;
  status: string;
  createdOn: string;
  updatedOn: string;
}

// GET client requirements (with userId for client role)
export const getClientRequirements = async (userId?: string): Promise<ClientRequirementResponse[]> => {
  const params = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${API_BASE}/api/client/requirements${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch requirements');
  return res.json();
};

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

// Request demo DTO (for POST) — matches backend DemoRequest entity
export interface RequestDemoDto {
  id: number;
  clientUserId: number;
  freelancerUserId: number;
  projectTitle: string;
  clientBudget: number;
  contactEmail: string;
  contactPhone: string;
  status: string;
  adminDescription?: string;
  createdOn: string;
}

// Demo request response DTO (from GET)
export interface DemoRequestResponse {
  demoId: number;
  freelancerId: number;
  freelancerName: string;
  clientUserId?: number;
  clientName?: string;
  contactEmail?: string;
  contactPhone?: string;
  projectTitle: string;
  budget: number;
  status: string;
  adminComments: string | null;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  timezone?: string | null;
  demoMeetingLink?: string | null;
  demoNotes?: string | null;
  clientFeedback?: string | null;
  freelancerFeedback?: string | null;
  declineReason?: string | null;
  requestedOn: string;
}

// Admin create assignment DTO
export interface CreateAssignmentDto {
  demoId: number;
  clientUserId: number;
  freelancerUserId: number;
  projectTitle: string;
  hourlyRate: number;
  totalHours?: number;
  status: string;
  adminComments?: string;
  monthlyCommitment?: number;
  advanceAmount?: number;
  pendingAmount?: number;
  nextPaymentDate?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  projectNotes?: string;
}

// POST create assignment from demo
export const createAssignment = async (data: CreateAssignmentDto): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/admin/assignments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create assignment');
};

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

// GET all demo requests (admin)
export const getAllDemoRequests = async (): Promise<DemoRequestResponse[]> => {
  const res = await fetch(`${API_BASE}/api/client/demo-requests`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch all demo requests');
  return res.json();
};

// Admin update demo request DTO
export interface UpdateDemoRequestDto {
  demoId: number;
  status: string;
  adminComments: string;
  scheduledDate?: string;
  scheduledTime?: string;
  timezone?: string;
  demoLink?: string;
}

// PUT update demo request (admin)
export const updateDemoRequest = async (data: UpdateDemoRequestDto): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/client/demo-requests/${data.demoId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update demo request');
};

// POST send demo link to client and freelancer
export const sendDemoLink = async (demoId: number, demoLink: string, scheduledDate: string, scheduledTime: string, timezone: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/client/demo-requests/${demoId}/send-link`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ demoId, demoLink, scheduledDate, scheduledTime, timezone }),
  });
  if (!res.ok) throw new Error('Failed to send demo link');
};

// Post client requirement DTO
export interface PostRequirementDto {
  id: number;
  clientUserId: number;
  mobileNumber: string;
  email: string;
  title: string;
  description: string;
  skillsRequired: string;
  minExperience: number;
  budget: number;
  country: string;
  language: string;
  status: string;
  allocatedFreelancerId: number;
  createdOn: string;
  updatedOn: string;
}

// POST client requirement
export const postRequirement = async (data: Partial<PostRequirementDto>): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/client/requirements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to post requirement');
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
