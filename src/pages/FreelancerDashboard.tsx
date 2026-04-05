import { useState, useRef, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import ChangePassword from './ChangePassword';
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
        <Card className="border border-slate-700/50 shadow-sm bg-gradient-to-br from-cyan-500/10 to-transparent bg-[#0D1B2E]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Total Earnings</p>
              <p className="text-xl font-extrabold text-slate-100 truncate">
                {earnings ? `${getCurrencySymbol(earnings.currency)}${earnings.earnedAmount.toLocaleString()}` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 shadow-sm bg-[#0D1B2E]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6 text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Active Projects</p>
              <p className="text-xl font-extrabold text-slate-100">{activeAssignments.length}</p>
            </div>
            {activeAssignments.length > 0 && (
              <Button variant="ghost" size="sm" className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/50" onClick={() => setActiveTab('assignments')}>
                View <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 shadow-sm bg-[#0D1B2E]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Completed</p>
              <p className="text-xl font-extrabold text-slate-100">{completedAssignments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Openings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cyan-400" /> Job Openings
        </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input placeholder="Search by skill, title, or keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-[#0D1B2E] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
              </div>
              <Badge variant="outline" className="px-3 py-2 text-xs shrink-0 border-slate-700/50 text-slate-400">{filteredOpenings.length} openings</Badge>
            </div>

            {openingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="border border-slate-700/50 shadow-sm animate-pulse bg-[#0D1B2E]">
                    <CardContent className="p-5"><div className="h-5 bg-slate-700 rounded w-2/3 mb-3" /><div className="h-4 bg-slate-700 rounded w-1/3 mb-4" /><div className="h-3 bg-slate-700 rounded w-full mb-2" /><div className="h-3 bg-slate-700 rounded w-3/4" /></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredOpenings.length === 0 ? (
              <Card className="border-0 shadow-lg overflow-hidden bg-[#0D1B2E]">
                <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500" />
                <CardContent className="py-16 text-center space-y-6">
                  <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">No Openings Available Right Now</h3>
                    <p className="text-slate-400 max-w-md mx-auto leading-relaxed">New freelancing requirements are posted regularly by clients. Keep your profile updated and stay online to get matched!</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium">
                    <Bell className="h-4 w-4" /> We'll notify you when new openings match your skills!
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredOpenings.map((job, idx) => (
                  <motion.div key={job.id || idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card className="border border-slate-700/50 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all group cursor-pointer bg-[#0D1B2E]">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-100 text-base group-hover:text-cyan-400 transition-colors truncate">{job.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-slate-400 flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.clientName}</span>
                              {job.location && <span className="text-sm text-slate-400 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {job.postedDate && <span className="text-xs text-slate-500">{getTimeAgo(job.postedDate)}</span>}
                            <Badge className={`block mt-1 text-[10px] ${job.status?.toLowerCase() === 'open' || job.status?.toLowerCase() === 'active' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-slate-700 text-slate-400'}`}>{job.status || 'Open'}</Badge>
                          </div>
                        </div>
                        {job.description && <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">{job.description}</p>}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {job.skills.map((skill, si) => <Badge key={si} className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[11px] px-2 py-0.5 font-normal">{skill}</Badge>)}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-slate-700/50">
                          {job.budget && (
                            <span className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                              {getCurrencySymbol(job.currency) === '₹' ? <IndianRupee className="h-3.5 w-3.5 text-cyan-400" /> : <DollarSign className="h-3.5 w-3.5 text-cyan-400" />}
                              {job.budget}
                            </span>
                          )}
                          {job.duration && <span className="text-xs text-slate-400 flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> {job.duration}</span>}
                          {job.deadline && <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                          {job.applicants !== undefined && job.applicants > 0 && <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {job.applicants} applicants</span>}
                          {job.postedDate && <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto"><Clock className="h-3.5 w-3.5" /> Posted: {new Date(job.postedDate).toLocaleDateString()} {new Date(job.postedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
      </div>

      {/* My Works - Interest Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-400" /> My Works
          <Badge variant="outline" className="ml-2 border-slate-700/50 text-slate-400 text-xs">{interests.length}</Badge>
        </h2>

        {interestsLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Card key={i} className="border border-slate-700/50 shadow-sm animate-pulse bg-[#0D1B2E]">
                <CardContent className="p-5"><div className="h-5 bg-slate-700 rounded w-2/3 mb-3" /><div className="h-4 bg-slate-700 rounded w-1/3 mb-4" /><div className="h-3 bg-slate-700 rounded w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : interests.length === 0 ? (
          <Card className="border border-slate-700/50 bg-[#0D1B2E]">
            <CardContent className="py-10 text-center">
              <Target className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-medium text-slate-300 mb-1">No interests submitted yet</h3>
              <p className="text-sm text-slate-500">Express interest in job openings above to see them here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {interests.map((interest, idx) => (
              <motion.div key={interest.interestId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => setSelectedInterest(interest)} className="cursor-pointer">
                <Card className="border border-slate-700/50 shadow-sm hover:border-indigo-500/30 transition-all bg-[#0D1B2E] hover:shadow-indigo-500/10 hover:shadow-lg">
                  <CardContent className="p-5 space-y-4">
                    {/* Header: Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-100 text-base">{interest.requirement?.title || `Requirement #${interest.requirementId}`}</h3>
                        {interest.requirement?.description && (
                          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{interest.requirement.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge className={`text-[11px] ${
                          interest.status?.toLowerCase() === 'interested' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' :
                          interest.status?.toLowerCase() === 'accepted' ? 'bg-green-500/15 text-green-300 border-green-500/20' :
                          interest.status?.toLowerCase() === 'rejected' ? 'bg-red-500/15 text-red-300 border-red-500/20' :
                          'bg-slate-700 text-slate-400'
                        }`}>{interest.status}</Badge>
                        {interest.requirement?.status && (
                          <Badge className={`text-[10px] ${interest.requirement.status.toLowerCase() === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-700 text-slate-400'}`}>{interest.requirement.status}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    {interest.requirement?.skillsRequired && (
                      <div className="flex flex-wrap gap-1.5">
                        {interest.requirement.skillsRequired.split(',').map((skill, si) => (
                          <Badge key={si} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-[11px] px-2 py-0.5 font-normal">{skill.trim()}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {interest.requirement?.budget !== undefined && (
                        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Budget</p>
                          <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5 text-cyan-400" />
                            {interest.requirement.budget.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {interest.requirement?.minExperience !== undefined && (
                        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Experience</p>
                          <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-orange-400" />
                            {interest.requirement.minExperience}+ yrs
                          </p>
                        </div>
                      )}
                      {interest.requirement?.country && (
                        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Country</p>
                          <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                            {interest.requirement.country}
                          </p>
                        </div>
                      )}
                      {interest.requirement?.language && (
                        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Language</p>
                          <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                            <Languages className="h-3.5 w-3.5 text-green-400" />
                            {interest.requirement.language}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Timestamps */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-slate-700/50 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Send className="h-3.5 w-3.5 text-indigo-400" />
                        Applied: {new Date(interest.createdOn).toLocaleDateString()} {new Date(interest.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {interest.requirement?.createdOn && (
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock className="h-3.5 w-3.5" />
                          Posted: {new Date(interest.requirement.createdOn).toLocaleDateString()}
                        </span>
                      )}
                      <Eye className="h-3.5 w-3.5 text-cyan-400 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {/* Interest Detail Dialog */}
      <Dialog open={!!selectedInterest} onOpenChange={(open) => !open && setSelectedInterest(null)}>
        <DialogContent className="sm:max-w-lg border-slate-700/50 shadow-2xl overflow-hidden p-0 bg-[#0D1B2E]" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Interest Details</DialogTitle>
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500" />
          {selectedInterest && (
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-100">{selectedInterest.requirement?.title || `Requirement #${selectedInterest.requirementId}`}</h2>
                  {selectedInterest.requirement?.description && (
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{selectedInterest.requirement.description}</p>
                  )}
                </div>
                <Badge className={`shrink-0 text-xs ${
                  selectedInterest.status?.toLowerCase() === 'interested' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' :
                  selectedInterest.status?.toLowerCase() === 'accepted' ? 'bg-green-500/15 text-green-300 border-green-500/20' :
                  selectedInterest.status?.toLowerCase() === 'rejected' ? 'bg-red-500/15 text-red-300 border-red-500/20' :
                  'bg-slate-700 text-slate-400'
                }`}>{selectedInterest.status}</Badge>
              </div>

              {selectedInterest.requirement?.skillsRequired && (
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-2">Skills Required</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterest.requirement.skillsRequired.split(',').map((skill, si) => (
                      <Badge key={si} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-xs px-2.5 py-1 font-normal">{skill.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {selectedInterest.requirement?.budget !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-cyan-400" />
                      {selectedInterest.requirement.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedInterest.requirement?.minExperience !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                    <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-orange-400" />
                      {selectedInterest.requirement.minExperience}+ years
                    </p>
                  </div>
                )}
                {selectedInterest.requirement?.country && (
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Country</p>
                    <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                      {selectedInterest.requirement.country}
                    </p>
                  </div>
                )}
                {selectedInterest.requirement?.language && (
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Language</p>
                    <p className="text-sm font-semibold text-slate-100 flex items-center gap-1">
                      <Languages className="h-3.5 w-3.5 text-green-400" />
                      {selectedInterest.requirement.language}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Send className="h-3.5 w-3.5 text-indigo-400" />
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
                  <Badge className={`text-xs ${selectedInterest.requirement.status.toLowerCase() === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-700 text-slate-400'}`}>{selectedInterest.requirement.status}</Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showNotifyPopup} onOpenChange={setShowNotifyPopup}>
        <DialogContent className="sm:max-w-md border-slate-700/50 shadow-2xl overflow-hidden p-0 bg-[#0D1B2E]" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Profile Under Review</DialogTitle>
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500" />
          <div className="p-8 text-center space-y-6">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center relative">
                <Bell className="h-10 w-10 text-primary" />
                <motion.div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary flex items-center justify-center" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Sparkles className="h-3 w-3 text-secondary-foreground" />
                </motion.div>
              </div>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">🎉 Profile Under Review!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Your profile is being reviewed. Once shortlisted for a matching project, we'll notify you immediately!</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center"><Mail className="h-5 w-5 text-primary" /></div>
                <span className="text-xs font-medium text-primary">Email</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/20 border border-secondary/30">
                <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center"><Phone className="h-5 w-5 text-secondary-foreground" /></div>
                <span className="text-xs font-medium text-secondary-foreground">Phone</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/20 border border-accent/30">
                <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-accent-foreground" /></div>
                <span className="text-xs font-medium text-accent-foreground">Chat</span>
              </motion.div>
            </div>
            <p className="text-xs text-muted-foreground">💡 Tip: Complete your profile and stay <strong>Available</strong> to get matched faster!</p>
            <div className="flex gap-3">
              <Button onClick={() => { setShowNotifyPopup(false); navigate('/freelancer-profile'); }} className="flex-1 gap-2"><User className="h-4 w-4" /> Update Profile</Button>
              <Button variant="outline" onClick={() => setShowNotifyPopup(false)} className="flex-1">Got It!</Button>
            </div>
          </div>
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
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="*" element={<FreelancerOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
