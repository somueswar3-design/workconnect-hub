import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign,
  Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award,
  Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare, Briefcase,
  ChevronDown, Play, Search, BarChart3, FileText, Cpu, Palette,
  Building2, GraduationCap, Stethoscope, ShoppingCart, Landmark, Truck,
  Smartphone, Settings, PieChart, MonitorPlay, User, MapPin, Timer,
  Languages, ChevronLeft, ChevronRight, Loader2, Send, X, Filter
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
import { getFilteredFreelancers, FreelancerProfileDto, FreelancerFilterParams, requestDemo, RequestDemoDto, getClientRequirements, ClientRequirementResponse } from '@/services/clientApi';

const ITEMS_PER_PAGE = 24;

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const freelancerSectionRef = useRef<HTMLDivElement>(null);

  // Freelancer list state (from API)
  const [freelancers, setFreelancers] = useState<FreelancerProfileDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [filterSkill, setFilterSkill] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterMinExp, setFilterMinExp] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Demo dialog state
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfileDto | null>(null);
  const [demoForm, setDemoForm] = useState({
    projectTitle: '', description: '', clientBudget: '', contactEmail: '', contactPhone: '',
  });
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  // Requirements state
  const [requirements, setRequirements] = useState<ClientRequirementResponse[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const loadFreelancers = async (filters?: FreelancerFilterParams) => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await getFilteredFreelancers(filters || {});
      setFreelancers(data);
      setHasLoaded(true);
    } catch (error) {
      console.error('Failed to load freelancers:', error);
      setHasError(true);
      setFreelancers([]);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load freelancers and requirements on mount
  useEffect(() => {
    loadFreelancers();
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    setReqLoading(true);
    try {
      const data = await getClientRequirements();
      setRequirements(data);
    } catch (error) {
      console.error('Failed to load requirements:', error);
    } finally {
      setReqLoading(false);
    }
  };

  // Expose scroll function globally for header to use
  useEffect(() => {
    (window as any).__scrollToFreelancers = () => {
      freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    return () => { delete (window as any).__scrollToFreelancers; };
  }, []);

  // Filter freelancers based on filters
  const filtered = useMemo(() => {
    let result = freelancers;
    if (filterSkill.trim()) {
      const q = filterSkill.toLowerCase();
      result = result.filter(f => f.primarySkills?.toLowerCase().includes(q));
    }
    if (filterCountry.trim()) {
      const q = filterCountry.toLowerCase();
      result = result.filter(f => f.country?.toLowerCase().includes(q));
    }
    if (filterMinExp.trim()) {
      const minExp = parseInt(filterMinExp);
      if (!isNaN(minExp)) {
        result = result.filter(f => (f.experience ?? f.experienceYears ?? 0) >= minExp);
      }
    }
    return result;
  }, [freelancers, filterSkill, filterCountry, filterMinExp]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterApply = () => {
    setCurrentPage(1);
    loadFreelancers({
      skill: filterSkill.trim() || undefined,
      country: filterCountry.trim() || undefined,
      minExperience: filterMinExp.trim() ? parseInt(filterMinExp) : undefined,
    });
  };

  const handleFilterClear = () => {
    setFilterSkill('');
    setFilterCountry('');
    setFilterMinExp('');
    setCurrentPage(1);
    loadFreelancers();
  };

  const getCurrencySymbol = (country?: string) => {
    if (!country) return '$';
    const c = country.toLowerCase();
    if (c.includes('india')) return '₹';
    if (c.includes('united kingdom')) return '£';
    return '$';
  };

  const handleDemoClick = (freelancer: FreelancerProfileDto) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedFreelancer(freelancer);
    setDemoForm({
      projectTitle: '', description: '', clientBudget: '',
      contactEmail: user?.email || '', contactPhone: '',
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
      toast({ title: '🎉 Demo Requested!', description: 'Your request has been submitted successfully.' });
      setDemoOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit demo request.', variant: 'destructive' });
    } finally {
      setDemoSubmitting(false);
    }
  };

  const handleHireTalentClick = () => {
    freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Extract unique skills and countries for filter dropdowns
  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    freelancers.forEach(f => {
      f.primarySkills?.split(',').forEach(s => {
        const trimmed = s.trim();
        if (trimmed) skills.add(trimmed);
      });
    });
    return Array.from(skills).sort();
  }, [freelancers]);

  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    freelancers.forEach(f => {
      if (f.country?.trim()) countries.add(f.country.trim());
    });
    return Array.from(countries).sort();
  }, [freelancers]);

  const stats = [
    { value: '500+', label: 'Active Freelancers' },
    { value: '1,200+', label: 'Projects Delivered' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const domains = [
    { name: 'IT & Software', icon: Code, color: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
    { name: 'Finance & Banking', icon: Landmark, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { name: 'Healthcare', icon: Stethoscope, color: 'bg-rose-500', lightBg: 'bg-rose-50', textColor: 'text-rose-600' },
    { name: 'HR & Recruitment', icon: Users, color: 'bg-violet-500', lightBg: 'bg-violet-50', textColor: 'text-violet-600' },
    { name: 'E-Commerce', icon: ShoppingCart, color: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
    { name: 'Data & Analytics', icon: BarChart3, color: 'bg-cyan-500', lightBg: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { name: 'Cloud & DevOps', icon: Cloud, color: 'bg-indigo-500', lightBg: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { name: 'Cybersecurity', icon: Shield, color: 'bg-red-500', lightBg: 'bg-red-50', textColor: 'text-red-600' },
    { name: 'Mobile Apps', icon: Smartphone, color: 'bg-pink-500', lightBg: 'bg-pink-50', textColor: 'text-pink-600' },
    { name: 'AI & Machine Learning', icon: Cpu, color: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
    { name: 'Education & EdTech', icon: GraduationCap, color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-600' },
    { name: 'Logistics & Supply Chain', icon: Truck, color: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600' },
    { name: 'UI/UX Design', icon: Palette, color: 'bg-fuchsia-500', lightBg: 'bg-fuchsia-50', textColor: 'text-fuchsia-600' },
    { name: 'ERP & CRM', icon: Settings, color: 'bg-slate-500', lightBg: 'bg-slate-50', textColor: 'text-slate-600' },
    { name: 'Digital Marketing', icon: MonitorPlay, color: 'bg-lime-600', lightBg: 'bg-lime-50', textColor: 'text-lime-700' },
    { name: 'Business Intelligence', icon: PieChart, color: 'bg-sky-500', lightBg: 'bg-sky-50', textColor: 'text-sky-600' },
  ];

  const testimonials = [
    { name: 'Rajesh K.', role: 'Full Stack Developer', location: 'Hyderabad', text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind.', rating: 5, avatar: 'R' },
    { name: 'Priya M.', role: 'DevOps Engineer', location: 'Bangalore', text: 'Finally, a platform that respects my time. I can work on my terms without compromising.', rating: 5, avatar: 'P' },
    { name: 'Suresh R.', role: 'Data Scientist', location: 'Chennai', text: 'The matching system is incredible. I only get projects that match my skills perfectly.', rating: 5, avatar: 'S' },
    { name: 'Lakshmi S.', role: 'React Developer', location: 'Vizag', text: 'Great platform for IT professionals. Tracking engagements is seamless and intuitive.', rating: 5, avatar: 'L' },
  ];

  const howItWorks = [
    { step: '1', title: 'Create Your Profile', description: 'Sign up, upload your resume, and let our smart system auto-fill your skills.', icon: Laptop, color: 'bg-emerald-500' },
    { step: '2', title: 'Browse & Match', description: 'Find projects that match your skills or get matched by clients looking for talent.', icon: Search, color: 'bg-blue-500' },
    { step: '3', title: 'Express Interest', description: 'Click "I\'m Interested" on projects you love and get connected with clients.', icon: Heart, color: 'bg-orange-500' },
    { step: '4', title: 'Get Paid', description: 'Complete work, track earnings, and receive timely payments for your expertise.', icon: DollarSign, color: 'bg-emerald-600' },
  ];

  // Colorful gradient sets for freelancer cards
  const cardColors = [
    { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    { bg: 'from-purple-500 to-violet-600', light: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    { bg: 'from-orange-500 to-amber-600', light: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
    { bg: 'from-rose-500 to-pink-600', light: 'bg-rose-50', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
    { bg: 'from-cyan-500 to-sky-600', light: 'bg-cyan-50', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' },
    { bg: 'from-fuchsia-500 to-pink-600', light: 'bg-fuchsia-50', text: 'text-fuchsia-600', badge: 'bg-fuchsia-100 text-fuchsia-700' },
    { bg: 'from-lime-500 to-green-600', light: 'bg-lime-50', text: 'text-lime-600', badge: 'bg-lime-100 text-lime-700' },
  ];

  return (
    <div className="flex flex-col bg-white text-gray-900 min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.2) 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find the perfect <br />
              <span className="text-emerald-400">IT freelance</span> services <br />
              for your business
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl">
              Connect with top-tier IT professionals across every domain. Privacy-first, flexible, and built for modern remote work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleHireTalentClick}
                className="gap-2 text-lg px-8 bg-emerald-500 hover:bg-emerald-600 border-0 font-bold text-white"
              >
                <Users className="h-5 w-5" /> Hire Talent <ArrowRight className="h-5 w-5" />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="gap-2 text-lg px-8 bg-transparent border-white/30 text-white hover:bg-white/10 font-bold"
                >
                  <Link to="/register?role=FreeLancer">
                    <Briefcase className="h-5 w-5" /> Register as Freelancer
                  </Link>
                </Button>
              )}
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-8 mt-10">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-emerald-400">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FREELANCER SHOWCASE (Main Section) ===== */}
      <section ref={freelancerSectionRef} className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-3 bg-emerald-50 text-emerald-600 border-emerald-200 text-sm px-4 py-1">🔥 Top Talent</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Hire Expert <span className="text-emerald-500">Freelancers</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Browse verified IT professionals. Hourly, Part-Time, or Full-Time — flexible for your needs.</p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Filter className="h-4 w-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <p className="text-sm text-gray-500">{filtered.length} freelancers found</p>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Skill</Label>
                        <select
                          value={filterSkill}
                          onChange={e => { setFilterSkill(e.target.value); setCurrentPage(1); }}
                          className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">All Skills</option>
                          {uniqueSkills.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Country</Label>
                        <select
                          value={filterCountry}
                          onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }}
                          className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">All Countries</option>
                          {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Min Experience (yrs)</Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 3"
                          value={filterMinExp}
                          onChange={e => { setFilterMinExp(e.target.value); setCurrentPage(1); }}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={handleFilterApply} className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Filter className="h-3 w-3" /> Apply
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleFilterClear} className="gap-1">
                        <X className="h-3 w-3" /> Clear
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          )}

          {/* Error */}
          {hasError && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Could not load freelancers from server.</p>
              <Button onClick={() => loadFreelancers()} variant="outline" className="gap-2">
                <Zap className="h-4 w-4" /> Retry
              </Button>
            </div>
          )}

          {/* Freelancer Small Cards Grid */}
          {hasLoaded && !isLoading && !hasError && (
            <>
              {paginated.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No freelancers found. Try different filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {paginated.map((f, idx) => {
                    const colorSet = cardColors[idx % cardColors.length];
                    const skills = f.primarySkills ? f.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
                    const symbol = getCurrencySymbol(f.country);
                    const expYears = f.experience ?? f.experienceYears ?? 0;

                    return (
                      <motion.div
                        key={f.freelancerId || f.id || idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 bg-white h-full">
                          <div className={`h-1.5 bg-gradient-to-r ${colorSet.bg}`} />
                          <CardContent className="p-3">
                            {/* Avatar & Name */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${colorSet.bg} flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0`}>
                                {f.fullName?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-xs text-gray-900 truncate leading-tight">{f.fullName}</h3>
                                <p className="text-[10px] text-gray-400 truncate flex items-center gap-0.5">
                                  <MapPin className="h-2.5 w-2.5 shrink-0" />{f.country || 'Remote'}
                                </p>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-2 text-[10px]">
                              <span className={`${colorSet.badge} px-1.5 py-0.5 rounded-full font-semibold`}>{expYears}yr exp</span>
                              <span className="font-bold text-gray-700 text-xs">{symbol}{f.hourRate || '—'}/hr</span>
                            </div>

                            {/* Skills - max 2 */}
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {skills.slice(0, 2).map((skill, si) => (
                                  <span key={si} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium truncate max-w-full">
                                    {skill}
                                  </span>
                                ))}
                                {skills.length > 2 && (
                                  <span className="text-[9px] px-1 py-0.5 text-gray-400">+{skills.length - 2}</span>
                                )}
                              </div>
                            )}

                            {/* Demo Button */}
                            <Button
                              onClick={() => handleDemoClick(f)}
                              size="sm"
                              className={`w-full gap-1 text-[10px] h-7 font-semibold bg-gradient-to-r ${colorSet.bg} hover:opacity-90 text-white shadow-sm`}
                            >
                              <Play className="h-3 w-3" /> Demo
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="h-8 px-2 text-xs"
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="h-8 px-2"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                    .reduce((acc: (number | string)[], page, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) {
                        acc.push('...');
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-xs">...</span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page as number)}
                          className={`h-8 w-8 p-0 text-xs ${currentPage === page ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}`}
                        >
                          {page}
                        </Button>
                      )
                    )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="h-8 px-2"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="h-8 px-2 text-xs"
                  >
                    Last
                  </Button>
                </div>
              )}

              {/* Login prompt for guests */}
              {!isAuthenticated && hasLoaded && paginated.length > 0 && (
                <div className="text-center mt-8">
                  <Button asChild size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                    <Link to="/register?role=Client">
                      Sign Up to Request Demos <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== BECOME A FREELANCER — Earn Money ===== */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            }} />
          </div>
          <div className="relative container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1 backdrop-blur-sm">💰 Earn Money</Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
                  Become a Freelancer & <br />Start Earning Today
                </h2>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Join thousands of IT professionals earning on their own terms. Work part-time while keeping your job, or go full-time freelancing.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: DollarSign, text: 'Set your own hourly rates' },
                    { icon: Clock, text: 'Work part-time or full-time — your choice' },
                    { icon: Globe, text: 'Connect with clients worldwide' },
                    { icon: Shield, text: 'Your identity stays protected' },
                    { icon: TrendingUp, text: 'Build your portfolio & grow' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 text-lg px-8 bg-white text-orange-600 hover:bg-white/90 font-bold shadow-xl"
                  >
                    <Link to="/register?role=FreeLancer">
                      <Briefcase className="h-5 w-5" /> Register as Freelancer
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="gap-2 text-lg px-8 bg-transparent border-white/40 text-white hover:bg-white/10 font-bold"
                  >
                    <Link to="/login">
                      Already registered? Login
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hidden md:grid grid-cols-2 gap-4"
              >
                {[
                  { label: 'Avg. Earnings', value: '₹50K+/mo', icon: DollarSign, bg: 'bg-white/20' },
                  { label: 'Active Projects', value: '1,200+', icon: Briefcase, bg: 'bg-white/15' },
                  { label: 'Freelancers', value: '500+', icon: Users, bg: 'bg-white/20' },
                  { label: 'Part-Time Earners', value: '60%', icon: Clock, bg: 'bg-white/15' },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10`}>
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-white/80" />
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                    <p className="text-xs text-white/70 font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}



      {/* ===== DOMAINS & TECHNOLOGIES ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-purple-50 text-purple-600 border-purple-200">All Domains</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Every Industry & Technology</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From IT to Healthcare, Finance to Logistics — find experts across every domain</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {domains.map((domain, i) => (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`${domain.lightBg} rounded-xl p-4 border border-transparent hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className={`h-10 w-10 rounded-lg ${domain.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  <domain.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className={`font-semibold text-sm ${domain.textColor}`}>{domain.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Get started in just 4 simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`h-14 w-14 rounded-full ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Freelancers Say</h2>
            <p className="text-gray-500">Join thousands of satisfied IT professionals</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full bg-white">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 italic leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="font-bold text-emerald-600">{t.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.role} • {t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA (guests only) ===== */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-slate-900 to-emerald-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-lg text-slate-300 mb-8">
                  Join WorkSupport360 today. Your privacy protected, your career elevated.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="gap-2 text-lg px-8 bg-emerald-500 hover:bg-emerald-600 border-0 font-bold text-white">
                    <Link to="/register?role=FreeLancer">Get Started Free <ArrowRight className="h-5 w-5" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-white/30 text-white hover:bg-white/10 font-bold">
                    <Link to="/register?role=Client">Hire Talent</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ===== DEMO REQUEST DIALOG ===== */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-500" />
              Request a Demo
            </DialogTitle>
            <DialogDescription>
              Request a demo session with <span className="font-semibold text-gray-900">{selectedFreelancer?.fullName}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Project Title <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. E-commerce Website Development" value={demoForm.projectTitle} onChange={e => setDemoForm(f => ({ ...f, projectTitle: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description</Label>
              <Textarea placeholder="Briefly describe your project requirements..." value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Budget</Label>
                <Input type="number" placeholder="e.g. 5000" value={demoForm.clientBudget} onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))} min={0} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Contact Phone</Label>
                <Input placeholder="Your phone number" value={demoForm.contactPhone} onChange={e => setDemoForm(f => ({ ...f, contactPhone: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Contact Email <span className="text-red-500">*</span></Label>
              <Input type="email" placeholder="your@email.com" value={demoForm.contactEmail} onChange={e => setDemoForm(f => ({ ...f, contactEmail: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDemoOpen(false)} disabled={demoSubmitting}>Cancel</Button>
              <Button onClick={handleDemoSubmit} disabled={demoSubmitting} className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white">
                {demoSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
