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
  const [showNotifyPopup, setShowNotifyPopup] = useState(false);
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

  useEffect(() => {
    if (!loading) {
      const valid = Array.isArray(assignments) ? assignments.filter(a => a.projectId !== 0) : [];
      if (valid.length === 0) {
        const timer = setTimeout(() => setShowNotifyPopup(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, assignments]);

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

      {/* My Requests - Tabbed Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" /> My Requests
        </h2>

        <Tabs value={requestsTab} onValueChange={setRequestsTab} className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="interests" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 text-slate-600">
              My Interests <Badge variant="outline" className="ml-2 border-slate-200 text-slate-500 text-[10px] px-1.5">{interests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="demos" className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 text-slate-600">
              Scheduled Demos <Badge variant="outline" className="ml-2 border-slate-200 text-slate-500 text-[10px] px-1.5">{demoRequests.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* My Interests Tab */}
          <TabsContent value="interests" className="mt-4">
            {interestsLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Card key={i} className="border border-slate-200 shadow-sm animate-pulse bg-white">
                    <CardContent className="p-5"><div className="h-5 bg-slate-100 rounded w-2/3 mb-3" /><div className="h-4 bg-slate-100 rounded w-1/3 mb-4" /><div className="h-3 bg-slate-100 rounded w-full" /></CardContent>
                  </Card>
                ))}
              </div>
            ) : interests.length === 0 ? (
              <Card className="border border-slate-200 bg-white">
                <CardContent className="py-10 text-center">
                  <Target className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                  <h3 className="text-base font-medium text-slate-700 mb-1">No interests submitted yet</h3>
                  <p className="text-sm text-slate-400">Express interest in job openings above to see them here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {interests.map((interest, idx) => (
                  <motion.div key={interest.interestId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => setSelectedInterest(interest)} className="cursor-pointer">
                    <Card className="border border-slate-200 shadow-sm hover:border-indigo-300 transition-all bg-white hover:shadow-indigo-100 hover:shadow-lg">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-base">{interest.requirement?.title || `Requirement #${interest.requirementId}`}</h3>
                            {interest.requirement?.description && (
                              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{interest.requirement.description}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <Badge className={`text-[11px] ${
                              interest.status?.toLowerCase() === 'interested' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              interest.status?.toLowerCase() === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              interest.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-slate-100 text-slate-400'
                            }`}>{interest.status}</Badge>
                            {interest.requirement?.status && (
                              <Badge className={`text-[10px] ${interest.requirement.status.toLowerCase() === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>{interest.requirement.status}</Badge>
                            )}
                          </div>
                        </div>

                        {interest.requirement?.skillsRequired && (
                          <div className="flex flex-wrap gap-1.5">
                            {interest.requirement.skillsRequired.split(',').map((skill, si) => (
                              <Badge key={si} className="bg-cyan-50 text-cyan-700 border-cyan-200 text-[11px] px-2 py-0.5 font-normal">{skill.trim()}</Badge>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {interest.requirement?.budget !== undefined && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Budget</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <IndianRupee className="h-3.5 w-3.5 text-cyan-600" />
                                {interest.requirement.budget.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {interest.requirement?.minExperience !== undefined && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Experience</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5 text-orange-600" />
                                {interest.requirement.minExperience}+ yrs
                              </p>
                            </div>
                          )}
                          {interest.requirement?.country && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Country</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                                {interest.requirement.country}
                              </p>
                            </div>
                          )}
                          {interest.requirement?.language && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Language</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <Languages className="h-3.5 w-3.5 text-emerald-600" />
                                {interest.requirement.language}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Send className="h-3.5 w-3.5 text-indigo-600" />
                            Applied: {new Date(interest.createdOn).toLocaleDateString()} {new Date(interest.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {interest.requirement?.createdOn && (
                            <span className="flex items-center gap-1 ml-auto">
                              <Clock className="h-3.5 w-3.5" />
                              Posted: {new Date(interest.requirement.createdOn).toLocaleDateString()}
                            </span>
                          )}
                          <Eye className="h-3.5 w-3.5 text-cyan-600 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Scheduled Demos Tab */}
          <TabsContent value="demos" className="mt-4">
            {demosLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Card key={i} className="border border-slate-200 shadow-sm animate-pulse bg-white">
                    <CardContent className="p-5"><div className="h-5 bg-slate-100 rounded w-2/3 mb-3" /><div className="h-4 bg-slate-100 rounded w-1/3 mb-4" /><div className="h-3 bg-slate-100 rounded w-full" /></CardContent>
                  </Card>
                ))}
              </div>
            ) : demoRequests.length === 0 ? (
              <Card className="border border-slate-200 bg-white">
                <CardContent className="py-10 text-center">
                  <Users className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                  <h3 className="text-base font-medium text-slate-700 mb-1">No demo requests yet</h3>
                  <p className="text-sm text-slate-400">When a client requests a demo with you, it will appear here with meeting details.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {demoRequests.map((demo, idx) => (
                  <motion.div key={demo.demoId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card className="border border-slate-200 shadow-sm hover:border-cyan-300 transition-all bg-white hover:shadow-cyan-100 hover:shadow-lg">
                      <CardContent className="p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-base">{demo.projectTitle || 'Demo Request'}</h3>
                            {demo.clientName && (
                              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" /> Client: {demo.clientName}
                              </p>
                            )}
                          </div>
                          <Badge className={`text-[11px] shrink-0 ${
                            demo.status?.toLowerCase() === 'approved' || demo.status?.toLowerCase() === 'scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            demo.status?.toLowerCase() === 'pending' || demo.status?.toLowerCase() === 'pending_approval' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            demo.status?.toLowerCase() === 'completed' || demo.status?.toLowerCase() === 'demo completed' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                            demo.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-slate-100 text-slate-400'
                          }`}>{demo.status}</Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {demo.budget !== undefined && demo.budget > 0 && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Budget</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <IndianRupee className="h-3.5 w-3.5 text-cyan-600" />
                                {demo.budget.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {demo.scheduledDate && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Demo Date</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                                {new Date(demo.scheduledDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {demo.scheduledTime && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Time {demo.timezone ? `(${demo.timezone})` : ''}</p>
                              <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-orange-600" />
                                {demo.scheduledTime}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Meeting Link */}
                        {demo.demoMeetingLink && (
                          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Meeting Link</p>
                            <a href={demo.demoMeetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:text-cyan-700 underline underline-offset-2 break-all flex items-center gap-1.5">
                              <Zap className="h-3.5 w-3.5 shrink-0" />
                              {demo.demoMeetingLink}
                            </a>
                          </div>
                        )}

                        {/* Admin Comments */}
                        {demo.adminComments && (
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Admin Notes</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{demo.adminComments}</p>
                          </div>
                        )}

                        {/* Timestamp */}
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
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* Interest Detail Dialog */}
      <Dialog open={!!selectedInterest} onOpenChange={(open) => !open && setSelectedInterest(null)}>
        <DialogContent className="sm:max-w-lg border-slate-200 shadow-2xl overflow-hidden p-0 bg-white" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Interest Details</DialogTitle>
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500" />
          {selectedInterest && (
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-900">{selectedInterest.requirement?.title || `Requirement #${selectedInterest.requirementId}`}</h2>
                  {selectedInterest.requirement?.description && (
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{selectedInterest.requirement.description}</p>
                  )}
                </div>
                <Badge className={`shrink-0 text-xs ${
                  selectedInterest.status?.toLowerCase() === 'interested' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  selectedInterest.status?.toLowerCase() === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedInterest.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-slate-100 text-slate-400'
                }`}>{selectedInterest.status}</Badge>
              </div>

              {selectedInterest.requirement?.skillsRequired && (
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-2">Skills Required</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterest.requirement.skillsRequired.split(',').map((skill, si) => (
                      <Badge key={si} className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs px-2.5 py-1 font-normal">{skill.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {selectedInterest.requirement?.budget !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-cyan-600" />
                      {selectedInterest.requirement.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedInterest.requirement?.minExperience !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-orange-600" />
                      {selectedInterest.requirement.minExperience}+ years
                    </p>
                  </div>
                )}
                {selectedInterest.requirement?.country && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Country</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                      {selectedInterest.requirement.country}
                    </p>
                  </div>
                )}
                {selectedInterest.requirement?.language && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Language</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <Languages className="h-3.5 w-3.5 text-emerald-600" />
                      {selectedInterest.requirement.language}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Send className="h-3.5 w-3.5 text-indigo-600" />
                  Applied: {new Date(selectedInterest.createdOn).toLocaleDateString()} {new Date(selectedInterest.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {selectedInterest.requirement?.createdOn && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Posted: {new Date(selectedInterest.requirement.createdOn).toLocaleDateString()}
                  </span>
                )}
              </div>

              {selectedInterest.requirement?.status && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Requirement Status:</span>
                  <Badge className={`text-xs ${selectedInterest.requirement.status.toLowerCase() === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>{selectedInterest.requirement.status}</Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
