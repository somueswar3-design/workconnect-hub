import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFreelancerProfile } from '@/services/freelancerApi';
import {
  Loader2, X, Plus, ChevronLeft, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { countries, getCurrencySymbol } from '@/data/countries';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Please select gender'),
  country: z.string().min(1, 'Please select a country'),
  phoneNumber: z.string().min(5, 'Phone number is required'),
  companyName: z.string().optional(),
  experienceYears: z.string().min(1, 'Experience is required'),
  primarySkills: z.string().min(1, 'Add at least one primary skill'),
  secondarySkills: z.string().optional(),
  skillSetDesc: z.string().min(1, 'Please describe your skill set'),
  anyFreelancingExperience: z.string().min(1, 'Freelancing experience is required'),
  currentCompany: z.string().optional(),
  currentCompanyRole: z.string().optional(),
  languagesKnown: z.string().min(1, 'Languages known is required'),
  speakingLanguage: z.string().min(1, 'Select preferred speaking language'),
  hoursAvailablePerDay: z.string().min(1, 'Hours per day is required'),
  hourRate: z.string().min(1, 'Hourly rate is required'),
  isAvailableInWeekends: z.boolean().optional(),
  bioDescription: z.string().min(10, 'Bio must be at least 10 characters'),
  linkedInProfile: z.string().optional(),
  portfolioURL: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const languageOptions = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Urdu'];

const genderMap: Record<string, number> = { male: 0, female: 1, other: 2, 'prefer-not': 3 };
const reverseGenderMap: Record<number, string> = { 0: 'male', 1: 'female', 2: 'other', 3: 'prefer-not' };
const freelancingExpMap: Record<string, number> = { new: 0, '0-1': 1, '1-3': 2, '3-5': 3, '5+': 4 };
const reverseFreelancingExpMap: Record<number, string> = { 0: 'new', 1: '0-1', 2: '1-3', 3: '3-5', 4: '5+' };

const NAV_SECTIONS = [
  {
    title: 'Profile',
    items: [
      { id: 'identity', icon: '◉', label: 'Identity & details' },
      { id: 'about', icon: '✦', label: 'About & bio' },
    ],
  },
  {
    title: 'Skills & Experience',
    items: [
      { id: 'skills', icon: '❋', label: 'Skills & tools' },
      { id: 'experience', icon: '◈', label: 'Work experience' },
    ],
  },
  {
    title: 'Rates & Availability',
    items: [
      { id: 'rates', icon: '◐', label: 'Rates & hours' },
      { id: 'availability', icon: '◑', label: 'Availability' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'languages', icon: '◁', label: 'Languages' },
      { id: 'links', icon: '▷', label: 'Links & portfolio' },
    ],
  },
];

const SUGGESTED_SKILLS = ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Next.js', 'Vue.js', 'Java', 'Spring Boot', 'Flutter', 'Kubernetes'];

const SkillTagInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => {
  const [input, setInput] = useState('');
  const tags = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
  const addTag = (tag?: string) => {
    const trimmed = (tag || input).trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed].join(', '));
      if (!tag) setInput('');
    }
  };
  const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag).join(', '));
  const suggestionsAvailable = SUGGESTED_SKILLS.filter(s => !tags.includes(s));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/15 border border-orange-500/30 text-orange-400">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-300">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-orange-500 transition-colors placeholder:text-slate-500"
        />
        <button type="button" onClick={() => addTag()} className="bg-orange-500 text-white border-none rounded-lg px-4 py-2.5 text-xs font-semibold hover:bg-orange-600 transition-colors">
          + Add
        </button>
      </div>
      {suggestionsAvailable.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Suggested — click to add</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionsAvailable.slice(0, 8).map(s => (
              <button key={s} type="button" onClick={() => addTag(s)}
                className="px-3 py-1 rounded-full text-xs border border-slate-600/50 bg-slate-800/30 text-slate-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/10 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FreelancerProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState('identity');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [profileId, setProfileId] = useState<number>(0);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '', gender: '', country: '', phoneNumber: '',
      companyName: '', experienceYears: '',
      primarySkills: '', secondarySkills: '', skillSetDesc: '',
      anyFreelancingExperience: '', currentCompany: '', currentCompanyRole: '',
      languagesKnown: '', speakingLanguage: '',
      hoursAvailablePerDay: '', hourRate: '', isAvailableInWeekends: false,
      bioDescription: '', linkedInProfile: '', portfolioURL: '',
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) return;
      try {
        const data = await getFreelancerProfile(user.userId);
        if (data && data.id) {
          setProfileId(data.id);
          form.reset({
            fullName: data.fullName || '',
            gender: reverseGenderMap[data.gender] || '',
            country: data.country || '',
            phoneNumber: data.phoneNumber || '',
            companyName: data.companyName || '',
            experienceYears: data.experienceYears?.toString() || '',
            primarySkills: data.primarySkills || '',
            secondarySkills: data.secondarySkills || '',
            skillSetDesc: data.skillSetDesc || '',
            anyFreelancingExperience: reverseFreelancingExpMap[data.anyFreelnacingExperience] || '',
            currentCompany: data.currentCompany || '',
            currentCompanyRole: data.currentCompanyRole || '',
            languagesKnown: data.languagesKnown || '',
            speakingLanguage: data.speakingLanguage || '',
            hoursAvailablePerDay: data.hoursAvailablePerDay || '',
            hourRate: data.hourRate || '',
            isAvailableInWeekends: data.isAvailbleInweeknds || false,
            bioDescription: data.bioDescption || '',
            linkedInProfile: data.linkedInProfile || '',
            portfolioURL: data.portfolioURL || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [user?.userId]);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        id: profileId,
        userId: parseInt(user?.userId || '0'),
        freelancerUserStatus: true,
        fullName: data.fullName,
        gender: genderMap[data.gender] ?? 0,
        country: data.country,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName || '',
        experienceYears: parseInt(data.experienceYears) || 0,
        primarySkills: data.primarySkills,
        secondarySkills: data.secondarySkills || '',
        skillSetDesc: data.skillSetDesc,
        anyFreelnacingExperience: freelancingExpMap[data.anyFreelancingExperience] ?? 0,
        currentCompany: data.currentCompany || '',
        currentCompanyRole: data.currentCompanyRole || '',
        languagesKnown: data.languagesKnown,
        speakingLanguage: data.speakingLanguage,
        hoursAvailablePerDay: data.hoursAvailablePerDay,
        hourRate: data.hourRate,
        isAvailbleInweeknds: data.isAvailableInWeekends || false,
        bioDescption: data.bioDescription,
        linkedInProfile: data.linkedInProfile || '',
        portfolioURL: data.portfolioURL || '',
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };

      const res = await fetch('https://localhost:7167/api/freelancer/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save profile');
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const markDoneAndContinue = (currentSection: string, nextSection: string) => {
    setCompletedSections(prev => new Set(prev).add(currentSection));
    setActivePage(nextSection);
  };

  const completionPct = Math.round((completedSections.size / 8) * 100);

  const initials = watchedValues.fullName
    ? watchedValues.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const currencySymbol = getCurrencySymbol(watchedValues.country);
  const primarySkillsList = watchedValues.primarySkills ? watchedValues.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Shared field classes
  const fieldInput = "w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-orange-500 transition-colors font-sans placeholder:text-slate-500";
  const fieldLabel = "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5";

  return (
    <div className="h-screen flex flex-col bg-[#0B1120] text-slate-200" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      {/* Top Bar */}
      <header className="h-[52px] flex items-center justify-between px-8 border-b border-slate-700/40 bg-[#0D1B2E] shrink-0 sticky top-0 z-50">
        <div className="text-lg tracking-tight">
          <span className="font-bold">Work</span>
          <span className="text-orange-500 font-bold">Support</span>
          <span className="font-bold">360</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            completionPct >= 80 ? 'bg-green-500/15 text-green-400 border-green-500/30' :
            completionPct >= 40 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
            'bg-blue-500/15 text-blue-400 border-blue-500/30'
          }`}>
            Profile {completionPct}% complete
          </span>
          <div className="flex items-center gap-2 px-3 py-1 border border-slate-600/50 rounded-full cursor-pointer hover:border-orange-500/50 transition-colors">
            <div className="w-[26px] h-[26px] rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[11px] font-semibold flex items-center justify-center">
              {initials}
            </div>
            <span className="text-xs text-slate-400">{watchedValues.fullName || user?.fullName || 'User'}</span>
          </div>
          <button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className="bg-orange-500 text-white border-none rounded-lg px-5 py-1.5 text-xs font-semibold hover:bg-orange-600 transition-opacity disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav */}
        <nav className="w-[260px] border-r border-slate-700/40 py-7 overflow-y-auto bg-[#0D1B2E] shrink-0 hidden lg:block">
          {NAV_SECTIONS.map(section => (
            <div key={section.title} className="mb-7">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-orange-500/80 px-5 mb-1.5">
                {section.title}
              </div>
              {section.items.map(item => {
                const isActive = activePage === item.id;
                const isDone = completedSections.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-[13px] border-l-2 transition-all text-left ${
                      isActive
                        ? 'text-orange-400 bg-orange-500/15 border-l-orange-500 font-medium'
                        : 'text-slate-400 border-l-transparent hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-sm w-[18px] text-center">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDone ? 'bg-green-500' : 'bg-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-10 py-9">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>

              {/* IDENTITY */}
              {activePage === 'identity' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 1 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Identity & details</h1>
                    <p className="text-sm text-slate-500 mt-1">Set up your personal information and how you appear to clients.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◉</span> Personal information
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Full Name *</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Gender *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className={fieldInput}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Country *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className={fieldInput}><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-[250px]">
                              {countries.map(c => (
                                <SelectItem key={c.code} value={c.name}>{c.name} ({c.currencySymbol})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Phone Number *</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="+91 98765 43210" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className={fieldLabel}>Company Name <span className="text-slate-600">(Optional)</span></FormLabel>
                          <FormControl><input className={fieldInput} placeholder="Your company" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => markDoneAndContinue('identity', 'about')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → About & bio
                    </button>
                  </div>
                </div>
              )}

              {/* ABOUT */}
              {activePage === 'about' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 2 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>About & bio</h1>
                    <p className="text-sm text-slate-500 mt-1">Write a compelling bio that tells clients who you are and what you do best.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">✦</span> Professional summary
                    </div>
                    <FormField control={form.control} name="bioDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Bio (shown on profile) *</FormLabel>
                        <FormControl>
                          <textarea className={`${fieldInput} min-h-[120px] resize-y`} placeholder="I'm a full-stack developer with 6+ years building scalable web applications..." {...field} />
                        </FormControl>
                        <div className="text-[11px] text-slate-600 text-right mt-1">{field.value?.length || 0} / 600</div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◉</span> Years of experience
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="experienceYears" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Total IT Experience (Years) *</FormLabel>
                          <FormControl><input type="number" className={fieldInput} placeholder="e.g. 5" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="anyFreelancingExperience" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Freelancing Experience *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className={fieldInput}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="new">New to Freelancing</SelectItem>
                              <SelectItem value="0-1">Less than 1 Year</SelectItem>
                              <SelectItem value="1-3">1 - 3 Years</SelectItem>
                              <SelectItem value="3-5">3 - 5 Years</SelectItem>
                              <SelectItem value="5+">5+ Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('identity')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('about', 'skills')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Skills
                    </button>
                  </div>
                </div>
              )}

              {/* SKILLS */}
              {activePage === 'skills' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 3 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Skills & tools</h1>
                    <p className="text-sm text-slate-500 mt-1">Add the skills clients search for. Be specific — "React 18" beats "JavaScript".</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">❋</span> Primary skills (shown on card)
                    </div>
                    <FormField control={form.control} name="primarySkills" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SkillTagInput value={field.value} onChange={field.onChange} placeholder="Type a skill and press Add..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◎</span> Secondary skills
                    </div>
                    <FormField control={form.control} name="secondarySkills" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SkillTagInput value={field.value || ''} onChange={field.onChange} placeholder="e.g. Docker, Redis..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◉</span> Skill description
                    </div>
                    <FormField control={form.control} name="skillSetDesc" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Describe your expertise *</FormLabel>
                        <FormControl>
                          <textarea className={`${fieldInput} min-h-[80px] resize-y`} placeholder="Describe your expertise and technical strengths..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('about')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('skills', 'experience')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Experience
                    </button>
                  </div>
                </div>
              )}

              {/* EXPERIENCE */}
              {activePage === 'experience' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 4 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Work experience</h1>
                    <p className="text-sm text-slate-500 mt-1">Add your employment and freelance history.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◈</span> Current position
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="currentCompany" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Company / Client</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="Company name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="currentCompanyRole" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Job Title / Role</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="Senior Developer" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('skills')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('experience', 'rates')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Rates
                    </button>
                  </div>
                </div>
              )}

              {/* RATES */}
              {activePage === 'rates' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 5 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Rates & hours</h1>
                    <p className="text-sm text-slate-500 mt-1">Set your hourly rate and daily availability.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◐</span> Hourly rate
                    </div>
                    <FormField control={form.control} name="hourRate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Rate ({currencySymbol}/hr) *</FormLabel>
                        <FormControl><input type="number" className={fieldInput} placeholder="e.g. 2900" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {watchedValues.hourRate && (
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-4xl font-serif text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>{currencySymbol}{parseInt(watchedValues.hourRate).toLocaleString()}</span>
                        <span className="text-sm text-slate-500">/hr</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◔</span> Daily availability
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="hoursAvailablePerDay" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Hours / Day *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className={fieldInput}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="1-2">1 - 2 Hours</SelectItem>
                              <SelectItem value="2-4">2 - 4 Hours</SelectItem>
                              <SelectItem value="4-6">4 - 6 Hours</SelectItem>
                              <SelectItem value="6-8">6 - 8 Hours</SelectItem>
                              <SelectItem value="8+">8+ Hours</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="isAvailableInWeekends" render={({ field }) => (
                        <FormItem className="flex flex-col justify-end">
                          <div className="flex items-center justify-between py-2.5">
                            <div>
                              <div className="text-[13px] font-medium text-slate-200">Available on weekends</div>
                              <div className="text-[11px] text-slate-500">Accept weekend project work</div>
                            </div>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('experience')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('rates', 'availability')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Availability
                    </button>
                  </div>
                </div>
              )}

              {/* AVAILABILITY */}
              {activePage === 'availability' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 6 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Availability</h1>
                    <p className="text-sm text-slate-500 mt-1">Tell clients exactly when and how much you can work.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◑</span> Engagement type
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: '⏱', label: 'Hourly', desc: 'Pay per hour. Flexible scope.' },
                        { icon: '🗓', label: 'Part-time', desc: '20–30h/week. Ongoing.' },
                        { icon: '💼', label: 'Full-time', desc: '40h/week dedicated.' },
                        { icon: '📋', label: 'Fixed project', desc: 'Milestone-based delivery.' },
                        { icon: '🔧', label: 'Daily support', desc: '2h/day IT support slot.' },
                        { icon: '⚡', label: 'On-demand', desc: 'Retainer basis.' },
                      ].map(item => (
                        <div key={item.label} className="border border-slate-700/40 rounded-xl p-4 cursor-pointer hover:bg-slate-800/30 hover:border-slate-600/50 transition-all text-center">
                          <div className="text-xl mb-1">{item.icon}</div>
                          <div className="text-[13px] font-semibold text-slate-200 mb-1">{item.label}</div>
                          <div className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('rates')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('availability', 'languages')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Languages
                    </button>
                  </div>
                </div>
              )}

              {/* LANGUAGES */}
              {activePage === 'languages' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 7 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Languages</h1>
                    <p className="text-sm text-slate-500 mt-1">List languages you can work in. Clients filter by this.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◁</span> Your languages
                    </div>
                    <FormField control={form.control} name="languagesKnown" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Languages Known *</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {languageOptions.map(lang => {
                            const selected = field.value ? field.value.split(',').map(s => s.trim()).includes(lang) : false;
                            return (
                              <button key={lang} type="button"
                                onClick={() => {
                                  const current = field.value ? field.value.split(',').map(s => s.trim()).filter(Boolean) : [];
                                  field.onChange(selected ? current.filter(l => l !== lang).join(', ') : [...current, lang].join(', '));
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                  selected ? 'bg-orange-500/15 text-orange-400 border-orange-500/40' : 'bg-slate-800/30 text-slate-400 border-slate-700/40 hover:border-orange-500/40'
                                }`}
                              >{lang}</button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◉</span> Preferred speaking language
                    </div>
                    <FormField control={form.control} name="speakingLanguage" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Speaking Language *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className={fieldInput}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('availability')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('languages', 'links')}
                      className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Links
                    </button>
                  </div>
                </div>
              )}

              {/* LINKS & PORTFOLIO */}
              {activePage === 'links' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Final step</div>
                    <h1 className="text-[30px] font-serif leading-tight text-slate-200" style={{ fontFamily: "'Georgia', serif" }}>Links & portfolio</h1>
                    <p className="text-sm text-slate-500 mt-1">Add your online presence so clients can learn more about you.</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-4 hover:border-slate-600/50 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">▷</span> Online profiles
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="linkedInProfile" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>LinkedIn Profile</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="portfolioURL" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Portfolio / Website</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="https://yoursite.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">🎉</span>
                      <div>
                        <div className="text-base font-semibold font-serif mb-1" style={{ fontFamily: "'Georgia', serif" }}>Profile complete!</div>
                        <div className="text-[13px] text-slate-400">Your profile will be visible to clients and HR once published.</div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4 bg-orange-500 text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
                    >
                      {isLoading ? 'Saving...' : 'Publish profile ✓'}
                    </button>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('languages')}
                      className="bg-transparent border border-slate-700/40 rounded-lg px-4 py-2 text-[13px] text-slate-400 hover:border-slate-500 transition-colors">
                      ← Back
                    </button>
                  </div>
                </div>
              )}

            </form>
          </Form>
        </main>

        {/* Right Preview Pane */}
        <aside className="w-[300px] border-l border-slate-700/40 py-7 px-5 overflow-y-auto bg-[#0D1B2E] shrink-0 hidden xl:block">
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-4 flex items-center gap-2">
            Live preview
            <span className="flex-1 h-px bg-slate-700" />
          </div>

          <div className="border border-slate-700/40 rounded-2xl overflow-hidden">
            {/* Dark header */}
            <div className="bg-slate-900 p-5 relative">
              <div className="w-14 h-14 rounded-full bg-orange-500 text-white text-xl font-bold flex items-center justify-center font-serif border-2 border-white/20 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                {initials}
              </div>
              <div className="text-[17px] font-semibold text-white tracking-tight">
                {watchedValues.fullName || 'Your Name'}
              </div>
              <div className="text-xs text-white/45 mt-0.5">
                {watchedValues.companyName || 'Freelancer'}
              </div>
              <div className="text-xs text-white/65 mt-1.5">
                {watchedValues.experienceYears ? `${watchedValues.experienceYears} yrs experience` : 'Experience not set'}
              </div>
              {watchedValues.country && (
                <div className="absolute top-4 right-4 bg-white/10 border border-white/20 rounded-full text-[10px] text-white/70 px-2.5 py-0.5">
                  {watchedValues.country}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Rate */}
              {watchedValues.hourRate && (
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-serif text-orange-500" style={{ fontFamily: "'Georgia', serif" }}>{currencySymbol}{parseInt(watchedValues.hourRate).toLocaleString()}</span>
                  <span className="text-xs text-slate-500">/hr</span>
                </div>
              )}

              {/* Skills */}
              {primarySkillsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {primarySkillsList.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2.5 py-0.5 rounded-full text-[11px] bg-orange-500/15 border border-orange-500/30 text-orange-400 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Info rows */}
              <div className="space-y-2 text-xs text-slate-400">
                {watchedValues.experienceYears && (
                  <div className="flex gap-2 items-start">
                    <span className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    {watchedValues.experienceYears} yrs IT
                    {watchedValues.anyFreelancingExperience && ` · ${watchedValues.anyFreelancingExperience} yrs freelancing`}
                  </div>
                )}
                {watchedValues.hoursAvailablePerDay && (
                  <div className="flex gap-2 items-start">
                    <span className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    {watchedValues.hoursAvailablePerDay} hrs/day
                    {watchedValues.isAvailableInWeekends && ' · Weekends'}
                  </div>
                )}
              </div>

              {/* Available badge */}
              <div className="flex items-center gap-1.5 mt-3 px-3 py-2 bg-green-500/15 border border-green-500/30 rounded-lg text-xs text-green-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available now
              </div>
            </div>
          </div>

          {/* Profile strength */}
          <div className="mt-5">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-3 flex items-center gap-2">
              Profile strength
              <span className="flex-1 h-px bg-slate-700" />
            </div>
            <div className="space-y-2">
              {NAV_SECTIONS.flatMap(s => s.items).map(item => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${completedSections.has(item.id) ? 'bg-green-500' : 'bg-slate-700'}`} />
                  <span className={completedSections.has(item.id) ? 'text-green-400' : 'text-slate-500'}>
                    {item.label}
                  </span>
                  {completedSections.has(item.id) && <span className="text-green-500 ml-auto">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-[#0D1B2E] border-slate-700/40 text-slate-200 max-w-md">
          <DialogHeader className="text-center items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <DialogTitle className="text-xl text-slate-100">Profile Updated Successfully!</DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
              Your profile has been saved and will be visible to clients and HR teams. You can update it anytime from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => { setShowSuccessModal(false); navigate('/freelancer'); }}
              className="flex-1 bg-orange-500 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="flex-1 bg-transparent border border-slate-600/50 text-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-700/30 transition-colors"
            >
              Continue Editing
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreelancerProfileForm;
