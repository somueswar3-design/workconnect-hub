import { useState, useRef, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import FreelancerMyRequests from './FreelancerMyRequests';
import FreelancerTimesheets from './FreelancerTimesheets';
import InvoiceGeneration from './InvoiceGeneration';
import BankDetailsManagement from './BankDetailsManagement';
import PaymentFlow from './PaymentFlow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, Save, Plus, X, Camera, LogOut, 
  Languages, Lock, ChevronDown, DollarSign, TrendingUp, Users, CheckCircle2,
  Wifi, WifiOff, Zap, Award, Target, Sparkles, Calendar, Search, Filter,
  Building2, IndianRupee, Timer, Eye, Send, Bell, MessageCircle, ArrowRight,
  LayoutGrid
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAssignments, getFreelancerEarnings, getJobOpenings, getFreelancerProfile, getFreelancerInterests, getFreelancerDemoRequests, AssignmentDto, EarningsDto, JobOpeningDto, FreelancerInterestResponseDto, FreelancerDemoRequestDto } from '@/services/freelancerApi';
import RequirementsGrid from '@/components/RequirementsGrid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/DashboardLayout';

const FreelancerOverview = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('requirements');
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [earnings, setEarnings] = useState<EarningsDto | null>(null);
  const [openings, setOpenings] = useState<JobOpeningDto[]>([]);
  const [interests, setInterests] = useState<FreelancerInterestResponseDto[]>([]);
  const [demoRequests, setDemoRequests] = useState<FreelancerDemoRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingsLoading, setOpeningsLoading] = useState(true);
  const [interestsLoading, setInterestsLoading] = useState(true);
  const [demosLoading, setDemosLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedInterest, setSelectedInterest] = useState<FreelancerInterestResponseDto | null>(null);
  const [requestsTab, setRequestsTab] = useState('interests');

  useEffect(() => {
    const load = async () => {
      const userId = user?.userId || '';
      setLoading(true);
      setOpeningsLoading(true);
      setInterestsLoading(true);

      try {
        const [a, e] = await Promise.all([
          getAssignments(userId).catch(() => []),
          getFreelancerEarnings(userId).catch(() => null),
        ]);
        setAssignments(Array.isArray(a) ? a : []);
        setEarnings(e);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
      setLoading(false);

      // Fetch openings and interests independently
      getJobOpenings(userId)
        .then(o => setOpenings(Array.isArray(o) ? o : []))
        .catch(() => setOpenings([]))
        .finally(() => setOpeningsLoading(false));

      getFreelancerInterests(userId)
        .then(i => {
          console.log('Freelancer interests response:', i);
          setInterests(Array.isArray(i) ? i : []);
        })
        .catch(err => {
          console.error('Failed to load interests:', err);
          setInterests([]);
        })
        .finally(() => setInterestsLoading(false));

      getFreelancerDemoRequests(userId)
        .then(d => setDemoRequests(Array.isArray(d) ? d : []))
        .catch(err => {
          console.error('Failed to load demo requests:', err);
          setDemoRequests([]);
        })
        .finally(() => setDemosLoading(false));
    };
    load();
  }, [user?.userId]);


  const validAssignments = Array.isArray(assignments) ? assignments.filter(a => a.projectId !== 0) : [];
  const activeAssignments = validAssignments.filter(a => a.status?.toLowerCase() === 'active');
  const completedAssignments = validAssignments.filter(a => a.status?.toLowerCase() !== 'active');

  const filteredOpenings = openings.filter(o =>
    o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const getCurrencySymbol = (currency?: string) => {
    if (!currency) return '$';
    const c = currency.toLowerCase();
    if (c.includes('india') || c.includes('inr') || c.includes('rupee')) return '₹';
    if (c.includes('eur')) return '€';
    if (c.includes('gbp') || c.includes('pound')) return '£';
    return '$';
  };

  return (
    <div className="p-6 space-y-5">
      {/* Compact Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Total Earnings</p>
              <p className="text-xl font-extrabold text-slate-900 truncate">
                {earnings ? `${getCurrencySymbol(earnings.currency)}${earnings.earnedAmount.toLocaleString()}` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Active Projects</p>
              <p className="text-xl font-extrabold text-slate-900">{activeAssignments.length}</p>
            </div>
            {activeAssignments.length > 0 && (
              <Button variant="ghost" size="sm" className="ml-auto text-xs text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50" onClick={() => setActiveTab('assignments')}>
                View <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Completed</p>
              <p className="text-xl font-extrabold text-slate-900">{completedAssignments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Status - Mock List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-600" /> Scheduled Demos
        </h2>

        <div className="space-y-4">
          {[
            {
              demoId: 'mock-1',
              projectTitle: 'E-commerce Platform Revamp',
              clientName: 'Acme Retail Pvt Ltd',
              status: 'Approved',
              budget: 85000,
              scheduledDate: '2026-05-08',
              scheduledTime: '10:30 AM',
              timezone: 'IST',
              demoMeetingLink: 'https://meet.google.com/xyz-mock-link',
              adminComments: 'Please prepare a 30-min walkthrough of past projects.',
              requestedOn: '2026-04-25T09:15:00Z',
            },
            {
              demoId: 'mock-2',
              projectTitle: 'Mobile Banking App – React Native',
              clientName: 'FinTrust Bank',
              status: 'Pending',
              budget: 120000,
              scheduledDate: '2026-05-12',
              scheduledTime: '03:00 PM',
              timezone: 'IST',
              demoMeetingLink: '',
              adminComments: 'Awaiting client confirmation on the proposed slot.',
              requestedOn: '2026-04-27T14:42:00Z',
            },
            {
              demoId: 'mock-3',
              projectTitle: 'Internal HR Dashboard',
              clientName: 'Globex Solutions',
              status: 'Completed',
              budget: 45000,
              scheduledDate: '2026-04-20',
              scheduledTime: '11:00 AM',
              timezone: 'IST',
              demoMeetingLink: '',
              adminComments: 'Demo went well. Client moved to contract stage.',
              requestedOn: '2026-04-15T08:00:00Z',
            },
            {
              demoId: 'mock-4',
              projectTitle: 'AI Chatbot Integration',
              clientName: 'NovaTech Labs',
              status: 'Rejected',
              budget: 60000,
              scheduledDate: '2026-04-22',
              scheduledTime: '05:30 PM',
              timezone: 'IST',
              demoMeetingLink: '',
              adminComments: 'Client opted for a different freelancer.',
              requestedOn: '2026-04-18T11:20:00Z',
            },
          ].map((demo, idx) => (
            <motion.div key={demo.demoId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="border border-slate-200 shadow-sm hover:border-cyan-300 transition-all bg-white hover:shadow-cyan-100 hover:shadow-lg">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-base">{demo.projectTitle}</h3>
                      <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" /> Client: {demo.clientName}
                      </p>
                    </div>
                    <Badge className={`text-[11px] shrink-0 ${
                      demo.status.toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      demo.status.toLowerCase() === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      demo.status.toLowerCase() === 'completed' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                      demo.status.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-100 text-slate-400'
                    }`}>{demo.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Budget</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-cyan-600" />
                        {demo.budget.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Demo Date</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                        {new Date(demo.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Time ({demo.timezone})</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-orange-600" />
                        {demo.scheduledTime}
                      </p>
                    </div>
                  </div>

                  {demo.demoMeetingLink && (
                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Meeting Link</p>
                      <a href={demo.demoMeetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:text-cyan-700 underline underline-offset-2 break-all flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 shrink-0" />
                        {demo.demoMeetingLink}
                      </a>
                    </div>
                  )}

                  {demo.adminComments && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Admin Notes</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{demo.adminComments}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-x-4 pt-2 border-t border-slate-200 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Requested: {new Date(demo.requestedOn).toLocaleDateString()} {new Date(demo.requestedOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const profile = await getFreelancerProfile(user?.userId || '');
        if (profile) {
          setIsActive(profile.availabilityStatus?.toLowerCase() === 'available');
        }
      } catch (err) {
        console.error('Failed to fetch profile availability:', err);
      }
    };
    if (user?.userId) fetchAvailability();
  }, [user?.userId]);

  return (
    <DashboardLayout userType="freelancer" isActive={isActive}>
      <Routes>
        <Route path="/" element={<FreelancerOverview />} />
        <Route path="/my-requests" element={<FreelancerMyRequests />} />
        <Route path="/timesheets" element={<FreelancerTimesheets />} />
        <Route path="/invoices" element={<InvoiceGeneration />} />
        <Route path="/bank-details" element={<BankDetailsManagement />} />
        <Route path="/payments" element={<PaymentFlow />} />
        <Route path="/profile" element={<Navigate to="/freelancer-profile" replace />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="*" element={<FreelancerOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
