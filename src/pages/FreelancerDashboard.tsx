import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, Save, Plus, X, Camera, LogOut, 
  Languages, Lock, ChevronDown, DollarSign, TrendingUp, Users, CheckCircle2,
  Wifi, WifiOff, Zap, Award, Target, Sparkles, Calendar
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
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getAssignments, getFreelancerEarnings, AssignmentDto, EarningsDto } from '@/services/freelancerApi';

const promoSlides = [
  {
    title: "Complete Your Profile",
    description: "Freelancers with complete profiles get 3x more opportunities.",
    icon: User,
    accent: "hsl(var(--primary))",
    bgPattern: "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
    emoji: "✨",
    cta: "Update Profile",
    action: "profile",
  },
  {
    title: "Set Your Hourly Rate",
    description: "Define your worth! Fair rates attract quality projects.",
    icon: DollarSign,
    accent: "hsl(142 71% 45%)",
    bgPattern: "radial-gradient(circle at 80% 30%, hsl(142 71% 45% / 0.15) 0%, transparent 50%)",
    emoji: "💰",
    cta: "Set Rate",
    action: "profile",
  },
  {
    title: "We Match You With Clients",
    description: "Our system finds the perfect projects for your skills.",
    icon: Target,
    accent: "hsl(25 95% 53%)",
    bgPattern: "radial-gradient(circle at 50% 80%, hsl(25 95% 53% / 0.15) 0%, transparent 50%)",
    emoji: "🎯",
    cta: "Learn More",
    action: "stay",
  },
  {
    title: "Go Online & Get Noticed",
    description: "Toggle your status to let clients know you're available.",
    icon: Zap,
    accent: "hsl(270 70% 55%)",
    bgPattern: "radial-gradient(circle at 30% 20%, hsl(270 70% 55% / 0.15) 0%, transparent 50%)",
    emoji: "⚡",
    cta: "Go Online",
    action: "stay",
  },
  {
    title: "Quality = Better Ratings",
    description: "Top-rated freelancers earn 40% more with priority matching.",
    icon: Award,
    accent: "hsl(340 75% 55%)",
    bgPattern: "radial-gradient(circle at 70% 60%, hsl(340 75% 55% / 0.15) 0%, transparent 50%)",
    emoji: "🏆",
    cta: "View History",
    action: "history",
  },
];

const FreelancerDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [earnings, setEarnings] = useState<EarningsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const userId = user?.userId || '';
        const [a, e] = await Promise.all([
          getAssignments(userId),
          getFreelancerEarnings(userId),
        ]);
        setAssignments(a);
        setEarnings(e);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
      setLoading(false);
    };
    load();
  }, [user?.userId]);

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

  const handleLogout = () => { logout(); navigate('/'); };

  const slide = promoSlides[currentSlide];
  const activeAssignments = Array.isArray(assignments) ? assignments.filter(a => a.status?.toLowerCase() === 'active') : [];
  const completedAssignments = Array.isArray(assignments) ? assignments.filter(a => a.status?.toLowerCase() !== 'active') : [];
  // Projects with projectId 0 are current/demo projects from API
  const currentProjects = Array.isArray(assignments) ? assignments.filter(a => a.projectId === 0 || a.status?.toLowerCase() === 'active') : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
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
              <h1 className="text-base font-bold text-foreground leading-tight">{user?.fullName || 'Freelancer'}</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50">
              {isOnline ? <Wifi className="h-4 w-4 text-primary" /> : <WifiOff className="h-4 w-4 text-muted-foreground" />}
              <span className={`text-xs font-medium ${isOnline ? 'text-primary' : 'text-muted-foreground'}`}>
                {isOnline ? 'Available' : 'Not Available'}
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
                        status: checked ? 'Available' : 'Not Available',
                        userId: user?.userId ? Number(user.userId) : 0,
                      }),
                    });
                    if (!res.ok) throw new Error('Failed to update availability');
                    toast({
                      title: checked ? '🟢 Available' : '⚫ Not Available',
                      description: checked ? 'You are now visible to clients.' : 'You will not appear in searches.',
                    });
                  } catch (err: any) {
                    setIsOnline(!checked);
                    toast({ title: 'Error', description: err.message || 'Failed to update status', variant: 'destructive' });
                  }
                }}
                className="data-[state=checked]:bg-primary"
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
        {/* ===== NEW UNIQUE SLIDER ===== */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-60" style={{ background: slide.bgPattern }} />
          
          {/* Floating decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-24 w-24 text-primary" />
            </motion.div>
          </div>

          <div className="relative p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-8"
              >
                {/* Left: Icon with glow */}
                <div className="hidden md:block relative shrink-0">
                  <div 
                    className="h-20 w-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}88)`,
                    }}
                  >
                    <span className="drop-shadow-md">{slide.emoji}</span>
                  </div>
                  <div 
                    className="absolute -inset-2 rounded-3xl blur-xl opacity-30"
                    style={{ background: slide.accent }}
                  />
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0">
                  <motion.h2 
                    className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      size="sm"
                      className="shadow-md"
                      onClick={() => {
                        if (slide.action === 'profile') navigate('/freelancer-profile');
                        else if (slide.action === 'history') setActiveTab('history');
                      }}
                    >
                      {slide.cta}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar style indicators */}
            <div className="flex items-center gap-2 mt-8">
              {promoSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="relative h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
                >
                  {i === currentSlide && (
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      key={`progress-${currentSlide}`}
                    />
                  )}
                  {i < currentSlide && (
                    <div className="absolute inset-0 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        {earnings && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center shadow-sm">
                  <DollarSign className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Total Earnings</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                      {earnings.currency === 'India' ? '₹' : '$'}{earnings.earnedAmount.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">{earnings.currency}</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <TrendingUp className="h-3 w-3 mr-1" /> Earnings
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs: Assignments / Work History */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="assignments" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="h-4 w-4" /> Assignments
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="h-4 w-4" /> Work History
            </TabsTrigger>
            <button
              onClick={() => navigate('/freelancer-profile')}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-1.5 hover:bg-primary hover:text-primary-foreground"
            >
              <User className="h-4 w-4" /> Update Profile
            </button>
          </TabsList>

          {/* Assignments Tab - All assignments */}
          <TabsContent value="assignments" className="space-y-6">
            {loading ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Loading assignments...</p>
                </CardContent>
              </Card>
            ) : assignments.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No assignments yet. Go online to receive work!</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Active Assignments */}
                {activeAssignments.length > 0 && (
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        Active Assignments ({activeAssignments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeAssignments.map((a, idx) => (
                          <motion.div 
                            key={`${a.projectId}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-primary" />
                              </div>
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                {a.status || 'Active'}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-foreground text-sm mb-1">{a.projectName}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" /> {a.clientName}
                            </p>
                            {a.startDate && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Started: {new Date(a.startDate).toLocaleDateString()}
                              </p>
                            )}
                            {a.endDate && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Due: {new Date(a.endDate).toLocaleDateString()}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Completed / Inactive Assignments */}
                {completedAssignments.length > 0 && (
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Past Assignments ({completedAssignments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedAssignments.map((a, idx) => (
                          <div key={`${a.projectId}-${idx}`} className="p-4 rounded-xl border border-border bg-muted/30">
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
              </>
            )}
          </TabsContent>

          {/* Work History Tab - shows current projects (projectId 0 = current from API) */}
          <TabsContent value="history" className="space-y-4">
            {currentProjects.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No work history yet</p>
                </CardContent>
              </Card>
            ) : (
              currentProjects.map((a, idx) => (
                <motion.div
                  key={`history-${a.projectId}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <div className="h-1 bg-primary" />
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground text-base">{a.projectName}</h3>
                              <p className="text-sm text-muted-foreground">{a.clientName}</p>
                            </div>
                            <Badge className={
                              a.status?.toLowerCase() === 'active' 
                                ? 'bg-primary/10 text-primary border-primary/20' 
                                : 'bg-muted text-muted-foreground'
                            }>
                              {a.projectId === 0 ? 'Current Project' : a.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                            {a.startDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Started: {new Date(a.startDate).toLocaleDateString()}
                              </span>
                            )}
                            {a.endDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Ends: {new Date(a.endDate).toLocaleDateString()}
                              </span>
                            )}
                            {!a.endDate && a.status?.toLowerCase() === 'active' && (
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <Zap className="h-3.5 w-3.5" /> In Progress
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
