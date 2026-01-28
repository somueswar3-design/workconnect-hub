export interface WorkerProfile {
  id: string;
  aliasName: string;
  email: string;
  mobile: string;
  companyAlias: string;
  skills: string[];
  experience: string;
  location: string;
  availability: 'available' | 'busy' | 'offline';
  hourlyRate: string;
  bio: string;
  resumeUrl?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface ProfileFormData {
  aliasName: string;
  email: string;
  mobile: string;
  companyAlias: string;
  skills: string;
  experience: string;
  location: string;
  hourlyRate: string;
  bio: string;
  resume?: File;
}
