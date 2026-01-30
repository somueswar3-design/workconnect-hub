import { WorkerProfile } from '@/types/profile';

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

// Mock hired freelancers for clients
const hiredFreelancers: HiredFreelancer[] = [
  {
    id: '1',
    freelancerName: 'Alex Johnson',
    freelancerAlias: 'alexj_dev',
    projectTitle: 'React Dashboard Development',
    description: 'Building analytics dashboard with real-time data visualization',
    hiredDate: new Date('2024-01-15'),
    status: 'active',
    hourlyRate: '$80',
    hoursWorked: 52,
    totalAmount: 4160,
    paidAmount: 3000,
    pendingAmount: 1160,
    skills: ['React', 'TypeScript', 'D3.js'],
  },
  {
    id: '2',
    freelancerName: 'Sarah Chen',
    freelancerAlias: 'sarah_backend',
    projectTitle: 'API Integration & Backend Support',
    description: 'Node.js backend development and third-party API integrations',
    hiredDate: new Date('2024-02-01'),
    status: 'active',
    hourlyRate: '$90',
    hoursWorked: 35,
    totalAmount: 3150,
    paidAmount: 2000,
    pendingAmount: 1150,
    skills: ['Node.js', 'PostgreSQL', 'REST APIs'],
  },
  {
    id: '3',
    freelancerName: 'Mike Brown',
    freelancerAlias: 'mike_cloud',
    projectTitle: 'AWS Infrastructure Setup',
    description: 'Cloud infrastructure setup and DevOps automation',
    hiredDate: new Date('2023-10-01'),
    endDate: new Date('2023-12-15'),
    status: 'completed',
    hourlyRate: '$100',
    hoursWorked: 80,
    totalAmount: 8000,
    paidAmount: 8000,
    pendingAmount: 0,
    rating: 5,
    skills: ['AWS', 'Terraform', 'Docker'],
  },
  {
    id: '4',
    freelancerName: 'Emily Davis',
    freelancerAlias: 'emily_mobile',
    projectTitle: 'Mobile App Development',
    description: 'React Native mobile application for iOS and Android',
    hiredDate: new Date('2023-08-15'),
    endDate: new Date('2023-11-30'),
    status: 'completed',
    hourlyRate: '$85',
    hoursWorked: 120,
    totalAmount: 10200,
    paidAmount: 10200,
    pendingAmount: 0,
    rating: 4.8,
    skills: ['React Native', 'iOS', 'Android'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get hired freelancers for a client
export const getHiredFreelancers = async (): Promise<HiredFreelancer[]> => {
  await delay(500);
  return [...hiredFreelancers];
};

// Get client statistics
export const getClientStats = async (): Promise<ClientStats> => {
  await delay(300);
  
  const totalSpent = hiredFreelancers.reduce((sum, f) => sum + f.totalAmount, 0);
  const paidAmount = hiredFreelancers.reduce((sum, f) => sum + f.paidAmount, 0);
  const pendingAmount = hiredFreelancers.reduce((sum, f) => sum + f.pendingAmount, 0);
  const activeFreelancers = hiredFreelancers.filter(f => f.status === 'active').length;
  const completedProjects = hiredFreelancers.filter(f => f.status === 'completed').length;
  const ratedProjects = hiredFreelancers.filter(f => f.rating);
  const averageRating = ratedProjects.length > 0 
    ? ratedProjects.reduce((sum, f) => sum + (f.rating || 0), 0) / ratedProjects.length 
    : 0;
  
  return {
    totalSpent,
    paidAmount,
    pendingAmount,
    activeFreelancers,
    completedProjects,
    averageRating,
  };
};
