export interface AssignedProject {
  id: string;
  clientName: string;
  clientCompany: string;
  projectTitle: string;
  description: string;
  assignedDate: Date;
  dueDate?: Date;
  status: 'active' | 'completed' | 'paused';
  hourlyRate: string;
  hoursWorked: number;
  totalAmount: number;
  settledAmount: number;
  pendingAmount: number;
  rating?: number;
  feedback?: string;
}

export interface FreelancerStats {
  totalEarnings: number;
  settledAmount: number;
  pendingAmount: number;
  activeProjects: number;
  completedProjects: number;
  averageRating: number;
  totalClients: number;
}

export interface InterestFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferredHourlyRate?: string;
  workerId: string;
}
