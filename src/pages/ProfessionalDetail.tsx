import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Briefcase, Clock, DollarSign, Globe, CheckCircle,
  Lock, Phone, Mail, Send, Award, Loader2, Heart, Languages, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFilteredFreelancers, FreelancerProfileDto, requestDemo } from '@/services/clientApi';

const avatarColors = ['bg-violet-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];

const getCurrencySymbol = (country?: string) => {
  if (!country) return '$';
  const c = country.toLowerCase();
  if (c.includes('india')) return '₹';
  if (c.includes('united kingdom')) return '£';
  return '$';
};

const ProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FreelancerProfileDto | null>(null);

  // Bid form
  const [bidAmount, setBidAmount] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const all = await getFilteredFreelancers({});
        const target = parseInt(id || '0', 10);
        const found = all.find(
          f => (f.freelancerId === target) || (f.id === target) || (f.userId === target)
        ) || null;
        setProfile(found);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const idx = useMemo(() => Math.abs((profile?.freelancerId || profile?.id || 0)) % avatarColors.length, [profile]);
  const initials = profile?.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  const skills = profile?.primarySkills ? profile.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const secSkills = profile?.secondarySkills ? profile.secondarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const langs = (profile?.languagesKnown || profile?.speakingLanguage || '').split(',').map(s => s.trim()).filter(Boolean);
  const symbol = getCurrencySymbol(profile?.country);
  const exp = profile?.experienceYears || profile?.experience || 0;
  const rating = (4.7 + (idx % 4) * 0.1).toFixed(1);
  const reviews = 50 + idx * 13;

  const requireLoginOr = (fn: () => void) => {
    if (!isAuthenticated) {
      toast({ title: 'Login required', description: 'Please log in to continue.' });
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    fn();
  };

  const handlePlaceBid = () => requireLoginOr(async () => {
    if (!bidAmount.trim() || !bidMessage.trim()) {
      toast({ title: 'Validation', description: 'Bid amount and message are required.', variant: 'destructive' });
      return;
    }
    if (!profile) return;
    setSubmitting(true);
    try {
      const interviewSchedule = interviewDate
        ? `Preferred interview: ${interviewDate}${interviewTime ? ' at ' + interviewTime : ''}`
        : '';
      const fullDescription = `${bidMessage}${bidDays ? `\nDuration: ${bidDays} days` : ''}${interviewSchedule ? `\n${interviewSchedule}` : ''}`;
      await requestDemo({
        id: 0,
        clientUserId: parseInt(user?.userId || '0', 10) || 0,
        freelancerUserId: profile.userId || profile.freelancerId || profile.id || 0,
        projectTitle: `Hire Request for ${profile.fullName}`,
        clientBudget: Number(bidAmount) || 0,
        contactEmail: user?.email || '',
        contactPhone: '',
        status: 'Pending',
        adminDescription: fullDescription,
        createdOn: new Date().toISOString(),
      });
      toast({ title: '🎉 Request submitted!', description: 'Our team will arrange the interview shortly.' });
      setBidAmount(''); setBidDays(''); setBidMessage(''); setInterviewDate(''); setInterviewTime('');
    } catch {
      toast({ title: 'Error', description: 'Failed to submit request.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  });

  const handleContact = () => requireLoginOr(() => {
    toast({ title: 'Contact unlocked', description: `You can now message ${profile?.fullName}.` });
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 mb-4">Professional not found.</p>
        <Button asChild variant="outline"><Link to="/">Back to Home</Link></Button>
      </div>
    );
  }

  // Mock projects portfolio
  const portfolio = [
    { title: `${skills[0] || 'Web'} dashboard for fintech client`, summary: 'Built a real-time analytics dashboard with role-based access and custom reporting.', tag: skills[0] || 'Web', budget: `${symbol}3,200` },
    { title: 'E-commerce platform migration', summary: 'Migrated legacy storefront to modern stack, reduced load time by 60%.', tag: skills[1] || 'Migration', budget: `${symbol}5,800` },
    { title: 'Mobile-first redesign', summary: 'Led the UX overhaul, improving conversion by 28% across key flows.', tag: skills[2] || 'Design', budget: `${symbol}2,400` },
  ];

  const jobsCompleted = 100 + idx * 17;
  const repeatPct = 75 + (idx % 20);
  const tagline = profile.bioDescption?.split('.')[0] || `${skills.slice(0, 3).join(', ') || 'IT'} Specialist`;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* DARK HERO */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(249,115,22,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.2) 0%, transparent 50%)' }} />
        <div className="container mx-auto px-4 pt-4 pb-8 relative">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
            {/* Big orange avatar */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-5xl lg:text-6xl shadow-2xl ring-4 ring-orange-300/30">
                {initials}
              </div>
              <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
            </div>

            {/* Identity block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight">{profile.fullName}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-400/40 rounded-md px-2.5 py-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
              <p className="text-base lg:text-lg text-white/70 mb-3">{tagline}</p>

              <div className="flex items-center gap-5 flex-wrap text-sm text-white/80">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="font-bold text-white">{rating}</span>
                  <span className="text-white/60">({reviews} reviews)</span>
                </div>
                {profile.country && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange-400" />{profile.country}</span>
                )}
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-400" />{profile.timeZone || 'IST (UTC+5:30)'}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-orange-400" />{exp || 6} years experience</span>
              </div>

              <div className="flex items-center gap-5 mt-3 text-sm text-white/80 flex-wrap">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /><strong className="text-white">{jobsCompleted}</strong> jobs completed</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-blue-400" /><strong className="text-white">{repeatPct}%</strong> repeat clients</span>
              </div>
            </div>

            {/* Rate + actions */}
            <div className="shrink-0 flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-5xl font-black text-orange-400 leading-none">{symbol}{profile.hourRate || '55'}<span className="text-xl text-orange-300/80">/hr</span></p>
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 rounded-md px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Available now
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => requireLoginOr(() => toast({ title: 'Saved!', description: 'Added to shortlist.' }))} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-1.5">
                  <Heart className="h-4 w-4" /> Save
                </Button>
                <Button onClick={() => document.getElementById('hire-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-1.5">
                  Hire Now →
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs in dark hero */}
          <div className="mt-8 border-b border-white/10">
            <Tabs defaultValue="about">
              <TabsList className="bg-transparent gap-2 p-0 h-auto">
                <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-white data-[state=active]:bg-transparent text-white/60 px-4 py-3 font-bold text-base data-[state=active]:shadow-none">Overview</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-white data-[state=active]:bg-transparent text-white/60 px-4 py-3 font-bold text-base data-[state=active]:shadow-none">Portfolio (12)</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-white data-[state=active]:bg-transparent text-white/60 px-4 py-3 font-bold text-base data-[state=active]:shadow-none">Reviews ({reviews})</TabsTrigger>
                <TabsTrigger value="experience" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-white data-[state=active]:bg-transparent text-white/60 px-4 py-3 font-bold text-base data-[state=active]:shadow-none">Skills</TabsTrigger>
              </TabsList>

              {/* Light content body */}
              <div className="bg-gray-50 -mx-4 px-4 mt-0">
                <div className="container mx-auto px-0 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6 text-gray-900">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

                <TabsContent value="about" className="pt-5 space-y-5">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Bio</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {profile.bioDescption || `Experienced ${skills[0] || 'IT'} professional with ${exp || 'several'} years of hands-on expertise. Passionate about delivering high-quality work and collaborating with clients to bring their vision to life.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Country</p><p className="font-semibold text-gray-900 text-sm flex items-center gap-1 mt-0.5"><Globe className="h-3.5 w-3.5 text-orange-500" />{profile.country || '—'}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Experience</p><p className="font-semibold text-gray-900 text-sm flex items-center gap-1 mt-0.5"><Briefcase className="h-3.5 w-3.5 text-orange-500" />{exp ? `${exp}+ yrs` : '—'}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Rate</p><p className="font-semibold text-gray-900 text-sm flex items-center gap-1 mt-0.5"><DollarSign className="h-3.5 w-3.5 text-orange-500" />{symbol}{profile.hourRate || '—'}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Hours/day</p><p className="font-semibold text-gray-900 text-sm flex items-center gap-1 mt-0.5"><Clock className="h-3.5 w-3.5 text-orange-500" />{profile.hoursAvailablePerDay || '8'} hrs</p></div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Primary Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.length ? skills.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-semibold">{s}</span>) : <p className="text-xs text-gray-400">No skills listed.</p>}
                    </div>
                  </div>

                  {secSkills.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Secondary Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {secSkills.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 font-medium">{s}</span>)}
                      </div>
                    </div>
                  )}

                  {langs.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Languages className="h-4 w-4 text-orange-500" /> Languages</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {langs.map((l, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium">{l}</span>)}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="experience" className="pt-5 space-y-3">
                  <div className="border-l-2 border-orange-500 pl-4 py-1">
                    <p className="font-bold text-gray-900">{profile.currentCompanyRole || skills[0] || 'Professional'}</p>
                    <p className="text-sm text-gray-500">{profile.currentCompany || profile.companyName || 'Independent'}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" />{exp ? `${exp}+ years` : 'Current role'}</p>
                  </div>
                  {profile.anyFreelnacingExperience ? (
                    <div className="border-l-2 border-gray-200 pl-4 py-1">
                      <p className="font-bold text-gray-900">Freelancing Experience</p>
                      <p className="text-sm text-gray-500">{profile.anyFreelnacingExperience}+ years on freelance projects</p>
                    </div>
                  ) : null}
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900 mb-1">Availability</p>
                    <p>Working {profile.hoursAvailablePerDay || '8'} hours per day{profile.isAvailbleInweeknds ? ', including weekends' : ', weekdays only'}.</p>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="pt-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {portfolio.map((p, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0">{p.budget}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">{p.summary}</p>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-semibold">{p.tag}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-5 space-y-3">
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
            </div>
          </div>

          {/* RIGHT (1/3) — Bid + Contact */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Hire / Bid card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-1 text-lg">Hire {profile.fullName.split(' ')[0]}</h3>
                <p className="text-xs text-gray-500 mb-4">Submit your offer & preferred interview slot. Our team coordinates the rest.</p>

                {!isAuthenticated ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center mb-3">
                    <Lock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-700 mb-2">Login required to submit a hire request.</p>
                    <Button
                      onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                    >
                      Login to Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="bidAmount" className="text-xs font-semibold text-gray-700">Bid amount ({symbol}/hr)</Label>
                      <Input id="bidAmount" type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder={`${symbol}${profile.hourRate || 50}`} className="mt-1 h-10" />
                    </div>
                    <div>
                      <Label htmlFor="bidDays" className="text-xs font-semibold text-gray-700">Engagement (days)</Label>
                      <Input id="bidDays" type="number" value={bidDays} onChange={(e) => setBidDays(e.target.value)} placeholder="e.g. 30" className="mt-1 h-10" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="interviewDate" className="text-xs font-semibold text-gray-700">Interview date</Label>
                        <Input id="interviewDate" type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="mt-1 h-10" />
                      </div>
                      <div>
                        <Label htmlFor="interviewTime" className="text-xs font-semibold text-gray-700">Time</Label>
                        <Input id="interviewTime" type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} className="mt-1 h-10" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bidMessage" className="text-xs font-semibold text-gray-700">Project / message</Label>
                      <Textarea id="bidMessage" rows={3} value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} placeholder="Briefly describe your project & requirements..." className="mt-1" />
                    </div>
                    <Button onClick={handlePlaceBid} disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-semibold">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                      Submit Hire Request
                    </Button>
                  </div>
                )}
              </div>

              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4 text-lg">Contact</h3>
                <div className="space-y-2.5">
                  <Button onClick={handleContact} variant="outline" className="w-full justify-start gap-3 border-gray-200 h-12 text-gray-800 font-medium hover:bg-orange-50 hover:border-orange-200">
                    <Phone className="h-4 w-4 text-orange-500" />
                    {isAuthenticated ? 'Reveal phone' : 'Login to view phone'}
                  </Button>
                  <Button onClick={handleContact} variant="outline" className="w-full justify-start gap-3 border-gray-200 h-12 text-gray-800 font-medium hover:bg-orange-50 hover:border-orange-200">
                    <Mail className="h-4 w-4 text-orange-500" />
                    {isAuthenticated ? 'Send message' : 'Login to message'}
                  </Button>
                  <Button onClick={() => requireLoginOr(() => toast({ title: 'Saved!', description: 'Added to favourites.' }))} variant="outline" className="w-full justify-start gap-3 border-gray-200 h-12 text-gray-800 font-medium hover:bg-rose-50 hover:border-rose-200">
                    <Heart className="h-4 w-4 text-rose-500" /> Save to favourites
                  </Button>
                </div>
                {!isAuthenticated && (
                  <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-orange-600 font-semibold hover:underline inline-flex items-center gap-1">
                      Already a member? Log in →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetail;
