import { WorkerProfile, ProfileFormData } from '@/types/profile';

// Mock database
let profiles: WorkerProfile[] = [
  {
    id: '1',
    aliasName: 'TechWizard',
    email: 'tech@example.com',
    mobile: '+1-555-0101',
    companyAlias: 'InnovateTech',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    experience: '5 years',
    location: 'San Francisco, CA',
    availability: 'available',
    hourlyRate: '$75',
    bio: 'Full-stack developer with expertise in modern web technologies.',
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
  },
  {
    id: '2',
    aliasName: 'CodeNinja',
    email: 'ninja@example.com',
    mobile: '+1-555-0102',
    companyAlias: 'DevSquad',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    experience: '7 years',
    location: 'Austin, TX',
    availability: 'available',
    hourlyRate: '$85',
    bio: 'Backend specialist focused on scalable systems.',
    createdAt: new Date('2024-02-20'),
    lastActive: new Date(),
  },
  {
    id: '3',
    aliasName: 'DesignPro',
    email: 'design@example.com',
    mobile: '+1-555-0103',
    companyAlias: 'CreativeHub',
    skills: ['UI/UX', 'Figma', 'CSS', 'Tailwind'],
    experience: '4 years',
    location: 'New York, NY',
    availability: 'busy',
    hourlyRate: '$65',
    bio: 'UI/UX designer with a passion for beautiful interfaces.',
    createdAt: new Date('2024-03-10'),
    lastActive: new Date(Date.now() - 3600000),
  },
  {
    id: '4',
    aliasName: 'CloudMaster',
    email: 'cloud@example.com',
    mobile: '+1-555-0104',
    companyAlias: 'SkyTech',
    skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform'],
    experience: '6 years',
    location: 'Seattle, WA',
    availability: 'available',
    hourlyRate: '$95',
    bio: 'Cloud architect specializing in enterprise solutions.',
    createdAt: new Date('2024-01-25'),
    lastActive: new Date(),
  },
  {
    id: '5',
    aliasName: 'DataGuru',
    email: 'data@example.com',
    mobile: '+1-555-0105',
    companyAlias: 'AnalyticsFirst',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    experience: '8 years',
    location: 'Boston, MA',
    availability: 'offline',
    hourlyRate: '$110',
    bio: 'Data scientist with ML expertise.',
    createdAt: new Date('2024-02-05'),
    lastActive: new Date(Date.now() - 86400000),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Parse resume content (mock implementation)
export const parseResume = async (file: File): Promise<Partial<ProfileFormData>> => {
  await delay(1500);
  
  // Mock parsed data based on file name patterns
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('senior') || fileName.includes('lead')) {
    return {
      experience: '8+ years',
      skills: 'React, TypeScript, Node.js, AWS, Team Leadership',
      bio: 'Experienced senior developer with leadership skills.',
    };
  }
  
  if (fileName.includes('frontend') || fileName.includes('ui')) {
    return {
      experience: '4 years',
      skills: 'React, Vue.js, CSS, Tailwind, Figma',
      bio: 'Frontend developer passionate about user experience.',
    };
  }
  
  if (fileName.includes('backend') || fileName.includes('api')) {
    return {
      experience: '5 years',
      skills: 'Node.js, Python, PostgreSQL, Redis, Docker',
      bio: 'Backend developer focused on scalable APIs.',
    };
  }
  
  // Default parsed data
  return {
    experience: '3 years',
    skills: 'JavaScript, React, Node.js, SQL',
    bio: 'Dedicated developer ready for new challenges.',
  };
};

// Get all profiles
export const getProfiles = async (): Promise<WorkerProfile[]> => {
  await delay(500);
  return [...profiles];
};

// Get available profiles only
export const getAvailableProfiles = async (): Promise<WorkerProfile[]> => {
  await delay(500);
  return profiles.filter(p => p.availability === 'available');
};

// Get profile by ID
export const getProfileById = async (id: string): Promise<WorkerProfile | null> => {
  await delay(300);
  return profiles.find(p => p.id === id) || null;
};

// Create new profile
export const createProfile = async (data: ProfileFormData): Promise<WorkerProfile> => {
  await delay(800);
  
  const newProfile: WorkerProfile = {
    id: String(Date.now()),
    aliasName: data.aliasName,
    email: data.email,
    mobile: data.mobile,
    companyAlias: data.companyAlias,
    skills: data.skills.split(',').map(s => s.trim()),
    experience: data.experience,
    location: data.location,
    availability: 'available',
    hourlyRate: data.hourlyRate,
    bio: data.bio,
    resumeUrl: data.resume ? URL.createObjectURL(data.resume) : undefined,
    createdAt: new Date(),
    lastActive: new Date(),
  };
  
  profiles.push(newProfile);
  return newProfile;
};

// Update profile
export const updateProfile = async (id: string, data: Partial<ProfileFormData>): Promise<WorkerProfile | null> => {
  await delay(600);
  
  const index = profiles.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  profiles[index] = {
    ...profiles[index],
    ...data,
    skills: data.skills ? data.skills.split(',').map(s => s.trim()) : profiles[index].skills,
    lastActive: new Date(),
  };
  
  return profiles[index];
};

// Update availability status
export const updateAvailability = async (id: string, availability: WorkerProfile['availability']): Promise<WorkerProfile | null> => {
  await delay(300);
  
  const index = profiles.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  profiles[index] = {
    ...profiles[index],
    availability,
    lastActive: new Date(),
  };
  
  return profiles[index];
};

// Delete profile
export const deleteProfile = async (id: string): Promise<boolean> => {
  await delay(400);
  
  const index = profiles.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  profiles.splice(index, 1);
  return true;
};

// Search profiles
export const searchProfiles = async (query: string): Promise<WorkerProfile[]> => {
  await delay(400);
  
  const lowerQuery = query.toLowerCase();
  return profiles.filter(p => 
    p.aliasName.toLowerCase().includes(lowerQuery) ||
    p.skills.some(s => s.toLowerCase().includes(lowerQuery)) ||
    p.location.toLowerCase().includes(lowerQuery)
  );
};
