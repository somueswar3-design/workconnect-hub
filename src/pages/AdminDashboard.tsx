import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Clock, DollarSign, CheckCircle2, XCircle, ChevronDown,
  LogOut, Briefcase, Search, Filter, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Freelancer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: string;
  experience: string;
  availability: 'available' | 'busy' | 'offline';
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  projectTitle: string;
  budget: string;
}

interface Assignment {
  id: string;
  freelancerId: string;
  freelancerName: string;
  clientId: string;
  clientName: string;
  projectTitle: string;
  hourlyRate: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'completed';
  assignedDate: string;
  approvedDate?: string;
  totalHours?: number;
  totalAmount?: number;
}

// Mock data
const mockFreelancers: Freelancer[] = [
  { id: 'f1', name: 'Ravi Kumar', email: 'ravi@test.com', skills: ['React', 'Node.js'], hourlyRate: '$75', experience: '5 Years', availability: 'available' },
  { id: 'f2', name: 'Priya Sharma', email: 'priya@test.com', skills: ['Python', 'AWS'], hourlyRate: '$85', experience: '7 Years', availability: 'available' },
  { id: 'f3', name: 'Arjun Reddy', email: 'arjun@test.com', skills: ['Java', 'Spring'], hourlyRate: '$90', experience: '8 Years', availability: 'busy' },
  { id: 'f4', name: 'Sneha Patel', email: 'sneha@test.com', skills: ['Angular', 'TypeScript'], hourlyRate: '$70', experience: '4 Years', availability: 'available' },
];

const mockClients: Client[] = [
  { id: 'c1', name: 'TechCorp Inc', email: 'admin@techcorp.com', company: 'TechCorp Solutions', projectTitle: 'E-commerce Platform', budget: '$10,000' },
  { id: 'c2', name: 'StartupX Labs', email: 'cto@startupx.com', company: 'StartupX', projectTitle: 'Mobile App Backend', budget: '$15,000' },
  { id: 'c3', name: 'DataFlow Analytics', email: 'pm@dataflow.com', company: 'DataFlow', projectTitle: 'Analytics Dashboard', budget: '$8,000' },
];

const initialAssignments: Assignment[] = [
  { id: 'a1', freelancerId: 'f1', freelancerName: 'Ravi Kumar', clientId: 'c1', clientName: 'TechCorp Inc', projectTitle: 'E-commerce Platform', hourlyRate: '$75', status: 'pending_approval', assignedDate: '2024-12-01' },
  { id: 'a2', freelancerId: 'f2', freelancerName: 'Priya Sharma', clientId: 'c2', clientName: 'StartupX Labs', projectTitle: 'Mobile App Backend', hourlyRate: '$85', status: 'approved', assignedDate: '2024-11-15', approvedDate: '2024-11-17', totalHours: 120, totalAmount: 10200 },
  { id: 'a3', freelancerId: 'f3', freelancerName: 'Arjun Reddy', clientId: 'c3', clientName: 'DataFlow Analytics', projectTitle: 'Analytics Dashboard', hourlyRate: '$90', status: 'active', assignedDate: '2024-10-01', approvedDate: '2024-10-03', totalHours: 200, totalAmount: 18000 },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAssign = () => {
    if (!selectedFreelancer || !selectedClient) {
      toast({ title: 'Error', description: 'Select both freelancer and client', variant: 'destructive' });
      return;
    }
    const freelancer = mockFreelancers.find(f => f.id === selectedFreelancer);
    const client = mockClients.find(c => c.id === selectedClient);
    if (!freelancer || !client) return;

    const newAssignment: Assignment = {
      id: `a${Date.now()}`,
      freelancerId: freelancer.id,
      freelancerName: freelancer.name,
      clientId: client.id,
      clientName: client.name,
      projectTitle: client.projectTitle,
      hourlyRate: freelancer.hourlyRate,
      status: 'pending_approval',
      assignedDate: new Date().toISOString().split('T')[0],
    };

    setAssignments(prev => [newAssignment, ...prev]);
    setShowAssignDialog(false);
    setSelectedFreelancer('');
    setSelectedClient('');
    toast({ title: 'Assignment Created', description: `${freelancer.name} assigned to ${client.name} — awaiting approval.` });
  };

  const handleApprove = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] } : a));
    toast({ title: 'Approved', description: 'Assignment approved. Payment tracking will now begin.' });
  };

  const handleReject = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    toast({ title: 'Rejected', description: 'Assignment has been rejected.' });
  };

  const handleStartPayment = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
    toast({ title: 'Payment Started', description: 'Payment tracking is now active for this assignment.' });
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending_approval').length,
    approved: assignments.filter(a => a.status === 'approved').length,
    active: assignments.filter(a => a.status === 'active').length,
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending_approval: { label: 'Pending Approval', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    active: { label: 'Active (Paid)', className: 'bg-primary/10 text-primary border-primary/20' },
    completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
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
            <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
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
            { label: 'Total Assignments', value: stats.total, icon: Users, gradient: 'from-primary to-primary/70' },
            { label: 'Pending Approval', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-amber-400' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-400' },
            { label: 'Active (Paying)', value: stats.active, icon: DollarSign, gradient: 'from-violet-500 to-violet-400' },
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

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search freelancers or clients..." className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
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
          <Button onClick={() => setShowAssignDialog(true)} className="gap-2">
            <UserCheck className="h-4 w-4" /> Assign Freelancer to Client
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments" className="gap-1.5">
              <Users className="h-4 w-4" /> Assignments
              <Badge variant="secondary" className="ml-1 h-5 text-xs">{filteredAssignments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="freelancers" className="gap-1.5">
              <UserCheck className="h-4 w-4" /> Freelancers
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-1.5">
              <Briefcase className="h-4 w-4" /> Clients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Freelancer</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.freelancerName}</TableCell>
                        <TableCell>{a.clientName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{a.projectTitle}</TableCell>
                        <TableCell>{a.hourlyRate}/hr</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[a.status]?.className}>
                            {statusConfig[a.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{a.assignedDate}</TableCell>
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
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No assignments found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="freelancers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFreelancers.map(f => (
                <Card key={f.id} className="border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{f.name}</h3>
                      <p className="text-xs text-muted-foreground">{f.email} · {f.experience}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {f.skills.map(s => <Badge key={s} variant="outline" className="text-xs h-5">{s}</Badge>)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">{f.hourlyRate}/hr</p>
                      <Badge className={f.availability === 'available' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}>
                        {f.availability}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockClients.map(c => (
                <Card key={c.id} className="border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.company} · {c.email}</p>
                      <p className="text-sm text-foreground mt-1">{c.projectTitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">{c.budget}</p>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Assign Freelancer to Client
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Select Freelancer *</Label>
              <Select value={selectedFreelancer} onValueChange={setSelectedFreelancer}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose freelancer" />
                </SelectTrigger>
                <SelectContent>
                  {mockFreelancers.filter(f => f.availability === 'available').map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} — {f.hourlyRate}/hr · {f.skills.join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <Label className="text-sm font-medium">Select Client / Project *</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.projectTitle} ({c.budget})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                ⓘ The assignment will be created in <strong>Pending Approval</strong> status. 
                You must approve it before payment tracking begins.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleAssign} className="gap-2">
              <UserCheck className="h-4 w-4" /> Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
