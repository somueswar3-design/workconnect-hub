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
      toast({ title: 'Validation', description: 'Bid amount and message required.', variant: 'destructive' });
      return;
    }
    if (!profile) return;
    setSubmitting(true);
    try {
      await requestDemo({
        id: 0,
        clientUserId: parseInt(user?.userId || '0', 10) || 0,
        freelancerUserId: profile.userId || profile.freelancerId || profile.id || 0,
        projectTitle: `Bid for ${profile.fullName}`,
        clientBudget: Number(bidAmount) || 0,
        contactEmail: user?.email || '',
        contactPhone: '',
        status: 'Pending',
        adminDescription: bidMessage,
        createdOn: new Date().toISOString(),
      });
      toast({ title: '🎉 Bid placed!', description: 'Your offer has been submitted.' });
      setBidAmount(''); setBidDays(''); setBidMessage('');
    } catch {
      toast({ title: 'Error', description: 'Failed to submit bid.', variant: 'destructive' });
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-gray-600">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Link to="/" className="text-xs text-gray-500 hover:text-orange-500">Home / Professionals / {profile.fullName}</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT (2/3) — Profile detail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card — gradient banner + green circle avatar (Eswar style) */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm relative">
              <div className="h-24 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500" />
              <div className="px-6 pb-6 pt-4 relative">
                {/* Green avatar overlapping banner */}
                <div className="absolute -top-12 left-6">
                  <div className="h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-white shadow-lg">
                    {initials.charAt(0)}
                  </div>
                </div>

                {/* Rate floating right */}
                <div className="absolute right-6 top-6 text-right">
                  <p className="text-3xl font-black text-gray-900">{symbol}{profile.hourRate || '—'}</p>
                  <p className="text-xs text-gray-400">per hour</p>
                </div>

                <div className="ml-28 pr-32">
                  <h1 className="text-2xl font-black text-gray-900">{profile.fullName}</h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{skills[0] || 'IT Professional'}</span>
                    {profile.country && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.country}</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{rating}</span>
                    <span className="text-xs text-gray-500">({reviews} reviews)</span>
                    <span className="ml-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <Tabs defaultValue="about">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

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
              {/* Contact card only (Place a Bid removed) */}
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
