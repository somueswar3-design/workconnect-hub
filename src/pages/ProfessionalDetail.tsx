import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Briefcase, Clock, User, CheckCircle,
  Lock, Send, Award, Loader2, Heart, Languages, Calendar, Zap, Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFilteredFreelancers, FreelancerProfileDto, requestDemo } from '@/services/clientApi';

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

  const [bidAmount, setBidAmount] = useState('');
  const [bidHours, setBidHours] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

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

  const idx = useMemo(() => Math.abs((profile?.freelancerId || profile?.id || 0)) % 6, [profile]);
  const initials = profile?.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  const skills = profile?.primarySkills ? profile.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const secSkills = profile?.secondarySkills ? profile.secondarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const langs = (profile?.languagesKnown || profile?.speakingLanguage || '').split(',').map(s => s.trim()).filter(Boolean);
  const symbol = getCurrencySymbol(profile?.country);
  const exp = profile?.experienceYears || profile?.experience || 6;
  const rating = (4.7 + (idx % 4) * 0.1).toFixed(1);
  const reviews = 50 + idx * 13;
  const jobsCompleted = 100 + idx * 17;
  const repeatPct = 75 + (idx % 20);

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

  const tagline = (profile.bioDescption?.split('.')[0]) || `${skills.slice(0, 3).join(', ') || 'IT'} Specialist`;
  const portfolio = [
    { title: `${skills[0] || 'Web'} dashboard for fintech client`, summary: 'Built a real-time analytics dashboard with role-based access and custom reporting.', tag: skills[0] || 'Web', budget: `${symbol}3,200` },
    { title: 'E-commerce platform migration', summary: 'Migrated legacy storefront to modern stack, reduced load time by 60%.', tag: skills[1] || 'Migration', budget: `${symbol}5,800` },
    { title: 'Mobile-first redesign', summary: 'Led the UX overhaul, improving conversion by 28% across key flows.', tag: skills[2] || 'Design', budget: `${symbol}2,400` },
  ];
  const skillProficiency = skills.slice(0, 5).map((s, i) => ({ name: s, pct: 96 - i * 6 }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* DARK HERO */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(249,115,22,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.18) 0%, transparent 50%)' }} />
        <div className="container mx-auto px-4 pt-4 pb-6 relative">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-28 w-28 lg:h-36 lg:w-36 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-4xl lg:text-5xl shadow-2xl ring-4 ring-orange-300/30">
                {initials}
              </div>
              <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl lg:text-5xl font-black tracking-tight">{profile.fullName}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-500/20 border border-blue-400/40 rounded-md px-2.5 py-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
              <p className="text-base lg:text-lg text-white/70 mb-3">{tagline}</p>

              <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-sm text-white/80">
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
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-400" />IST (UTC+5:30)</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-orange-400" />{exp} years experience</span>
              </div>

              <div className="flex items-center gap-x-5 gap-y-2 mt-3 text-sm text-white/80 flex-wrap">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /><strong className="text-white">{jobsCompleted}</strong> jobs completed</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-blue-400" /><strong className="text-white">{repeatPct}%</strong> repeat clients</span>
              </div>
            </div>

            {/* Rate + actions */}
            <div className="shrink-0 flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-4xl lg:text-5xl font-black text-orange-400 leading-none">
                  {symbol}{profile.hourRate || '55'}<span className="text-xl text-orange-300/80">/hr</span>
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 rounded-md px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Available now
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => requireLoginOr(() => toast({ title: 'Saved!', description: 'Added to shortlist.' }))} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-1.5">
                  <Heart className="h-4 w-4" /> Save
                </Button>
                <Button onClick={() => document.getElementById('hire-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-1.5">
                  Hire Now →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS + LIGHT BODY */}
      <div className="container mx-auto px-4 -mt-px">
        <Tabs defaultValue="overview" className="w-full">
          {/* Tab strip aligned to dark hero bottom */}
          <div className="bg-slate-900 -mx-4 px-4 border-b border-white/10">
            <div className="container mx-auto px-0">
              <TabsList className="bg-transparent gap-1 p-0 h-auto rounded-none">
                {[
                  { v: 'overview', l: 'Overview' },
                  { v: 'portfolio', l: `Portfolio (12)` },
                  { v: 'reviews', l: `Reviews (${reviews})` },
                  { v: 'skills', l: 'Skills' },
                ].map(t => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-white data-[state=active]:bg-transparent text-white/60 hover:text-white px-4 py-3 font-bold text-sm lg:text-base data-[state=active]:shadow-none"
                  >
                    {t.l}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MAIN */}
              <div className="lg:col-span-2 space-y-6">
                <TabsContent value="overview" className="m-0 space-y-6">
                  {/* About Me */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-violet-500" /> About Me
                    </h2>
                    <div className="space-y-3 text-[15px] text-gray-700 leading-relaxed">
                      <p>
                        {profile.bioDescption ||
                          `I'm a ${skills[0] || 'full-stack'} professional with ${exp}+ years of experience building scalable solutions for startups and enterprises. I specialize in ${skills.slice(0, 3).join(', ') || 'modern technologies'} with a strong focus on quality and delivery.`}
                      </p>
                      <p>
                        I've delivered {jobsCompleted}+ projects on time and within budget. My clients appreciate clear communication, clean code, and proactive problem-solving. I treat every project as if it were my own product.
                      </p>
                    </div>
                  </div>

                  {/* Core Skills */}
                  {skillProficiency.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500" /> Core Skills
                      </h2>
                      <div className="space-y-4">
                        {skillProficiency.map((s, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-slate-900 text-sm">{s.name}</span>
                              <span className="text-orange-500 font-bold text-sm">{s.pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: `${s.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Secondary tags */}
                  {(secSkills.length > 0 || langs.length > 0) && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                      {secSkills.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2">Additional Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {secSkills.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 font-medium">{s}</span>)}
                          </div>
                        </div>
                      )}
                      {langs.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Languages className="h-4 w-4 text-blue-500" /> Languages</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {langs.map((l, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium">{l}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="portfolio" className="m-0">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Portfolio</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {portfolio.map((p, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0">{p.budget}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{p.summary}</p>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-semibold">{p.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="m-0">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                      <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">{rating}</p>
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
                          <p className="text-sm font-bold text-slate-900">{r.name}</p>
                          <span className="text-[10px] text-gray-400">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: r.rating }).map((_, si) => <Star key={si} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                        </div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="m-0">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Primary Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.length ? skills.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-semibold">{s}</span>) : <p className="text-xs text-gray-400">No skills listed.</p>}
                      </div>
                    </div>
                    <div className="border-l-2 border-orange-500 pl-4 py-1">
                      <p className="font-bold text-slate-900">{profile.currentCompanyRole || skills[0] || 'Professional'}</p>
                      <p className="text-sm text-gray-500">{profile.currentCompany || profile.companyName || 'Independent'}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" />{exp}+ years</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      <p className="font-semibold text-slate-900 mb-1">Availability</p>
                      <p>Working {profile.hoursAvailablePerDay || '8'} hours per day{profile.isAvailbleInweeknds ? ', including weekends' : ', weekdays only'}.</p>
                    </div>
                  </div>
                </TabsContent>
              </div>

              {/* SIDEBAR */}
              <aside className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* Rate card */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-5 text-center">
                      <p className="text-4xl font-black text-orange-500 leading-none">
                        {symbol}{profile.hourRate || '55'}<span className="text-lg text-orange-400">/hr</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-2">Hourly Rate · Fixed price available</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-black text-slate-900">{rating}<span className="text-amber-400">★</span></p>
                        <p className="text-[11px] text-gray-500">Rating</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-black text-slate-900">{jobsCompleted}</p>
                        <p className="text-[11px] text-gray-500">Jobs Done</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-black text-slate-900">{exp} yrs</p>
                        <p className="text-[11px] text-gray-500">Experience</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-black text-slate-900">{'<1hr'}</p>
                        <p className="text-[11px] text-gray-500">Response</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => document.getElementById('hire-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white h-12 font-bold gap-2 text-base"
                    >
                      <Rocket className="h-4 w-4" /> Hire Now — Send Request
                    </Button>
                    <Button
                      onClick={() => requireLoginOr(() => toast({ title: 'Saved!', description: 'Added to shortlist.' }))}
                      variant="outline"
                      className="w-full mt-2 border-gray-200 text-slate-800 font-semibold gap-2 h-11"
                    >
                      <Heart className="h-4 w-4 text-rose-500" /> Save to Shortlist
                    </Button>
                  </div>

                  {/* Hire form */}
                  <div id="hire-form" className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm scroll-mt-24">
                    <h3 className="font-black text-slate-900 mb-1 text-lg">Send Hire Request</h3>
                    <p className="text-xs text-gray-500 mb-4">Submit your offer & preferred interview slot. Our team coordinates the rest.</p>

                    {!isAuthenticated ? (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                        <Lock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-700 mb-3">Login required to submit a hire request.</p>
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
                          <Input id="bidAmount" type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder={`${symbol}${profile.hourRate || 55}`} className="mt-1 h-10" />
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
                </div>
              </aside>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalDetail;
