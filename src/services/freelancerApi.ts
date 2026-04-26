import { FreelancerStats, InterestFormData } from '@/types/project';
import { WorkerProfile } from '@/types/profile';
import { API_BASE_URL as API_BASE } from '@/config/api';

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

// Save/update freelancer profile
export const saveFreelancerProfile = async (payload: any): Promise<any> => {
  const url = `${API_BASE}/api/freelancer/profile`;
  console.log('[freelancerApi] POST', url, payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  console.log('[freelancerApi] response status', res.status);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[freelancerApi] save failed', res.status, errText);
    throw new Error(`Failed to save profile (${res.status}): ${errText || res.statusText}`);
  }
  return res.json();
};

// Calculate profile completion percentage from profile data
export const calculateProfilePercentage = (data: any): number => {
  if (!data) return 0;
  const fields = [
    'fullName', 'gender', 'country', 'phoneNumber',
    'primarySkills', 'skillSetDesc', 'experienceYears',
    'anyFreelancingExperience', 'languagesKnown', 'speakingLanguage',
    'hoursAvailablePerDay', 'hourRate', 'bioDescription',
    'linkedInProfile', 'portfolioURL',
  ];
  const filled = fields.filter(f => {
    const val = data[f];
    if (typeof val === 'number') return true;
    return val && String(val).trim().length > 0;
  });
  return Math.round((filled.length / fields.length) * 100);
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

// Job Opening DTO from backend
export interface JobOpeningDto {
  id: number;
  title: string;
  clientName: string;
  description: string;
  skills: string[];
  budget: string;
  currency: string;
  duration: string;
  location: string;
  postedDate: string;
  deadline: string | null;
  status: string;
  applicants: number;
}

// Get freelancing openings/requirements posted by clients
export const getJobOpenings = async (userId: string): Promise<JobOpeningDto[]> => {
  const res = await fetch(`${API_BASE}/api/freelancer/openings?userId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch openings');
  return res.json();
};

// Interest requirement details from GET response
export interface InterestRequirementDto {
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
}

// Interest DTO for GET response
export interface FreelancerInterestResponseDto {
  interestId: number;
  freelancerUserId: number;
  requirementId: number;
  status: string;
  createdOn: string;
  requirement: InterestRequirementDto;
}

// Interest DTO for POST
export interface FreelancerInterestDto {
  id: number;
  requirementId: number;
  freelancerUserId: number;
  comment: string;
  status: string;
  createdOn: string;
}

// GET freelancer interests
export const getFreelancerInterests = async (userId: string): Promise<FreelancerInterestResponseDto[]> => {
  const res = await fetch(`${API_BASE}/api/freelancer/interest/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch interests');
  return res.json();
};

// POST freelancer interest on a requirement
export const submitFreelancerInterest = async (data: Partial<FreelancerInterestDto>): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/freelancer/interest`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit interest');
};

// Submit interest form (legacy)
export const submitInterestForm = async (data: InterestFormData): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
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

// Demo request response DTO for freelancer view
export interface FreelancerDemoRequestDto {
  demoId: number;
  clientUserId: number;
  clientName: string;
  projectTitle: string;
  budget: number;
  status: string;
  adminComments: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  timezone: string | null;
  demoMeetingLink: string | null;
  requestedOn: string;
}

// GET demo requests assigned to a freelancer
export const getFreelancerDemoRequests = async (userId: string): Promise<FreelancerDemoRequestDto[]> => {
  const res = await fetch(`${API_BASE}/api/client/demo-requests?freelancerUserId=${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch demo requests');
  return res.json();
};

// =====================================================
// PORTFOLIO PROJECTS
// =====================================================

export interface PortfolioScreenshotDto {
  id: number;
  portfolioId: number;
  url: string;
  fileName?: string;
}

export interface PortfolioProjectDto {
  id: number;
  freelancerUserId: number;
  title: string;
  description: string;
  projectUrl?: string;
  techStack?: string;
  screenshots: PortfolioScreenshotDto[];
  createdOn?: string;
}

// Auth headers WITHOUT content-type (browser sets multipart boundary automatically)
const getAuthHeadersMultipart = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// GET all portfolio projects for a freelancer
export const getPortfolioProjects = async (freelancerUserId: string | number): Promise<PortfolioProjectDto[]> => {
  const res = await fetch(`${API_BASE}/api/freelancer/portfolio?freelancerUserId=${freelancerUserId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// CREATE / UPDATE portfolio project (no files yet, returns saved with id)
export const savePortfolioProject = async (payload: Partial<PortfolioProjectDto>): Promise<PortfolioProjectDto> => {
  const res = await fetch(`${API_BASE}/api/freelancer/portfolio`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Failed to save portfolio (${res.status}): ${errText || res.statusText}`);
  }
  return res.json();
};

// DELETE portfolio project
export const deletePortfolioProject = async (portfolioId: number, freelancerUserId: string | number): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/freelancer/portfolio/${portfolioId}?freelancerUserId=${freelancerUserId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete portfolio project');
};

// UPLOAD a screenshot file (multipart/form-data) — backend stores under /{freelancerUserId}/{portfolioId}/
export const uploadPortfolioScreenshot = async (
  freelancerUserId: string | number,
  portfolioId: number,
  file: File,
): Promise<PortfolioScreenshotDto> => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('freelancerUserId', String(freelancerUserId));
  formData.append('portfolioId', String(portfolioId));

  const res = await fetch(`${API_BASE}/api/freelancer/portfolio/upload`, {
    method: 'POST',
    headers: getAuthHeadersMultipart(),
    body: formData,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${errText || res.statusText}`);
  }
  return res.json();
};

// DELETE a screenshot
export const deletePortfolioScreenshot = async (
  portfolioId: number,
  screenshotId: number,
  freelancerUserId: string | number,
): Promise<void> => {
  const res = await fetch(
    `${API_BASE}/api/freelancer/portfolio/${portfolioId}/screenshot/${screenshotId}?freelancerUserId=${freelancerUserId}`,
    { method: 'DELETE', headers: getAuthHeaders() },
  );
  if (!res.ok) throw new Error('Failed to delete screenshot');
};
