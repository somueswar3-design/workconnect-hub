import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Clock, DollarSign, CheckCircle2, XCircle, ChevronDown,
  LogOut, Briefcase, Search, Filter, ArrowRight, Video, Send, Loader2,
  Calendar, Globe, MessageSquare, ExternalLink, Edit, CreditCard, AlertCircle,
  RotateCcw, FileText, PlayCircle, ThumbsUp, ThumbsDown, UserPlus, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  getAllDemoRequests, updateDemoRequest, sendDemoLink, createAssignment,
  DemoRequestResponse, UpdateDemoRequestDto, CreateAssignmentDto,
  getFreelancerProfiles, FreelancerProfileDto
} from '@/services/clientApi';

// ─── Types ───
interface Assignment {
  id: string; professionalId: string; professionalName: string; clientId: string; clientName: string;
  projectTitle: string; hourlyRate: string; totalHours?: number;
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'completed';
  assignedDate: string; approvedDate?: string; totalAmount?: number;
  invoiceGenerated?: boolean; demoId?: number;
  monthlyCommitment?: number; advanceAmount?: number; pendingAmount?: number;
  nextPaymentDate?: string; projectStartDate?: string; projectEndDate?: string;
  projectNotes?: string;
}

interface BillingRecord {
  id: string; assignmentId: string; freelancerName: string; clientName: string;
  projectTitle: string; invoiceAmount: number; paidAmount: number; pendingAmount: number;
  commission: number; billingStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  followUpStatus: 'none' | 'reminder_sent' | 'escalated' | 'resolved';
  followUpNotes: string; invoiceDate: string; dueDate: string; lastFollowUp?: string;
}

// ─── Timezone Data ───
const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India (IST, UTC+5:30)' },
  { value: 'America/New_York', label: 'US Eastern (EST, UTC-5)' },
  { value: 'America/Chicago', label: 'US Central (CST, UTC-6)' },
  { value: 'America/Denver', label: 'US Mountain (MST, UTC-7)' },
  { value: 'America/Los_Angeles', label: 'US Pacific (PST, UTC-8)' },
  { value: 'Europe/London', label: 'UK (GMT, UTC+0)' },
  { value: 'Europe/Berlin', label: 'Europe Central (CET, UTC+1)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST, UTC+4)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT, UTC+8)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST, UTC+10)' },
  { value: 'Asia/Tokyo', label: 'Japan (JST, UTC+9)' },
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
];

const DEMO_STATUSES = ['Pending', 'Scheduled', 'Demo In Progress', 'Demo Completed', 'Approved', 'Declined', 'On Hold'];
const BILLING_STATUSES = ['pending', 'partial', 'paid', 'overdue'];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Assignments state
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Demo requests state
  const [demoRequests, setDemoRequests] = useState<DemoRequestResponse[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSearch, setDemoSearch] = useState('');
  const [demoFilterStatus, setDemoFilterStatus] = useState('all');

  // Billing state
  const [billing, setBilling] = useState<BillingRecord[]>([]);
  const [billingSearch, setBillingSearch] = useState('');
  const [billingFilterStatus, setBillingFilterStatus] = useState('all');
  const [billingUpdateOpen, setBillingUpdateOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);
  const [billingForm, setBillingForm] = useState({ billingStatus: '', followUpStatus: '', followUpNotes: '', paidAmount: 0 });
  const [billingUpdating, setBillingUpdating] = useState(false);

  // Schedule dialog
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<DemoRequestResponse | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    timezone: 'Asia/Kolkata', scheduledDate: '', scheduledTime: '',
    demoLink: '', adminComments: '', status: 'Scheduled',
  });
  const [scheduleSending, setScheduleSending] = useState(false);

  // Update status dialog
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateDemo, setUpdateDemo] = useState<DemoRequestResponse | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '', adminComments: '', declineReason: '',
    clientFeedback: '', freelancerFeedback: '', demoNotes: '',
  });
  const [updateSending, setUpdateSending] = useState(false);

  // Demo detail view
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDemo, setDetailDemo] = useState<DemoRequestResponse | null>(null);

  // Create assignment dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignDemo, setAssignDemo] = useState<DemoRequestResponse | null>(null);
  const [assignForm, setAssignForm] = useState({
    hourlyRate: '', totalHours: '', adminComments: '', selectedFreelancerId: 0,
    monthlyCommitment: '', advanceAmount: '', projectStartDate: '', projectEndDate: '', projectNotes: '',
  });
  const [assignSending, setAssignSending] = useState(false);
  const [freelancerList, setFreelancerList] = useState<FreelancerProfileDto[]>([]);
  const [freelancerListLoading, setFreelancerListLoading] = useState(false);

  // Assign project to freelancer dialog
  const [assignProjectOpen, setAssignProjectOpen] = useState(false);
  const [assignProjectTarget, setAssignProjectTarget] = useState<Assignment | null>(null);
  const [assignProjectForm, setAssignProjectForm] = useState({
    selectedFreelancerId: 0, projectStartDate: '', projectEndDate: '', status: 'active' as string,
  });
  const [assignProjectSending, setAssignProjectSending] = useState(false);

  // ─── Fetch demo requests ───
  const loadDemoRequests = async () => {
    setDemoLoading(true);
    try {
      const data = await getAllDemoRequests();
      setDemoRequests(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load demo requests', variant: 'destructive' });
    } finally {
      setDemoLoading(false);
    }
  };

  useEffect(() => { loadDemoRequests(); }, []);

  // ─── Assignment Handlers ───
  const handleApprove = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] } : a));
    toast({ title: 'Approved', description: 'Assignment approved.' });
  };
  const handleReject = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    toast({ title: 'Rejected', description: 'Assignment rejected.' });
  };
  const handleStartPayment = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
    toast({ title: 'Payment Started' });
  };

  // ─── Billing Handlers ───
  const openBillingUpdate = (record: BillingRecord) => {
    setSelectedBilling(record);
    setBillingForm({ billingStatus: record.billingStatus, followUpStatus: record.followUpStatus, followUpNotes: record.followUpNotes, paidAmount: record.paidAmount });
    setBillingUpdateOpen(true);
  };
  const handleBillingUpdate = () => {
    if (!selectedBilling) return;
    setBillingUpdating(true);
    setTimeout(() => {
      setBilling(prev => prev.map(b => b.id === selectedBilling.id ? {
        ...b, billingStatus: billingForm.billingStatus as BillingRecord['billingStatus'],
        followUpStatus: billingForm.followUpStatus as BillingRecord['followUpStatus'],
        followUpNotes: billingForm.followUpNotes, paidAmount: billingForm.paidAmount,
        pendingAmount: b.invoiceAmount - billingForm.paidAmount,
        lastFollowUp: new Date().toISOString().split('T')[0],
      } : b));
      toast({ title: '✅ Billing Updated' });
      setBillingUpdateOpen(false);
      setBillingUpdating(false);
    }, 500);
  };

  // ─── Demo Schedule Handler ───
  const handleScheduleDemo = async () => {
    if (!selectedDemo) return;
    if (!scheduleForm.scheduledDate || !scheduleForm.scheduledTime || !scheduleForm.demoLink) {
      toast({ title: 'Missing Fields', description: 'Please fill date, time and demo link.', variant: 'destructive' });
      return;
    }
    setScheduleSending(true);
    try {
      await updateDemoRequest({
        demoId: selectedDemo.demoId, status: scheduleForm.status,
        adminComments: scheduleForm.adminComments, scheduledDate: scheduleForm.scheduledDate,
        scheduledTime: scheduleForm.scheduledTime, timezone: scheduleForm.timezone,
        demoLink: scheduleForm.demoLink,
      });
      await sendDemoLink(selectedDemo.demoId, scheduleForm.demoLink, scheduleForm.scheduledDate, scheduleForm.scheduledTime, scheduleForm.timezone);
      toast({ title: '✅ Demo Scheduled & Link Sent!', description: `Meeting invitation sent to both client and professional.` });
      setScheduleOpen(false);
      loadDemoRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to schedule demo.', variant: 'destructive' });
    } finally {
      setScheduleSending(false);
    }
  };

  // ─── Update Status Handler (enhanced) ───
  const handleUpdateStatus = async () => {
    if (!updateDemo) return;
    setUpdateSending(true);
    try {
      const comments = [
        updateForm.adminComments,
        updateForm.demoNotes ? `[Demo Notes] ${updateForm.demoNotes}` : '',
        updateForm.clientFeedback ? `[Client Feedback] ${updateForm.clientFeedback}` : '',
        updateForm.freelancerFeedback ? `[Freelancer Feedback] ${updateForm.freelancerFeedback}` : '',
        updateForm.declineReason ? `[Decline Reason] ${updateForm.declineReason}` : '',
      ].filter(Boolean).join('\n');

      await updateDemoRequest({
        demoId: updateDemo.demoId,
        status: updateForm.status,
        adminComments: comments,
      });
      toast({ title: '✅ Status Updated', description: `Demo #${updateDemo.demoId} updated to "${updateForm.status}".` });
      setUpdateOpen(false);
      loadDemoRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } finally {
      setUpdateSending(false);
    }
  };

  // ─── Create Assignment Handler ───
  const handleCreateAssignment = async () => {
    if (!assignDemo) return;
    if (!assignForm.hourlyRate) {
      toast({ title: 'Missing Fields', description: 'Hourly rate is required.', variant: 'destructive' });
      return;
    }
    setAssignSending(true);
    try {
      const freelancerUserId = assignForm.selectedFreelancerId || assignDemo.freelancerId;
      const monthlyCommitment = Number(assignForm.monthlyCommitment) || 0;
      const advanceAmount = Number(assignForm.advanceAmount) || 0;
      const pendingAmount = monthlyCommitment > 0 ? monthlyCommitment - advanceAmount : 0;

      // Calculate next payment date (30 days from start or today)
      const startDate = assignForm.projectStartDate || new Date().toISOString().split('T')[0];
      const nextPayment = new Date(startDate);
      nextPayment.setDate(nextPayment.getDate() + 30);
      const nextPaymentDate = nextPayment.toISOString().split('T')[0];

      await createAssignment({
        demoId: assignDemo.demoId,
        clientUserId: assignDemo.clientUserId || 0,
        freelancerUserId,
        projectTitle: assignDemo.projectTitle,
        hourlyRate: Number(assignForm.hourlyRate),
        totalHours: assignForm.totalHours ? Number(assignForm.totalHours) : undefined,
        status: 'active',
        adminComments: assignForm.adminComments,
        monthlyCommitment,
        advanceAmount,
        pendingAmount,
        nextPaymentDate,
        projectStartDate: assignForm.projectStartDate || undefined,
        projectEndDate: assignForm.projectEndDate || undefined,
        projectNotes: assignForm.projectNotes || undefined,
      });

      // Also add to local assignments list
      const newAssignment: Assignment = {
        id: `a-${Date.now()}`,
        professionalId: String(freelancerUserId),
        professionalName: freelancerList.find(f => (f.freelancerId || f.id) === freelancerUserId)?.fullName || assignDemo.freelancerName || 'Professional',
        clientId: String(assignDemo.clientUserId || ''),
        clientName: assignDemo.clientName || 'Client',
        projectTitle: assignDemo.projectTitle,
        hourlyRate: `₹${assignForm.hourlyRate}`,
        totalHours: assignForm.totalHours ? Number(assignForm.totalHours) : 0,
        status: 'active',
        assignedDate: assignForm.projectStartDate || new Date().toISOString().split('T')[0],
        demoId: assignDemo.demoId,
        totalAmount: monthlyCommitment,
        monthlyCommitment,
        advanceAmount,
        pendingAmount,
        nextPaymentDate,
        projectStartDate: assignForm.projectStartDate || new Date().toISOString().split('T')[0],
        projectEndDate: assignForm.projectEndDate,
        projectNotes: assignForm.projectNotes,
      };
      setAssignments(prev => [...prev, newAssignment]);

      toast({ title: '✅ Project Created!', description: `Project "${assignDemo.projectTitle}" has been created with ₹${monthlyCommitment.toLocaleString()}/month commitment.` });
      setAssignOpen(false);
      loadDemoRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to create assignment.', variant: 'destructive' });
    } finally {
      setAssignSending(false);
    }
  };

  // ─── Assign Project to Freelancer ───
  const openAssignProject = async (assignment: Assignment) => {
    setAssignProjectTarget(assignment);
    setAssignProjectForm({
      selectedFreelancerId: Number(assignment.professionalId) || 0,
      projectStartDate: assignment.projectStartDate || '',
      projectEndDate: assignment.projectEndDate || '',
      status: assignment.status,
    });
    setAssignProjectOpen(true);
    setFreelancerListLoading(true);
    try {
      const profiles = await getFreelancerProfiles();
      setFreelancerList(profiles);
    } catch {
      setFreelancerList([]);
    } finally {
      setFreelancerListLoading(false);
    }
  };

  const handleAssignProject = async () => {
    if (!assignProjectTarget) return;
    if (!assignProjectForm.selectedFreelancerId) {
      toast({ title: 'Missing', description: 'Please select a freelancer.', variant: 'destructive' });
      return;
    }
    setAssignProjectSending(true);
    try {
      const selectedFreelancer = freelancerList.find(f => (f.freelancerId || f.id) === assignProjectForm.selectedFreelancerId);
      setAssignments(prev => prev.map(a => a.id === assignProjectTarget.id ? {
        ...a,
        professionalId: String(assignProjectForm.selectedFreelancerId),
        professionalName: selectedFreelancer?.fullName || a.professionalName,
        projectStartDate: assignProjectForm.projectStartDate || a.projectStartDate,
        projectEndDate: assignProjectForm.projectEndDate || a.projectEndDate,
        status: assignProjectForm.status as Assignment['status'],
      } : a));
      toast({ title: '✅ Project Assigned!', description: `"${assignProjectTarget.projectTitle}" assigned to ${selectedFreelancer?.fullName || 'freelancer'}.` });
      setAssignProjectOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to assign project.', variant: 'destructive' });
    } finally {
      setAssignProjectSending(false);
    }
  };

  const openSchedule = (demo: DemoRequestResponse) => {
    setSelectedDemo(demo);
    setScheduleForm({ timezone: 'Asia/Kolkata', scheduledDate: '', scheduledTime: '', demoLink: '', adminComments: demo.adminComments || '', status: 'Scheduled' });
    setScheduleOpen(true);
  };

  const openUpdate = (demo: DemoRequestResponse, presetStatus?: string) => {
    setUpdateDemo(demo);
    setUpdateForm({ status: presetStatus || demo.status, adminComments: '', declineReason: '', clientFeedback: '', freelancerFeedback: '', demoNotes: '' });
    setUpdateOpen(true);
  };

  const openDetail = (demo: DemoRequestResponse) => {
    setDetailDemo(demo);
    setDetailOpen(true);
  };

  const openCreateAssignment = async (demo: DemoRequestResponse) => {
    setAssignDemo(demo);
    setAssignForm({ hourlyRate: '', totalHours: '', adminComments: '', selectedFreelancerId: demo.freelancerId, monthlyCommitment: '', advanceAmount: '', projectStartDate: '', projectEndDate: '', projectNotes: '' });
    setAssignOpen(true);
    // Load freelancer list for swapping
    setFreelancerListLoading(true);
    try {
      const profiles = await getFreelancerProfiles();
      setFreelancerList(profiles);
    } catch {
      setFreelancerList([]);
    } finally {
      setFreelancerListLoading(false);
    }
  };

  // ─── Filters ───
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredDemos = demoRequests.filter(d => {
    const matchesSearch = d.freelancerName?.toLowerCase().includes(demoSearch.toLowerCase()) ||
      d.projectTitle?.toLowerCase().includes(demoSearch.toLowerCase()) ||
      d.clientName?.toLowerCase().includes(demoSearch.toLowerCase());
    const matchesFilter = demoFilterStatus === 'all' || d.status === demoFilterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredBilling = billing.filter(b => {
    const matchesSearch = b.freelancerName.toLowerCase().includes(billingSearch.toLowerCase()) ||
      b.clientName.toLowerCase().includes(billingSearch.toLowerCase());
    const matchesFilter = billingFilterStatus === 'all' || b.billingStatus === billingFilterStatus;
    return matchesSearch && matchesFilter;
  });

  const demoStats = {
    total: demoRequests.length,
    pending: demoRequests.filter(d => d.status === 'Pending' || d.status === 'Requested').length,
    scheduled: demoRequests.filter(d => d.status === 'Scheduled').length,
    inProgress: demoRequests.filter(d => d.status === 'Demo In Progress').length,
    completed: demoRequests.filter(d => d.status === 'Demo Completed').length,
    approved: demoRequests.filter(d => d.status === 'Approved').length,
    declined: demoRequests.filter(d => d.status === 'Declined' || d.status === 'Rejected').length,
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending_approval: { label: 'Pending Approval', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    active: { label: 'Active', className: 'bg-primary/10 text-primary border-primary/20' },
    completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  };

  const demoStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Requested: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Demo In Progress': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      'Demo Completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      Approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      Declined: 'bg-destructive/10 text-destructive border-destructive/20',
      Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      'On Hold': 'bg-muted text-muted-foreground border-border',
    };
    return map[status] || 'bg-muted text-muted-foreground border-border';
  };

  const billingStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      partial: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      overdue: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return map[status] || 'bg-muted text-muted-foreground border-border';
  };

  const followUpBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      none: { label: 'No Follow-up', className: 'bg-muted text-muted-foreground border-border' },
      reminder_sent: { label: 'Reminder Sent', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
      escalated: { label: 'Escalated', className: 'bg-destructive/10 text-destructive border-destructive/20' },
      resolved: { label: 'Resolved', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    };
    return map[status] || { label: status, className: 'bg-muted text-muted-foreground border-border' };
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Helper to get action buttons per demo status
  const getDemoActions = (demo: DemoRequestResponse) => {
    const status = demo.status;
    const actions: JSX.Element[] = [];

    // View details always
    actions.push(
      <Button key="view" size="sm" variant="ghost" className="gap-1 text-xs h-7" onClick={() => openDetail(demo)}>
        <Eye className="h-3.5 w-3.5" /> View
      </Button>
    );

    if (status === 'Pending' || status === 'Requested') {
      actions.push(
        <Button key="schedule" size="sm" className="gap-1 text-xs h-7" onClick={() => openSchedule(demo)}>
          <Send className="h-3.5 w-3.5" /> Schedule Demo
        </Button>
      );
      actions.push(
        <Button key="decline" size="sm" variant="outline" className="gap-1 text-xs h-7 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => openUpdate(demo, 'Declined')}>
          <XCircle className="h-3.5 w-3.5" /> Decline
        </Button>
      );
    }

    if (status === 'Scheduled') {
      actions.push(
        <Button key="start" size="sm" className="gap-1 text-xs h-7 bg-indigo-600 hover:bg-indigo-700" onClick={() => openUpdate(demo, 'Demo In Progress')}>
          <PlayCircle className="h-3.5 w-3.5" /> Start Demo
        </Button>
      );
    }

    if (status === 'Demo In Progress') {
      actions.push(
        <Button key="complete" size="sm" className="gap-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700" onClick={() => openUpdate(demo, 'Demo Completed')}>
          <CheckCircle2 className="h-3.5 w-3.5" /> Complete Demo
        </Button>
      );
    }

    if (status === 'Demo Completed') {
      actions.push(
        <Button key="approve" size="sm" className="gap-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700" onClick={() => openUpdate(demo, 'Approved')}>
          <ThumbsUp className="h-3.5 w-3.5" /> Approve
        </Button>
      );
      actions.push(
        <Button key="decline2" size="sm" variant="outline" className="gap-1 text-xs h-7 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => openUpdate(demo, 'Declined')}>
          <ThumbsDown className="h-3.5 w-3.5" /> Decline
        </Button>
      );
    }

    if (status === 'Approved') {
      actions.push(
        <Button key="assign" size="sm" className="gap-1 text-xs h-7 bg-cyan-600 hover:bg-cyan-700" onClick={() => openCreateAssignment(demo)}>
          <UserPlus className="h-3.5 w-3.5" /> Create Assignment
        </Button>
      );
    }

    // Generic update for any status
    if (!['Pending', 'Requested'].includes(status)) {
      actions.push(
        <Button key="edit" size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => openUpdate(demo)}>
          <Edit className="h-3.5 w-3.5" /> Edit
        </Button>
      );
    }

    return actions;
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-[#0D1B2E]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">
              <span className="text-orange-500">Work</span>
              <span className="text-amber-500">Support</span>
              <span className="text-blue-500">360</span>
              <span className="text-slate-400 text-sm font-normal ml-2">Admin</span>
            </h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Demos', value: demoStats.total, icon: Video, gradient: 'from-blue-500 to-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Pending', value: demoStats.pending, icon: Clock, gradient: 'from-amber-500 to-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Approved', value: demoStats.approved, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Assignments', value: assignments.length, icon: Users, gradient: 'from-cyan-500 to-cyan-400', bg: 'bg-cyan-500/10' },
          ].map(s => (
            <Card key={s.label} className="border border-slate-700/50 shadow-md overflow-hidden bg-[#0D1B2E]">
              <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className="h-5 w-5 text-slate-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-100">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="demo-requests" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="demo-requests" className="gap-1.5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400">
              <Video className="h-4 w-4" /> Demo Requests
              <Badge variant="outline" className="ml-1 h-5 text-xs border-slate-700/50 text-slate-400">{demoRequests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-1.5 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-slate-400">
              <Users className="h-4 w-4" /> Assignments
              <Badge variant="outline" className="ml-1 h-5 text-xs border-slate-700/50 text-slate-400">{assignments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 text-slate-400">
              <CreditCard className="h-4 w-4" /> Billing & Follow-up
              <Badge variant="outline" className="ml-1 h-5 text-xs border-slate-700/50 text-slate-400">{billing.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ═══════════ DEMO REQUESTS TAB ═══════════ */}
          <TabsContent value="demo-requests">
            {/* Demo Sub-Stats */}
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-4">
              {[
                { label: 'Pending', count: demoStats.pending, color: 'text-amber-400' },
                { label: 'Scheduled', count: demoStats.scheduled, color: 'text-blue-400' },
                { label: 'In Progress', count: demoStats.inProgress, color: 'text-indigo-400' },
                { label: 'Completed', count: demoStats.completed, color: 'text-emerald-400' },
                { label: 'Approved', count: demoStats.approved, color: 'text-green-400' },
                { label: 'Declined', count: demoStats.declined, color: 'text-red-400' },
                { label: 'Total', count: demoStats.total, color: 'text-slate-200' },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <p className={`text-lg font-bold ${s.color}`}>{s.count}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input value={demoSearch} onChange={e => setDemoSearch(e.target.value)}
                  placeholder="Search by freelancer, client, or project..." className="pl-9 bg-[#0D1B2E] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
              </div>
              <Select value={demoFilterStatus} onValueChange={setDemoFilterStatus}>
                <SelectTrigger className="w-48 bg-[#0D1B2E] border-slate-700/50 text-slate-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {DEMO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadDemoRequests} className="gap-1.5 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                <Loader2 className={`h-4 w-4 ${demoLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>

            {demoLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              </div>
            ) : filteredDemos.length === 0 ? (
              <Card className="border border-slate-700/50 shadow-md bg-[#0D1B2E]">
                <CardContent className="py-16 text-center text-slate-400">
                  <Video className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No demo requests found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDemos.map(demo => (
                  <Card key={demo.demoId} className="border border-slate-700/50 shadow-sm hover:shadow-md transition-shadow bg-[#0D1B2E] hover:border-slate-600/50">
                    <CardContent className="p-5 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-100 truncate">{demo.projectTitle || 'Untitled Project'}</p>
                          <p className="text-sm text-slate-400">Demo #{demo.demoId}</p>
                        </div>
                        <Badge className={demoStatusBadge(demo.status)}>{demo.status}</Badge>
                      </div>
                      <Separator className="bg-slate-700/50" />

                      {/* Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-slate-500 shrink-0" />
                          <span className="text-slate-200 font-medium">{demo.freelancerName || 'N/A'}</span>
                        </div>
                        {demo.clientName && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-500 shrink-0" />
                            <span className="text-slate-300">Client: {demo.clientName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-slate-500 shrink-0" />
                          <span className="text-slate-300">Budget: {demo.budget ? `₹${demo.budget.toLocaleString()}` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                          <span className="text-slate-400">Requested: {demo.requestedOn ? new Date(demo.requestedOn).toLocaleDateString() : 'N/A'}</span>
                        </div>

                        {/* Scheduled info */}
                        {demo.scheduledDate && (
                          <div className="p-2 rounded bg-blue-500/5 border border-blue-500/20 text-xs">
                            <span className="text-blue-400">📅 {new Date(demo.scheduledDate).toLocaleDateString()} at {demo.scheduledTime} ({demo.timezone})</span>
                          </div>
                        )}

                        {/* Meeting link */}
                        {demo.demoMeetingLink && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-cyan-400 shrink-0" />
                            <a href={demo.demoMeetingLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs truncate underline">{demo.demoMeetingLink}</a>
                          </div>
                        )}

                        {/* Decline reason */}
                        {(demo.status === 'Declined' || demo.status === 'Rejected') && demo.adminComments && (
                          <div className="p-2.5 rounded bg-red-500/5 border border-red-500/20">
                            <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Decline Reason</p>
                            <p className="text-xs text-red-300">{demo.adminComments}</p>
                          </div>
                        )}

                        {/* Admin comments for other statuses */}
                        {demo.adminComments && demo.status !== 'Declined' && demo.status !== 'Rejected' && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                            <span className="text-slate-400 text-xs line-clamp-2">{demo.adminComments}</span>
                          </div>
                        )}
                      </div>
                      <Separator className="bg-slate-700/50" />

                      {/* Actions */}
                      <div className="flex flex-wrap gap-1.5">
                        {getDemoActions(demo)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ═══════════ ASSIGNMENTS TAB ═══════════ */}
          <TabsContent value="assignments">
            <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
              <div className="flex gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="pl-9 bg-[#0D1B2E] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-[#0D1B2E] border-slate-700/50 text-slate-200">
                    <Filter className="h-4 w-4 mr-2" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending_approval">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {assignments.length === 0 ? (
              <Card className="border border-slate-700/50 shadow-md bg-[#0D1B2E]">
                <CardContent className="py-16 text-center text-slate-400">
                  <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No assignments yet</p>
                  <p className="text-sm text-slate-500 mt-1">Approve demos and create assignments to see them here.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-slate-700/50 shadow-lg bg-[#0D1B2E]">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-transparent">
                        <TableHead className="text-slate-400">Professional</TableHead>
                        <TableHead className="text-slate-400">Client</TableHead>
                        <TableHead className="text-slate-400">Project</TableHead>
                        <TableHead className="text-slate-400">Rate</TableHead>
                        <TableHead className="text-slate-400">Monthly</TableHead>
                        <TableHead className="text-slate-400">Advance</TableHead>
                        <TableHead className="text-slate-400">Pending</TableHead>
                        <TableHead className="text-slate-400">Next Payment</TableHead>
                        <TableHead className="text-slate-400">Start</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-right text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.map(a => (
                        <TableRow key={a.id} className="border-slate-700/50 hover:bg-slate-800/30">
                          <TableCell className="font-medium text-slate-200">{a.professionalName}</TableCell>
                          <TableCell className="text-slate-300">{a.clientName}</TableCell>
                          <TableCell className="max-w-[150px] truncate text-slate-300">{a.projectTitle}</TableCell>
                          <TableCell className="text-slate-200">{a.hourlyRate}/hr</TableCell>
                          <TableCell className="text-slate-200">{a.monthlyCommitment ? `₹${a.monthlyCommitment.toLocaleString()}` : '-'}</TableCell>
                          <TableCell className="text-emerald-400">{a.advanceAmount ? `₹${a.advanceAmount.toLocaleString()}` : '-'}</TableCell>
                          <TableCell className="text-amber-400 font-semibold">{a.pendingAmount ? `₹${a.pendingAmount.toLocaleString()}` : '-'}</TableCell>
                          <TableCell className="text-blue-400 text-xs">{a.nextPaymentDate || '-'}</TableCell>
                          <TableCell className="text-slate-400 text-xs">{a.projectStartDate || a.assignedDate}</TableCell>
                          <TableCell><Badge className={statusConfig[a.status]?.className}>{statusConfig[a.status]?.label}</Badge></TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              {a.status === 'pending_approval' && (
                                <>
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10" onClick={() => handleApprove(a.id)}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={() => handleReject(a.id)}>
                                    <XCircle className="h-3.5 w-3.5" /> Reject
                                  </Button>
                                </>
                              )}
                              {a.status === 'approved' && (
                                <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handleStartPayment(a.id)}>
                                  <DollarSign className="h-3.5 w-3.5" /> Start
                                </Button>
                              )}
                              {a.projectNotes && (
                                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-slate-400" title={a.projectNotes}>
                                  <FileText className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredAssignments.length === 0 && (
                        <TableRow><TableCell colSpan={11} className="text-center py-8 text-slate-400">No projects found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══════════ BILLING & FOLLOW-UP TAB ═══════════ */}
          <TabsContent value="billing">
            {billing.length === 0 ? (
              <Card className="border border-slate-700/50 shadow-md bg-[#0D1B2E]">
                <CardContent className="py-16 text-center text-slate-400">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No billing records yet</p>
                  <p className="text-sm text-slate-500 mt-1">Billing records will appear when assignments are active.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input value={billingSearch} onChange={e => setBillingSearch(e.target.value)} placeholder="Search client or freelancer..." className="pl-9 bg-[#0D1B2E] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
                  </div>
                  <Select value={billingFilterStatus} onValueChange={setBillingFilterStatus}>
                    <SelectTrigger className="w-44 bg-[#0D1B2E] border-slate-700/50 text-slate-200"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {BILLING_STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredBilling.map(b => {
                    const fu = followUpBadge(b.followUpStatus);
                    return (
                      <Card key={b.id} className="border border-slate-700/50 shadow-sm hover:shadow-md transition-shadow bg-[#0D1B2E]">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-100 truncate">{b.projectTitle}</p>
                              <p className="text-sm text-slate-400">{b.clientName}</p>
                            </div>
                            <Badge className={billingStatusBadge(b.billingStatus)}>{b.billingStatus}</Badge>
                          </div>
                          <Separator className="bg-slate-700/50" />
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between"><span className="text-slate-400">Professional</span><span className="font-medium text-slate-200">{b.freelancerName}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Invoice</span><span className="font-medium text-slate-200">₹{b.invoiceAmount.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Paid</span><span className="font-medium text-emerald-400">₹{b.paidAmount.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Pending</span><span className="font-bold text-amber-400">₹{b.pendingAmount.toLocaleString()}</span></div>
                          </div>
                          <Separator className="bg-slate-700/50" />
                          <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs border-slate-700/50 text-slate-300 hover:bg-slate-700/50" onClick={() => openBillingUpdate(b)}>
                            <RotateCcw className="h-3.5 w-3.5" /> Update Billing
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* ═══════════ SCHEDULE DEMO DIALOG ═══════════ */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <Video className="h-5 w-5 text-cyan-400" /> Schedule Demo & Send Meeting Invitation
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Schedule a demo for <strong className="text-slate-200">{selectedDemo?.projectTitle}</strong> with <strong className="text-slate-200">{selectedDemo?.freelancerName}</strong>. Meeting invitation emails will be sent to both client and freelancer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Timezone *</Label>
              <Select value={scheduleForm.timezone} onValueChange={v => setScheduleForm(f => ({ ...f, timezone: v }))}>
                <SelectTrigger className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>{TIMEZONES.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date *</Label>
                <Input type="date" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" value={scheduleForm.scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setScheduleForm(f => ({ ...f, scheduledDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time Slot *</Label>
                <Select value={scheduleForm.scheduledTime} onValueChange={v => setScheduleForm(f => ({ ...f, scheduledTime: v }))}>
                  <SelectTrigger className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>{TIME_SLOTS.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Meeting Link (Zoom/Google Meet) *</Label>
              <Input className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                value={scheduleForm.demoLink} onChange={e => setScheduleForm(f => ({ ...f, demoLink: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-300">Status</Label>
              <Select value={scheduleForm.status} onValueChange={v => setScheduleForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>{DEMO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Admin Notes</Label>
              <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={3} placeholder="Add notes about this demo..."
                value={scheduleForm.adminComments} onChange={e => setScheduleForm(f => ({ ...f, adminComments: e.target.value }))} />
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-xs text-cyan-400">📧 Meeting invitation with link, date and time will be sent to both the <strong>client</strong> and <strong>freelancer</strong> via email.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Cancel</Button>
            <Button onClick={handleScheduleDemo} disabled={scheduleSending} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
              {scheduleSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {scheduleSending ? 'Sending...' : 'Schedule & Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ UPDATE STATUS DIALOG (Enhanced) ═══════════ */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="sm:max-w-lg bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <Edit className="h-5 w-5 text-cyan-400" /> Update Demo Status
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Update status for <strong className="text-slate-200">{updateDemo?.projectTitle}</strong> (Demo #{updateDemo?.demoId})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-slate-300">Status *</Label>
              <Select value={updateForm.status} onValueChange={v => setUpdateForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>{DEMO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Demo Notes - shown for In Progress & Completed */}
            {(updateForm.status === 'Demo In Progress' || updateForm.status === 'Demo Completed') && (
              <div>
                <Label className="text-sm font-medium text-slate-300">Demo Notes / Timings</Label>
                <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={3} placeholder="e.g. Demo started at 10:30 AM, discussed project scope..."
                  value={updateForm.demoNotes} onChange={e => setUpdateForm(f => ({ ...f, demoNotes: e.target.value }))} />
              </div>
            )}

            {/* Feedback - shown when completing or approving */}
            {(updateForm.status === 'Demo Completed' || updateForm.status === 'Approved') && (
              <>
                <div>
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><ThumbsUp className="h-3.5 w-3.5 text-emerald-400" /> Client Feedback</Label>
                  <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={2} placeholder="How did the client respond? Interested / Needs changes / OK..."
                    value={updateForm.clientFeedback} onChange={e => setUpdateForm(f => ({ ...f, clientFeedback: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><ThumbsUp className="h-3.5 w-3.5 text-blue-400" /> Freelancer Feedback</Label>
                  <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={2} placeholder="How did the freelancer perform? Technically sound / Needs improvement..."
                    value={updateForm.freelancerFeedback} onChange={e => setUpdateForm(f => ({ ...f, freelancerFeedback: e.target.value }))} />
                </div>
              </>
            )}

            {/* Decline reason */}
            {updateForm.status === 'Declined' && (
              <div>
                <Label className="text-sm font-medium text-red-400">Decline Reason *</Label>
                <Textarea className="mt-1 bg-[#0A1628] border-red-500/30 text-slate-200" rows={3} placeholder="Explain why this demo request is being declined..."
                  value={updateForm.declineReason} onChange={e => setUpdateForm(f => ({ ...f, declineReason: e.target.value }))} />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-slate-300">Admin Comments</Label>
              <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={3} placeholder="General notes..."
                value={updateForm.adminComments} onChange={e => setUpdateForm(f => ({ ...f, adminComments: e.target.value }))} />
            </div>

            {/* Approve info */}
            {updateForm.status === 'Approved' && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-emerald-400">✅ After approval, you can create an assignment for this client and assign a freelancer.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={updateSending || (updateForm.status === 'Declined' && !updateForm.declineReason)}
              className={`gap-2 ${updateForm.status === 'Declined' ? 'bg-red-600 hover:bg-red-700' : updateForm.status === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}>
              {updateSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {updateSending ? 'Updating...' : `Update to ${updateForm.status}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ DEMO DETAIL DIALOG ═══════════ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-[#0D1B2E] border-slate-700/50 text-slate-100 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <Eye className="h-5 w-5 text-cyan-400" /> Demo Details
            </DialogTitle>
          </DialogHeader>
          {detailDemo && (
            <div className="space-y-4 py-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{detailDemo.projectTitle || 'Untitled'}</h3>
                  <p className="text-sm text-slate-400">Demo #{detailDemo.demoId}</p>
                </div>
                <Badge className={demoStatusBadge(detailDemo.status)}>{detailDemo.status}</Badge>
              </div>
              <Separator className="bg-slate-700/50" />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Freelancer</p>
                  <p className="font-medium text-slate-200">{detailDemo.freelancerName || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Client</p>
                  <p className="font-medium text-slate-200">{detailDemo.clientName || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Budget</p>
                  <p className="font-medium text-slate-200">{detailDemo.budget ? `₹${detailDemo.budget.toLocaleString()}` : 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Requested On</p>
                  <p className="font-medium text-slate-200">{detailDemo.requestedOn ? new Date(detailDemo.requestedOn).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              {detailDemo.contactEmail && (
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-sm text-slate-200">{detailDemo.contactEmail} {detailDemo.contactPhone && `• ${detailDemo.contactPhone}`}</p>
                </div>
              )}

              {detailDemo.scheduledDate && (
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">Scheduled</p>
                  <p className="text-sm text-blue-300">📅 {new Date(detailDemo.scheduledDate).toLocaleDateString()} at {detailDemo.scheduledTime} ({detailDemo.timezone})</p>
                </div>
              )}

              {detailDemo.demoMeetingLink && (
                <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">Meeting Link</p>
                  <a href={detailDemo.demoMeetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 underline break-all">{detailDemo.demoMeetingLink}</a>
                </div>
              )}

              {(detailDemo.status === 'Declined' || detailDemo.status === 'Rejected') && detailDemo.adminComments && (
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Decline Reason</p>
                  <p className="text-sm text-red-300 whitespace-pre-line">{detailDemo.adminComments}</p>
                </div>
              )}

              {detailDemo.adminComments && detailDemo.status !== 'Declined' && detailDemo.status !== 'Rejected' && (
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Admin Notes & Feedback</p>
                  <p className="text-sm text-slate-300 whitespace-pre-line">{detailDemo.adminComments}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════ CREATE ASSIGNMENT DIALOG ═══════════ */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-lg bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <UserPlus className="h-5 w-5 text-cyan-400" /> Create Project
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Create a project for <strong className="text-slate-200">{assignDemo?.projectTitle}</strong>. Set financials, dates and assign a freelancer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {/* Project info */}
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Project:</span> <span className="text-slate-200 font-medium">{assignDemo?.projectTitle}</span></div>
                <div><span className="text-slate-500">Client:</span> <span className="text-slate-200">{assignDemo?.clientName || 'N/A'}</span></div>
                <div><span className="text-slate-500">Budget:</span> <span className="text-slate-200">{assignDemo?.budget ? `₹${assignDemo.budget.toLocaleString()}` : 'N/A'}</span></div>
                <div><span className="text-slate-500">Demo #:</span> <span className="text-slate-200">{assignDemo?.demoId}</span></div>
              </div>
            </div>

            {/* Select Freelancer (can swap) */}
            <div>
              <Label className="text-sm font-medium text-slate-300">Assign Freelancer *</Label>
              {freelancerListLoading ? (
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading freelancers...</div>
              ) : (
                <Select value={String(assignForm.selectedFreelancerId)} onValueChange={v => setAssignForm(f => ({ ...f, selectedFreelancerId: Number(v) }))}>
                  <SelectTrigger className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue placeholder="Select freelancer" /></SelectTrigger>
                  <SelectContent>
                    {freelancerList.map(f => (
                      <SelectItem key={f.freelancerId || f.id} value={String(f.freelancerId || f.id)}>
                        {f.fullName} — {f.primarySkills?.split(',').slice(0, 2).join(', ')} ({f.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-[10px] text-slate-500 mt-1">Default: {assignDemo?.freelancerName}. You can change the freelancer for this project.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-slate-300">Hourly Rate (₹) *</Label>
                <Input type="number" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="e.g. 500"
                  value={assignForm.hourlyRate} onChange={e => setAssignForm(f => ({ ...f, hourlyRate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300">Total Hours (estimated)</Label>
                <Input type="number" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="e.g. 160"
                  value={assignForm.totalHours} onChange={e => setAssignForm(f => ({ ...f, totalHours: e.target.value }))} />
              </div>
            </div>

            <Separator className="bg-slate-700/50" />

            {/* Financial Details */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">💰 Financial Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-slate-300">Monthly Commitment (₹)</Label>
                  <Input type="number" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="e.g. 50000"
                    value={assignForm.monthlyCommitment} onChange={e => setAssignForm(f => ({ ...f, monthlyCommitment: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-300">Advance Amount (₹)</Label>
                  <Input type="number" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="e.g. 20000"
                    value={assignForm.advanceAmount} onChange={e => setAssignForm(f => ({ ...f, advanceAmount: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Auto-calculated pending & next payment */}
            {assignForm.monthlyCommitment && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-400">Monthly Commitment</span>
                  <span className="font-semibold text-amber-300">₹{Number(assignForm.monthlyCommitment).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Advance Paid</span>
                  <span className="font-semibold text-emerald-300">₹{(Number(assignForm.advanceAmount) || 0).toLocaleString()}</span>
                </div>
                <Separator className="bg-amber-500/20" />
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Pending Amount</span>
                  <span className="font-bold text-red-300">₹{(Number(assignForm.monthlyCommitment) - (Number(assignForm.advanceAmount) || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400">Next Payment Date</span>
                  <span className="font-medium text-blue-300">
                    {(() => {
                      const start = assignForm.projectStartDate || new Date().toISOString().split('T')[0];
                      const next = new Date(start);
                      next.setDate(next.getDate() + 30);
                      return next.toLocaleDateString();
                    })()}
                  </span>
                </div>
              </div>
            )}

            <Separator className="bg-slate-700/50" />

            {/* Project Dates */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">📅 Project Dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-slate-300">Start Date</Label>
                  <Input type="date" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                    value={assignForm.projectStartDate} onChange={e => setAssignForm(f => ({ ...f, projectStartDate: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-300">End Date</Label>
                  <Input type="date" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                    value={assignForm.projectEndDate} onChange={e => setAssignForm(f => ({ ...f, projectEndDate: e.target.value }))}
                    min={assignForm.projectStartDate || undefined} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm font-medium text-slate-300">Project Notes</Label>
              <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={3} placeholder="Add project notes, scope details, special instructions..."
                value={assignForm.projectNotes} onChange={e => setAssignForm(f => ({ ...f, projectNotes: e.target.value }))} />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-300">Admin Comments</Label>
              <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={2} placeholder="Internal notes..."
                value={assignForm.adminComments} onChange={e => setAssignForm(f => ({ ...f, adminComments: e.target.value }))} />
            </div>

            {assignForm.hourlyRate && assignForm.totalHours && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs text-emerald-400">Estimated Project Amount: <strong>₹{(Number(assignForm.hourlyRate) * Number(assignForm.totalHours)).toLocaleString()}</strong></p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Cancel</Button>
            <Button onClick={handleCreateAssignment} disabled={assignSending} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
              {assignSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {assignSending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ BILLING UPDATE DIALOG ═══════════ */}
      <Dialog open={billingUpdateOpen} onOpenChange={setBillingUpdateOpen}>
        <DialogContent className="sm:max-w-md bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100"><CreditCard className="h-5 w-5 text-cyan-400" /> Update Billing</DialogTitle>
            <DialogDescription className="text-slate-400">{selectedBilling?.projectTitle} — {selectedBilling?.clientName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-slate-300">Billing Status *</Label>
              <Select value={billingForm.billingStatus} onValueChange={v => setBillingForm(f => ({ ...f, billingStatus: v }))}>
                <SelectTrigger className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>{BILLING_STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-300">Paid Amount (₹)</Label>
              <Input type="number" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" value={billingForm.paidAmount}
                onChange={e => setBillingForm(f => ({ ...f, paidAmount: Number(e.target.value) }))} />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-300">Follow-up Notes</Label>
              <Textarea className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200" rows={3} placeholder="Follow-up details..."
                value={billingForm.followUpNotes} onChange={e => setBillingForm(f => ({ ...f, followUpNotes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBillingUpdateOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Cancel</Button>
            <Button onClick={handleBillingUpdate} disabled={billingUpdating} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
              {billingUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {billingUpdating ? 'Updating...' : 'Update Billing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;