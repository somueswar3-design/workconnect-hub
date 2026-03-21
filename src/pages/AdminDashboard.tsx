import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Clock, DollarSign, CheckCircle2, XCircle, ChevronDown,
  LogOut, Briefcase, Search, Filter, ArrowRight, Video, Send, Loader2,
  Calendar, Globe, MessageSquare, ExternalLink, Edit, CreditCard, AlertCircle,
  RotateCcw, FileText
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
  getAllDemoRequests, updateDemoRequest, sendDemoLink,
  DemoRequestResponse, UpdateDemoRequestDto
} from '@/services/clientApi';

// ─── Types ───
interface Assignment {
  id: string; professionalId: string; professionalName: string; clientId: string; clientName: string;
  projectTitle: string; hourlyRate: string; totalHours?: number;
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'completed';
  assignedDate: string; approvedDate?: string; totalAmount?: number;
  invoiceGenerated?: boolean;
}

interface BillingRecord {
  id: string;
  assignmentId: string;
  freelancerName: string;
  clientName: string;
  projectTitle: string;
  invoiceAmount: number;
  paidAmount: number;
  pendingAmount: number;
  commission: number;
  billingStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  followUpStatus: 'none' | 'reminder_sent' | 'escalated' | 'resolved';
  followUpNotes: string;
  invoiceDate: string;
  dueDate: string;
  lastFollowUp?: string;
}

// ─── Mock Data ───
const initialAssignments: Assignment[] = [
  { id: 'a1', professionalId: 'f1', professionalName: 'Ravi Kumar', clientId: 'c1', clientName: 'TechCorp Inc', projectTitle: 'E-commerce Platform', hourlyRate: '$75', status: 'pending_approval', assignedDate: '2024-12-01', totalHours: 0 },
  { id: 'a2', professionalId: 'f2', professionalName: 'Priya Sharma', clientId: 'c2', clientName: 'StartupX Labs', projectTitle: 'Mobile App Backend', hourlyRate: '$85', status: 'approved', assignedDate: '2024-11-15', approvedDate: '2024-11-17', totalHours: 120, totalAmount: 10200 },
  { id: 'a3', professionalId: 'f3', professionalName: 'Arjun Reddy', clientId: 'c3', clientName: 'DataFlow Analytics', projectTitle: 'Analytics Dashboard', hourlyRate: '$90', status: 'active', assignedDate: '2024-10-01', approvedDate: '2024-10-03', totalHours: 200, totalAmount: 18000 },
];

const initialBilling: BillingRecord[] = [
  {
    id: 'b1', assignmentId: 'a2', freelancerName: 'Priya Sharma', clientName: 'StartupX Labs',
    projectTitle: 'Mobile App Backend', invoiceAmount: 10200, paidAmount: 5000, pendingAmount: 5200,
    commission: 1020, billingStatus: 'partial', followUpStatus: 'reminder_sent',
    followUpNotes: 'Sent payment reminder on Dec 10. 120hrs × $85/hr billed.', invoiceDate: '2024-11-20', dueDate: '2024-12-20', lastFollowUp: '2024-12-10',
  },
  {
    id: 'b2', assignmentId: 'a3', freelancerName: 'Arjun Reddy', clientName: 'DataFlow Analytics',
    projectTitle: 'Analytics Dashboard', invoiceAmount: 18000, paidAmount: 0, pendingAmount: 18000,
    commission: 1800, billingStatus: 'overdue', followUpStatus: 'escalated',
    followUpNotes: 'Escalated to management. Client requested extension.', invoiceDate: '2024-10-15', dueDate: '2024-11-15', lastFollowUp: '2024-12-01',
  },
  {
    id: 'b3', assignmentId: 'a1', freelancerName: 'Ravi Kumar', clientName: 'TechCorp Inc',
    projectTitle: 'E-commerce Platform', invoiceAmount: 7500, paidAmount: 7500, pendingAmount: 0,
    commission: 750, billingStatus: 'paid', followUpStatus: 'resolved',
    followUpNotes: 'Payment completed successfully.', invoiceDate: '2024-09-01', dueDate: '2024-10-01', lastFollowUp: '2024-10-02',
  },
];

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

const DEMO_STATUSES = ['Pending', 'Scheduled', 'Demo Completed', 'Approved', 'Rejected', 'On Hold'];
const BILLING_STATUSES = ['pending', 'partial', 'paid', 'overdue'];
const FOLLOWUP_STATUSES = ['none', 'reminder_sent', 'escalated', 'resolved'];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Assignments state
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Demo requests state
  const [demoRequests, setDemoRequests] = useState<DemoRequestResponse[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSearch, setDemoSearch] = useState('');
  const [demoFilterStatus, setDemoFilterStatus] = useState('all');

  // Billing state
  const [billing, setBilling] = useState<BillingRecord[]>(initialBilling);
  const [billingSearch, setBillingSearch] = useState('');
  const [billingFilterStatus, setBillingFilterStatus] = useState('all');
  const [billingUpdateOpen, setBillingUpdateOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);
  const [billingForm, setBillingForm] = useState({
    billingStatus: '', followUpStatus: '', followUpNotes: '', paidAmount: 0,
  });
  const [billingUpdating, setBillingUpdating] = useState(false);

  // Schedule / Update dialog state
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
  const [updateForm, setUpdateForm] = useState({ status: '', adminComments: '' });
  const [updateSending, setUpdateSending] = useState(false);

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
    setBillingForm({
      billingStatus: record.billingStatus,
      followUpStatus: record.followUpStatus,
      followUpNotes: record.followUpNotes,
      paidAmount: record.paidAmount,
    });
    setBillingUpdateOpen(true);
  };

  const handleBillingUpdate = () => {
    if (!selectedBilling) return;
    setBillingUpdating(true);
    setTimeout(() => {
      setBilling(prev => prev.map(b => b.id === selectedBilling.id ? {
        ...b,
        billingStatus: billingForm.billingStatus as BillingRecord['billingStatus'],
        followUpStatus: billingForm.followUpStatus as BillingRecord['followUpStatus'],
        followUpNotes: billingForm.followUpNotes,
        paidAmount: billingForm.paidAmount,
        pendingAmount: b.invoiceAmount - billingForm.paidAmount,
        lastFollowUp: new Date().toISOString().split('T')[0],
      } : b));
      toast({ title: '✅ Billing Updated', description: `Billing for ${selectedBilling.clientName} updated.` });
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
      toast({ title: '✅ Demo Scheduled & Link Sent!', description: `Demo link sent to client and professional (${selectedDemo.freelancerName}).` });
      setScheduleOpen(false);
      loadDemoRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to schedule demo.', variant: 'destructive' });
    } finally {
      setScheduleSending(false);
    }
  };

  // ─── Update Status Handler ───
  const handleUpdateStatus = async () => {
    if (!updateDemo) return;
    setUpdateSending(true);
    try {
      await updateDemoRequest({ demoId: updateDemo.demoId, status: updateForm.status, adminComments: updateForm.adminComments });
      toast({ title: '✅ Status Updated', description: `Demo #${updateDemo.demoId} updated to "${updateForm.status}".` });
      setUpdateOpen(false);
      loadDemoRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } finally {
      setUpdateSending(false);
    }
  };

  const openSchedule = (demo: DemoRequestResponse) => {
    setSelectedDemo(demo);
    setScheduleForm({ timezone: 'Asia/Kolkata', scheduledDate: '', scheduledTime: '', demoLink: '', adminComments: demo.adminComments || '', status: 'Scheduled' });
    setScheduleOpen(true);
  };

  const openUpdate = (demo: DemoRequestResponse) => {
    setUpdateDemo(demo);
    setUpdateForm({ status: demo.status, adminComments: demo.adminComments || '' });
    setUpdateOpen(true);
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
      d.projectTitle?.toLowerCase().includes(demoSearch.toLowerCase());
    const matchesFilter = demoFilterStatus === 'all' || d.status === demoFilterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredBilling = billing.filter(b => {
    const matchesSearch = b.freelancerName.toLowerCase().includes(billingSearch.toLowerCase()) ||
      b.clientName.toLowerCase().includes(billingSearch.toLowerCase());
    const matchesFilter = billingFilterStatus === 'all' || b.billingStatus === billingFilterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending_approval').length,
    approved: assignments.filter(a => a.status === 'approved').length,
    active: assignments.filter(a => a.status === 'active').length,
  };

  const demoStats = {
    total: demoRequests.length,
    pending: demoRequests.filter(d => d.status === 'Pending' || d.status === 'Requested').length,
    scheduled: demoRequests.filter(d => d.status === 'Scheduled').length,
    completed: demoRequests.filter(d => d.status === 'Demo Completed' || d.status === 'Approved').length,
  };

  const billingStats = {
    totalInvoiced: billing.reduce((s, b) => s + b.invoiceAmount, 0),
    totalPending: billing.reduce((s, b) => s + b.pendingAmount, 0),
    totalCommission: billing.reduce((s, b) => s + b.commission, 0),
    overdue: billing.filter(b => b.billingStatus === 'overdue').length,
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending_approval: { label: 'Pending Approval', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    active: { label: 'Active (Paid)', className: 'bg-primary/10 text-primary border-primary/20' },
    completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  };

  const demoStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Requested: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Demo Completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      Approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
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

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">WorkSupport360 Admin</h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Demo Requests', value: demoStats.total, icon: Video, gradient: 'from-blue-500 to-blue-400' },
            { label: 'Assignments', value: stats.total, icon: Users, gradient: 'from-primary to-primary/70' },
            { label: 'Pending Billing', value: `$${billingStats.totalPending.toLocaleString()}`, icon: AlertCircle, gradient: 'from-amber-500 to-amber-400' },
            { label: 'Commission (10%)', value: `$${billingStats.totalCommission.toLocaleString()}`, icon: DollarSign, gradient: 'from-emerald-500 to-emerald-400' },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-md overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.gradient} text-primary-foreground`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs - only Demo, Assignments, Billing */}
        <Tabs defaultValue="demo-requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="demo-requests" className="gap-1.5">
              <Video className="h-4 w-4" /> Demo Requests
              <Badge variant="secondary" className="ml-1 h-5 text-xs">{demoRequests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-1.5">
              <Users className="h-4 w-4" /> Assignments
              <Badge variant="secondary" className="ml-1 h-5 text-xs">{filteredAssignments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5">
              <CreditCard className="h-4 w-4" /> Billing & Follow-up
              <Badge variant="secondary" className="ml-1 h-5 text-xs">{billing.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ═══════════ DEMO REQUESTS TAB ═══════════ */}
          <TabsContent value="demo-requests">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={demoSearch} onChange={e => setDemoSearch(e.target.value)}
                  placeholder="Search by freelancer or project..." className="pl-9" />
              </div>
              <Select value={demoFilterStatus} onValueChange={setDemoFilterStatus}>
                <SelectTrigger className="w-44">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Requested">Requested</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Demo Completed">Demo Completed</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadDemoRequests} className="gap-1.5">
                <Loader2 className={`h-4 w-4 ${demoLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>

            {demoLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredDemos.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-16 text-center text-muted-foreground">
                  <Video className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No demo requests found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDemos.map(demo => (
                  <Card key={demo.demoId} className="border border-border shadow-sm hover:shadow-md transition-shadow bg-card">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{demo.projectTitle || 'Untitled Project'}</p>
                          <p className="text-sm text-muted-foreground">Demo #{demo.demoId}</p>
                        </div>
                        <Badge className={demoStatusBadge(demo.status)}>{demo.status}</Badge>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground font-medium">{demo.freelancerName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">Budget: {demo.budget ? `₹${demo.budget.toLocaleString()}` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Requested: {demo.requestedOn ? new Date(demo.requestedOn).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {demo.adminComments && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-xs line-clamp-2">{demo.adminComments}</span>
                          </div>
                        )}
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        {(demo.status === 'Pending' || demo.status === 'Requested') && (
                          <Button size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => openSchedule(demo)}>
                            <Send className="h-3.5 w-3.5" /> Schedule & Send Link
                          </Button>
                        )}
                        {demo.status === 'Scheduled' && (
                          <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            onClick={() => openUpdate(demo)}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Update After Demo
                          </Button>
                        )}
                        {(demo.status !== 'Pending' && demo.status !== 'Requested' && demo.status !== 'Scheduled') && (
                          <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" onClick={() => openUpdate(demo)}>
                            <Edit className="h-3.5 w-3.5" /> Update Status
                          </Button>
                        )}
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
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="pl-9" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
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

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Professional</TableHead><TableHead>Client</TableHead><TableHead>Project</TableHead>
                      <TableHead>Rate</TableHead><TableHead>Hours</TableHead><TableHead>Status</TableHead><TableHead>Assigned</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.professionalName}</TableCell>
                        <TableCell>{a.clientName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{a.projectTitle}</TableCell>
                        <TableCell>{a.hourlyRate}/hr</TableCell>
                        <TableCell className="text-sm">{a.totalHours || 0}h</TableCell>
                        <TableCell><Badge className={statusConfig[a.status]?.className}>{statusConfig[a.status]?.label}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            {a.status === 'pending_approval' && (
                              <>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleApprove(a.id)}>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => handleReject(a.id)}>
                                  <XCircle className="h-3.5 w-3.5" /> Reject
                                </Button>
                              </>
                            )}
                            {a.status === 'approved' && (
                              <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handleStartPayment(a.id)}>
                                <DollarSign className="h-3.5 w-3.5" /> Start Payment
                              </Button>
                            )}
                            {a.status === 'active' && a.totalAmount && (
                              <span className="text-sm font-semibold text-emerald-600">${a.totalAmount.toLocaleString()}</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAssignments.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No assignments found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════ BILLING & FOLLOW-UP TAB ═══════════ */}
          <TabsContent value="billing">
            {/* Billing Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Invoiced', value: `$${billingStats.totalInvoiced.toLocaleString()}`, icon: FileText, cls: 'text-blue-600 bg-blue-100' },
                { label: 'Pending Amount', value: `$${billingStats.totalPending.toLocaleString()}`, icon: Clock, cls: 'text-amber-600 bg-amber-100' },
                { label: 'Commission (10%)', value: `$${billingStats.totalCommission.toLocaleString()}`, icon: DollarSign, cls: 'text-emerald-600 bg-emerald-100' },
                { label: 'Overdue', value: billingStats.overdue, icon: AlertCircle, cls: 'text-destructive bg-destructive/10' },
              ].map(s => (
                <Card key={s.label} className="border border-border">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${s.cls}`}><s.icon className="h-4 w-4" /></div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={billingSearch} onChange={e => setBillingSearch(e.target.value)}
                  placeholder="Search client or freelancer..." className="pl-9" />
              </div>
              <Select value={billingFilterStatus} onValueChange={setBillingFilterStatus}>
                <SelectTrigger className="w-44">
                  <Filter className="h-4 w-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBilling.map(b => {
                const fu = followUpBadge(b.followUpStatus);
                return (
                  <Card key={b.id} className="border border-border shadow-sm hover:shadow-md transition-shadow bg-card">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{b.projectTitle}</p>
                          <p className="text-sm text-muted-foreground">{b.clientName}</p>
                        </div>
                        <Badge className={billingStatusBadge(b.billingStatus)}>{b.billingStatus}</Badge>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Freelancer</span>
                          <span className="font-medium text-foreground">{b.freelancerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Invoice</span>
                          <span className="font-medium text-foreground">${b.invoiceAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Paid</span>
                          <span className="font-medium text-emerald-600">${b.paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Pending</span>
                          <span className="font-bold text-amber-600">${b.pendingAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Commission</span>
                          <span className="font-medium text-primary">${b.commission.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Follow-up</span>
                          <Badge className={fu.className}>{fu.label}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Due: {b.dueDate}</span>
                          {b.lastFollowUp && <span className="text-muted-foreground">Last: {b.lastFollowUp}</span>}
                        </div>
                        {b.followUpNotes && (
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded line-clamp-2">{b.followUpNotes}</p>
                        )}
                      </div>
                      <Separator />
                      <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs" onClick={() => openBillingUpdate(b)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Update Billing & Follow-up
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredBilling.length === 0 && (
                <Card className="col-span-full border-0 shadow-md">
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No billing records found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ═══════════ SCHEDULE DEMO DIALOG ═══════════ */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" /> Schedule Demo & Send Link
            </DialogTitle>
            <DialogDescription>
              Schedule a demo for <strong>{selectedDemo?.projectTitle}</strong> with <strong>{selectedDemo?.freelancerName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Timezone *</Label>
              <Select value={scheduleForm.timezone} onValueChange={v => setScheduleForm(f => ({ ...f, timezone: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{TIMEZONES.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date *</Label>
                <Input type="date" className="mt-1" value={scheduleForm.scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setScheduleForm(f => ({ ...f, scheduledDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time Slot *</Label>
                <Select value={scheduleForm.scheduledTime} onValueChange={v => setScheduleForm(f => ({ ...f, scheduledTime: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>{TIME_SLOTS.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Demo Meeting Link *</Label>
              <Input className="mt-1" placeholder="https://meet.google.com/... or https://zoom.us/..."
                value={scheduleForm.demoLink} onChange={e => setScheduleForm(f => ({ ...f, demoLink: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Select value={scheduleForm.status} onValueChange={v => setScheduleForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{DEMO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Admin Description / Comments</Label>
              <Textarea className="mt-1" rows={3} placeholder="Add notes about this demo..."
                value={scheduleForm.adminComments} onChange={e => setScheduleForm(f => ({ ...f, adminComments: e.target.value }))} />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">📧 The demo link, date and time will be sent to both the <strong>client</strong> and <strong>freelancer</strong>.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleDemo} disabled={scheduleSending} className="gap-2">
              {scheduleSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {scheduleSending ? 'Sending...' : 'Schedule & Send Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ UPDATE STATUS DIALOG ═══════════ */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit className="h-5 w-5 text-primary" /> Update Demo Status</DialogTitle>
            <DialogDescription>Update status for <strong>{updateDemo?.projectTitle}</strong> (Demo #{updateDemo?.demoId})</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Status *</Label>
              <Select value={updateForm.status} onValueChange={v => setUpdateForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{DEMO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Admin Description / Comments</Label>
              <Textarea className="mt-1" rows={4} placeholder="Add post-demo notes, feedback..."
                value={updateForm.adminComments} onChange={e => setUpdateForm(f => ({ ...f, adminComments: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={updateSending} className="gap-2">
              {updateSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {updateSending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ BILLING UPDATE DIALOG ═══════════ */}
      <Dialog open={billingUpdateOpen} onOpenChange={setBillingUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Update Billing & Follow-up</DialogTitle>
            <DialogDescription>
              {selectedBilling?.projectTitle} — {selectedBilling?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Billing Status *</Label>
              <Select value={billingForm.billingStatus} onValueChange={v => setBillingForm(f => ({ ...f, billingStatus: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BILLING_STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Paid Amount ($)</Label>
              <Input type="number" className="mt-1" value={billingForm.paidAmount}
                onChange={e => setBillingForm(f => ({ ...f, paidAmount: Number(e.target.value) }))} />
              {selectedBilling && (
                <p className="text-xs text-muted-foreground mt-1">Invoice total: ${selectedBilling.invoiceAmount.toLocaleString()}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Follow-up Status</Label>
              <Select value={billingForm.followUpStatus} onValueChange={v => setBillingForm(f => ({ ...f, followUpStatus: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Follow-up</SelectItem>
                  <SelectItem value="reminder_sent">Reminder Sent</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Follow-up Notes</Label>
              <Textarea className="mt-1" rows={3} placeholder="Add follow-up details, next steps..."
                value={billingForm.followUpNotes} onChange={e => setBillingForm(f => ({ ...f, followUpNotes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBillingUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleBillingUpdate} disabled={billingUpdating} className="gap-2">
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
