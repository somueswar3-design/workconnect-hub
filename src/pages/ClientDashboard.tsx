import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Users, Briefcase, Clock, Languages, MapPin, 
  IndianRupee, DollarSign, Calendar, ChevronLeft, ChevronRight, 
  Star, Zap, Filter, X, Send, Search, PlusCircle, FileText
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
import { countries } from '@/data/countries';
import { getFreelancerProfiles, getFilteredFreelancers, getDemoRequests, FreelancerProfileDto, FreelancerFilterParams, requestDemo, RequestDemoDto, DemoRequestResponse, postRequirement, getClientRequirements, ClientRequirementResponse } from '@/services/clientApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    budgetCountry: 'India',
  });
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      budgetCountry: 'India',
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
        clientId: parseInt(user?.userId || '0', 10) || 0,
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
      toast({ title: '🎉 Demo Requested!', description: 'Your request has been submitted. The freelancer and admin team will be notified shortly.' });
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
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Freelancer Directory</h1>
          <p className="text-xs text-slate-400">{profiles.length} professionals found</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/client/post-requirement')}
            className="gap-1.5 h-8 text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 font-semibold animate-pulse hover:animate-none"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Post Requirement
          </Button>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-1.5 h-8 text-xs ${showFilters ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'}`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {isFiltering && <Badge className="bg-cyan-400 text-[#0A1628] h-4 w-4 p-0 flex items-center justify-center text-[9px] ml-1">✓</Badge>}
          </Button>
        </div>
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
                  <Button size="sm" variant="outline" onClick={handleClearFilters} className="gap-1 h-7 text-xs px-3 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
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
            <CardContent className="py-12 text-center space-y-4">
              <Users className="h-10 w-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-slate-100">No Freelancers Found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filters or post your own requirement.</p>
              <Button
                size="sm"
                onClick={() => navigate('/client/post-requirement')}
                className="gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 font-semibold"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Post Your Requirement
              </Button>
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
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Country (Currency)</Label>
              <Select value={demoForm.budgetCountry} onValueChange={v => setDemoForm(f => ({ ...f, budgetCountry: v }))}>
                <SelectTrigger className="w-full bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent className="max-h-60 bg-[#0D1B2E] border-slate-700/50">
                  {countries.map(c => (
                    <SelectItem key={c.code} value={c.name} className="text-slate-200 focus:bg-slate-700/50 focus:text-slate-100">{c.name} ({c.currencySymbol} {c.currency})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-300">Budget ({countries.find(c => c.name === demoForm.budgetCountry)?.currencySymbol || '₹'})</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">{countries.find(c => c.name === demoForm.budgetCountry)?.currencySymbol || '₹'}</span>
                  <Input type="number" placeholder="e.g. 5000" value={demoForm.clientBudget} onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))} min={0} className="pl-8 bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
                </div>
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

// ===== My Requests Page (Demo + Requirements) =====
const MyRequests = () => {
  const [demoRequests, setDemoRequests] = useState<DemoRequestResponse[]>([]);
  const [requirements, setRequirements] = useState<ClientRequirementResponse[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(true);
  const [loadingReq, setLoadingReq] = useState(true);
  const [hasErrorDemo, setHasErrorDemo] = useState(false);
  const [hasErrorReq, setHasErrorReq] = useState(false);
  const [connectingReqId, setConnectingReqId] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadDemo = async () => {
      setLoadingDemo(true);
      setHasErrorDemo(false);
      try {
        const data = await getDemoRequests(user?.userId || '');
        setDemoRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load demo requests:', err);
        setHasErrorDemo(true);
      } finally {
        setLoadingDemo(false);
      }
    };
    const loadReq = async () => {
      setLoadingReq(true);
      setHasErrorReq(false);
      try {
        const data = await getClientRequirements(user?.userId || '');
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
        setRequirements(arr);
      } catch (err) {
        console.error('Failed to load requirements:', err);
        setHasErrorReq(true);
      } finally {
        setLoadingReq(false);
      }
    };
    loadDemo();
    loadReq();
  }, [user?.userId]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved' || s === 'accepted' || s === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'rejected' || s === 'declined' || s === 'closed') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'in progress' || s === 'inprogress') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (s === 'requested' || s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s === 'open') return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const handleLetsConnect = async (req: ClientRequirementResponse) => {
    setConnectingReqId(req.id);
    try {
      const payload: RequestDemoDto = {
        id: 0,
        clientId: parseInt(user?.userId || '0', 10) || 0,
        freelancerId: 0,
        projectTitle: req.title,
        description: req.description || '',
        clientBudget: req.budget || 0,
        contactEmail: user?.email || '',
        contactPhone: '',
        status: 'Pending',
        adminComments: `Skills: ${req.skillsRequired || ''} | Exp: ${req.minExperience || 0}+ yrs | Country: ${req.country || 'Any'} | Language: ${req.language || 'Any'}`,
        createdOn: new Date().toISOString(),
      };
      await requestDemo(payload);
      toast({ title: '🎉 Request Sent!', description: 'Our team will notify matching freelancers and connect you for a demo shortly.' });
      // Refresh demo requests
      try {
        const data = await getDemoRequests(user?.userId || '');
        setDemoRequests(data);
      } catch {}
    } catch (error) {
      console.error('Connect request failed:', error);
      toast({ title: 'Error', description: 'Failed to send request. Please try again.', variant: 'destructive' });
    } finally {
      setConnectingReqId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track your posted requirements and demo requests</p>
      </div>

      {/* Summary Stats - White theme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-extrabold text-gray-900">{demoRequests.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Demo Requests</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-extrabold text-cyan-600">{requirements.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Requirements</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-extrabold text-amber-600">{demoRequests.filter(r => ['pending', 'requested'].includes(r.status?.toLowerCase())).length + requirements.filter(r => ['pending', 'open'].includes(r.status?.toLowerCase())).length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pending</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-extrabold text-emerald-600">{demoRequests.filter(r => ['approved', 'accepted'].includes(r.status?.toLowerCase())).length + requirements.filter(r => ['completed', 'approved'].includes(r.status?.toLowerCase())).length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requirements" className="w-full">
        <TabsList className="bg-white border border-gray-200 w-full sm:w-auto shadow-sm">
          <TabsTrigger value="requirements" className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 text-gray-500 gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            Posted Requirements ({requirements.length})
          </TabsTrigger>
          <TabsTrigger value="demos" className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 text-gray-500 gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5" />
            Demo Requests ({demoRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* Requirements Tab - Grid Layout */}
        <TabsContent value="requirements" className="mt-4">
          {loadingReq ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : hasErrorReq ? (
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="py-12 text-center space-y-3">
                <X className="h-10 w-10 text-red-400 mx-auto" />
                <h3 className="text-base font-semibold text-gray-900">Unable to Load Requirements</h3>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Zap className="h-3.5 w-3.5 mr-1" /> Retry
                </Button>
              </CardContent>
            </Card>
          ) : requirements.length === 0 ? (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500" />
              <CardContent className="py-16 text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-cyan-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Requirements Posted Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">Post your project requirements and matching freelancers will show interest.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((req, idx) => {
                const skills = req.skillsRequired ? req.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : [];
                return (
                  <motion.div
                    key={req.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-cyan-300 transition-all h-full flex flex-col">
                      <CardContent className="p-4 flex flex-col flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{req.title}</h3>
                            {req.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{req.description}</p>}
                          </div>
                          <Badge className={`text-[10px] shrink-0 ${getStatusColor(req.status)}`}>
                            {req.status || 'Open'}
                          </Badge>
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {skills.slice(0, 4).map((skill, si) => (
                              <Badge key={si} className="bg-cyan-50 text-cyan-700 border-cyan-200 text-[10px] px-1.5 py-0 font-normal h-5">{skill}</Badge>
                            ))}
                            {skills.length > 4 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-gray-300 text-gray-500">+{skills.length - 4}</Badge>
                            )}
                          </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs flex-1">
                          {req.budget > 0 && (
                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2 py-1.5">
                              <DollarSign className="h-3 w-3 text-cyan-500" />
                              <span className="text-gray-900 font-medium">₹{req.budget.toLocaleString()}</span>
                            </div>
                          )}
                          {req.minExperience > 0 && (
                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2 py-1.5">
                              <Briefcase className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">{req.minExperience}+ yrs</span>
                            </div>
                          )}
                          {req.country && (
                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2 py-1.5">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700 truncate">{req.country}</span>
                            </div>
                          )}
                          {req.language && (
                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2 py-1.5">
                              <Languages className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700 truncate">{req.language}</span>
                            </div>
                          )}
                        </div>

                        {/* Footer: Date + Let's Connect */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock className="h-3 w-3" />
                            {new Date(req.createdOn).toLocaleDateString()}
                          </span>
                          {req.status?.toLowerCase() === 'open' && (
                            <Button
                              size="sm"
                              onClick={() => handleLetsConnect(req)}
                              disabled={connectingReqId === req.id}
                              className="h-7 px-3 text-xs gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full"
                            >
                              {connectingReqId === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                              {connectingReqId === req.id ? 'Sending...' : "Let's Connect"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Demo Requests Tab - Grid Layout */}
        <TabsContent value="demos" className="mt-4">
          {loadingDemo ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : hasErrorDemo ? (
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="py-12 text-center space-y-3">
                <X className="h-10 w-10 text-red-400 mx-auto" />
                <h3 className="text-base font-semibold text-gray-900">Unable to Load Requests</h3>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Zap className="h-3.5 w-3.5 mr-1" /> Retry
                </Button>
              </CardContent>
            </Card>
          ) : demoRequests.length === 0 ? (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500" />
              <CardContent className="py-16 text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
                  <Send className="h-10 w-10 text-cyan-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Demo Requests Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">Browse the freelancer directory and request demos to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoRequests.map((req, idx) => (
                <motion.div
                  key={req.demoId || idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-cyan-300 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{req.projectTitle}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Freelancer: {req.freelancerName || `ID ${req.freelancerId}`}</p>
                        </div>
                        <Badge className={`text-[10px] shrink-0 ${getStatusColor(req.status)}`}>
                          {req.status || 'Requested'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-100">
                        {req.budget > 0 && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-cyan-500" />
                            <span className="text-gray-900 font-medium">₹{req.budget.toLocaleString()}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(req.requestedOn).toLocaleDateString()}
                        </span>
                        {req.adminComments && (
                          <span className="flex items-center gap-1 text-indigo-600">
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
        </TabsContent>
      </Tabs>

    </div>
  );
};

// ===== Post Requirement Page =====
const PostRequirement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    projectTitle: '',
    description: '',
    requiredSkills: '',
    budget: '',
    experienceLevel: '',
    language: '',
    country: '',
    contactEmail: user?.email || '',
    countryCode: '+91',
    contactPhone: '',
  });

  const handleSubmit = async () => {
    if (!form.projectTitle.trim() || !form.requiredSkills.trim() || !form.contactEmail.trim()) {
      toast({ title: 'Validation', description: 'Project title, required skills, and email are required.', variant: 'destructive' });
      return;
    }
    if (!form.contactPhone.trim() || form.contactPhone.trim().length < 7) {
      toast({ title: 'Validation', description: 'A valid mobile number with country code is required.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await postRequirement({
        id: 0,
        clientUserId: Number(user?.userId) || 0,
        mobileNumber: `${form.countryCode}${form.contactPhone}`,
        email: form.contactEmail,
        title: form.projectTitle,
        description: form.description,
        skillsRequired: form.requiredSkills,
        minExperience: Number(form.experienceLevel) || 0,
        budget: Number(form.budget) || 0,
        country: form.country,
        language: form.language,
        status: 'Pending',
        allocatedFreelancerId: 0,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      });
      toast({ title: '🎉 Requirement Posted!', description: 'Your requirement has been posted. We will notify matching freelancers shortly.' });
      setForm({ projectTitle: '', description: '', requiredSkills: '', budget: '', experienceLevel: '', language: '', country: '', contactEmail: user?.email || '', countryCode: '+91', contactPhone: '' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to post requirement.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Post a Requirement</h1>
        <p className="text-xs text-slate-400 mt-0.5">Can't find the right freelancer? Post your project requirements and we'll notify matching professionals.</p>
      </div>

      <Card className="border border-slate-700/50 bg-[#0D1B2E]">
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500" />
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-300">Project Title <span className="text-red-400">*</span></Label>
            <Input placeholder="e.g. E-commerce Platform Development" value={form.projectTitle} onChange={e => setForm(f => ({ ...f, projectTitle: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-300">Description</Label>
            <Textarea placeholder="Describe your project in detail — what you need, timeline, etc." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-300">Required Skills <span className="text-red-400">*</span></Label>
            <Input placeholder="e.g. React, Node.js, Python (comma separated)" value={form.requiredSkills} onChange={e => setForm(f => ({ ...f, requiredSkills: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Budget</Label>
              <Input type="number" placeholder="e.g. 5000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} min={0} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Min Experience (yrs)</Label>
              <Input type="number" placeholder="e.g. 3" value={form.experienceLevel} onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))} min={0} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Preferred Language</Label>
              <Input placeholder="e.g. English, Telugu" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Preferred Country</Label>
              <Input placeholder="e.g. India" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-300">Mobile Number <span className="text-red-400">*</span></Label>
              <div className="flex gap-1.5">
                <Select value={form.countryCode} onValueChange={val => setForm(f => ({ ...f, countryCode: val }))}>
                  <SelectTrigger className="w-24 h-9 bg-[#0A1628] border-slate-700/50 text-slate-200 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1B2E] border-slate-700/50">
                    <SelectItem value="+91" className="text-slate-200">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1" className="text-slate-200">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44" className="text-slate-200">🇬🇧 +44</SelectItem>
                    <SelectItem value="+61" className="text-slate-200">🇦🇺 +61</SelectItem>
                    <SelectItem value="+971" className="text-slate-200">🇦🇪 +971</SelectItem>
                    <SelectItem value="+65" className="text-slate-200">🇸🇬 +65</SelectItem>
                    <SelectItem value="+49" className="text-slate-200">🇩🇪 +49</SelectItem>
                    <SelectItem value="+81" className="text-slate-200">🇯🇵 +81</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="e.g. 9876543210" value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '') }))} className="flex-1 bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" maxLength={15} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-300">Contact Email <span className="text-red-400">*</span></Label>
            <Input type="email" placeholder="your@email.com" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/30">
            <Button onClick={handleSubmit} disabled={submitting} className="gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post Requirement
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-700/50 bg-[#0D1B2E]/50">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">How it works</p>
            <p className="text-xs text-slate-400 mt-0.5">Once posted, our system will match your requirements with available freelancers and notify them. You'll also receive email updates when matching freelancers are found.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <DashboardLayout userType="client">
      <Routes>
        <Route path="/" element={<MyRequests />} />
        <Route path="/freelancers" element={<ClientOverview />} />
        <Route path="/demo-requests" element={<MyRequests />} />
        <Route path="/post-requirement" element={<PostRequirement />} />
        <Route path="/history" element={<MyRequests />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="/settings/*" element={<MyRequests />} />
        <Route path="*" element={<MyRequests />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;
