import { AssignedProject, FreelancerStats, InterestFormData } from '@/types/project';
import { WorkerProfile } from '@/types/profile';

// Mock assigned projects for freelancers
const assignedProjects: AssignedProject[] = [
  {
    id: '1',
    clientName: 'TechCorp Inc',
    clientCompany: 'TechCorp Solutions',
    projectTitle: 'E-commerce Platform Support',
    description: 'Provide technical support for React-based e-commerce platform',
    assignedDate: new Date('2024-01-10'),
    dueDate: new Date('2024-03-15'),
    status: 'active',
    hourlyRate: '$75',
    hoursWorked: 45,
    totalAmount: 3375,
    settledAmount: 2000,
    pendingAmount: 1375,
    rating: 4.5,
    feedback: 'Great communication and technical skills',
  },
  {
    id: '2',
    clientName: 'StartupX',
    clientCompany: 'StartupX Labs',
    projectTitle: 'API Integration Project',
    description: 'Integrate third-party APIs into existing Node.js backend',
    assignedDate: new Date('2024-02-01'),
    status: 'active',
    hourlyRate: '$85',
    hoursWorked: 28,
    totalAmount: 2380,
    settledAmount: 1500,
    pendingAmount: 880,
  },
  {
    id: '3',
    clientName: 'DataFlow',
    clientCompany: 'DataFlow Analytics',
    projectTitle: 'Dashboard Development',
    description: 'Build analytics dashboard with charts and reports',
    assignedDate: new Date('2023-11-15'),
    dueDate: new Date('2024-01-30'),
    status: 'completed',
    hourlyRate: '$80',
    hoursWorked: 60,
    totalAmount: 4800,
    settledAmount: 4800,
    pendingAmount: 0,
    rating: 5,
    feedback: 'Excellent work! Delivered on time with great quality.',
  },
  {
    id: '4',
    clientName: 'CloudBase',
    clientCompany: 'CloudBase Systems',
    projectTitle: 'AWS Migration Support',
    description: 'Help migrate infrastructure to AWS',
    assignedDate: new Date('2023-10-01'),
    dueDate: new Date('2023-12-20'),
    status: 'completed',
    hourlyRate: '$95',
    hoursWorked: 80,
    totalAmount: 7600,
    settledAmount: 7600,
    pendingAmount: 0,
    rating: 4.8,
    feedback: 'Very knowledgeable about AWS services',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get assigned projects for a freelancer
export const getAssignedProjects = async (): Promise<AssignedProject[]> => {
  await delay(500);
  return [...assignedProjects];
};

// Get freelancer statistics
export const getFreelancerStats = async (): Promise<FreelancerStats> => {
  await delay(300);
  
  const totalEarnings = assignedProjects.reduce((sum, p) => sum + p.totalAmount, 0);
  const settledAmount = assignedProjects.reduce((sum, p) => sum + p.settledAmount, 0);
  const pendingAmount = assignedProjects.reduce((sum, p) => sum + p.pendingAmount, 0);
  const activeProjects = assignedProjects.filter(p => p.status === 'active').length;
  const completedProjects = assignedProjects.filter(p => p.status === 'completed').length;
  const ratedProjects = assignedProjects.filter(p => p.rating);
  const averageRating = ratedProjects.length > 0 
    ? ratedProjects.reduce((sum, p) => sum + (p.rating || 0), 0) / ratedProjects.length 
    : 0;
  const totalClients = new Set(assignedProjects.map(p => p.clientName)).size;
  
  return {
    totalEarnings,
    settledAmount,
    pendingAmount,
    activeProjects,
    completedProjects,
    averageRating,
    totalClients,
  };
};

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

// Submit interest form (mock - would send to admin)
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
  return {
    ...profile,
    email: profile.email.replace(/(.{2})(.*)(@.*)/, '$1****$3'),
    mobile: profile.mobile.replace(/(\+\d{1,3})-(\d{3})-(\d{4})/, '$1-***-$3').slice(0, -4) + '****',
  };
};
