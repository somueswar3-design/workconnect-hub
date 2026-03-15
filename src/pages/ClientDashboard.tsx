import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Users, Briefcase, Clock, Languages, MapPin, 
  IndianRupee, DollarSign, Calendar, ChevronLeft, ChevronRight, 
  Star, Zap, Filter, X, Send, Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getFreelancerProfiles, getFilteredFreelancers, getDemoRequests, FreelancerProfileDto, FreelancerFilterParams, requestDemo, RequestDemoDto, DemoRequestResponse } from '@/services/clientApi';
import DashboardLayout from '@/layouts/DashboardLayout';
import ChangePassword from '@/pages/ChangePassword';

const ITEMS_PER_PAGE = 10;

const freelancingExpLabel: Record<number, string> = {
  0: 'New', 1: '<1 Year', 2: '1-3 Years', 3: '3-5 Years', 4: '5+ Years',
};

const ClientOverview = () => {
  const [profiles, setProfiles] = useState<FreelancerProfileDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterMinExp, setFilterMinExp] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Demo dialog state
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfileDto | null>(null);
  const [demoForm, setDemoForm] = useState({
    projectTitle: '',
    description: '',
    clientBudget: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const loadProfiles = async (filters?: FreelancerFilterParams) => {
    setIsLoading(true);
    setHasError(false);
    try {
      const hasFilters = filters && (filters.skill || filters.language || filters.country || filters.minExperience !== undefined);
      const data = await getFilteredFreelancers(filters || {});
      setIsFiltering(!!hasFilters);

      setProfiles(data);
    } catch (error) {
      console.error('Failed to load freelancer profiles:', error);
      setHasError(true);
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProfiles(); }, []);

  const handleApplyFilters = () => {
    const filters: FreelancerFilterParams = {};
    if (filterSkill.trim()) filters.skill = filterSkill.trim();
    if (filterLanguage.trim()) filters.language = filterLanguage.trim();
    if (filterCountry.trim()) filters.country = filterCountry.trim();
    if (filterMinExp) filters.minExperience = Number(filterMinExp);
    loadProfiles(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterSkill('');
    setFilterLanguage('');
    setFilterCountry('');
    setFilterMinExp('');
    loadProfiles();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(profiles.length / ITEMS_PER_PAGE);
  const paginated = profiles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getCurrencySymbol = (country?: string) => {
    if (!country) return '$';
    const c = country.toLowerCase();
    if (c.includes('india')) return '₹';
    if (c.includes('united kingdom')) return '£';
    if (c.includes('euro')) return '€';
    return '$';
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDemoClick = (freelancer: FreelancerProfileDto) => {
    setSelectedFreelancer(freelancer);
    setDemoForm({
      projectTitle: '',
      description: '',
      clientBudget: '',
      contactEmail: user?.email || '',
      contactPhone: '',
    });
    setDemoOpen(true);
  };

  const handleDemoSubmit = async () => {
    if (!selectedFreelancer) return;
    if (!demoForm.projectTitle.trim() || !demoForm.contactEmail.trim()) {
      toast({ title: 'Validation', description: 'Project title and email are required', variant: 'destructive' });
      return;
    }

    setDemoSubmitting(true);
    try {
      const payload: RequestDemoDto = {
        id: 0,
        clientId: Number(user?.userId) || 0,
        freelancerId: selectedFreelancer.freelancerId || selectedFreelancer.id || 0,
        projectTitle: demoForm.projectTitle.trim(),
        description: demoForm.description.trim(),
        clientBudget: Number(demoForm.clientBudget) || 0,
        contactEmail: demoForm.contactEmail.trim(),
        contactPhone: demoForm.contactPhone.trim(),
        status: 'Pending',
        adminComments: '',
        createdOn: new Date().toISOString(),
      };
      await requestDemo(payload);
      toast({ title: '🎉 Demo Requested!', description: 'Thank you! Our admin team will coordinate the demo process with you shortly.' });
      setDemoOpen(false);
    } catch (error) {
      console.error('Demo request failed:', error);
      toast({ title: 'Error', description: 'Failed to submit demo request. Please try again.', variant: 'destructive' });
    } finally {
      setDemoSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <>
    <div className="p-4 sm:p-6 flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Freelancer Directory</h1>
          <p className="text-xs text-slate-400">{profiles.length} professionals found</p>
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`gap-1.5 h-8 text-xs ${!showFilters ? 'border-slate-700/50 text-slate-300 hover:bg-slate-700/50' : ''}`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {isFiltering && <Badge className="bg-cyan-400 text-[#0A1628] h-4 w-4 p-0 flex items-center justify-center text-[9px] ml-1">✓</Badge>}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card className="border border-slate-700/50 shadow-sm bg-[#0D1B2E]">
              <CardContent className="p-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Skill</Label>
                    <Input placeholder="e.g. React" value={filterSkill} onChange={e => setFilterSkill(e.target.value)} className="h-8 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Language</Label>
                    <Input placeholder="e.g. Telugu" value={filterLanguage} onChange={e => setFilterLanguage(e.target.value)} className="h-8 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Country</Label>
                    <Input placeholder="e.g. India" value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="h-8 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Min Exp (yrs)</Label>
                    <Input type="number" placeholder="e.g. 4" value={filterMinExp} onChange={e => setFilterMinExp(e.target.value)} className="h-8 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" min={0} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" onClick={handleApplyFilters} className="gap-1 h-7 text-xs px-3 bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Search className="h-3 w-3" /> Apply
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleClearFilters} className="gap-1 h-7 text-xs px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50">
                    <X className="h-3 w-3" /> Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Results */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {hasError ? (
          <Card className="border border-red-500/20 bg-red-500/5">
            <CardContent className="py-12 text-center space-y-3">
              <div className="h-14 w-14 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Unable to Load</h3>
              <p className="text-sm text-slate-400">Could not connect to server.</p>
              <Button onClick={() => loadProfiles()} variant="outline" size="sm" className="gap-1.5 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                <Zap className="h-3.5 w-3.5" /> Retry
              </Button>
            </CardContent>
          </Card>
        ) : paginated.length === 0 ? (
          <Card className="border-0 shadow-sm bg-[#0D1B2E]">
            <CardContent className="py-12 text-center space-y-3">
              <Users className="h-10 w-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-slate-100">No Freelancers Found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {paginated.map((p, idx) => {
              const skills = p.primarySkills ? p.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
              const languages = p.languagesKnown ? p.languagesKnown.split(',').map(s => s.trim()).filter(Boolean) : [];
              const symbol = getCurrencySymbol(p.country);
              const expYears = p.experience ?? p.experienceYears ?? 0;
              const fId = p.freelancerId || p.id || idx;

              return (
                <motion.div
                  key={fId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <Card className="border border-slate-700/50 hover:border-cyan-500/30 transition-all shadow-sm hover:shadow bg-[#0D1B2E]">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                          {p.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-slate-100 text-sm truncate">{p.fullName}</h3>
                            <Button
                              size="sm"
                              className="gap-1 h-7 text-[11px] font-semibold px-3 shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white"
                              onClick={() => handleDemoClick(p)}
                            >
                              <Zap className="h-3 w-3" /> Demo
                            </Button>
                          </div>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-2">
                            {p.country && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" /> {p.country}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Briefcase className="h-3 w-3" /> {expYears} yrs
                            </span>
                            {p.hourRate && (
                              <span className="flex items-center gap-0.5 font-medium text-slate-200">
                                {symbol}{p.hourRate}/hr
                              </span>
                            )}
                            {languages.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <Languages className="h-3 w-3" /> {languages.join(', ')}
                              </span>
                            )}
                          </div>

                          {/* Skills */}
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {skills.slice(0, 5).map((skill, si) => (
                                <Badge key={si} className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] px-1.5 py-0 font-normal h-5">{skill}</Badge>
                              ))}
                              {skills.length > 5 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-slate-700/50 text-slate-400">+{skills.length - 5}</Badge>
                              )}
                            </div>
                          )}

                          {/* Portfolio */}
                          {p.portfolioURL && (
                            <a href={p.portfolioURL} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline mt-1 inline-block">
                              View Portfolio →
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-3 pb-1 border-t border-slate-700/50 mt-3 shrink-0">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 px-2 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 disabled:opacity-30">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'string' ? (
              <span key={`e-${idx}`} className="px-1 text-slate-500 text-xs">...</span>
            ) : (
              <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className={`h-7 w-7 p-0 text-xs ${page === currentPage ? 'bg-cyan-500 text-white' : 'border-slate-700/50 text-slate-300 hover:bg-slate-700/50'}`}>
                {page}
              </Button>
            )
          )}
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-7 px-2 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 disabled:opacity-30">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] text-slate-500 ml-2">
            {currentPage}/{totalPages}
          </span>
        </div>
      )}
    </div>

      {/* Demo Request Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-lg bg-[#0D1B2E] border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <Zap className="h-5 w-5 text-cyan-400" />
              Request a Demo
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Request a demo session with <span className="font-semibold text-slate-200">{selectedFreelancer?.fullName}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Project Title <span className="text-red-400">*</span></Label>
              <Input placeholder="e.g. E-commerce Website Development" value={demoForm.projectTitle} onChange={e => setDemoForm(f => ({ ...f, projectTitle: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Description</Label>
              <Textarea placeholder="Briefly describe your project requirements..." value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} rows={3} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-300">Budget</Label>
                <Input type="number" placeholder="e.g. 5000" value={demoForm.clientBudget} onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))} min={0} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-300">Contact Phone</Label>
                <Input placeholder="Your phone number" value={demoForm.contactPhone} onChange={e => setDemoForm(f => ({ ...f, contactPhone: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Contact Email <span className="text-red-400">*</span></Label>
              <Input type="email" placeholder="your@email.com" value={demoForm.contactEmail} onChange={e => setDemoForm(f => ({ ...f, contactEmail: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDemoOpen(false)} disabled={demoSubmitting} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Cancel</Button>
              <Button onClick={handleDemoSubmit} disabled={demoSubmitting} className="gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white">
                {demoSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ===== My Demo Requests Page =====
const MyDemoRequests = () => {
  const [requests, setRequests] = useState<DemoRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const data = await getDemoRequests(user?.userId || '');
        setRequests(data);
      } catch (err) {
        console.error('Failed to load demo requests:', err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.userId]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved' || s === 'accepted') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s === 'rejected' || s === 'declined') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (s === 'in progress' || s === 'inprogress') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (s === 'requested') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-100">My Demo Requests</h1>
        <p className="text-xs text-slate-400 mt-0.5">Track your submitted demo requests and their status</p>
      </div>

      {hasError ? (
        <Card className="border border-red-500/20 bg-red-500/5">
          <CardContent className="py-12 text-center space-y-3">
            <X className="h-10 w-10 text-red-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-100">Unable to Load Requests</h3>
            <p className="text-sm text-slate-400">Could not connect to server.</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
              <Zap className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card className="border-0 bg-[#0D1B2E]">
          <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500" />
          <CardContent className="py-16 text-center space-y-4">
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center">
              <Send className="h-10 w-10 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">No Demo Requests Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">Browse the freelancer directory and request demos to get started with your projects.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border border-slate-700/50 bg-[#0D1B2E]">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-extrabold text-slate-100">{requests.length}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-700/50 bg-[#0D1B2E]">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-extrabold text-amber-400">{requests.filter(r => ['pending', 'requested'].includes(r.status?.toLowerCase())).length}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Requested</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-700/50 bg-[#0D1B2E]">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-extrabold text-emerald-400">{requests.filter(r => ['approved', 'accepted'].includes(r.status?.toLowerCase())).length}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Approved</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-700/50 bg-[#0D1B2E]">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-extrabold text-indigo-400">{requests.filter(r => r.status?.toLowerCase().includes('progress')).length}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">In Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Request Cards */}
          {requests.map((req, idx) => (
            <motion.div
              key={req.id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className="border border-slate-700/50 bg-[#0D1B2E] hover:border-cyan-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-100 text-sm truncate">{req.projectTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Freelancer ID: {req.freelancerId}</p>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${getStatusColor(req.status)}`}>
                      {req.status || 'Pending'}
                    </Badge>
                  </div>

                  {req.description && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{req.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-700/30">
                    {req.clientBudget > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-cyan-400" />
                        <span className="text-slate-200 font-medium">₹{req.clientBudget.toLocaleString()}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(req.createdOn).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      {req.contactEmail}
                    </span>
                    {req.adminComments && (
                      <span className="flex items-center gap-1 text-indigo-300">
                        <Star className="h-3 w-3" />
                        {req.adminComments}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <DashboardLayout userType="client">
      <Routes>
        <Route path="/" element={<ClientOverview />} />
        <Route path="/freelancers" element={<ClientOverview />} />
        <Route path="/demo-requests" element={<MyDemoRequests />} />
        <Route path="/history" element={<ClientOverview />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="/settings/*" element={<ClientOverview />} />
        <Route path="*" element={<ClientOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;
