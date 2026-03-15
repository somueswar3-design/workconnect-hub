import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, Save, Plus, X, Camera, LogOut, 
  Languages, Lock, ChevronDown, DollarSign, TrendingUp, Users, CheckCircle2,
  Wifi, WifiOff, Zap, Award, Target, Sparkles, Calendar, Search, Filter,
  Building2, IndianRupee, Timer, Eye, Send, Bell, MessageCircle, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAssignments, getFreelancerEarnings, getJobOpenings, AssignmentDto, EarningsDto, JobOpeningDto } from '@/services/freelancerApi';
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
  const [activeTab, setActiveTab] = useState('openings');
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [earnings, setEarnings] = useState<EarningsDto | null>(null);
  const [openings, setOpenings] = useState<JobOpeningDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingsLoading, setOpeningsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifyPopup, setShowNotifyPopup] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setOpeningsLoading(true);
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

      try {
        const userId = user?.userId || '';
        const o = await getJobOpenings(userId);
        setOpenings(o);
      } catch (err) {
        console.error('Failed to load openings:', err);
        setOpenings([]);
      }
      setOpeningsLoading(false);
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
        <Card className="border border-border shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Total Earnings</p>
              <p className="text-xl font-extrabold text-foreground truncate">
                {earnings ? `${getCurrencySymbol(earnings.currency)}${earnings.earnedAmount.toLocaleString()}` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Active Projects</p>
              <p className="text-xl font-extrabold text-foreground">{activeAssignments.length}</p>
            </div>
            {activeAssignments.length > 0 && (
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setActiveTab('assignments')}>
                View <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Completed</p>
              <p className="text-xl font-extrabold text-foreground">{completedAssignments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Openings */}
      <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by skill, title, or keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
            <Badge variant="outline" className="px-3 py-2 text-xs shrink-0">{filteredOpenings.length} openings</Badge>
          </div>

          {openingsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border border-border shadow-sm animate-pulse">
                  <CardContent className="p-5"><div className="h-5 bg-muted rounded w-2/3 mb-3" /><div className="h-4 bg-muted rounded w-1/3 mb-4" /><div className="h-3 bg-muted rounded w-full mb-2" /><div className="h-3 bg-muted rounded w-3/4" /></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOpenings.length === 0 ? (
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
              <CardContent className="py-16 text-center space-y-6">
                <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No Openings Available Right Now</h3>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">New freelancing requirements are posted regularly by clients. Keep your profile updated and stay online to get matched!</p>
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Bell className="h-4 w-4" /> We'll notify you when new openings match your skills!
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOpenings.map((job, idx) => (
                <motion.div key={job.id || idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors truncate">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.clientName}</span>
                            {job.location && <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {job.postedDate && <span className="text-xs text-muted-foreground">{getTimeAgo(job.postedDate)}</span>}
                          <Badge className={`block mt-1 text-[10px] ${job.status?.toLowerCase() === 'open' || job.status?.toLowerCase() === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground'}`}>{job.status || 'Open'}</Badge>
                        </div>
                      </div>
                      {job.description && <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{job.description}</p>}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {job.skills.map((skill, si) => <Badge key={si} variant="secondary" className="text-[11px] px-2 py-0.5 font-normal">{skill}</Badge>)}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-border">
                        {job.budget && (
                          <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                            {getCurrencySymbol(job.currency) === '₹' ? <IndianRupee className="h-3.5 w-3.5 text-primary" /> : <DollarSign className="h-3.5 w-3.5 text-primary" />}
                            {job.budget}
                          </span>
                        )}
                        {job.duration && <span className="text-xs text-muted-foreground flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> {job.duration}</span>}
                        {job.deadline && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                        {job.applicants !== undefined && job.applicants > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {job.applicants} applicants</span>}
                        {job.postedDate && <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto"><Clock className="h-3.5 w-3.5" /> Posted: {new Date(job.postedDate).toLocaleDateString()} {new Date(job.postedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
      </div>

      {/* Notification Popup */}
      <Dialog open={showNotifyPopup} onOpenChange={setShowNotifyPopup}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl overflow-hidden p-0">
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
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
  return (
    <DashboardLayout userType="freelancer">
      <Routes>
        <Route path="/" element={<FreelancerOverview />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="*" element={<FreelancerOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
