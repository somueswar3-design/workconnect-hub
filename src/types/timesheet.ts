export interface TimesheetEntry {
  date: string; // YYYY-MM-DD
  hours: number;
  notes?: string;
}

export interface Timesheet {
  id: string;
  assignmentId: number;
  freelancerUserId: number;
  freelancerName: string;
  clientUserId: number;
  clientName: string;
  projectTitle: string;
  month: number; // 1-12
  year: number;
  entries: TimesheetEntry[];
  totalHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedOn?: string;
  reviewedOn?: string;
  clientComments?: string;
  freelancerNotes?: string;
}
