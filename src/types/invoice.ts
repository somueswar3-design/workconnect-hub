export interface Invoice {
  id: string;
  invoiceNumber: string;
  assignmentId: number;
  freelancerUserId: number;
  freelancerName: string;
  clientUserId: number;
  clientName: string;
  projectTitle: string;
  timesheetId: string;
  month: number;
  year: number;
  totalHours: number;
  hourlyRate: number;
  subtotal: number;
  platformFee: number; // 10%
  platformFeePercent: number;
  totalAmount: number;
  currency: string;
  currencySymbol: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'completed';
  paidAmount: number;
  bankDetailsId?: string;
  generatedOn: string;
  dueDate: string;
  paidOn?: string;
  notes?: string;
}

export interface BankDetails {
  id: string;
  freelancerUserId: number;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode?: string;
  branchName?: string;
  accountType: 'savings' | 'current';
  isDefault: boolean;
  createdOn: string;
  updatedOn: string;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'registration' | 'profile' | 'assignment' | 'timesheet' | 'invoice' | 'payment' | 'demo' | 'system';
  userId: number;
  userName: string;
  userRole: string;
  entityId?: string;
  entityType?: string;
  details: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface QuotationRequest {
  id: string;
  clientUserId: number;
  clientName: string;
  freelancerUserId: number;
  freelancerName: string;
  freelancerHourlyRate: string;
  clientOfferedRate: string;
  projectTitle: string;
  description?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'counter_offer';
  counterOfferRate?: string;
  createdOn: string;
  respondedOn?: string;
  notes?: string;
}

export interface FundTransfer {
  id: string;
  invoiceId: string;
  freelancerUserId: number;
  freelancerName: string;
  bankDetailsId: string;
  amount: number;
  currency: string;
  status: 'initiated' | 'processing' | 'completed' | 'failed';
  transactionRef?: string;
  initiatedOn: string;
  completedOn?: string;
  notes?: string;
}
