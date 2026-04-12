import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign,
  Globe, Code, Database, Cloud, Lock, TrendingUp, Award,
  Laptop, Search, BarChart3, FileText, Cpu, Palette,
  Building2, GraduationCap, Stethoscope, ShoppingCart, Landmark, Truck,
  Smartphone, Settings, PieChart, MonitorPlay, User, MapPin,
  Languages, ChevronLeft, ChevronRight, Loader2, Send, X, Filter,
  Briefcase, Heart, Play, Sparkles, Phone, Mail, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFilteredFreelancers, FreelancerProfileDto, FreelancerFilterParams, requestDemo, RequestDemoDto, getClientRequirements, ClientRequirementResponse, postRequirement } from '@/services/clientApi';
import { submitFreelancerInterest } from '@/services/freelancerApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/data/countries';

const ITEMS_PER_PAGE = 48;

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const locationState = useLocation();
  const { toast } = useToast();
  const freelancerSectionRef = useRef<HTMLDivElement>(null);
  const worksSectionRef = useRef<HTMLDivElement>(null);

  const [freelancers, setFreelancers] = useState<FreelancerProfileDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSkill, setFilterSkill] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterMinExp, setFilterMinExp] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfileDto | null>(null);
  const [demoForm, setDemoForm] = useState({ projectTitle: '', description: '', clientBudget: '', contactEmail: '', contactPhone: '', budgetCountry: 'India', phoneCountryCode: '+91' });
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<ClientRequirementResponse[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ClientRequirementResponse | null>(null);
  const [interestComment, setInterestComment] = useState('');
  const [interestSubmitting, setInterestSubmitting] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);
  const [postReqOpen, setPostReqOpen] = useState(false);
  const [postReqSubmitting, setPostReqSubmitting] = useState(false);
  const [postReqForm, setPostReqForm] = useState({ projectTitle: '', description: '', requiredSkills: '', budget: '', experienceLevel: '', language: '', country: '', contactEmail: '', countryCode: '+91', contactPhone: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const loadFreelancers = async (filters?: FreelancerFilterParams) => {
    setIsLoading(true); setHasError(false);
    try { const data = await getFilteredFreelancers(filters || {}); setFreelancers(data); setHasLoaded(true); }
    catch { setHasError(true); setFreelancers([]); setHasLoaded(true); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadFreelancers(); loadRequirements(); }, []);

  const loadRequirements = async () => {
    setReqLoading(true);
    try { const data = await getClientRequirements(); setRequirements(data); }
    catch { /* silent */ }
    finally { setReqLoading(false); }
  };

  useEffect(() => {
    (window as any).__scrollToFreelancers = () => freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    (window as any).__scrollToWorks = () => worksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    return () => { delete (window as any).__scrollToFreelancers; delete (window as any).__scrollToWorks; };
  }, []);

  useEffect(() => {
    const state = locationState.state as any;
    if (state?.scrollToFreelancers) setTimeout(() => freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    if (state?.scrollToWorks) setTimeout(() => worksSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  }, [locationState.state]);

  const filtered = useMemo(() => {
    let result = freelancers;
    if (filterSkill.trim()) { const q = filterSkill.toLowerCase(); result = result.filter(f => f.primarySkills?.toLowerCase().includes(q)); }
    if (filterCountry.trim()) { const q = filterCountry.toLowerCase(); result = result.filter(f => f.country?.toLowerCase().includes(q)); }
    if (filterMinExp.trim()) { const minExp = parseInt(filterMinExp); if (!isNaN(minExp)) result = result.filter(f => (f.experience ?? f.experienceYears ?? 0) >= minExp); }
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); result = result.filter(f => f.primarySkills?.toLowerCase().includes(q) || f.fullName?.toLowerCase().includes(q)); }
    return result;
  }, [freelancers, filterSkill, filterCountry, filterMinExp, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterApply = () => { setCurrentPage(1); loadFreelancers({ skill: filterSkill.trim() || undefined, country: filterCountry.trim() || undefined, minExperience: filterMinExp.trim() ? parseInt(filterMinExp) : undefined }); };
  const handleFilterClear = () => { setFilterSkill(''); setFilterCountry(''); setFilterMinExp(''); setCurrentPage(1); loadFreelancers(); };

  const getCurrencySymbol = (country?: string) => { if (!country) return '$'; const c = country.toLowerCase(); if (c.includes('india')) return '₹'; if (c.includes('united kingdom')) return '£'; return '$'; };

  const handleDemoClick = (freelancer: FreelancerProfileDto) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSelectedFreelancer(freelancer);
    setDemoForm({ projectTitle: '', description: '', clientBudget: '', contactEmail: user?.email || '', contactPhone: '', budgetCountry: 'India', phoneCountryCode: '+91' });
    setDemoOpen(true);
  };

  const handleDemoSubmit = async () => {
    if (!selectedFreelancer) return;
    if (!demoForm.projectTitle.trim() || !demoForm.contactEmail.trim() || !demoForm.contactPhone.trim()) { toast({ title: 'Validation', description: 'Project title, phone and email are required', variant: 'destructive' }); return; }
    setDemoSubmitting(true);
    try {
      await requestDemo({ id: 0, clientUserId: parseInt(user?.userId || '0', 10) || 0, freelancerUserId: selectedFreelancer.userId || selectedFreelancer.freelancerId || selectedFreelancer.id || 0, projectTitle: demoForm.projectTitle.trim(), clientBudget: Number(demoForm.clientBudget) || 0, contactEmail: demoForm.contactEmail.trim(), contactPhone: `${demoForm.phoneCountryCode}${demoForm.contactPhone.trim()}`, status: 'Pending', adminDescription: '', createdOn: new Date().toISOString() });
      toast({ title: '🎉 Demo Requested!', description: 'Your request has been submitted successfully.' }); setDemoOpen(false);
    } catch { toast({ title: 'Error', description: 'Failed to submit.', variant: 'destructive' }); }
    finally { setDemoSubmitting(false); }
  };

  const handleHireTalentClick = () => freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleInterestClick = (req: ClientRequirementResponse) => {
    if (!isAuthenticated) { navigate('/register?role=FreeLancer'); return; }
    setSelectedRequirement(req); setInterestComment(''); setInterestSuccess(false); setInterestOpen(true);
  };

  const handleInterestSubmit = async () => {
    if (!selectedRequirement) return;
    setInterestSubmitting(true);
    try { await submitFreelancerInterest({ id: 0, requirementId: selectedRequirement.id, freelancerUserId: parseInt(user?.userId || '0', 10) || 0, comment: interestComment.trim(), status: 'Pending', createdOn: new Date().toISOString() }); setInterestSuccess(true); }
    catch { toast({ title: 'Error', description: 'Failed to submit interest.', variant: 'destructive' }); }
    finally { setInterestSubmitting(false); }
  };

  const openPostRequirement = () => {
    if (!isAuthenticated) { navigate('/register?role=Client'); return; }
    setPostReqForm({ projectTitle: '', description: '', requiredSkills: '', budget: '', experienceLevel: '', language: '', country: '', contactEmail: user?.email || '', countryCode: '+91', contactPhone: '' });
    setPostReqOpen(true);
  };

  const handlePostReqSubmit = async () => {
    if (!postReqForm.projectTitle.trim() || !postReqForm.requiredSkills.trim() || !postReqForm.contactEmail.trim()) { toast({ title: 'Validation', description: 'Project title, skills, and email are required.', variant: 'destructive' }); return; }
    if (!postReqForm.contactPhone.trim() || postReqForm.contactPhone.trim().length < 7) { toast({ title: 'Validation', description: 'Valid mobile number required.', variant: 'destructive' }); return; }
    setPostReqSubmitting(true);
    try {
      await postRequirement({ id: 0, clientUserId: Number(user?.userId) || 0, mobileNumber: `${postReqForm.countryCode}${postReqForm.contactPhone}`, email: postReqForm.contactEmail, title: postReqForm.projectTitle, description: postReqForm.description, skillsRequired: postReqForm.requiredSkills, minExperience: Number(postReqForm.experienceLevel) || 0, budget: Number(postReqForm.budget) || 0, country: postReqForm.country, language: postReqForm.language, status: 'Pending', allocatedFreelancerId: 0, createdOn: new Date().toISOString(), updatedOn: new Date().toISOString() });
      toast({ title: '🎉 Requirement Posted!', description: 'We will match the right professional for you.' }); setPostReqOpen(false); loadRequirements();
    } catch { toast({ title: 'Error', description: 'Failed to post requirement.', variant: 'destructive' }); }
    finally { setPostReqSubmitting(false); }
  };

  const uniqueSkills = useMemo(() => { const s = new Set<string>(); freelancers.forEach(f => f.primarySkills?.split(',').forEach(sk => { const t = sk.trim(); if (t) s.add(t); })); return Array.from(s).sort(); }, [freelancers]);
  const uniqueCountries = useMemo(() => { const c = new Set<string>(); freelancers.forEach(f => { if (f.country?.trim()) c.add(f.country.trim()); }); return Array.from(c).sort(); }, [freelancers]);

  const isFreelancer = isAuthenticated && user?.role?.toLowerCase() === 'freelancer';
  const isClient = isAuthenticated && user?.role?.toLowerCase() === 'client';

  const avatarColors = [
    'bg-amber-700', 'bg-emerald-600', 'bg-cyan-600', 'bg-rose-500', 'bg-violet-600', 'bg-indigo-600',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden flex flex-col">
        {/* Globe Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            poster=""
          >
            <source src="https://cdn.pixabay.com/video/2020/05/31/40205-426958995_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/60 via-[#0B1120]/40 to-[#0B1120]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 mb-8">
              <CheckCircle className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-orange-300 font-medium">Verified IT professionals only</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.05] mb-8 tracking-tight">
              <span className="text-white">Hire Expert</span>
              <br />
              <span className="text-orange-500">IT Professionals</span>
              <br />
              <span className="text-white">On Demand</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Browse verified IT support professionals. Hourly, Part-Time, or Full-Time — flexible and ready for your project timeline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleHireTalentClick}
                className="gap-3 text-base px-8 h-13 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-2xl shadow-orange-500/25 border-0">
                <Search className="h-5 w-5" /> Find talent
              </Button>
              {isAuthenticated ? (
                <Button size="lg" variant="outline"
                  className="gap-3 text-base px-8 h-13 bg-transparent border-slate-600 text-white hover:bg-slate-800 font-bold rounded-full"
                  onClick={() => { freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Calendar className="h-5 w-5" /> Request Demo / Interview
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="outline" asChild
                    className="gap-3 text-base px-8 h-13 bg-transparent border-slate-600 text-white hover:bg-slate-800 font-bold rounded-full">
                    <Link to="/register?role=FreeLancer">
                      <Briefcase className="h-5 w-5" /> Join as professional
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild
                    className="gap-3 text-base px-8 h-13 bg-transparent border-slate-600 text-white hover:bg-slate-800 font-bold rounded-full">
                    <Link to="/login">
                      <ArrowRight className="h-5 w-5" /> Log in
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Bar - in normal flow, not overlapping */}
        <div className="relative z-10 border-t border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {[
                { value: '2,480+', label: 'IT professionals' },
                { value: '348', label: 'Live projects' },
                { value: '94%', label: 'Satisfaction rate' },
                { value: '48h', label: 'Avg. time to hire' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ WHO IS IT FOR ══════════════════ */}
      <section className="py-24 bg-[#0B1120]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">WHO IS IT FOR?</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white italic">One platform, every role</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Freelancer', desc: 'IT professionals seeking hourly, part-time, or full-time work support contracts', icon: Briefcase, color: 'bg-amber-800/60' },
              { title: 'Client', desc: 'Businesses and individuals needing verified IT professionals for projects', icon: Building2, color: 'bg-cyan-800/60' },
              { title: 'HR / Recruiter', desc: 'HR teams and recruiting agencies sourcing IT talent with full workflow management', icon: Users, color: 'bg-violet-800/60' },
            ].map((item, i) => (
              <div key={item.title}>
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center hover:border-slate-700 transition-all h-full">
                  <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-5`}>
                    <item.icon className="h-7 w-7 text-white/80" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="py-24 bg-[#0B1120]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white italic">Simple. Transparent. Fast.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { num: '01', title: 'Search & discover', desc: 'Browse verified IT professionals or post your project. Filter by skills, rate, availability.' },
              { num: '02', title: 'Interview & agree', desc: 'Book time slots, conduct interviews, agree on rate — all managed through the platform.' },
              { num: '03', title: 'Work & get paid', desc: 'Weekly timesheets, approval workflows, auto-invoicing with 10% platform fee. Transparent payments.' },
            ].map((step, i) => (
              <div key={step.num}>
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all h-full">
                  <p className="text-5xl font-black text-orange-500/30 mb-4">{step.num}</p>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FREELANCER PROFILE CTA (Freelancer only) ══════════════════ */}
      {isFreelancer && (
        <section className="py-8 bg-[#0B1120]">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-orange-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
                  <User className="h-7 w-7 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">Complete Your Profile & Get Matched</h2>
                  <p className="text-slate-400 text-sm mt-1">Update your skills, hourly rate & availability to get discovered by clients.</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button size="sm" onClick={() => navigate('/freelancer-profile')} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <User className="h-4 w-4" /> Update Profile
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/freelancer')} className="gap-2 border-slate-600 text-white hover:bg-slate-800">
                  <Briefcase className="h-4 w-4" /> Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ FEATURED PROFESSIONALS ══════════════════ */}
      {!isFreelancer && (
        <section ref={freelancerSectionRef} className="py-24 bg-[#0B1120]">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">BROWSE TALENT</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white italic">Featured professionals</h2>
                </div>
                <Button variant="outline" onClick={() => navigate('/talent-search')} className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full hidden sm:flex">
                  See all <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Search bar */}
              <div className="relative max-w-full mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  placeholder="Search by skill: React, AWS, DevOps, Python..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-12 h-12 bg-[#111827] border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-base focus:border-orange-500/50 focus:ring-orange-500/20"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 mb-6">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800">
                  <Filter className="h-4 w-4" /> {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>
                <span className="text-sm text-slate-500">{filtered.length} professionals found</span>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs text-slate-400 mb-1.5 block">Skill</Label>
                          <select value={filterSkill} onChange={e => { setFilterSkill(e.target.value); setCurrentPage(1); }} className="w-full h-9 rounded-md border border-slate-700 bg-[#0B1120] text-white px-3 text-sm">
                            <option value="">All Skills</option>
                            {uniqueSkills.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-400 mb-1.5 block">Country</Label>
                          <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }} className="w-full h-9 rounded-md border border-slate-700 bg-[#0B1120] text-white px-3 text-sm">
                            <option value="">All Countries</option>
                            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-400 mb-1.5 block">Min Experience (yrs)</Label>
                          <Input type="number" min={0} placeholder="e.g. 3" value={filterMinExp} onChange={e => { setFilterMinExp(e.target.value); setCurrentPage(1); }} className="h-9 bg-[#0B1120] border-slate-700 text-white" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={handleFilterApply} className="gap-1.5 bg-orange-500 hover:bg-orange-600"><Filter className="h-3 w-3" /> Apply</Button>
                        <Button size="sm" variant="outline" onClick={handleFilterClear} className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800"><X className="h-3 w-3" /> Clear</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {isLoading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}

            {hasError && !isLoading && (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-4">Could not load professionals from server.</p>
                <Button onClick={() => loadFreelancers()} variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"><Zap className="h-4 w-4" /> Retry</Button>
              </div>
            )}

            {hasLoaded && !isLoading && !hasError && (
              <>
                {paginated.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No professionals found. Try different filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {paginated.slice(0, 8).map((f, idx) => {
                      const skills = f.primarySkills ? f.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
                      const symbol = getCurrencySymbol(f.country);
                      const expYears = f.experience ?? f.experienceYears ?? 0;
                      const avatarColor = avatarColors[idx % avatarColors.length];
                      const initials = f.fullName ? f.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
                      const isAvailable = idx % 4 !== 3;
                      return (
                        <div key={f.freelancerId || f.id || idx}>
                          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all h-full group cursor-pointer" onClick={() => handleDemoClick(f)}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`h-11 w-11 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-white text-sm truncate">{f.fullName}</h3>
                                <p className="text-xs text-slate-400 truncate">{f.primarySkills?.split(',')[0]?.trim() || 'IT Professional'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              ))}
                              <span className="text-xs text-slate-400 ml-1">4.{8 + (idx % 3)} ({50 + idx * 13})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {skills.slice(0, 3).map((skill, si) => (
                                <span key={si} className="text-[11px] px-2.5 py-1 rounded-full border border-slate-700 text-slate-300 font-medium">{skill}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-black text-white">{symbol}{f.hourRate || '—'}<span className="text-sm font-normal text-slate-500">/hr</span></span>
                              <div className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                <span className={`text-xs ${isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>{isAvailable ? 'Available' : 'Busy'}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {!isAuthenticated && paginated.length > 0 && (
                  <div className="text-center mt-10">
                    <Button variant="outline" asChild className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full px-8">
                      <Link to="/register?role=Client">Register to view all {filtered.length} professionals <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                )}

                {isAuthenticated && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="h-8 px-2 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">First</Button>
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-8 px-2 border-slate-700 text-slate-300 hover:bg-slate-800"><ChevronLeft className="h-3 w-3" /></Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2).reduce((acc: (number | string)[], page, idx, arr) => { if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) acc.push('...'); acc.push(page); return acc; }, []).map((page, idx) => page === '...' ? <span key={`e-${idx}`} className="px-1 text-slate-500 text-xs">...</span> : <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page as number)} className={`h-8 w-8 p-0 text-xs ${currentPage === page ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{page}</Button>)}
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-8 px-2 border-slate-700 text-slate-300 hover:bg-slate-800"><ChevronRight className="h-3 w-3" /></Button>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="h-8 px-2 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">Last</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════ LIVE PROJECTS ══════════════════ */}
      {!isClient && (
        <section ref={worksSectionRef} className="py-24 bg-[#0B1120]">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">OPEN WORK</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white italic flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                    Live projects
                  </h2>
                </div>
                <Button onClick={openPostRequirement} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full">
                  Post a project
                </Button>
              </div>
            </motion.div>

            {reqLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : requirements.length === 0 ? (
              <div className="text-center py-12"><FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">No live openings at the moment. Check back soon!</p></div>
            ) : (
              <div className="space-y-4">
                {requirements.slice(0, 6).map((req, idx) => {
                  const skills = req.skillsRequired ? req.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : [];
                  const icons = [Settings, Lock, Code, Database, Cloud, Cpu];
                  const IconComp = icons[idx % icons.length];
                  const iconBgs = ['bg-slate-700', 'bg-emerald-700', 'bg-blue-700', 'bg-violet-700', 'bg-cyan-700', 'bg-rose-700'];
                  return (
                    <div key={req.id}>
                      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center gap-5 hover:border-slate-600 transition-all group">
                        <div className={`h-12 w-12 rounded-xl ${iconBgs[idx % iconBgs.length]} flex items-center justify-center shrink-0`}>
                          <IconComp className="h-6 w-6 text-white/70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-base mb-1 truncate">{req.title}</h3>
                          <p className="text-sm text-slate-400 truncate">{req.description || `${skills.join(', ')}`}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="text-orange-400 font-semibold">₹{req.budget?.toLocaleString() || '—'}</span>
                            <span>{req.minExperience || 0}+ yrs</span>
                            <span>{skills.length} skills</span>
                          </div>
                        </div>
                        <Button onClick={() => handleInterestClick(req)} variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full shrink-0">
                          Apply <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════ POST JD CTA ══════════════════ */}
      {!isFreelancer && (
        <section className="py-24 bg-[#0B1120]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">WE MATCH FOR YOU</p>
                  <h3 className="text-3xl font-black text-white mb-4 leading-tight">Can't find the right talent?</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Post your <span className="font-semibold text-orange-400">Job Description</span> and we'll assign the right work support professional. We handle the matching, demo, and onboarding.
                  </p>
                  <div className="space-y-3 mb-8">
                    {['Share your JD — we handle the rest', 'Get matched within 24–48 hours', 'Verified & skilled professionals only'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /><span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={openPostRequirement} size="lg" className="gap-2 w-fit font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl">
                    <FileText className="h-5 w-5" /> Post Your Requirement
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-blue-500/20 p-10 md:p-12 flex flex-col justify-center items-center text-center border-l border-slate-800">
                  <div className="h-20 w-20 rounded-3xl bg-orange-500/20 flex items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-orange-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">How We Work</p>
                  <p className="text-3xl font-black text-white mb-3">We Hire & Provide</p>
                  <p className="text-slate-400 text-sm mb-8 max-w-xs leading-relaxed">
                    Share your requirements — we hire the right work support professional and provide them to you.
                  </p>
                  <div className="space-y-2.5 text-left w-full max-w-xs">
                    {['Find & verify the right candidate', 'Admin-coordinated demo & onboarding', 'Transparent billing & invoicing'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" /><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ BECOME A PROFESSIONAL ══════════════════ */}
      {!isAuthenticated && (
        <section className="py-24 bg-gradient-to-br from-orange-600 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
          <div className="relative container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <motion.div >
                <p className="text-white/70 font-bold text-sm tracking-widest uppercase mb-4">EARN MONEY</p>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">Become a Work Support Professional</h2>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Join hundreds of IT professionals earning on their own terms. Set your rates, work flexibly, and get paid per hour.
                </p>
                <div className="space-y-3.5 mb-10">
                  {[
                    { icon: DollarSign, text: 'Set your own hourly rates' },
                    { icon: Clock, text: 'Work part-time or full-time' },
                    { icon: Globe, text: 'Connect with clients worldwide' },
                    { icon: Shield, text: 'Your identity stays protected' },
                    { icon: TrendingUp, text: 'Build your portfolio & grow' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center"><item.icon className="h-4 w-4 text-white" /></div>
                      <span className="font-medium text-lg text-white">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gap-2 text-lg px-10 h-14 bg-[#0B1120] text-white hover:bg-[#0B1120]/90 font-bold rounded-full shadow-2xl">
                    <Link to="/register?role=FreeLancer"><Briefcase className="h-5 w-5" /> Join as Professional</Link>
                  </Button>
                </div>
              </motion.div>
              <div className="hidden md:grid grid-cols-2 gap-5">
                {[
                  { label: 'Avg. Earnings', value: '₹50K+/mo', icon: DollarSign },
                  { label: 'Active Projects', value: '1,200+', icon: Briefcase },
                  { label: 'Professionals', value: '500+', icon: Users },
                  { label: 'Hourly Earners', value: '60%', icon: Clock },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-white/80" />
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-white/60 font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-24 bg-[#0B1120]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">TESTIMONIALS</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white italic">What professionals say</h2>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              { name: 'Rajesh K.', role: 'Full Stack Developer', location: 'Hyderabad', text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind.', avatar: 'R' },
              { name: 'Priya M.', role: 'DevOps Engineer', location: 'Bangalore', text: 'Finally, a platform that respects my time. I can work on my terms without compromising.', avatar: 'P' },
              { name: 'Suresh R.', role: 'Data Scientist', location: 'Chennai', text: 'The matching system is incredible. I only get projects that match my skills perfectly.', avatar: 'S' },
              { name: 'Lakshmi S.', role: 'React Developer', location: 'Vizag', text: 'Great platform for IT professionals. Tracking engagements is seamless and intuitive.', avatar: 'L' },
            ].map((t, i) => (
              <div key={t.name}>
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 h-full hover:border-slate-700 transition-all">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-slate-400 mb-5 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                    <div className={`h-10 w-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm`}>{t.avatar}</div>
                    <div>
                      <p className="font-semibold text-sm text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      {!isAuthenticated && (
        <section className="py-20 bg-[#111827] border-t border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <motion.div >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Join WorkSupport360 today and connect with the right opportunities.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-10 h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-xl">
                  <Link to="/register?role=FreeLancer"><Briefcase className="h-5 w-5" /> I'm a Freelancer</Link>
                </Button>
                <Button asChild size="lg" className="gap-2 text-lg px-10 h-14 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-slate-600">
                  <Link to="/register?role=Client"><Building2 className="h-5 w-5" /> Hire Talent</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════ DIALOGS (same logic) ══════════════════ */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-[#111827] border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white"><Play className="h-5 w-5 text-orange-500" /> Request a Free Demo</DialogTitle>
            <DialogDescription className="text-slate-400">Tell us about your project. We'll coordinate a demo with <span className="font-semibold text-white">{selectedFreelancer?.fullName}</span>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-medium text-slate-300">Project Title <span className="text-orange-500">*</span></Label><Input className="h-9 text-sm bg-[#0B1120] border-slate-700 text-white" placeholder="e.g. E-commerce Website" value={demoForm.projectTitle} onChange={e => setDemoForm(f => ({ ...f, projectTitle: e.target.value }))} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-slate-300">Description</Label><Textarea className="text-sm min-h-[60px] bg-[#0B1120] border-slate-700 text-white" placeholder="Briefly describe your requirements..." value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-slate-300">Country (Currency)</Label><Select value={demoForm.budgetCountry} onValueChange={v => setDemoForm(f => ({ ...f, budgetCountry: v }))}><SelectTrigger className="w-full h-9 text-sm bg-[#0B1120] border-slate-700 text-white"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent className="bg-[#111827] border-slate-700">{countries.map(c => <SelectItem key={c.code} value={c.name} className="text-white">{c.name} ({c.currencySymbol} {c.currency})</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs font-medium text-slate-300">Budget ({countries.find(c => c.name === demoForm.budgetCountry)?.currencySymbol || '₹'})</Label><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">{countries.find(c => c.name === demoForm.budgetCountry)?.currencySymbol || '₹'}</span><Input type="number" placeholder="e.g. 5000" value={demoForm.clientBudget} onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))} min={0} className="pl-7 h-9 text-sm bg-[#0B1120] border-slate-700 text-white" /></div></div>
              <div className="space-y-1"><Label className="text-xs font-medium text-slate-300">Phone <span className="text-orange-500">*</span></Label><div className="flex gap-1.5"><Select value={demoForm.phoneCountryCode} onValueChange={v => setDemoForm(f => ({ ...f, phoneCountryCode: v }))}><SelectTrigger className="w-[90px] h-9 text-xs shrink-0 bg-[#0B1120] border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-[#111827] border-slate-700"><SelectItem value="+91" className="text-white">🇮🇳 +91</SelectItem><SelectItem value="+1" className="text-white">🇺🇸 +1</SelectItem><SelectItem value="+44" className="text-white">🇬🇧 +44</SelectItem><SelectItem value="+61" className="text-white">🇦🇺 +61</SelectItem><SelectItem value="+971" className="text-white">🇦🇪 +971</SelectItem><SelectItem value="+65" className="text-white">🇸🇬 +65</SelectItem><SelectItem value="+49" className="text-white">🇩🇪 +49</SelectItem><SelectItem value="+81" className="text-white">🇯🇵 +81</SelectItem></SelectContent></Select><Input className="h-9 text-sm flex-1 bg-[#0B1120] border-slate-700 text-white" placeholder="Phone" value={demoForm.contactPhone} onChange={e => setDemoForm(f => ({ ...f, contactPhone: e.target.value.replace(/[^0-9]/g, '') }))} maxLength={15} /></div></div>
            </div>
            <div className="space-y-1"><Label className="text-xs font-medium text-slate-300">Email <span className="text-orange-500">*</span></Label><Input type="email" className="h-9 text-sm bg-[#0B1120]/50 border-slate-700 text-slate-400 cursor-not-allowed" value={demoForm.contactEmail} readOnly /></div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setDemoOpen(false)} disabled={demoSubmitting} className="border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</Button>
              <Button size="sm" onClick={handleDemoSubmit} disabled={demoSubmitting} className="gap-1.5 bg-orange-500 hover:bg-orange-600">{demoSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={interestOpen} onOpenChange={(open) => { setInterestOpen(open); if (!open) setInterestSuccess(false); }}>
        <DialogContent className="sm:max-w-md bg-[#111827] border-slate-700 text-white">
          {interestSuccess ? (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Interest Submitted! 🎉</h3>
              <p className="text-slate-400 mb-1">Your interest in <span className="font-semibold text-white">{selectedRequirement?.title}</span> has been sent.</p>
              <p className="text-sm text-slate-500 mb-6">The client will review and get back to you soon.</p>
              <Button onClick={() => setInterestOpen(false)} className="font-semibold px-8 bg-orange-500 hover:bg-orange-600">Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle className="flex items-center gap-2 text-white"><Heart className="h-5 w-5 text-rose-500" /> Express Interest</DialogTitle><DialogDescription className="text-slate-400">Show your interest in <span className="font-semibold text-white">{selectedRequirement?.title}</span></DialogDescription></DialogHeader>
              <div className="bg-[#0B1120] rounded-lg p-3 space-y-2 text-sm border border-slate-800">
                <div className="flex justify-between"><span className="text-slate-500">Budget</span><span className="font-semibold text-white">₹{selectedRequirement?.budget?.toLocaleString() || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Skills</span><span className="font-medium text-white text-right max-w-[200px] truncate">{selectedRequirement?.skillsRequired || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Experience</span><span className="font-medium text-white">{selectedRequirement?.minExperience || 0}+ years</span></div>
              </div>
              <div className="space-y-1.5"><Label className="text-sm text-slate-300">Message (optional)</Label><Textarea placeholder="Why are you a good fit?" value={interestComment} onChange={e => setInterestComment(e.target.value)} rows={3} className="bg-[#0B1120] border-slate-700 text-white" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setInterestOpen(false)} disabled={interestSubmitting} className="border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</Button>
                <Button onClick={handleInterestSubmit} disabled={interestSubmitting} className="gap-1.5 bg-orange-500 hover:bg-orange-600">{interestSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />} Submit Interest</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={postReqOpen} onOpenChange={setPostReqOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-[#111827] border-slate-700 text-white">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-white"><FileText className="h-5 w-5 text-orange-500" /> Post Your Requirement</DialogTitle><DialogDescription className="text-slate-400">Share your project details. We'll match you with the right professional.</DialogDescription></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5"><Label className="text-sm text-slate-300">Project Title <span className="text-orange-500">*</span></Label><Input placeholder="e.g. E-commerce Platform Development" value={postReqForm.projectTitle} onChange={e => setPostReqForm(f => ({ ...f, projectTitle: e.target.value }))} className="bg-[#0B1120] border-slate-700 text-white" /></div>
            <div className="space-y-1.5"><Label className="text-sm text-slate-300">Description</Label><Textarea placeholder="Describe your project..." value={postReqForm.description} onChange={e => setPostReqForm(f => ({ ...f, description: e.target.value }))} rows={3} className="bg-[#0B1120] border-slate-700 text-white" /></div>
            <div className="space-y-1.5"><Label className="text-sm text-slate-300">Required Skills <span className="text-orange-500">*</span></Label><Input placeholder="React, Node.js, Python (comma separated)" value={postReqForm.requiredSkills} onChange={e => setPostReqForm(f => ({ ...f, requiredSkills: e.target.value }))} className="bg-[#0B1120] border-slate-700 text-white" /></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-sm text-slate-300">Budget (₹)</Label><Input type="number" placeholder="50000" value={postReqForm.budget} onChange={e => setPostReqForm(f => ({ ...f, budget: e.target.value }))} min={0} className="bg-[#0B1120] border-slate-700 text-white" /></div>
              <div className="space-y-1.5"><Label className="text-sm text-slate-300">Min Experience</Label><Input type="number" placeholder="3" value={postReqForm.experienceLevel} onChange={e => setPostReqForm(f => ({ ...f, experienceLevel: e.target.value }))} min={0} className="bg-[#0B1120] border-slate-700 text-white" /></div>
              <div className="space-y-1.5"><Label className="text-sm text-slate-300">Language</Label><Input placeholder="English" value={postReqForm.language} onChange={e => setPostReqForm(f => ({ ...f, language: e.target.value }))} className="bg-[#0B1120] border-slate-700 text-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-sm text-slate-300">Country</Label><Input placeholder="India" value={postReqForm.country} onChange={e => setPostReqForm(f => ({ ...f, country: e.target.value }))} className="bg-[#0B1120] border-slate-700 text-white" /></div>
              <div className="space-y-1.5"><Label className="text-sm text-slate-300">Mobile <span className="text-orange-500">*</span></Label><div className="flex gap-1.5"><Select value={postReqForm.countryCode} onValueChange={val => setPostReqForm(f => ({ ...f, countryCode: val }))}><SelectTrigger className="w-[90px] h-9 text-xs bg-[#0B1120] border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-[#111827] border-slate-700"><SelectItem value="+91" className="text-white">🇮🇳 +91</SelectItem><SelectItem value="+1" className="text-white">🇺🇸 +1</SelectItem><SelectItem value="+44" className="text-white">🇬🇧 +44</SelectItem><SelectItem value="+61" className="text-white">🇦🇺 +61</SelectItem><SelectItem value="+971" className="text-white">🇦🇪 +971</SelectItem><SelectItem value="+65" className="text-white">🇸🇬 +65</SelectItem><SelectItem value="+49" className="text-white">🇩🇪 +49</SelectItem><SelectItem value="+81" className="text-white">🇯🇵 +81</SelectItem></SelectContent></Select><Input placeholder="9876543210" value={postReqForm.contactPhone} onChange={e => setPostReqForm(f => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '') }))} className="flex-1 bg-[#0B1120] border-slate-700 text-white" maxLength={15} /></div></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm text-slate-300">Email <span className="text-orange-500">*</span></Label><Input type="email" placeholder="your@email.com" value={postReqForm.contactEmail} onChange={e => setPostReqForm(f => ({ ...f, contactEmail: e.target.value }))} className="bg-[#0B1120] border-slate-700 text-white" /></div>
            <div className="bg-orange-500/10 rounded-lg p-3 flex items-start gap-3 border border-orange-500/20">
              <Users className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
              <div><p className="text-sm font-semibold text-orange-400">We Hire & Provide the Right Professional</p><p className="text-xs text-slate-400 mt-0.5">We'll find, verify, and assign the right work support professional.</p></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="outline" onClick={() => setPostReqOpen(false)} disabled={postReqSubmitting} className="border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</Button>
              <Button onClick={handlePostReqSubmit} disabled={postReqSubmitting} className="gap-1.5 bg-orange-500 hover:bg-orange-600">{postReqSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post Requirement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
