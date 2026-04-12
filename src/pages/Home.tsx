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
const HERO_VIDEO_URL = 'https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4';

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
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);

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
    return result;
  }, [freelancers, filterSkill, filterCountry, filterMinExp]);

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

  const cardColors = [
    { bg: 'from-primary to-blue-700', badge: 'bg-primary/10 text-primary' },
    { bg: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-700' },
    { bg: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-700' },
    { bg: 'from-secondary to-amber-600', badge: 'bg-orange-100 text-orange-700' },
    { bg: 'from-rose-500 to-pink-600', badge: 'bg-rose-100 text-rose-700' },
    { bg: 'from-cyan-500 to-sky-600', badge: 'bg-cyan-100 text-cyan-700' },
  ];

  const domains = [
    { name: 'IT & Software', icon: Code, gradient: 'from-primary/10 to-primary/5', iconBg: 'bg-primary', text: 'text-primary' },
    { name: 'Finance & Banking', icon: Landmark, gradient: 'from-emerald-500/10 to-emerald-500/5', iconBg: 'bg-emerald-500', text: 'text-emerald-600' },
    { name: 'Healthcare', icon: Stethoscope, gradient: 'from-rose-500/10 to-rose-500/5', iconBg: 'bg-rose-500', text: 'text-rose-600' },
    { name: 'HR & Recruitment', icon: Users, gradient: 'from-violet-500/10 to-violet-500/5', iconBg: 'bg-violet-500', text: 'text-violet-600' },
    { name: 'E-Commerce', icon: ShoppingCart, gradient: 'from-secondary/10 to-secondary/5', iconBg: 'bg-secondary', text: 'text-secondary' },
    { name: 'Data & Analytics', icon: BarChart3, gradient: 'from-cyan-500/10 to-cyan-500/5', iconBg: 'bg-cyan-500', text: 'text-cyan-600' },
    { name: 'Cloud & DevOps', icon: Cloud, gradient: 'from-indigo-500/10 to-indigo-500/5', iconBg: 'bg-indigo-500', text: 'text-indigo-600' },
    { name: 'Cybersecurity', icon: Shield, gradient: 'from-red-500/10 to-red-500/5', iconBg: 'bg-red-500', text: 'text-red-600' },
    { name: 'Mobile Apps', icon: Smartphone, gradient: 'from-pink-500/10 to-pink-500/5', iconBg: 'bg-pink-500', text: 'text-pink-600' },
    { name: 'AI & ML', icon: Cpu, gradient: 'from-purple-500/10 to-purple-500/5', iconBg: 'bg-purple-500', text: 'text-purple-600' },
    { name: 'Education', icon: GraduationCap, gradient: 'from-amber-500/10 to-amber-500/5', iconBg: 'bg-amber-500', text: 'text-amber-600' },
    { name: 'UI/UX Design', icon: Palette, gradient: 'from-fuchsia-500/10 to-fuchsia-500/5', iconBg: 'bg-fuchsia-500', text: 'text-fuchsia-600' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary/30" />
        <video autoPlay muted loop playsInline preload="auto" onLoadedData={() => setHeroVideoLoaded(true)} onCanPlayThrough={() => setHeroVideoLoaded(true)} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroVideoLoaded ? 'opacity-40' : 'opacity-0'}`} aria-hidden="true">
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 text-sm px-5 py-2 backdrop-blur-md">
                <Sparkles className="h-4 w-4 mr-2" /> IT Work Support, On Demand
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-white tracking-tight">
                Hire Expert{' '}
                <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                  IT Professionals
                </span>
                <br />
                <span className="text-white/90">Effortlessly.</span>
              </h1>

              <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                Browse verified professionals. Hourly, Part-Time, or Full-Time — 
                flexible engagement models tailored for your business needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Button size="lg" onClick={handleHireTalentClick} className="gap-3 text-lg px-10 h-14 bg-primary hover:bg-primary/90 font-bold shadow-2xl shadow-primary/30">
                  <Users className="h-5 w-5" /> Hire Talent <ArrowRight className="h-5 w-5" />
                </Button>
                {!isAuthenticated && (
                  <Button size="lg" variant="outline" asChild className="gap-3 text-lg px-10 h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 font-bold backdrop-blur-sm">
                    <Link to="/register?role=FreeLancer">
                      <Briefcase className="h-5 w-5" /> Join as Professional
                    </Link>
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { value: '500+', label: 'Active Professionals', icon: Users },
                  { value: '1,200+', label: 'Projects Delivered', icon: Briefcase },
                  { value: '98%', label: 'Satisfaction Rate', icon: Star },
                  { value: '24/7', label: 'Dedicated Support', icon: Clock },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <stat.icon className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ ENGAGEMENT MODELS ══════════════════ */}
      <section className="py-16 bg-background relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { title: 'Hourly', desc: 'Pay only for the hours worked. Ideal for quick tasks and bug fixes.', icon: Clock, color: 'from-primary to-blue-600' },
              { title: 'Part-Time', desc: 'Dedicated support for 4 hours daily. Perfect for ongoing projects.', icon: Calendar, color: 'from-emerald-500 to-teal-600' },
              { title: 'Full-Time', desc: 'A dedicated professional working exclusively on your project.', icon: Briefcase, color: 'from-secondary to-amber-600' },
            ].map((model) => (
              <motion.div key={model.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card overflow-hidden group">
                  <div className={`h-1.5 bg-gradient-to-r ${model.color}`} />
                  <CardContent className="p-6">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <model.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{model.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{model.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FREELANCER PROFILE CTA (Freelancer only) ══════════════════ */}
      {isFreelancer && (
        <section className="py-6">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-xl overflow-hidden max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-primary via-blue-600 to-primary/80 p-6 text-primary-foreground">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                    <User className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">Complete Your Profile & Get Matched</h2>
                    <p className="text-white/80 text-sm mt-1">Update your skills, hourly rate & availability to get discovered by clients.</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <Button size="sm" onClick={() => navigate('/freelancer-profile')} className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold shadow-md">
                    <User className="h-4 w-4" /> Update Profile
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate('/freelancer')} className="gap-2 bg-transparent border-white/30 text-white hover:bg-white/10">
                    <Briefcase className="h-4 w-4" /> Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* ══════════════════ FREELANCER SHOWCASE ══════════════════ */}
      {!isFreelancer && (
        <section ref={freelancerSectionRef} className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Top IT Talent
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
                Hire Expert <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Professionals</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Browse verified IT work support professionals ready for your projects.</p>
            </motion.div>

            {/* Filters */}
            <div className="mb-8 max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="h-4 w-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <span className="text-sm text-muted-foreground">{filtered.length} professionals found</span>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <Card className="border-dashed mb-4">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">Skill</Label>
                            <select value={filterSkill} onChange={e => { setFilterSkill(e.target.value); setCurrentPage(1); }} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                              <option value="">All Skills</option>
                              {uniqueSkills.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">Country</Label>
                            <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                              <option value="">All Countries</option>
                              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">Min Experience (yrs)</Label>
                            <Input type="number" min={0} placeholder="e.g. 3" value={filterMinExp} onChange={e => { setFilterMinExp(e.target.value); setCurrentPage(1); }} className="h-9" />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={handleFilterApply} className="gap-1.5"><Filter className="h-3 w-3" /> Apply</Button>
                          <Button size="sm" variant="outline" onClick={handleFilterClear} className="gap-1.5"><X className="h-3 w-3" /> Clear</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isLoading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

            {hasError && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Could not load professionals from server.</p>
                <Button onClick={() => loadFreelancers()} variant="outline" className="gap-2"><Zap className="h-4 w-4" /> Retry</Button>
              </div>
            )}

            {hasLoaded && !isLoading && !hasError && (
              <>
                {paginated.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No professionals found. Try different filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {paginated.map((f, idx) => {
                      const colorSet = cardColors[idx % cardColors.length];
                      const skills = f.primarySkills ? f.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
                      const symbol = getCurrencySymbol(f.country);
                      const expYears = f.experience ?? f.experienceYears ?? 0;
                      return (
                        <motion.div key={f.freelancerId || f.id || idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(idx * 0.02, 0.3) }}>
                          <Card className="border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 bg-card h-full">
                            <div className={`h-1 bg-gradient-to-r ${colorSet.bg}`} />
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2.5">
                                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${colorSet.bg} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
                                  {f.fullName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-xs text-foreground truncate leading-tight">{f.fullName}</h3>
                                  <p className="text-[10px] text-muted-foreground truncate flex items-center gap-0.5">
                                    <MapPin className="h-2.5 w-2.5 shrink-0" />{f.country || 'Remote'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mb-2 text-[10px]">
                                <span className={`${colorSet.badge} px-1.5 py-0.5 rounded-full font-semibold`}>{expYears}yr exp</span>
                                <span className="font-bold text-foreground text-xs">{symbol}{f.hourRate || '—'}/hr</span>
                              </div>
                              {skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2.5">
                                  {skills.slice(0, 2).map((skill, si) => (
                                    <span key={si} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium truncate max-w-full">{skill}</span>
                                  ))}
                                  {skills.length > 2 && <span className="text-[9px] px-1 py-0.5 text-muted-foreground">+{skills.length - 2}</span>}
                                </div>
                              )}
                              <Button onClick={() => handleDemoClick(f)} size="sm" className={`w-full gap-1 text-[10px] h-7 font-semibold bg-gradient-to-r ${colorSet.bg} hover:opacity-90 text-white shadow-sm`}>
                                <Play className="h-3 w-3" /> Demo
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="h-8 px-2 text-xs">First</Button>
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-8 px-2"><ChevronLeft className="h-3 w-3" /></Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2).reduce((acc: (number | string)[], page, idx, arr) => { if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) acc.push('...'); acc.push(page); return acc; }, []).map((page, idx) => page === '...' ? <span key={`e-${idx}`} className="px-1 text-muted-foreground text-xs">...</span> : <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page as number)} className="h-8 w-8 p-0 text-xs">{page}</Button>)}
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-8 px-2"><ChevronRight className="h-3 w-3" /></Button>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="h-8 px-2 text-xs">Last</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════ LIVE PROJECTS (Freelancer & Guests) ══════════════════ */}
      {!isClient && (
        <section ref={worksSectionRef} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 text-sm px-4 py-1.5">
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Live Openings
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Current Project Requirements</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Active projects looking for IT work support professionals. Express your interest!</p>
            </motion.div>

            {reqLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : requirements.length === 0 ? (
              <div className="text-center py-12"><FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No live openings at the moment. Check back soon!</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {requirements.slice(0, 12).map((req, idx) => {
                  const skills = req.skillsRequired ? req.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : [];
                  const accents = ['from-primary to-blue-600', 'from-emerald-500 to-teal-500', 'from-secondary to-amber-500', 'from-rose-500 to-pink-500', 'from-cyan-500 to-sky-500', 'from-violet-500 to-purple-500'];
                  const accent = accents[idx % accents.length];
                  return (
                    <motion.div key={req.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.04 }}>
                      <Card className="group border shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-card overflow-hidden hover:-translate-y-1">
                        <div className={`h-1 bg-gradient-to-r ${accent}`} />
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-1">{req.title}</h3>
                            <Badge variant="secondary" className="shrink-0 text-[10px]">{req.status || 'Open'}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{req.description}</p>
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {skills.slice(0, 3).map((skill, si) => <span key={si} className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground border">{skill}</span>)}
                              {skills.length > 3 && <span className="text-[10px] px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">+{skills.length - 3}</span>}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground mb-4 mt-auto">
                            <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-500" /><span className="font-semibold text-foreground">₹{req.budget?.toLocaleString() || '—'}</span></div>
                            <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5"><Award className="h-3.5 w-3.5 text-amber-500" /><span>{req.minExperience || 0}+ yrs</span></div>
                            <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /><span className="truncate">{req.country || 'Remote'}</span></div>
                            <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5"><Languages className="h-3.5 w-3.5 text-violet-500" /><span className="truncate">{req.language || '—'}</span></div>
                          </div>
                          <Button onClick={() => handleInterestClick(req)} size="sm" className="w-full gap-1.5 text-xs h-9 font-semibold">
                            <Heart className="h-3.5 w-3.5" /> I'm Interested
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════ POST JD CTA (Clients & Guests) ══════════════════ */}
      {!isFreelancer && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="p-10 md:p-12 flex flex-col justify-center bg-card">
                  <Badge className="mb-4 w-fit bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1">🤝 We Match For You</Badge>
                  <h3 className="text-3xl font-extrabold text-foreground mb-4 leading-tight">Can't find the right talent?</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Post your <span className="font-semibold text-primary">Job Description</span> and we'll assign the right work support professional. We handle the matching, demo, and onboarding.
                  </p>
                  <div className="space-y-3 mb-8">
                    {['Share your JD — we handle the rest', 'Get matched within 24–48 hours', 'Verified & skilled professionals only'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /><span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={openPostRequirement} size="lg" className="gap-2 w-fit font-bold shadow-xl">
                    <FileText className="h-5 w-5" /> Post Your Requirement
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-primary via-blue-600 to-primary/80 p-10 md:p-12 text-primary-foreground flex flex-col justify-center items-center text-center">
                  <div className="h-20 w-20 rounded-3xl bg-white/15 flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Users className="h-10 w-10" />
                  </div>
                  <p className="text-sm text-white/70 font-medium mb-1">How We Work</p>
                  <p className="text-3xl font-extrabold mb-3">We Hire & Provide</p>
                  <p className="text-white/80 text-sm mb-8 max-w-xs leading-relaxed">
                    Share your requirements — we hire the right work support professional and provide them to you.
                  </p>
                  <div className="space-y-2.5 text-left w-full max-w-xs">
                    {['Find & verify the right candidate', 'Admin-coordinated demo & onboarding', 'Transparent billing & invoicing'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-white/90"><CheckCircle className="h-3.5 w-3.5 text-emerald-300 shrink-0" /><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ BECOME A PROFESSIONAL (Guests only) ══════════════════ */}
      {!isAuthenticated && (
        <section className="py-24 bg-gradient-to-br from-secondary via-rose-500 to-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
          <div className="relative container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Badge className="mb-5 bg-white/20 text-white border-white/30 text-sm px-5 py-1.5 backdrop-blur-sm">💰 Earn Money</Badge>
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">Become a Work Support Professional</h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
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
                      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm"><item.icon className="h-4 w-4" /></div>
                      <span className="font-medium text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gap-2 text-lg px-10 h-14 bg-white text-secondary hover:bg-white/90 font-bold shadow-2xl">
                    <Link to="/register?role=FreeLancer"><Briefcase className="h-5 w-5" /> Join as Professional</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-10 h-14 bg-transparent border-white/30 text-white hover:bg-white/10 font-bold">
                    <Link to="/login">Already registered? Login</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="hidden md:grid grid-cols-2 gap-5">
                {[
                  { label: 'Avg. Earnings', value: '₹50K+/mo', icon: DollarSign },
                  { label: 'Active Projects', value: '1,200+', icon: Briefcase },
                  { label: 'Professionals', value: '500+', icon: Users },
                  { label: 'Hourly Earners', value: '60%', icon: Clock },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-white/80" />
                    <p className="text-3xl font-extrabold">{stat.value}</p>
                    <p className="text-xs text-white/60 font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ DOMAINS ══════════════════ */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <Badge className="mb-4 bg-violet-500/10 text-violet-600 border-violet-500/20 text-sm px-4 py-1.5">All Domains</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Explore Every Industry</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From IT to Healthcare, Finance to Logistics — find experts across every domain.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {domains.map((domain, i) => (
              <motion.div key={domain.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} whileHover={{ y: -4, scale: 1.03 }}
                className={`bg-gradient-to-br ${domain.gradient} rounded-2xl p-5 border border-transparent hover:border-border hover:shadow-lg transition-all cursor-pointer group text-center`}>
                <div className={`h-12 w-12 rounded-xl ${domain.iconBg} flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <domain.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`font-semibold text-sm ${domain.text}`}>{domain.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Get started in 4 simple steps</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Create Your Profile', desc: 'Sign up, upload your resume, and let our smart system auto-fill your skills.', icon: Laptop, color: 'from-primary to-blue-600' },
              { step: '2', title: 'Get Discovered', desc: 'Clients browse professionals by skill, domain & hourly rate.', icon: Search, color: 'from-emerald-500 to-teal-600' },
              { step: '3', title: 'Demo & Connect', desc: 'Our admin coordinates a demo call. Once approved, assignments are created.', icon: Heart, color: 'from-secondary to-amber-600' },
              { step: '4', title: 'Work & Get Paid', desc: 'Work hourly, track time, and receive invoices with transparent billing.', icon: DollarSign, color: 'from-violet-500 to-purple-600' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
                <div className="relative inline-flex mb-6">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">{item.step}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">What Professionals Say</h2>
            <p className="text-muted-foreground">Trusted by IT professionals across the globe</p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              { name: 'Rajesh K.', role: 'Full Stack Developer', location: 'Hyderabad', text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind.', avatar: 'R' },
              { name: 'Priya M.', role: 'DevOps Engineer', location: 'Bangalore', text: 'Finally, a platform that respects my time. I can work on my terms without compromising.', avatar: 'P' },
              { name: 'Suresh R.', role: 'Data Scientist', location: 'Chennai', text: 'The matching system is incredible. I only get projects that match my skills perfectly.', avatar: 'S' },
              { name: 'Lakshmi S.', role: 'React Developer', location: 'Vizag', text: 'Great platform for IT professionals. Tracking engagements is seamless and intuitive.', avatar: 'L' },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="border shadow-sm hover:shadow-lg transition-all h-full bg-card">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 border-t pt-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm">{t.avatar}</div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} • {t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join WorkSupport360 today and connect with the right opportunities.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-10 h-14 bg-white text-primary hover:bg-white/90 font-bold shadow-xl">
                  <Link to="/register?role=FreeLancer"><Briefcase className="h-5 w-5" /> I'm a Freelancer</Link>
                </Button>
                <Button asChild size="lg" className="gap-2 text-lg px-10 h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-xl">
                  <Link to="/register?role=Client"><Building2 className="h-5 w-5" /> Hire Talent</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════ DIALOGS (kept same logic) ══════════════════ */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Play className="h-5 w-5 text-primary" /> Request a Free Demo</DialogTitle>
            <DialogDescription>Tell us about your project. We'll coordinate a demo with <span className="font-semibold">{selectedFreelancer?.fullName}</span>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-medium">Project Title <span className="text-destructive">*</span></Label><Input className="h-9 text-sm" placeholder="e.g. E-commerce Website" value={demoForm.projectTitle} onChange={e => setDemoForm(f => ({ ...f, projectTitle: e.target.value }))} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium">Description</Label><Textarea className="text-sm min-h-[60px]" placeholder="Briefly describe your requirements..." value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium">Country (Currency)</Label><Select value={demoForm.budgetCountry} onValueChange={v => setDemoForm(f => ({ ...f, budgetCountry: v }))}><SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent className="max-h-60">{countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name} ({c.currencySymbol} {c.currency})</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs font-medium">Budget ({countries.find(c => c.name === demoForm.budgetCountry)?.currencySymbol || '₹'})</Label><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{countries.find(c => c.name === demoForm.budgetCountry)?.currencySymbol || '₹'}</span><Input type="number" placeholder="e.g. 5000" value={demoForm.clientBudget} onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))} min={0} className="pl-7 h-9 text-sm" /></div></div>
              <div className="space-y-1"><Label className="text-xs font-medium">Phone <span className="text-destructive">*</span></Label><div className="flex gap-1.5"><Select value={demoForm.phoneCountryCode} onValueChange={v => setDemoForm(f => ({ ...f, phoneCountryCode: v }))}><SelectTrigger className="w-[90px] h-9 text-xs shrink-0"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="+91">🇮🇳 +91</SelectItem><SelectItem value="+1">🇺🇸 +1</SelectItem><SelectItem value="+44">🇬🇧 +44</SelectItem><SelectItem value="+61">🇦🇺 +61</SelectItem><SelectItem value="+971">🇦🇪 +971</SelectItem><SelectItem value="+65">🇸🇬 +65</SelectItem><SelectItem value="+49">🇩🇪 +49</SelectItem><SelectItem value="+81">🇯🇵 +81</SelectItem></SelectContent></Select><Input className="h-9 text-sm flex-1" placeholder="Phone" value={demoForm.contactPhone} onChange={e => setDemoForm(f => ({ ...f, contactPhone: e.target.value.replace(/[^0-9]/g, '') }))} maxLength={15} /></div></div>
            </div>
            <div className="space-y-1"><Label className="text-xs font-medium">Email <span className="text-destructive">*</span></Label><Input type="email" className="h-9 text-sm bg-muted/50 cursor-not-allowed" value={demoForm.contactEmail} readOnly /></div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setDemoOpen(false)} disabled={demoSubmitting}>Cancel</Button>
              <Button size="sm" onClick={handleDemoSubmit} disabled={demoSubmitting} className="gap-1.5">{demoSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={interestOpen} onOpenChange={(open) => { setInterestOpen(open); if (!open) setInterestSuccess(false); }}>
        <DialogContent className="sm:max-w-md">
          {interestSuccess ? (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Interest Submitted! 🎉</h3>
              <p className="text-muted-foreground mb-1">Your interest in <span className="font-semibold text-foreground">{selectedRequirement?.title}</span> has been sent.</p>
              <p className="text-sm text-muted-foreground mb-6">The client will review and get back to you soon.</p>
              <Button onClick={() => setInterestOpen(false)} className="font-semibold px-8">Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-rose-500" /> Express Interest</DialogTitle><DialogDescription>Show your interest in <span className="font-semibold text-foreground">{selectedRequirement?.title}</span></DialogDescription></DialogHeader>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-semibold text-foreground">₹{selectedRequirement?.budget?.toLocaleString() || '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Skills</span><span className="font-medium text-foreground text-right max-w-[200px] truncate">{selectedRequirement?.skillsRequired || '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Experience</span><span className="font-medium text-foreground">{selectedRequirement?.minExperience || 0}+ years</span></div>
              </div>
              <div className="space-y-1.5"><Label className="text-sm">Message (optional)</Label><Textarea placeholder="Why are you a good fit?" value={interestComment} onChange={e => setInterestComment(e.target.value)} rows={3} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setInterestOpen(false)} disabled={interestSubmitting}>Cancel</Button>
                <Button onClick={handleInterestSubmit} disabled={interestSubmitting} className="gap-1.5">{interestSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />} Submit Interest</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={postReqOpen} onOpenChange={setPostReqOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Post Your Requirement</DialogTitle><DialogDescription>Share your project details. We'll match you with the right professional.</DialogDescription></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5"><Label className="text-sm">Project Title <span className="text-destructive">*</span></Label><Input placeholder="e.g. E-commerce Platform Development" value={postReqForm.projectTitle} onChange={e => setPostReqForm(f => ({ ...f, projectTitle: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label className="text-sm">Description</Label><Textarea placeholder="Describe your project..." value={postReqForm.description} onChange={e => setPostReqForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="space-y-1.5"><Label className="text-sm">Required Skills <span className="text-destructive">*</span></Label><Input placeholder="React, Node.js, Python (comma separated)" value={postReqForm.requiredSkills} onChange={e => setPostReqForm(f => ({ ...f, requiredSkills: e.target.value }))} /></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-sm">Budget (₹)</Label><Input type="number" placeholder="50000" value={postReqForm.budget} onChange={e => setPostReqForm(f => ({ ...f, budget: e.target.value }))} min={0} /></div>
              <div className="space-y-1.5"><Label className="text-sm">Min Experience</Label><Input type="number" placeholder="3" value={postReqForm.experienceLevel} onChange={e => setPostReqForm(f => ({ ...f, experienceLevel: e.target.value }))} min={0} /></div>
              <div className="space-y-1.5"><Label className="text-sm">Language</Label><Input placeholder="English" value={postReqForm.language} onChange={e => setPostReqForm(f => ({ ...f, language: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-sm">Country</Label><Input placeholder="India" value={postReqForm.country} onChange={e => setPostReqForm(f => ({ ...f, country: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-sm">Mobile <span className="text-destructive">*</span></Label><div className="flex gap-1.5"><Select value={postReqForm.countryCode} onValueChange={val => setPostReqForm(f => ({ ...f, countryCode: val }))}><SelectTrigger className="w-[90px] h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="+91">🇮🇳 +91</SelectItem><SelectItem value="+1">🇺🇸 +1</SelectItem><SelectItem value="+44">🇬🇧 +44</SelectItem><SelectItem value="+61">🇦🇺 +61</SelectItem><SelectItem value="+971">🇦🇪 +971</SelectItem><SelectItem value="+65">🇸🇬 +65</SelectItem><SelectItem value="+49">🇩🇪 +49</SelectItem><SelectItem value="+81">🇯🇵 +81</SelectItem></SelectContent></Select><Input placeholder="9876543210" value={postReqForm.contactPhone} onChange={e => setPostReqForm(f => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '') }))} className="flex-1" maxLength={15} /></div></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm">Email <span className="text-destructive">*</span></Label><Input type="email" placeholder="your@email.com" value={postReqForm.contactEmail} onChange={e => setPostReqForm(f => ({ ...f, contactEmail: e.target.value }))} /></div>
            <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-3 border border-primary/10">
              <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div><p className="text-sm font-semibold text-primary">We Hire & Provide the Right Professional</p><p className="text-xs text-muted-foreground mt-0.5">We'll find, verify, and assign the right work support professional.</p></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setPostReqOpen(false)} disabled={postReqSubmitting}>Cancel</Button>
              <Button onClick={handlePostReqSubmit} disabled={postReqSubmitting} className="gap-1.5">{postReqSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post Requirement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
