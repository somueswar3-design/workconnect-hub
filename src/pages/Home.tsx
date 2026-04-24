import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFilteredFreelancers, FreelancerProfileDto, FreelancerFilterParams, requestDemo, RequestDemoDto, getClientRequirements, ClientRequirementResponse, postRequirement } from '@/services/clientApi';
import { submitFreelancerInterest } from '@/services/freelancerApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/data/countries';
import { Checkbox } from '@/components/ui/checkbox';
import catWeb from '@/assets/cat-web.jpg';
import catMobile from '@/assets/cat-mobile.jpg';
import catDesign from '@/assets/cat-design.jpg';
import catData from '@/assets/cat-data.jpg';
import catMarketing from '@/assets/cat-marketing.jpg';
import catWriting from '@/assets/cat-writing.jpg';
import heroMakeItReal from '@/assets/hero-makeitreal.jpg';

const ITEMS_PER_PAGE = 6;

const HERO_TABS = ['Find freelancers', 'Browse projects', 'Post a job'] as const;
type HeroMode = 'hire' | 'work';
type HirePanel = 'skill' | 'location' | 'category';
type WorkPanel = 'skill' | 'language' | 'featured';

const HIRE_TILES = [
  { label: 'Graphic designers', img: catDesign, filter: 'UI/UX Design' },
  { label: 'Website designers', img: catWeb, filter: 'Web Development' },
  { label: 'Mobile app developers', img: catMobile, filter: 'Mobile Development' },
  { label: 'Logo designers', img: catMarketing, filter: 'Graphic Design' },
  { label: 'Product designers', img: catWriting, filter: 'UI/UX Design' },
  { label: 'Data scientists', img: catData, filter: 'Data Science & AI' },
];
const WORK_TILES = [
  { label: 'Website jobs', img: catWeb, filter: 'Web Development' },
  { label: 'Graphic design jobs', img: catDesign, filter: 'Graphic Design' },
  { label: 'Data entry jobs', img: catData, filter: 'Data Science & AI' },
  { label: 'Mobile app jobs', img: catMobile, filter: 'Mobile Development' },
  { label: 'Marketing jobs', img: catMarketing, filter: 'Digital Marketing' },
  { label: 'Logistics jobs', img: catWriting, filter: 'E-Commerce' },
];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Spanish', 'French', 'German', 'Mandarin'];
const SKILL_TAGS = ['React', 'Node.js', 'AWS', 'DevOps', 'Python', 'Cybersecurity', 'UI/UX', 'Mobile', 'Java', '.NET', 'Angular', 'Data Science'];

const CATEGORIES = [
  { label: 'Web Development', icon: Code, type: 'IT' },
  { label: 'Mobile Development', icon: Smartphone, type: 'IT' },
  { label: 'Cloud & DevOps', icon: Cloud, type: 'IT' },
  { label: 'Data Science & AI', icon: Database, type: 'IT' },
  { label: 'Cybersecurity', icon: Lock, type: 'IT' },
  { label: 'UI/UX Design', icon: Palette, type: 'IT' },
  { label: 'QA & Testing', icon: Settings, type: 'IT' },
  { label: 'ERP & SAP', icon: Cpu, type: 'IT' },
  { label: 'Digital Marketing', icon: TrendingUp, type: 'Non-IT' },
  { label: 'Content Writing', icon: FileText, type: 'Non-IT' },
  { label: 'Graphic Design', icon: MonitorPlay, type: 'Non-IT' },
  { label: 'SEO & Analytics', icon: BarChart3, type: 'Non-IT' },
  { label: 'E-Commerce', icon: ShoppingCart, type: 'Non-IT' },
  { label: 'Healthcare IT', icon: Stethoscope, type: 'Non-IT' },
  { label: 'Finance & Banking', icon: Landmark, type: 'Non-IT' },
  { label: 'Education & Training', icon: GraduationCap, type: 'Non-IT' },
];

// Technologies under each category for drilldown
const CATEGORY_TECHS: Record<string, string[]> = {
  'Web Development': ['React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Laravel', 'Rails', 'ASP.NET', 'WordPress'],
  'Mobile Development': ['React Native', 'Flutter', 'Swift / iOS', 'Kotlin / Android', 'Ionic', 'Xamarin'],
  'Cloud & DevOps': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions'],
  'Data Science & AI': ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'OpenAI / LLMs', 'NLP', 'Computer Vision', 'MLOps'],
  'Cybersecurity': ['Penetration Testing', 'SIEM', 'SOC', 'OWASP', 'Compliance (ISO/SOC2)', 'Cloud Security'],
  'UI/UX Design': ['Figma', 'Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 'Design Systems'],
  'QA & Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'TestNG', 'Manual QA', 'Performance Testing'],
  'ERP & SAP': ['SAP ABAP', 'S/4HANA', 'SAP Fiori', 'Oracle ERP', 'NetSuite', 'Microsoft Dynamics'],
  'Digital Marketing': ['SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Content Strategy', 'Marketing Automation'],
  'Content Writing': ['Blog Writing', 'Copywriting', 'Technical Writing', 'Translation', 'Proofreading', 'Scriptwriting'],
  'Graphic Design': ['Logo Design', 'Branding', 'Illustration', 'Social Media Graphics', 'Print Design', 'Motion Graphics'],
  'SEO & Analytics': ['Google Analytics', 'GA4', 'Looker Studio', 'SEO Audit', 'Keyword Research', 'Tag Manager'],
  'E-Commerce': ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Amazon Listings', 'Product Photography'],
  'Healthcare IT': ['HL7', 'FHIR', 'EHR Integration', 'HIPAA Compliance', 'Telehealth Platforms'],
  'Finance & Banking': ['Core Banking', 'Trading Systems', 'Risk Modelling', 'Fintech APIs', 'Blockchain'],
  'Education & Training': ['LMS', 'Moodle', 'Curriculum Design', 'eLearning Authoring', 'Instructional Design'],
};

const AVAILABILITY_OPTIONS = ['Available now', 'Part-time', 'Full-time'];

const RATE_OPTIONS = [
  { label: 'Under $20/hr', min: 0, max: 20 },
  { label: '$20–$50/hr', min: 20, max: 50 },
  { label: '$50–$100/hr', min: 50, max: 100 },
  { label: '$100+/hr', min: 100, max: Infinity },
];

const PanelOption = ({ icon: Icon, title, desc, active, onClick }: { icon: any; title: string; desc: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
      active ? 'bg-white border-orange-400 shadow-sm' : 'bg-white/60 border-transparent hover:bg-white hover:border-gray-200'
    }`}
  >
    <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-bold mb-0.5 ${active ? 'text-orange-600' : 'text-gray-900'}`}>{title}</p>
      <p className="text-xs text-gray-500 leading-snug">{desc}</p>
    </div>
    <ChevronRight className={`h-4 w-4 shrink-0 mt-2 ${active ? 'text-orange-500' : 'text-gray-300'}`} />
  </button>
);

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
  const [profileViewOpen, setProfileViewOpen] = useState(false);
  const [profileFreelancer, setProfileFreelancer] = useState<FreelancerProfileDto | null>(null);
  const [profileIdx, setProfileIdx] = useState(0);
  const [demoForm, setDemoForm] = useState({ projectTitle: '', description: '', clientBudget: '', contactEmail: '', contactPhone: '', budgetCountry: 'India', phoneCountryCode: '+91' });
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<ClientRequirementResponse[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ClientRequirementResponse | null>(null);
  const [interestComment, setInterestComment] = useState('');
  const [interestSubmitting, setInterestSubmitting] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);
  const [reqCurrentPage, setReqCurrentPage] = useState(1);
  const REQ_PER_PAGE = 6;
  const [postReqOpen, setPostReqOpen] = useState(false);
  const [postReqSubmitting, setPostReqSubmitting] = useState(false);
  const [postReqForm, setPostReqForm] = useState({ projectTitle: '', description: '', requiredSkills: '', budget: '', experienceLevel: '', language: '', country: '', contactEmail: '', countryCode: '+91', contactPhone: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [heroTab, setHeroTab] = useState<typeof HERO_TABS[number]>('Find freelancers');
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['Available now']);
  const [selectedRates, setSelectedRates] = useState<string[]>(['$20–$50/hr']);
  const [selectedSkillFilters, setSelectedSkillFilters] = useState<string[]>([]);
  const [heroSearchInput, setHeroSearchInput] = useState('');
  const [heroMode, setHeroMode] = useState<HeroMode>('hire');
  const [hirePanel, setHirePanel] = useState<HirePanel>('skill');
  const [workPanel, setWorkPanel] = useState<WorkPanel>('skill');
  const [drilldownCategory, setDrilldownCategory] = useState<string | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

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
    (window as any).__openPostRequirement = () => openPostRequirement();
    return () => { delete (window as any).__scrollToFreelancers; delete (window as any).__scrollToWorks; delete (window as any).__openPostRequirement; };
  }, []);

  useEffect(() => {
    const state = locationState.state as any;
    if (state?.scrollToFreelancers) setTimeout(() => freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    if (state?.scrollToWorks) setTimeout(() => worksSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    if (state?.openPostRequirement) setTimeout(() => openPostRequirement(), 300);
  }, [locationState.state]);

  // Show profile-completion banner for freelancers whose profile is incomplete
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  useEffect(() => {
    if (!isAuthenticated || !user) { setProfileIncomplete(false); return; }
    if (user.role?.toLowerCase() !== 'freelancer') { setProfileIncomplete(false); return; }
    if (!user.userId) return;
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    (async () => {
      try {
        const { API_BASE_URL } = await import('@/config/api');
        const res = await fetch(`${API_BASE_URL}/api/freelancer/profile-status?userId=${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfileIncomplete(!data?.profileUpdated);
      } catch {
        setProfileIncomplete(true);
      }
    })();
  }, [isAuthenticated, user?.userId, user?.role]);

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
  const handleFilterClear = () => { setFilterSkill(''); setFilterCountry(''); setFilterMinExp(''); setSelectedAvailability([]); setSelectedRates([]); setSelectedSkillFilters([]); setCurrentPage(1); loadFreelancers(); };

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

  const avatarColors = ['bg-violet-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];

  const handleHeroSearch = () => {
    if (heroSearchInput.trim()) {
      setSearchQuery(heroSearchInput.trim());
      setCurrentPage(1);
      freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkillTagClick = (skill: string) => {
    setSearchQuery(skill);
    setHeroSearchInput(skill);
    setCurrentPage(1);
    freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroTabClick = (tab: typeof HERO_TABS[number]) => {
    setHeroTab(tab);
    if (tab === 'Browse projects') {
      worksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'Post a job') {
      openPostRequirement();
    }
  };

  const toggleCheckbox = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 pt-10 pb-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] mb-3 tracking-tight text-gray-900">
              Hire experts. <span className="text-orange-500">Get work done.</span>
            </h1>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Connect with verified IT & creative professionals — hourly, part-time or full-time.
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200">
              <button
                onClick={() => setHeroMode('hire')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  heroMode === 'hire' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hire a Freelancer
              </button>
              <button
                onClick={() => setHeroMode('work')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  heroMode === 'work' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Earn Money Freelancing
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left options panel */}
              <div className="lg:col-span-4 bg-gray-50 p-5 space-y-3 border-r border-gray-200">
                {heroMode === 'hire' ? (
                  <>
                    <PanelOption icon={Code} title="By skill" desc="Looking for a freelancer with a specific skill? Start here." active={hirePanel === 'skill'} onClick={() => setHirePanel('skill')} />
                    <PanelOption icon={MapPin} title="By location" desc="Search for freelancers based on their location and timezone." active={hirePanel === 'location'} onClick={() => setHirePanel('location')} />
                    <PanelOption icon={Briefcase} title="By category" desc="Find freelancers that suit a certain project category." active={hirePanel === 'category'} onClick={() => setHirePanel('category')} />
                  </>
                ) : (
                  <>
                    <PanelOption icon={Code} title="By skill" desc="Search for work that requires a particular skill." active={workPanel === 'skill'} onClick={() => setWorkPanel('skill')} />
                    <PanelOption icon={Languages} title="By language" desc="Find projects that are in your language." active={workPanel === 'language'} onClick={() => setWorkPanel('language')} />
                    <PanelOption icon={Award} title="Featured jobs" desc="Explore our current list of top featured projects." active={workPanel === 'featured'} onClick={() => setWorkPanel('featured')} />
                  </>
                )}
              </div>

              {/* Right content */}
              <div className="lg:col-span-8 p-5">
                <div className="flex items-stretch bg-white border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm">
                  <div className="flex items-center px-3 border-r border-gray-200">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  {heroMode === 'work' && workPanel === 'language' ? (
                    <select
                      className="bg-transparent text-gray-700 text-sm px-3 outline-none flex-1 cursor-pointer py-3"
                      value={heroSearchInput}
                      onChange={e => setHeroSearchInput(e.target.value)}
                    >
                      <option value="">Select language…</option>
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  ) : (heroMode === 'hire' && hirePanel === 'location') ? (
                    <select
                      className="bg-transparent text-gray-700 text-sm px-3 outline-none flex-1 cursor-pointer py-3"
                      value={filterCountry}
                      onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }}
                    >
                      <option value="">All countries</option>
                      {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={heroMode === 'hire' ? 'Search skills, roles, or names…' : 'Search project keywords…'}
                      value={heroSearchInput}
                      onChange={e => setHeroSearchInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
                      className="flex-1 bg-transparent text-gray-900 px-3 outline-none placeholder:text-gray-400 text-sm py-3"
                    />
                  )}
                  <Button
                    onClick={() => {
                      if (heroMode === 'work') worksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      else handleHeroSearch();
                    }}
                    className="m-1.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg border-0"
                  >
                    Search
                  </Button>
                </div>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {heroMode === 'work' ? 'Do you want projects like these?' : 'Popular searches'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(heroMode === 'hire' ? HIRE_TILES : WORK_TILES).map(tile => (
                    <button
                      key={tile.label}
                      onClick={() => {
                        if (heroMode === 'work') {
                          worksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          setFilterSkill(tile.filter);
                          setSearchQuery(tile.filter);
                          setCurrentPage(1);
                          freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all bg-white text-left"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={tile.img} alt={tile.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="px-3 py-2.5 bg-white">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{tile.label}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {SKILL_TAGS.slice(0, 8).map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleSkillTagClick(skill)}
                      className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ MAKE IT REAL (Freelancer.in style) ══════════════════ */}
      <section className="relative overflow-hidden bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-14">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black leading-[1.05] mb-2">
                <span className="text-orange-500">Make it real</span>
              </h2>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-8 leading-tight">
                with WorkSupport360
              </h3>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">The best talent</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Discover reliable professionals by exploring their portfolios and immersing yourself in the feedback shared on their profiles.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Fast bids</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Get quick, no-obligation quotes from skilled freelancers. 80% of jobs receive bids within 60 seconds. Your idea is just moments from reality.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Quality work</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Access top-rated experts across IT, design, marketing and more. Every professional is verified for quality.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Safe & secure</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Your project, your money, your data — all protected. Pay only when you're satisfied with the milestone.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setHeroMode('hire')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-6 h-11">
                  Hire a Freelancer
                </Button>
                <Button onClick={() => setHeroMode('work')} variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white font-bold rounded-full px-6 h-11 bg-transparent">
                  Earn Money Freelancing
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroMakeItReal}
                alt="Vibrant hummingbird made of colorful splashes representing creativity"
                width={1280}
                height={768}
                loading="lazy"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CATEGORY DRILLDOWN ══════════════════ */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-2">EXPLORE</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Pick a category</h2>
            <p className="text-gray-500 mt-2 text-sm">Click a category to see related technologies.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => { setDrilldownCategory(cat.label); setSelectedTechs([]); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all bg-white group ${
                  cat.type === 'IT' ? 'hover:border-orange-300 hover:shadow-orange-500/10' : 'hover:border-blue-300 hover:shadow-blue-500/10'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                  cat.type === 'IT' ? 'bg-orange-50 group-hover:bg-orange-100' : 'bg-blue-50 group-hover:bg-blue-100'
                }`}>
                  <cat.icon className={`h-5 w-5 ${cat.type === 'IT' ? 'text-orange-500' : 'text-blue-500'}`} />
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CATEGORY TECH POPUP ══════════════════ */}
      <Dialog open={!!drilldownCategory} onOpenChange={(open) => { if (!open) { setDrilldownCategory(null); setSelectedTechs([]); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-gray-900">{drilldownCategory}</DialogTitle>
            <DialogDescription>Select one or more technologies to filter freelancers.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 py-2 max-h-[50vh] overflow-y-auto">
            {(drilldownCategory ? (CATEGORY_TECHS[drilldownCategory] || []) : []).map(tech => {
              const active = selectedTechs.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTechs(prev => active ? prev.filter(t => t !== tech) : [...prev, tech])}
                  className={`text-sm px-4 py-2 rounded-full border font-semibold transition-all ${
                    active
                      ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600'
                  }`}
                >
                  {active && <CheckCircle className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />}
                  {tech}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">{selectedTechs.length} selected</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedTechs([])} className="border-gray-300 text-gray-600">
                Clear
              </Button>
              <Button
                disabled={selectedTechs.length === 0}
                onClick={() => {
                  const query = selectedTechs.join(', ');
                  setFilterSkill(selectedTechs[0] || drilldownCategory || '');
                  setSearchQuery(query);
                  setCurrentPage(1);
                  setDrilldownCategory(null);
                  setTimeout(() => freelancerSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-1.5"
              >
                <Search className="h-4 w-4" /> Find freelancer{selectedTechs.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* ══════════════════ MAIN CONTENT: Sidebar + Freelancer Grid ══════════════════ */}
      <section ref={freelancerSectionRef} className="bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <div className="flex gap-8">

            {/* ─── LEFT SIDEBAR ─── */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-black text-gray-900">2,480</p>
                    <p className="text-xs text-gray-500 mt-0.5">IT professionals</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-black text-gray-900">348</p>
                    <p className="text-xs text-gray-500 mt-0.5">Live projects</p>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Availability</h3>
                  <div className="space-y-2.5">
                    {AVAILABILITY_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{opt}</span>
                        <Checkbox
                          checked={selectedAvailability.includes(opt)}
                          onCheckedChange={() => toggleCheckbox(selectedAvailability, opt, setSelectedAvailability)}
                          className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Hourly Rate */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Hourly Rate</h3>
                  <div className="space-y-2.5">
                    {RATE_OPTIONS.map(opt => (
                      <label key={opt.label} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
                        <Checkbox
                          checked={selectedRates.includes(opt.label)}
                          onCheckedChange={() => toggleCheckbox(selectedRates, opt.label, setSelectedRates)}
                          className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Skills</h3>
                  <div className="space-y-2.5">
                    {['React / Vue', 'Node.js', 'Python / Django', 'AWS / Azure', 'DevOps / CI-CD', 'Data Science', 'Mobile (React Native)', 'UI/UX Design'].map(skill => (
                      <label key={skill} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{skill}</span>
                        <Checkbox
                          checked={selectedSkillFilters.includes(skill)}
                          onCheckedChange={() => toggleCheckbox(selectedSkillFilters, skill, setSelectedSkillFilters)}
                          className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Country filter */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Country</h3>
                  <select
                    value={filterCountry}
                    onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 rounded-lg border border-gray-200 bg-white text-gray-700 px-3 text-sm outline-none"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <Button onClick={handleFilterClear} variant="outline" size="sm" className="w-full gap-2 border-gray-300 text-gray-500 hover:text-gray-900 hover:bg-gray-100 mt-2">
                  <X className="h-3.5 w-3.5" /> Clear all filters
                </Button>
              </div>
            </aside>

            {/* ─── RIGHT: FREELANCER GRID ─── */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    Showing {filtered.length} freelancers
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 lg:hidden">
                    <Filter className="h-4 w-4" /> Filters
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/talent-search')} className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hidden sm:flex">
                    See all <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile filters */}
              {showFilters && (
                <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1.5 block">Skill</Label>
                      <select value={filterSkill} onChange={e => { setFilterSkill(e.target.value); setCurrentPage(1); }} className="w-full h-9 rounded-md border border-gray-200 bg-white text-gray-700 px-3 text-sm">
                        <option value="">All Skills</option>
                        {uniqueSkills.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1.5 block">Country</Label>
                      <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }} className="w-full h-9 rounded-md border border-gray-200 bg-white text-gray-700 px-3 text-sm">
                        <option value="">All Countries</option>
                        {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1.5 block">Min Experience (yrs)</Label>
                      <Input type="number" min={0} placeholder="e.g. 3" value={filterMinExp} onChange={e => { setFilterMinExp(e.target.value); setCurrentPage(1); }} className="h-9 bg-white border-gray-200 text-gray-700" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleFilterApply} className="gap-1.5 bg-orange-500 hover:bg-orange-600"><Filter className="h-3 w-3" /> Apply</Button>
                    <Button size="sm" variant="outline" onClick={handleFilterClear} className="gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-100"><X className="h-3 w-3" /> Clear</Button>
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}

              {/* Error */}
              {hasError && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Could not load professionals from server.</p>
                  <Button onClick={() => loadFreelancers()} variant="outline" className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-100"><Zap className="h-4 w-4" /> Retry</Button>
                </div>
              )}

              {/* Freelancer Cards Grid */}
              {hasLoaded && !isLoading && !hasError && (
                <>
                  {paginated.length === 0 ? (
                    <div className="text-center py-16">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No professionals found. Try different filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {paginated.map((f, idx) => {
                        const skills = f.primarySkills ? f.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
                        const symbol = getCurrencySymbol(f.country);
                        const avatarColor = avatarColors[idx % avatarColors.length];
                        const initials = f.fullName ? f.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
                        const isAvailable = idx % 4 !== 3;
                        return (
                          <div
                            key={f.freelancerId || f.id || idx}
                            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 transition-all group"
                          >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`h-12 w-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-white shadow`}>
                                {initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-orange-500 transition-colors">{f.fullName}</h3>
                                <p className="text-xs text-gray-500 truncate">{skills[0] || 'IT Professional'} developer</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                <span className={`text-[10px] font-medium ${isAvailable ? 'text-emerald-600' : 'text-gray-400'}`}>{isAvailable ? 'Available' : 'Busy'}</span>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              ))}
                              <span className="text-xs text-gray-500 ml-1.5">{(4.7 + (idx % 4) * 0.1).toFixed(1)} ({50 + idx * 13})</span>
                            </div>

                            {/* Skill Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {skills.slice(0, 3).map((skill, si) => (
                                <span key={si} className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 font-medium">{skill}</span>
                              ))}
                              {skills.length > 3 && <span className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 text-gray-400">+{skills.length - 3}</span>}
                            </div>

                            {/* Rate + Country */}
                            <div className="flex items-center justify-between mb-4 text-sm">
                              <span className="text-lg font-black text-gray-900">{symbol}{f.hourRate || '—'}<span className="text-xs font-normal text-gray-400">/hr</span></span>
                              {f.country && <span className="text-xs text-gray-500 flex items-center gap-1"><Globe className="h-3 w-3" />{f.country}</span>}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                onClick={() => navigate(`/professional/${f.freelancerId || f.id || f.userId || idx}`)}
                                variant="outline"
                                className="border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold text-sm h-9 rounded-xl"
                              >
                                <User className="h-3.5 w-3.5 mr-1.5" /> View Profile
                              </Button>
                              <Button
                                onClick={() => handleDemoClick(f)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm h-9 rounded-xl border-0"
                              >
                                <Phone className="h-3.5 w-3.5 mr-1.5" /> Connect
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!isAuthenticated && paginated.length > 0 && (
                    <div className="text-center mt-10">
                      <Button variant="outline" asChild className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-full px-8">
                        <Link to="/register?role=Client">Register to view all {filtered.length} professionals <ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  )}

                  {isAuthenticated && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="h-8 px-2 text-xs border-gray-300 text-gray-600 hover:bg-gray-100">First</Button>
                      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-8 px-2 border-gray-300 text-gray-600 hover:bg-gray-100"><ChevronLeft className="h-3 w-3" /></Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2).reduce((acc: (number | string)[], page, idx, arr) => { if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) acc.push('...'); acc.push(page); return acc; }, []).map((page, idx) => page === '...' ? <span key={`e-${idx}`} className="px-1 text-gray-400 text-xs">...</span> : <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page as number)} className={`h-8 w-8 p-0 text-xs ${currentPage === page ? 'bg-orange-500 hover:bg-orange-600 border-orange-500 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{page}</Button>)}
                      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-8 px-2 border-gray-300 text-gray-600 hover:bg-gray-100"><ChevronRight className="h-3 w-3" /></Button>
                      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="h-8 px-2 text-xs border-gray-300 text-gray-600 hover:bg-gray-100">Last</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ LIVE PROJECTS ══════════════════ */}
      <section ref={worksSectionRef} className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-2">LIVE PROJECTS</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Explore Ongoing Projects</h2>
            <p className="text-gray-500 mt-2 text-sm">Discover real projects you can work on right now.</p>
          </div>

          {reqLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
          ) : requirements.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No live projects available right now.</p>
            </div>
          ) : (() => {
            const reqTotalPages = Math.ceil(requirements.length / REQ_PER_PAGE);
            const reqPaginated = requirements.slice((reqCurrentPage - 1) * REQ_PER_PAGE, reqCurrentPage * REQ_PER_PAGE);
            return (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                  {reqPaginated.map((req) => {
                    const skills = req.skillsRequired?.split(',').map(s => s.trim()).filter(Boolean) || [];
                    return (
                      <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-bold text-gray-900 line-clamp-2">{req.title}</h3>
                          <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                            req.status?.toLowerCase() === 'open' || req.status?.toLowerCase() === 'pending'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}>{req.status || 'Open'}</span>
                        </div>

                        {req.description && <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">{req.description}</p>}

                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {skills.slice(0, 4).map((skill, si) => (
                              <span key={si} className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 font-medium">{skill}</span>
                            ))}
                            {skills.length > 4 && <span className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 text-gray-400">+{skills.length - 4}</span>}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                          {req.budget > 0 && <span className="flex items-center gap-1 font-semibold text-gray-700"><DollarSign className="h-3 w-3 text-emerald-500" />{req.budget.toLocaleString()}</span>}
                          {req.minExperience > 0 && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{req.minExperience}+ yrs</span>}
                          {req.country && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{req.country}</span>}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(req.createdOn).toLocaleDateString()}</span>
                          <Button size="sm" onClick={() => handleInterestClick(req)} className="h-7 text-xs gap-1 bg-orange-500 hover:bg-orange-600 text-white border-0">
                            <Heart className="h-3 w-3" /> I'm Interested
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {reqTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                    <Button variant="outline" size="sm" disabled={reqCurrentPage === 1} onClick={() => setReqCurrentPage(1)} className="h-8 px-2 text-xs border-gray-300 text-gray-600 hover:bg-gray-100">First</Button>
                    <Button variant="outline" size="sm" disabled={reqCurrentPage === 1} onClick={() => setReqCurrentPage(p => p - 1)} className="h-8 px-2 border-gray-300 text-gray-600 hover:bg-gray-100"><ChevronLeft className="h-3 w-3" /></Button>
                    {Array.from({ length: reqTotalPages }, (_, i) => i + 1).map(page => (
                      <Button key={page} variant={reqCurrentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setReqCurrentPage(page)} className={`h-8 w-8 p-0 text-xs ${reqCurrentPage === page ? 'bg-orange-500 hover:bg-orange-600 border-orange-500 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{page}</Button>
                    ))}
                    <Button variant="outline" size="sm" disabled={reqCurrentPage === reqTotalPages} onClick={() => setReqCurrentPage(p => p + 1)} className="h-8 px-2 border-gray-300 text-gray-600 hover:bg-gray-100"><ChevronRight className="h-3 w-3" /></Button>
                    <Button variant="outline" size="sm" disabled={reqCurrentPage === reqTotalPages} onClick={() => setReqCurrentPage(reqTotalPages)} className="h-8 px-2 text-xs border-gray-300 text-gray-600 hover:bg-gray-100">Last</Button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* ══════════════════ BECOME A PROFESSIONAL ══════════════════ */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
          <div className="relative container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <p className="text-white/70 font-bold text-xs tracking-widest uppercase mb-3">EARN MONEY</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">Become a Work Support Professional</h2>
                <p className="text-white/80 text-base mb-6 leading-relaxed">Join hundreds of IT professionals earning on their own terms.</p>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: DollarSign, text: 'Set your own hourly rates' },
                    { icon: Clock, text: 'Work part-time or full-time' },
                    { icon: Globe, text: 'Connect with clients worldwide' },
                    { icon: Shield, text: 'Your identity stays protected' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center"><item.icon className="h-4 w-4 text-white" /></div>
                      <span className="font-medium text-white">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="gap-2 px-8 h-12 bg-gray-900 text-white hover:bg-gray-800 font-bold rounded-full">
                  <Link to="/register?role=FreeLancer"><Briefcase className="h-5 w-5" /> Join as Professional</Link>
                </Button>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {[
                  { label: 'Professionals', value: '500+', icon: Users },
                  { label: 'Hourly Earners', value: '60%', icon: Clock },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/10">
                    <stat.icon className="h-7 w-7 mx-auto mb-2 text-white/80" />
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-white/60 font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-2">TESTIMONIALS</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">What professionals say</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              { name: 'Rajesh K.', role: 'Full Stack Developer', location: 'Hyderabad', text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind.', avatar: 'R' },
              { name: 'Priya M.', role: 'DevOps Engineer', location: 'Bangalore', text: 'Finally, a platform that respects my time. I can work on my terms without compromising.', avatar: 'P' },
              { name: 'Suresh R.', role: 'Data Scientist', location: 'Chennai', text: 'The matching system is incredible. I only get projects that match my skills perfectly.', avatar: 'S' },
              { name: 'Lakshmi S.', role: 'React Developer', location: 'Vizag', text: 'Great platform for IT professionals. Tracking engagements is seamless and intuitive.', avatar: 'L' },
            ].map((t, i) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-5 h-full hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <div className={`h-9 w-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-xs`}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      {!isAuthenticated && (
        <section className="py-16 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join WorkSupport360 today and connect with the right opportunities.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="gap-2 px-8 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full">
                <Link to="/register?role=FreeLancer"><Briefcase className="h-5 w-5" /> I'm a Freelancer</Link>
              </Button>
              <Link to="/register?role=Client" className="inline-flex items-center justify-center gap-2 px-8 h-12 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full border border-gray-600 transition-colors">
                <Building2 className="h-5 w-5" /> Hire Talent
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ DIALOGS ══════════════════ */}
      {/* View Profile Dialog (Freelancer.in style) */}
      <Dialog open={profileViewOpen} onOpenChange={setProfileViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {profileFreelancer && (() => {
            const f = profileFreelancer;
            const skills = f.primarySkills ? f.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
            const secSkills = f.secondarySkills ? f.secondarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
            const langs = (f.languagesKnown || f.speakingLanguage || '').split(',').map(s => s.trim()).filter(Boolean);
            const symbol = getCurrencySymbol(f.country);
            const initials = f.fullName ? f.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
            const avatarColor = avatarColors[profileIdx % avatarColors.length];
            const rating = (4.7 + (profileIdx % 4) * 0.1).toFixed(1);
            const reviews = 50 + profileIdx * 13;
            const exp = f.experienceYears || f.experience || 0;
            return (
              <>
                {/* Header banner */}
                <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 h-20 rounded-t-lg">
                  <h2 className="sr-only">Profile</h2>
                </div>
                <div className="px-6 -mt-10 pb-6">
                  <div className="flex items-end gap-4 mb-4 flex-wrap sm:flex-nowrap">
                    <div className={`h-20 w-20 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white shadow-lg shrink-0`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <h2 className="text-xl font-black text-gray-900 truncate">{f.fullName}</h2>
                      <p className="text-sm text-gray-500 truncate">{skills[0] || 'IT Professional'} • {f.country}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">{rating}</span>
                        <span className="text-xs text-gray-400">({reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right pb-1">
                      <p className="text-2xl font-black text-gray-900">{symbol}{f.hourRate || '—'}</p>
                      <p className="text-xs text-gray-400">/hour</p>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full justify-start bg-gray-100 h-10">
                      <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                      <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                      <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
                      <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">About</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {f.bioDescption || `Experienced ${skills[0] || 'IT'} professional with ${exp || 'several'} years of hands-on expertise. Passionate about delivering high-quality work and collaborating with clients to bring their vision to life.`}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Country</p><p className="font-semibold text-gray-900 flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-orange-500" />{f.country || '—'}</p></div>
                        <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Experience</p><p className="font-semibold text-gray-900 flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-orange-500" />{exp ? `${exp}+ years` : '—'}</p></div>
                        <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Hourly Rate</p><p className="font-semibold text-gray-900 flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-orange-500" />{symbol}{f.hourRate || '—'}/hr</p></div>
                        <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Hours/Day</p><p className="font-semibold text-gray-900 flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-orange-500" />{f.hoursAvailablePerDay || '8'} hrs</p></div>
                      </div>
                      {langs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2">Languages</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {langs.map((l, i) => <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 font-medium">{l}</span>)}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="experience" className="mt-4 space-y-3">
                      <div className="border-l-2 border-orange-500 pl-4 py-1">
                        <p className="text-sm font-bold text-gray-900">{f.currentCompanyRole || skills[0] || 'Professional'}</p>
                        <p className="text-xs text-gray-500">{f.currentCompany || f.companyName || 'Independent'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{exp ? `${exp}+ years experience` : 'Current'}</p>
                      </div>
                      {f.anyFreelnacingExperience ? (
                        <div className="border-l-2 border-gray-200 pl-4 py-1">
                          <p className="text-sm font-bold text-gray-900">Freelancing Experience</p>
                          <p className="text-xs text-gray-500">{f.anyFreelnacingExperience}+ years on freelance projects</p>
                        </div>
                      ) : null}
                      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                        <p className="font-semibold text-gray-900 mb-1">Availability</p>
                        <p>Working {f.hoursAvailablePerDay || '8'} hours per day{f.isAvailbleInweeknds ? ', including weekends' : ', weekdays only'}.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="skills" className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Primary Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.length > 0 ? skills.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-semibold">{s}</span>) : <p className="text-xs text-gray-400">No skills listed</p>}
                        </div>
                      </div>
                      {secSkills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2">Secondary Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {secSkills.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 font-medium">{s}</span>)}
                          </div>
                        </div>
                      )}
                      {f.skillSetDesc && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2">Skill Description</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{f.skillSetDesc}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4 space-y-3">
                      <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                        <div className="text-center">
                          <p className="text-3xl font-black text-gray-900">{rating}</p>
                          <div className="flex items-center gap-0.5 justify-center mt-1">
                            {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{reviews} reviews</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {[5, 4, 3, 2, 1].map(stars => (
                            <div key={stars} className="flex items-center gap-2 text-xs">
                              <span className="w-3 text-gray-500">{stars}</span>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {[
                        { name: 'Sarah M.', rating: 5, text: 'Excellent work and great communication. Delivered ahead of schedule.', date: '2 weeks ago' },
                        { name: 'James L.', rating: 5, text: 'Highly skilled and professional. Will definitely hire again.', date: '1 month ago' },
                        { name: 'Priya K.', rating: 4, text: 'Good quality work and responsive throughout the project.', date: '2 months ago' },
                      ].map((r, i) => (
                        <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-gray-900">{r.name}</p>
                            <span className="text-[10px] text-gray-400">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-1">
                            {Array.from({ length: r.rating }).map((_, si) => <Star key={si} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-600">{r.text}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={() => setProfileViewOpen(false)} className="flex-1 border-gray-300">Close</Button>
                    <Button onClick={() => { setProfileViewOpen(false); handleDemoClick(f); }} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-1.5">
                      <Phone className="h-4 w-4" /> Connect Now
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>


      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Play className="h-5 w-5 text-orange-500" /> Request a Free Demo</DialogTitle>
            <DialogDescription className="text-gray-500">Tell us about your project. We'll coordinate a demo with <span className="font-semibold text-gray-900">{selectedFreelancer?.fullName}</span>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-medium text-gray-700">Project Title <span className="text-orange-500">*</span></Label><Input className="h-9 text-sm" placeholder="e.g. E-commerce Website" value={demoForm.projectTitle} onChange={e => setDemoForm(f => ({ ...f, projectTitle: e.target.value }))} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-gray-700">Description</Label><Textarea className="text-sm min-h-[60px]" placeholder="Briefly describe your requirements..." value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-gray-700">Country (Currency)</Label><Select value={demoForm.budgetCountry} onValueChange={v => setDemoForm(f => ({ ...f, budgetCountry: v }))}><SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name} ({c.currencySymbol} {c.currency})</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-gray-700">Budget</Label><Input type="number" min={0} className="h-9 text-sm" placeholder="e.g. 50000" value={demoForm.clientBudget} onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))} /></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-gray-700">Mobile <span className="text-orange-500">*</span></Label><div className="flex gap-1.5"><Select value={demoForm.phoneCountryCode} onValueChange={v => setDemoForm(f => ({ ...f, phoneCountryCode: v }))}><SelectTrigger className="w-[90px] h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="+91">🇮🇳 +91</SelectItem><SelectItem value="+1">🇺🇸 +1</SelectItem><SelectItem value="+44">🇬🇧 +44</SelectItem><SelectItem value="+61">🇦🇺 +61</SelectItem><SelectItem value="+971">🇦🇪 +971</SelectItem><SelectItem value="+65">🇸🇬 +65</SelectItem></SelectContent></Select><Input placeholder="9876543210" value={demoForm.contactPhone} onChange={e => setDemoForm(f => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '') }))} className="flex-1 h-9 text-sm" maxLength={15} /></div></div>
            <div className="space-y-1"><Label className="text-xs font-medium text-gray-700">Email <span className="text-orange-500">*</span></Label><Input type="email" className="h-9 text-sm" placeholder="your@email.com" value={demoForm.contactEmail} onChange={e => setDemoForm(f => ({ ...f, contactEmail: e.target.value }))} /></div>
            <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={() => setDemoOpen(false)} disabled={demoSubmitting}>Cancel</Button><Button onClick={handleDemoSubmit} disabled={demoSubmitting} className="gap-1.5 bg-orange-500 hover:bg-orange-600">{demoSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Submit Request</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={interestOpen} onOpenChange={setInterestOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-orange-500" /> Express Interest</DialogTitle><DialogDescription className="text-gray-500">Apply to <span className="font-semibold text-gray-900">{selectedRequirement?.title}</span></DialogDescription></DialogHeader>
          {interestSuccess ? (
            <div className="text-center py-6">
              <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Interest Submitted!</h3>
              <p className="text-sm text-gray-500">We'll notify you when the client responds.</p>
              <Button onClick={() => setInterestOpen(false)} className="mt-4 bg-orange-500 hover:bg-orange-600">Close</Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 pt-2">
                <div className="space-y-1"><Label className="text-xs text-gray-700">Comment (optional)</Label><Textarea placeholder="Why are you a good fit for this project?" value={interestComment} onChange={e => setInterestComment(e.target.value)} rows={3} className="text-sm" /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setInterestOpen(false)} disabled={interestSubmitting}>Cancel</Button>
                <Button onClick={handleInterestSubmit} disabled={interestSubmitting} className="gap-1.5 bg-orange-500 hover:bg-orange-600">{interestSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />} Submit Interest</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={postReqOpen} onOpenChange={setPostReqOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-orange-500" /> Post Your Requirement</DialogTitle><DialogDescription className="text-gray-500">Share your project details. We'll match you with the right professional.</DialogDescription></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5"><Label className="text-sm text-gray-700">Project Title <span className="text-orange-500">*</span></Label><Input placeholder="e.g. E-commerce Platform Development" value={postReqForm.projectTitle} onChange={e => setPostReqForm(f => ({ ...f, projectTitle: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label className="text-sm text-gray-700">Description</Label><Textarea placeholder="Describe your project..." value={postReqForm.description} onChange={e => setPostReqForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="space-y-1.5"><Label className="text-sm text-gray-700">Required Skills <span className="text-orange-500">*</span></Label><Input placeholder="React, Node.js, Python (comma separated)" value={postReqForm.requiredSkills} onChange={e => setPostReqForm(f => ({ ...f, requiredSkills: e.target.value }))} /></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-sm text-gray-700">Budget (₹)</Label><Input type="number" placeholder="50000" value={postReqForm.budget} onChange={e => setPostReqForm(f => ({ ...f, budget: e.target.value }))} min={0} /></div>
              <div className="space-y-1.5"><Label className="text-sm text-gray-700">Min Experience</Label><Input type="number" placeholder="3" value={postReqForm.experienceLevel} onChange={e => setPostReqForm(f => ({ ...f, experienceLevel: e.target.value }))} min={0} /></div>
              <div className="space-y-1.5"><Label className="text-sm text-gray-700">Language</Label><Input placeholder="English" value={postReqForm.language} onChange={e => setPostReqForm(f => ({ ...f, language: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-sm text-gray-700">Country</Label><Input placeholder="India" value={postReqForm.country} onChange={e => setPostReqForm(f => ({ ...f, country: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-sm text-gray-700">Mobile <span className="text-orange-500">*</span></Label><div className="flex gap-1.5"><Select value={postReqForm.countryCode} onValueChange={val => setPostReqForm(f => ({ ...f, countryCode: val }))}><SelectTrigger className="w-[90px] h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="+91">🇮🇳 +91</SelectItem><SelectItem value="+1">🇺🇸 +1</SelectItem><SelectItem value="+44">🇬🇧 +44</SelectItem><SelectItem value="+61">🇦🇺 +61</SelectItem><SelectItem value="+971">🇦🇪 +971</SelectItem><SelectItem value="+65">🇸🇬 +65</SelectItem><SelectItem value="+49">🇩🇪 +49</SelectItem><SelectItem value="+81">🇯🇵 +81</SelectItem></SelectContent></Select><Input placeholder="9876543210" value={postReqForm.contactPhone} onChange={e => setPostReqForm(f => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '') }))} className="flex-1" maxLength={15} /></div></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm text-gray-700">Email <span className="text-orange-500">*</span></Label><Input type="email" placeholder="your@email.com" value={postReqForm.contactEmail} onChange={e => setPostReqForm(f => ({ ...f, contactEmail: e.target.value }))} /></div>
            <div className="bg-orange-50 rounded-lg p-3 flex items-start gap-3 border border-orange-200">
              <Users className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
              <div><p className="text-sm font-semibold text-orange-600">We Hire & Provide the Right Professional</p><p className="text-xs text-gray-500 mt-0.5">We'll find, verify, and assign the right work support professional.</p></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <Button variant="outline" onClick={() => setPostReqOpen(false)} disabled={postReqSubmitting}>Cancel</Button>
              <Button onClick={handlePostReqSubmit} disabled={postReqSubmitting} className="gap-1.5 bg-orange-500 hover:bg-orange-600">{postReqSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post Requirement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
