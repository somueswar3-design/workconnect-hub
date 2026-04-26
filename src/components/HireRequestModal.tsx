import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Lock, Check, Star, Info, Mail, PhoneOff, Inbox, Rocket, ArrowLeft, ArrowRight, Loader2, CheckCircle2, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { requestDemo, FreelancerProfileDto } from '@/services/clientApi';
import { encryptRole } from '@/lib/roleCipher';

interface HireRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FreelancerProfileDto;
  rating: string;
  reviews: number;
  symbol: string;
}

const URGENCY_OPTIONS = [
  { value: 'not-urgent', label: 'Not urgent', icon: '🐢' },
  { value: 'normal', label: 'Normal timeline', icon: '🗓️' },
  { value: 'urgent', label: 'Urgent — ASAP', icon: '⚡' },
  { value: 'critical', label: 'Critical — Today', icon: '🔥' },
];

const HireRequestModal = ({ open, onOpenChange, profile, rating, reviews, symbol }: HireRequestModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  // Step 1
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [budgetType, setBudgetType] = useState('Milestone-based');
  const [duration, setDuration] = useState('1–3 months');
  const [startWhen, setStartWhen] = useState('Immediately');
  const [urgency, setUrgency] = useState('normal');

  // Step 2
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState('');
  const [hearAbout, setHearAbout] = useState('Google Search');
  const [agree, setAgree] = useState(true);

  const initials = profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  const role = profile.currentCompanyRole || 'Professional';
  const rate = profile.hourRate || '55';

  const reset = () => {
    setStep(1); setSubmitted(false); setRefId('');
    setProjectTitle(''); setProjectDescription(''); setBidAmount(''); setBudgetType('Milestone-based');
    setDuration('1–3 months'); setStartWhen('Immediately'); setUrgency('normal');
    setFullName(''); setCompany(''); setMobile(''); setHearAbout('Google Search'); setAgree(true);
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const validateStep1 = () => {
    if (!projectTitle.trim() || !projectDescription.trim() || !bidAmount.trim()) {
      toast({ title: 'Missing details', description: 'Project title, description and bid amount are required.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!fullName.trim() || !email.trim()) {
      toast({ title: 'Missing details', description: 'Your name and email are required.', variant: 'destructive' });
      return false;
    }
    if (!agree) {
      toast({ title: 'Consent required', description: 'Please agree to be contacted by HireXpert admin.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const urgencyLabel = URGENCY_OPTIONS.find(u => u.value === urgency)?.label || 'Normal';
      const description = [
        `Project: ${projectTitle}`,
        `Description: ${projectDescription}`,
        `Bid: ${symbol}${bidAmount} (${budgetType})`,
        `Duration: ${duration} | Start: ${startWhen}`,
        `Urgency: ${urgencyLabel}`,
        `Contact: ${fullName}${company ? ' / ' + company : ''} · ${email}${mobile ? ' · ' + mobile : ''}`,
        `Source: ${hearAbout}`,
      ].join('\n');

      await requestDemo({
        id: 0,
        clientUserId: parseInt(user?.userId || '0', 10) || 0,
        freelancerUserId: profile.userId || profile.freelancerId || profile.id || 0,
        projectTitle,
        clientBudget: Number(bidAmount) || 0,
        contactEmail: email,
        contactPhone: mobile,
        status: 'Pending',
        adminDescription: description,
        createdOn: new Date().toISOString(),
      });
      setRefId(`HX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
      setSubmitted(true);
    } catch {
      toast({ title: 'Error', description: 'Failed to submit your bid request.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // Header (always visible)
  const Header = () => (
    <div className="flex items-start gap-4 px-6 pt-6">
      <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">{profile.fullName}</h2>
        <p className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap mt-0.5">
          {role}
          <span>·</span>
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{rating} ({reviews} reviews)</span>
        </p>
        <p className="text-sm font-semibold text-orange-500 flex items-center gap-1.5 flex-wrap mt-1">
          {symbol}{rate}/hr
          <span className="text-gray-400">·</span>
          <span className="inline-flex items-center gap-1">🟢 Available Now</span>
          <span className="text-gray-400">·</span>
          <span className="text-xs uppercase tracking-wider">in {profile.country || 'India'}</span>
        </p>
      </div>
      <button
        onClick={() => handleClose(false)}
        className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition shrink-0"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  // Security banner
  const SecurityBanner = () => (
    <div className="mx-6 mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex gap-3">
      <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-blue-900 text-sm">Your information is secure — Admin will reach out to you</p>
        <p className="text-xs text-blue-800/80 mt-1 leading-relaxed">
          Submit your bid request and our admin team will contact you to discuss the project details, negotiate the bid amount, and facilitate the hiring process. No direct contact with the freelancer until you're matched.
        </p>
      </div>
    </div>
  );

  // Stepper
  const Stepper = () => {
    const steps = ['Project Details', 'Your Info', 'Review & Submit'];
    return (
      <div className="px-6 mt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {steps.map((label, i) => {
            const num = i + 1;
            const done = step > num || submitted;
            const active = step === num && !submitted;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    done ? 'bg-emerald-500 text-white' : active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : num}
                  </div>
                  <p className={`text-xs font-bold mt-2 ${done ? 'text-emerald-600' : active ? 'text-orange-500' : 'text-gray-500'}`}>
                    {label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mt-[-18px] ${step > num ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Not authenticated — prompt login/register, return to this profile after auth
  if (!isAuthenticated) {
    const returnPath = typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '/';
    const goLogin = () => {
      handleClose(false);
      try { sessionStorage.setItem('post_login_redirect', returnPath); } catch {}
      window.location.href = `/login?redirect=${encodeURIComponent(returnPath)}`;
    };
    const goRegister = () => {
      handleClose(false);
      try { sessionStorage.setItem('post_login_redirect', returnPath); } catch {}
      window.location.href = `/register?role=Client&redirect=${encodeURIComponent(returnPath)}`;
    };
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <Header />
          <div className="p-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center mb-3">
              <Lock className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Login required to hire</h3>
            <p className="text-sm text-gray-600 mb-5">
              Please log in or register as a <span className="font-bold text-slate-900">Client</span> to send a hire request to <span className="font-bold text-slate-900">{profile.fullName}</span>. We'll bring you right back to this profile.
            </p>
            <Button
              onClick={goLogin}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-bold mb-2"
            >
              Login to Continue
            </Button>
            <Button
              onClick={goRegister}
              variant="outline"
              className="w-full h-11 font-bold border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Register as Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Authenticated as Freelancer — block hiring
  if (user?.role?.toLowerCase() === 'freelancer') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <Header />
          <div className="p-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Info className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Freelancers can't hire</h3>
            <p className="text-sm text-gray-600 mb-5">
              You're currently signed in as a <span className="font-bold text-slate-900">Freelancer</span>, so you cannot send a hire request. To hire <span className="font-bold text-slate-900">{profile.fullName}</span>, please log out and sign in or register with a <span className="font-bold text-slate-900">Client</span> account.
            </p>
            <Button
              onClick={() => { handleClose(false); window.location.href = '/register?role=Client'; }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-bold mb-2"
            >
              Register as Client
            </Button>
            <Button
              onClick={() => handleClose(false)}
              variant="outline"
              className="w-full h-11 font-bold"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Submitted
  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
          <Header />
          <SecurityBanner />
          <Stepper />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-5">
              Your bid request for <span className="font-bold text-slate-900">{profile.fullName}</span> has been received. Our admin team will contact you shortly to discuss the details.
            </p>
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-xl py-3 px-4 mb-5 inline-block min-w-[280px]">
              <p className="font-black text-orange-700 tracking-wider">Ref: {refId}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-left max-w-lg mx-auto">
              {[
                'Admin reviews your bid request and project details',
                'Admin contacts you via email to discuss bid amount & scope',
                'Once agreed, admin introduces you to the freelancer',
                'Project starts with escrow payment protection',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5">
                  <div className="h-6 w-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => handleClose(false)}
              className="w-full max-w-lg mt-6 bg-orange-500 hover:bg-orange-600 text-white h-12 font-bold text-base"
            >
              Done — Back to Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        <Header />
        <SecurityBanner />
        <Stepper />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="px-6 py-5 space-y-4">
            <div>
              <Label className="font-bold text-slate-900">Project Title <span className="text-orange-500">*</span></Label>
              <Input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="e.g. Build SaaS dashboard" className="mt-1.5 h-11" />
            </div>
            <div>
              <Label className="font-bold text-slate-900">Project Description <span className="text-orange-500">*</span></Label>
              <Textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} rows={4} placeholder="Briefly describe what you need..." className="mt-1.5" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-bold text-slate-900">Your Bid Amount <span className="text-orange-500">*</span></Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">{symbol}</span>
                  <Input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} placeholder="200" className="pl-7 h-11" />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1">
                  <span>💡</span>
                  <span>{profile.fullName?.split(' ')[0]}'s rate is {symbol}{rate}/hr. Admin will discuss the final amount with you.</span>
                </p>
              </div>
              <div>
                <Label className="font-bold text-slate-900">Budget Type</Label>
                <Select value={budgetType} onValueChange={setBudgetType}>
                  <SelectTrigger className="mt-1.5 h-11 border-orange-300 ring-1 ring-orange-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Milestone-based', 'Fixed price', 'Hourly', 'Retainer'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-bold text-slate-900">Project Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Less than 1 month', '1–3 months', '3–6 months', '6+ months'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-bold text-slate-900">When to start</Label>
                <Select value={startWhen} onValueChange={setStartWhen}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Immediately', 'Within a week', 'Within 2 weeks', 'In a month'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="font-bold text-slate-900">How urgent is this? <span className="text-orange-500">*</span></Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {URGENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUrgency(opt.value)}
                    className={`px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition flex items-center gap-1.5 ${
                      urgency === opt.value
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="px-6 py-5 space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-slate-900">Why we need your contact info</span>
                <span className="text-gray-600"> Our admin team will use your name and email to reach out to you directly to discuss your bid, confirm availability, and guide you through the hiring process. </span>
                <span className="font-bold text-slate-900">Your mobile number is optional and only used if email contact fails.</span>
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-bold text-slate-900">Your Full Name <span className="text-orange-500">*</span></Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. John Smith" className="mt-1.5 h-11" />
              </div>
              <div>
                <Label className="font-bold text-slate-900">Company / Startup <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. TechNova Inc." className="mt-1.5 h-11" />
              </div>
            </div>
            <div>
              <Label className="font-bold text-slate-900">Email Address <span className="text-orange-500">*</span></Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1.5 h-11" />
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-violet-500" />
                Admin will contact you at this email within <span className="font-semibold">2–4 business hours</span>.
              </p>
            </div>
            <div>
              <Label className="font-bold text-slate-900">Mobile Number <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 98765 43210 (only if email isn't sufficient)" className="mt-1.5 h-11" />
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                <PhoneOff className="h-3.5 w-3.5 text-rose-500" />
                Your mobile number will <span className="font-semibold">NOT</span> be shared with the freelancer. Only used for admin contact if needed.
              </p>
            </div>
            <div>
              <Label className="font-bold text-slate-900">How did you hear about us?</Label>
              <Select value={hearAbout} onValueChange={setHearAbout}>
                <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Google Search', 'Referral', 'Social Media', 'Blog / Article', 'Other'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <Checkbox checked={agree} onCheckedChange={v => setAgree(!!v)} className="mt-0.5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
              <span className="text-sm text-gray-700 leading-relaxed">
                I agree to be contacted by HireXpert admin to discuss my bid request and understand that my contact details will <span className="font-bold">not</span> be shared with the freelancer without my consent.
              </span>
            </label>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="px-6 py-5 space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Freelancer</p>
              {[
                ['Name', profile.fullName],
                ['Role', role],
                ['Rating', <span key="r" className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {rating} ({reviews} reviews)</span>],
                ['Location', profile.country || '—'],
                ['Standard rate', `${symbol}${rate}/hr`],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between py-1.5 text-sm">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-bold text-slate-900 text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Your Bid Request</p>
              {[
                ['Project', projectTitle],
                ['Your Bid', <span key="b" className="text-orange-500 font-black text-lg">{symbol}{bidAmount} {budgetType}</span>],
                ['Budget Type', budgetType],
                ['Duration', duration],
                ['Start Date', startWhen],
                ['Urgency', URGENCY_OPTIONS.find(u => u.value === urgency)?.label || '—'],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between py-1.5 text-sm gap-3">
                  <span className="text-gray-600 shrink-0">{k}</span>
                  <span className="font-bold text-slate-900 text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Your Contact Info</p>
              {[
                ['Name', fullName],
                ['Email', email],
                ['Mobile', mobile || 'Optional · Admin only'],
                ['Company', company || '—'],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between py-1.5 text-sm gap-3">
                  <span className="text-gray-600 shrink-0">{k}</span>
                  <span className="font-bold text-slate-900 text-right break-all">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Inbox className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 leading-relaxed">
                <span className="font-bold">What happens next? </span>
                Once you submit, our admin team will review your request and contact you at your email within <span className="font-bold">2–4 business hours</span> to discuss the bid amount, project scope, and next steps. The freelancer's contact info remains private until you are matched.
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center pt-1">
              By submitting, you agree to our <a href="/terms-of-service" className="text-orange-500 font-semibold hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-orange-500 font-semibold hover:underline">Privacy Policy</a>. We will never share your contact details without consent.
            </p>
          </div>
        )}

        {/* FOOTER NAV */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/60">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-1.5 border-gray-300 font-semibold">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : <div />}
          <p className="text-sm text-gray-500 font-medium">Step {step} of 3</p>
          {step < 3 ? (
            <Button
              onClick={() => {
                if (step === 1 && !validateStep1()) return;
                if (step === 2 && !validateStep2()) return;
                setStep(s => s + 1);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-1.5 px-6 h-11"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-1.5 px-6 h-11"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              Submit Bid Request
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HireRequestModal;
