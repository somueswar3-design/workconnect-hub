import { FreelancerStats, InterestFormData } from '@/types/project';
import { WorkerProfile } from '@/types/profile';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7167';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Assignment DTO from backend
export interface AssignmentDto {
  projectId: number;
  projectName: string;
  clientId: number;
  clientName: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

// Get freelancer profile data
export const getFreelancerProfile = async (userId: string): Promise<any | null> => {
  const res = await fetch(`${API_BASE}/api/freelancer/profile?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
};

// Check if freelancer profile is updated
export const getProfileStatus = async (userId: string): Promise<{ profileUpdated: boolean }> => {
  const res = await fetch(`${API_BASE}/api/freelancer/profile-status?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch profile status');
  return res.json();
};

// Get assignments for a freelancer
export const getAssignments = async (userId: string): Promise<AssignmentDto[]> => {
  const res = await fetch(`${API_BASE}/api/freelancer/assignments?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
};

// Earnings DTO from backend
export interface EarningsDto {
  currency: string;
  earnedAmount: number;
}

// Get freelancer earnings
export const getFreelancerEarnings = async (userId: string): Promise<EarningsDto> => {
  const res = await fetch(`${API_BASE}/api/freelancer/earnings?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch earnings');
  return res.json();
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Update freelancer availability status
export const updateFreelancerStatus = async (
  isActive: boolean
): Promise<{ success: boolean; message: string }> => {
  await delay(400);
  return {
    success: true,
    message: isActive ? 'Status set to Active - You can receive new work' : 'Status set to Inactive - Not accepting new work',
  };
};

// Submit interest form
export const submitInterestForm = async (data: InterestFormData): Promise<{ success: boolean; message: string }> => {
  await delay(600);
  console.log('Interest form submitted:', data);
  return {
    success: true,
    message: 'Your interest has been submitted! The worker will be notified.',
  };
};

// Get masked contact info for browse view
export const getMaskedProfile = (profile: WorkerProfile): WorkerProfile => {
  const lastTwo = profile.mobile.replace(/\D/g, '').slice(-2);
  return {
    ...profile,
    email: '******@****.com',
    mobile: `XXXXXXXX${lastTwo}`,
  };
};
