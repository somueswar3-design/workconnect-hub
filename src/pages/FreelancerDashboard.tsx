import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, Save, Plus, X, Camera, LogOut, 
  Languages, Lock, ChevronDown, Star, DollarSign, TrendingUp, Users, CheckCircle2,
  Wifi, WifiOff, ChevronLeft, ChevronRight, Shield, Zap, Award, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getAssignments, getFreelancerStats, AssignmentDto } from '@/services/freelancerApi';
import WorkHistoryTimeline from '@/components/WorkHistoryTimeline';
import { FreelancerStats } from '@/types/project';

interface FreelancerFormData {
  fullName: string;
  email: string;
  mobile: string;
  location: string;
  experience: string;
  hourlyRate: string;
  bio: string;
  skills: string[];
  primaryLanguage: string;
  otherLanguages: string[];
  companyAlias: string;
}

const promoSlides = [
  {
    title: "Complete Your Profile Today",
    description: "Freelancers with complete profiles get 3x more work opportunities. Update your skills, experience, and hourly rate to stand out.",
    icon: User,
    gradient: "from-[hsl(217,91%,50%)] to-[hsl(217,91%,35%)]",
    cta: "Update Profile",
    tab: "profile",
  },
  {
    title: "Set Your Hourly Rate",
    description: "Define your worth! We match you with clients looking for your exact skill set and budget range. Fair rates attract quality projects.",
    icon: DollarSign,
    gradient: "from-[hsl(160,84%,39%)] to-[hsl(160,84%,25%)]",
    cta: "Set Rate Now",
    tab: "profile",
  },
  {
    title: "We Find Work For You",
    description: "Once your profile is complete, our system matches you with clients. You'll be notified via email or phone when a matching opportunity arises.",
    icon: Target,
    gradient: "from-[hsl(25,95%,53%)] to-[hsl(25,95%,40%)]",
    cta: "Learn More",
    tab: "dashboard",
  },
  {
    title: "Go Online & Get Noticed",
    description: "Toggle your status to 'Online' to let clients know you're available. Offline freelancers won't appear in search results.",
    icon: Zap,
    gradient: "from-[hsl(270,70%,55%)] to-[hsl(270,70%,40%)]",
    cta: "Go Online",
    tab: "dashboard",
  },
  {
    title: "Quality Work = Better Ratings",
    description: "Deliver excellent work consistently to build your reputation. Top-rated freelancers earn 40% more and get priority matching.",
    icon: Award,
    gradient: "from-[hsl(340,75%,55%)] to-[hsl(340,75%,40%)]",
    cta: "View Ratings",
    tab: "history",
  },
];

const FreelancerDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOnline, setIsOnline] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [stats, setStats] = useState<FreelancerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FreelancerFormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: '',
    location: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    skills: [],
    primaryLanguage: 'English',
    otherLanguages: [],
    companyAlias: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const userId = user?.userId || '';
        const [a, s] = await Promise.all([
          getAssignments(userId),
          getFreelancerStats(),
        ]);
        setAssignments(a);
        setStats(s);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
      setLoading(false);
    };
    load();
  }, [user?.userId]);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: 'Image must be less than 5MB', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.experience.trim()) newErrors.experience = 'Experience is required';
    if (!form.hourlyRate.trim()) newErrors.hourlyRate = 'Hourly rate is required';
    if (!form.primaryLanguage) newErrors.primaryLanguage = 'Primary language is required';
    if (form.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (!form.bio.trim()) newErrors.bio = 'Bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fill all mandatory fields', variant: 'destructive' });
      return;
    }
    updateUser({ fullName: form.fullName, avatarUrl: avatarPreview || undefined });
    toast({ title: 'Profile Saved', description: 'Your profile has been updated successfully.' });
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
      if (errors.skills) setErrors(e => ({ ...e, skills: '' }));
    }
  };

  const removeSkill = (skill: string) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const update = (field: keyof FreelancerFormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const languageOptions = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Urdu'];

  const toggleOtherLanguage = (lang: string) => {
    setForm(p => ({
      ...p,
      otherLanguages: p.otherLanguages.includes(lang) ? p.otherLanguages.filter(l => l !== lang) : [...p.otherLanguages, lang],
    }));
  };

  const slide = promoSlides[currentSlide];

  const activeAssignments = assignments.filter(a => a.isActive);
  const inactiveAssignments = assignments.filter(a => !a.isActive);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div 
              className="relative cursor-pointer group" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-10 w-10 rounded-full bg-muted border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <Camera className="h-4 w-4 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                {form.fullName || 'Freelancer'}
              </h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50">
              {isOnline ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-muted-foreground" />}
              <span className={`text-xs font-medium ${isOnline ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={async (checked) => {
                  setIsOnline(checked);
                  try {
                    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7167';
                    const authToken = localStorage.getItem('auth_token');
                    const res = await fetch(`${API_BASE}/api/freelancer/availability`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                      },
                      body: JSON.stringify({
                        status: checked ? 'Available' : 'Unavailable',
                        userId: user?.userId || '',
                      }),
                    });
                    if (!res.ok) throw new Error('Failed to update availability');
                    toast({
                      title: checked ? '🟢 You are Online' : '⚫ You are Offline',
                      description: checked ? 'You are now visible to clients and ready to receive work.' : 'You will not appear in client searches.',
                    });
                  } catch (err: any) {
                    setIsOnline(!checked); // revert on failure
                    toast({ title: 'Error', description: err.message || 'Failed to update status', variant: 'destructive' });
                  }
                }}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <ChevronDown className="h-4 w-4" /> Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/change-password')}>
                  <Lock className="h-4 w-4 mr-2" /> Change Password
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Promo Slider */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <div className={`bg-gradient-to-r ${slide.gradient} p-8 md:p-10 text-primary-foreground transition-all duration-500`}>
            <div className="flex items-start gap-6">
              <div className="hidden md:flex h-16 w-16 rounded-2xl bg-primary-foreground/20 items-center justify-center shrink-0">
                <slide.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                <p className="text-primary-foreground/85 text-sm md:text-base max-w-2xl leading-relaxed">{slide.description}</p>
                <Button 
                  variant="secondary" 
                  className="mt-4 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
                  onClick={() => slide.tab === 'profile' ? navigate('/freelancer-profile') : setActiveTab(slide.tab)}
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {promoSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-primary-foreground' : 'w-2 bg-primary-foreground/40'}`}
                />
              ))}
            </div>
          </div>
          {/* Arrows */}
          <button 
            onClick={() => setCurrentSlide(p => (p - 1 + promoSlides.length) % promoSlides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-primary-foreground" />
          </button>
          <button 
            onClick={() => setCurrentSlide(p => (p + 1) % promoSlides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                    <p className="text-xl font-bold text-foreground">${stats.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Settled</p>
                    <p className="text-xl font-bold text-foreground">${stats.settledAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-foreground">${stats.pendingAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-xl font-bold text-foreground">{stats.averageRating.toFixed(1)} ⭐</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs: Dashboard / Work History / Profile */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="dashboard" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="h-4 w-4" /> Work History
            </TabsTrigger>
            <button
              onClick={() => navigate('/freelancer-profile')}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-1.5 hover:bg-primary hover:text-primary-foreground"
            >
              <User className="h-4 w-4" /> Update Profile
            </button>
          </TabsList>

          {/* Dashboard Tab - Current Assignments */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Active Assignments */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Current Assignments ({activeAssignments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No active assignments. Go online to receive work!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeAssignments.map(a => (
                      <div key={a.projectId} className="p-4 rounded-xl border border-border bg-gradient-to-br from-emerald-500/5 to-transparent hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-emerald-600" />
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                            {a.status || 'Active'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">{a.projectName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {a.clientName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inactive/Completed Assignments */}
            {inactiveAssignments.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Past Assignments ({inactiveAssignments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inactiveAssignments.map(a => (
                      <div key={a.projectId} className="p-4 rounded-xl border border-border bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {a.status || 'Completed'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">{a.projectName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {a.clientName}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Work History Tab */}
          <TabsContent value="history">
            <WorkHistoryTimeline projects={[]} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Personal Details</h2>
                  <Badge variant="outline" className="text-xs">All fields mandatory *</Badge>
                </div>
                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <Label className="text-sm font-medium">Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your full name" className={`pl-9 ${errors.fullName ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <Label className="text-sm font-medium">Email *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className={`pl-9 ${errors.email ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  {/* Mobile */}
                  <div>
                    <Label className="text-sm font-medium">Mobile Number *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.mobile} onChange={e => update('mobile', e.target.value)} placeholder="+91-XXX-XXX-XXXX" className={`pl-9 ${errors.mobile ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile}</p>}
                  </div>
                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium">Location *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.location} onChange={e => update('location', e.target.value)} placeholder="City, Country" className={`pl-9 ${errors.location ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
                  </div>
                  {/* Experience */}
                  <div>
                    <Label className="text-sm font-medium">Experience *</Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="e.g. 5+ Years" className={`pl-9 ${errors.experience ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.experience && <p className="text-xs text-destructive mt-1">{errors.experience}</p>}
                  </div>
                  {/* Hourly Rate */}
                  <div>
                    <Label className="text-sm font-medium">Hourly Rate *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} placeholder="e.g. $75" className={`pl-9 ${errors.hourlyRate ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.hourlyRate && <p className="text-xs text-destructive mt-1">{errors.hourlyRate}</p>}
                  </div>
                  {/* Company Alias */}
                  <div>
                    <Label className="text-sm font-medium">Company / Alias</Label>
                    <div className="relative mt-1">
                      <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.companyAlias} onChange={e => update('companyAlias', e.target.value)} placeholder="Company or brand name" className="pl-9" />
                    </div>
                  </div>
                  {/* Primary Language */}
                  <div>
                    <Label className="text-sm font-medium">Primary Language *</Label>
                    <Select value={form.primaryLanguage} onValueChange={v => update('primaryLanguage', v)}>
                      <SelectTrigger className={`mt-1 ${errors.primaryLanguage ? 'border-destructive' : ''}`}>
                        <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.primaryLanguage && <p className="text-xs text-destructive mt-1">{errors.primaryLanguage}</p>}
                  </div>
                </div>

                {/* Other Languages */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Other Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.filter(l => l !== form.primaryLanguage).map(lang => (
                      <Badge key={lang} variant={form.otherLanguages.includes(lang) ? 'default' : 'outline'} className={`cursor-pointer transition-colors ${form.otherLanguages.includes(lang) ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`} onClick={() => toggleOtherLanguage(lang)}>
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label className="text-sm font-medium">About Me / Bio *</Label>
                  <Textarea value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Describe your expertise..." rows={3} className={`mt-1 ${errors.bio ? 'border-destructive' : ''}`} />
                  {errors.bio && <p className="text-xs text-destructive mt-1">{errors.bio}</p>}
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Skills & Technologies *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map(skill => (
                      <Badge key={skill} className="bg-primary/10 text-primary border-primary/20 gap-1 pr-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive rounded-full"><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Type a skill and press Enter" className={`max-w-xs ${errors.skills ? 'border-destructive' : ''}`} />
                    <Button size="sm" variant="outline" onClick={addSkill} type="button"><Plus className="h-4 w-4 mr-1" /> Add</Button>
                  </div>
                  {errors.skills && <p className="text-xs text-destructive mt-1">{errors.skills}</p>}
                </div>

                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gap-2 px-8"><Save className="h-4 w-4" /> Save Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
