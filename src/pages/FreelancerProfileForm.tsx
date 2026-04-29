import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFreelancerProfile, saveFreelancerProfile, calculateProfilePercentage } from '@/services/freelancerApi';
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
import PortfolioSection from '@/components/PortfolioSection';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Please select gender'),
  country: z.string().min(1, 'Please select a country'),
  phoneNumber: z.string().min(5, 'Phone number is required'),
  companyName: z.string().optional(),
  experienceYears: z.string().min(1, 'Experience is required'),
  skillCategory: z.string().min(1, 'Please pick a category first'),
  primarySkills: z.string().min(1, 'Add at least one primary skill'),
  secondarySkills: z.string().optional(),
  skillSetDesc: z.string().min(1, 'Please describe your skill set'),
  anyFreelancingExperience: z.string().min(1, 'Freelancing experience is required'),
  currentCompany: z.string().optional(),
  currentCompanyRole: z.string().optional(),
  engagementType: z.string().min(1, 'Select engagement type'),
  languagesKnown: z.string().min(1, 'Select at least one language'),
  speakingLanguage: z.string().min(1, 'Select preferred speaking language'),
  hoursAvailablePerDay: z.string().min(1, 'Hours per day is required'),
  hourRate: z.string().min(1, 'Hourly rate is required'),
  isAvailableInWeekends: z.boolean().optional(),
  headline: z.string().max(120, 'Headline must be 120 chars or less').optional(),
  bioDescription: z.string().min(10, 'Bio must be at least 10 characters'),
  projectUrls: z.string().optional(),
  portfolioURL: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const languageOptions = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Urdu'];

const SKILL_CATEGORIES: Record<string, string[]> = {
  'Web Development': ['React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
  'Mobile Development': ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android (Java)', 'iOS', 'Expo'],
  'Desktop Apps': ['Electron', 'WPF', '.NET', 'C++', 'Qt', 'JavaFX'],
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  'Data & AI/ML': ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'LangChain', 'OpenAI', 'NLP'],
  'Backend & Database': ['Java', 'Spring Boot', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'Microservices'],
  'Design & UX': ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Webflow'],
  'QA & Testing': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Manual Testing', 'Postman'],
};

const SAMPLE_PROJECT_URLS = [
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js',
  'https://github.com/tensorflow/tensorflow',
  'https://github.com/flutter/flutter',
  'https://github.com/microsoft/vscode',
];

const ENGAGEMENT_TYPES = [
  { icon: '⏱', label: 'Hourly', desc: 'Pay per hour. Flexible scope.' },
  { icon: '🗓', label: 'Part-time', desc: '20–30h/week. Ongoing.' },
  { icon: '💼', label: 'Full-time', desc: '40h/week dedicated.' },
  { icon: '📋', label: 'Fixed project', desc: 'Milestone-based delivery.' },
  { icon: '🔧', label: 'Daily support', desc: '2h/day IT support slot.' },
  { icon: '⚡', label: 'On-demand', desc: 'Retainer basis.' },
];

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
      { id: 'portfolio', icon: '◆', label: 'Portfolio' },
      { id: 'links', icon: '▷', label: 'Links & socials' },
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
          <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 border border-orange-200 text-orange-600">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-800">
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
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400"
        />
        <button type="button" onClick={() => addTag()} className="bg-orange-500 text-gray-900 border-none rounded-lg px-4 py-2.5 text-xs font-semibold hover:bg-orange-600 transition-colors">
          + Add
        </button>
      </div>
      {suggestionsAvailable.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Suggested — click to add</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionsAvailable.slice(0, 8).map(s => (
              <button key={s} type="button" onClick={() => addTag(s)}
                className="px-3 py-1 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors">
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
  const { token, user, updateUser } = useAuth();
  const [profileId, setProfileId] = useState<number>(0);
  const [experienceExtra, setExperienceExtra] = useState({ startDate: '', endDate: '', currentlyWorking: false, description: '' });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '', gender: '', country: '', phoneNumber: '',
      companyName: '', experienceYears: '',
      skillCategory: '', primarySkills: '', secondarySkills: '', skillSetDesc: '',
      anyFreelancingExperience: '', currentCompany: '', currentCompanyRole: '',
      engagementType: 'Part-time',
      languagesKnown: '', speakingLanguage: '',
      hoursAvailablePerDay: '', hourRate: '', isAvailableInWeekends: false,
      bioDescription: '', headline: '', projectUrls: '', portfolioURL: '',
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
            fullName: data.fullName || user.fullName || '',
            gender: reverseGenderMap[data.gender] || '',
            country: data.country || '',
            phoneNumber: data.phoneNumber || '',
            companyName: data.companyName || '',
            experienceYears: data.experienceYears?.toString() || '',
            skillCategory: data.skillCategory || '',
            primarySkills: data.primarySkills || '',
            secondarySkills: data.secondarySkills || '',
            skillSetDesc: data.skillSetDesc || '',
            anyFreelancingExperience: reverseFreelancingExpMap[data.anyFreelnacingExperience] || '',
            currentCompany: data.currentCompany || '',
            currentCompanyRole: data.currentCompanyRole || '',
            engagementType: data.engagementType || 'Part-time',
            languagesKnown: data.languagesKnown || '',
            speakingLanguage: data.speakingLanguage || '',
            hoursAvailablePerDay: data.hoursAvailablePerDay || '',
            hourRate: data.hourRate || '',
            isAvailableInWeekends: data.isAvailbleInweeknds || false,
            bioDescription: data.bioDescption || '',
            headline: data.headline || '',
            projectUrls: data.projectUrls || data.linkedInProfile || '',
            portfolioURL: data.portfolioURL || '',
          });
          // Update profile percentage in context
          const pct = calculateProfilePercentage(data);
          updateUser({ profilePercentage: pct, fullName: data.fullName || user.fullName });

          // Pre-mark sections as complete if their fields are already filled (from prior save)
          const done = new Set<string>();
          if (data.fullName && data.country && data.phoneNumber && data.bioDescption) done.add('identity');
          if (data.experienceYears || data.anyFreelnacingExperience) done.add('about');
          if (data.primarySkills || data.skillCategory) done.add('skills');
          if (data.experienceYears || data.currentCompany || data.currentCompanyRole) done.add('experience');
          if (data.hourRate) done.add('rates');
          if (data.hoursAvailablePerDay) done.add('availability');
          if (data.languagesKnown || data.speakingLanguage) done.add('languages');
          if (data.portfolioURL) done.add('portfolio');
          if (data.linkedInProfile || data.projectUrls) done.add('links');
          setCompletedSections(done);
        } else if (user.fullName) {
          // No profile yet — prefill name from token so user doesn't retype it
          form.setValue('fullName', user.fullName);
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
        headline: data.headline || '',
        linkedInProfile: data.projectUrls || '',
        skillCategory: data.skillCategory || '',
        engagementType: data.engagementType || 'Part-time',
        projectUrls: data.projectUrls || '',
        portfolioURL: data.portfolioURL || '',
        isProfileCompleted: true,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };

      await saveFreelancerProfile(payload);
      
      // Calculate and store profile percentage
      const pct = calculateProfilePercentage(data);
      updateUser({ profilePercentage: pct, fullName: data.fullName });
      
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentProgress = async (): Promise<boolean> => {
    const data = form.getValues();
    console.log('[ProfileForm] saveCurrentProgress called', { userId: user?.userId, profileId, data });
    setIsLoading(true);
    try {
      const payload = {
        id: profileId,
        userId: parseInt(user?.userId || '0'),
        freelancerUserStatus: true,
        fullName: data.fullName || '',
        gender: genderMap[data.gender] ?? 0,
        country: data.country || '',
        phoneNumber: data.phoneNumber || '',
        companyName: data.companyName || '',
        experienceYears: parseInt(data.experienceYears) || 0,
        primarySkills: data.primarySkills || '',
        secondarySkills: data.secondarySkills || '',
        skillSetDesc: data.skillSetDesc || '',
        anyFreelnacingExperience: freelancingExpMap[data.anyFreelancingExperience] ?? 0,
        currentCompany: data.currentCompany || '',
        currentCompanyRole: data.currentCompanyRole || '',
        languagesKnown: data.languagesKnown || '',
        speakingLanguage: data.speakingLanguage || '',
        hoursAvailablePerDay: data.hoursAvailablePerDay || '',
        hourRate: data.hourRate || '',
        isAvailbleInweeknds: data.isAvailableInWeekends || false,
        bioDescption: data.bioDescription || '',
        headline: data.headline || '',
        linkedInProfile: data.projectUrls || '',
        skillCategory: data.skillCategory || '',
        engagementType: data.engagementType || 'Part-time',
        projectUrls: data.projectUrls || '',
        portfolioURL: data.portfolioURL || '',
        isProfileCompleted: false,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
      const saved = await saveFreelancerProfile(payload);
      if (saved?.id) setProfileId(saved.id);
      const pct = calculateProfilePercentage(data);
      updateUser({ profilePercentage: pct, fullName: data.fullName });
      toast.success('Progress saved');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to save progress');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const SECTION_FIELDS: Record<string, (keyof ProfileFormData)[]> = {
    identity: ['fullName', 'gender', 'country', 'phoneNumber', 'headline', 'bioDescription'],
    about: ['experienceYears', 'anyFreelancingExperience'],
    skills: ['skillCategory', 'primarySkills', 'skillSetDesc'],
    experience: ['currentCompany', 'currentCompanyRole'],
    rates: ['hourRate', 'hoursAvailablePerDay'],
    availability: ['engagementType'],
    languages: ['languagesKnown', 'speakingLanguage'],
    portfolio: [],
    links: [],
  };

  // Custom per-section validation in addition to schema (covers optional schema fields we want required here)
  const validateSection = async (currentSection: string): Promise<boolean> => {
    const fields = SECTION_FIELDS[currentSection] || [];
    const data = form.getValues();

    // Extra required-checks for sections where schema marks fields optional but UX needs them
    if (currentSection === 'experience') {
      if (!data.currentCompany?.trim()) { form.setError('currentCompany', { message: 'Current company is required' }); }
      if (!data.currentCompanyRole?.trim()) { form.setError('currentCompanyRole', { message: 'Role / job title is required' }); }
    }
    if (currentSection === 'languages') {
      const langs = (data.languagesKnown || '').split(',').map(s => s.trim()).filter(Boolean);
      if (langs.length === 0) { form.setError('languagesKnown', { message: 'Select at least one language' }); }
      if (!data.speakingLanguage) { form.setError('speakingLanguage', { message: 'Pick a preferred speaking language' }); }
    }

    if (!fields.length) return true;
    const valid = await form.trigger(fields);
    return valid;
  };

  const markDoneAndContinue = async (currentSection: string, nextSection: string) => {
    const valid = await validateSection(currentSection);
    if (!valid) {
      toast.error('Please complete the required fields before continuing');
      return;
    }
    const ok = await saveCurrentProgress();
    if (!ok) return;
    setCompletedSections(prev => new Set(prev).add(currentSection));
    setActivePage(nextSection);
  };

  // Continue from currently active section to the next nav item (used by top-right Continue button)
  const ALL_SECTION_IDS = NAV_SECTIONS.flatMap(s => s.items).map(i => i.id);
  const goToNextSection = async () => {
    const idx = ALL_SECTION_IDS.indexOf(activePage);
    const next = idx >= 0 && idx < ALL_SECTION_IDS.length - 1 ? ALL_SECTION_IDS[idx + 1] : null;
    if (!next) {
      // On final section -> submit
      await form.handleSubmit(handleSubmit)();
      return;
    }
    await markDoneAndContinue(activePage, next);
  };

  // Unified profile percentage — same calculation everywhere (header + preview)
  const completionPct = (() => {
    const d = watchedValues;
    return calculateProfilePercentage({
      fullName: d.fullName,
      gender: d.gender,
      country: d.country,
      phoneNumber: d.phoneNumber,
      primarySkills: d.primarySkills,
      skillSetDesc: d.skillSetDesc,
      experienceYears: d.experienceYears,
      anyFreelancingExperience: d.anyFreelancingExperience,
      languagesKnown: d.languagesKnown,
      speakingLanguage: d.speakingLanguage,
      hoursAvailablePerDay: d.hoursAvailablePerDay,
      hourRate: d.hourRate,
      bioDescription: d.bioDescription,
      linkedInProfile: d.projectUrls,
      portfolioURL: d.portfolioURL,
    });
  })();

  const initials = watchedValues.fullName
    ? watchedValues.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const currencySymbol = getCurrencySymbol(watchedValues.country);
  const primarySkillsList = watchedValues.primarySkills ? watchedValues.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Shared field classes
  const fieldInput = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 transition-colors font-sans placeholder:text-gray-400";
  const fieldLabel = "block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      {/* Top Bar */}
      <header className="h-[52px] flex items-center justify-between px-8 border-b border-gray-200 bg-white shrink-0 sticky top-0 z-50">
        <div className="text-lg tracking-tight font-bold text-gray-900">
          Update Profile
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            completionPct >= 80 ? 'bg-green-50 text-green-600 border-green-200' :
            completionPct >= 40 ? 'bg-amber-50 text-amber-600 border-amber-200' :
            'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            Profile {completionPct}% complete
          </span>
          <button
            type="button"
            onClick={goToNextSection}
            disabled={isLoading}
            className="bg-orange-500 text-gray-900 rounded-lg px-4 py-1.5 text-xs font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Saving…' : (activePage === 'links' ? 'Publish ✓' : 'Continue →')}
          </button>
        </div>
      </header>

      {/* Horizontal Tab Bar — all tabs visible. Completed + current are enabled; future locked tabs are disabled until prior step is saved. */}
      <div className="border-b border-gray-200 bg-white sticky top-[52px] z-40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_SECTIONS.flatMap(s => s.items).map((item, idx) => {
              const isActive = activePage === item.id;
              const isDone = completedSections.has(item.id);
              const isLocked = !isDone && !isActive;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => { if (!isLocked) setActivePage(item.id); }}
                  title={isLocked ? 'Complete the previous step to unlock' : undefined}
                  className={`shrink-0 flex items-center gap-2 px-4 py-3 text-[13px] border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-orange-600 border-orange-500 font-semibold'
                      : isLocked
                        ? 'text-gray-300 border-transparent cursor-not-allowed'
                        : 'text-gray-500 border-transparent hover:text-gray-900'
                  }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    isDone ? 'bg-green-500 text-white' : (isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-300')
                  }`}>
                    {isDone ? '✓' : (isLocked ? '🔒' : idx + 1)}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content area: form + side preview */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <main className="min-w-0">
          {/* Reminder banner — stays visible until the freelancer reaches & clicks Publish on the final step */}
          <div className="mb-6 relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 shadow-sm">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-400 to-amber-500" />
            <div className="flex items-start gap-3 pl-2">
              <div className="shrink-0 w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-base shadow-sm">
                ⚠
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-orange-700 leading-snug">
                  Please finish all steps and click <span className="px-1.5 py-0.5 rounded bg-orange-500 text-white text-[11px] font-bold mx-0.5">Publish profile ✓</span> on the last tab.
                </div>
                <div className="text-[12px] text-orange-600/90 mt-1 leading-relaxed">
                  Your profile will <span className="font-semibold">not be visible to clients</span> until you reach the final <span className="font-medium">Links &amp; portfolio</span> step and publish it.
                </div>
              </div>
              <span className="hidden sm:inline-flex shrink-0 self-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-orange-600 border border-orange-200">
                Action needed
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>


              {/* IDENTITY */}
              {activePage === 'identity' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 1 of 8</div>
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Identity & details</h1>
                    <p className="text-sm text-gray-400 mt-1">Set up your personal information and how you appear to clients.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                          <FormLabel className={fieldLabel}>Company Name <span className="text-gray-400">(Optional)</span></FormLabel>
                          <FormControl><input className={fieldInput} placeholder="Your company" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">✦</span> About me
                    </div>
                    <FormField control={form.control} name="headline" render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className={fieldLabel}>Headline / Tagline</FormLabel>
                        <FormControl>
                          <input className={fieldInput} placeholder="e.g. Senior Full-Stack Developer · React, Node, AWS" maxLength={120} {...field} />
                        </FormControl>
                        <div className="text-[11px] text-gray-400 text-right mt-1">{field.value?.length || 0} / 120</div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bioDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>About me — long bio (shown on profile) *</FormLabel>
                        <FormControl>
                          <textarea className={`${fieldInput} min-h-[140px] resize-y`} placeholder="I'm a full-stack developer with 6+ years building scalable web applications. I specialize in React, Node.js and AWS. I focus on clean architecture, performance, and shipping fast..." maxLength={2000} {...field} />
                        </FormControl>
                        <div className="text-[11px] text-gray-400 text-right mt-1">{field.value?.length || 0} / 2000</div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => markDoneAndContinue('identity', 'about')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
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
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>About & bio</h1>
                    <p className="text-sm text-gray-400 mt-1">Write a compelling bio that tells clients who you are and what you do best.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('about', 'skills')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
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
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Skills & tools</h1>
                    <p className="text-sm text-gray-400 mt-1">Add the skills clients search for. Be specific — "React 18" beats "JavaScript".</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◇</span> Pick your category first <span className="text-red-500">*</span>
                    </div>
                    <p className="text-[12px] text-gray-500 mb-3">Choose a category — we'll suggest the right primary skills below.</p>
                    <FormField control={form.control} name="skillCategory" render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.keys(SKILL_CATEGORIES).map(cat => {
                            const selected = field.value === cat;
                            return (
                              <button key={cat} type="button"
                                onClick={() => field.onChange(cat)}
                                className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all text-left ${
                                  selected ? 'bg-orange-50 text-orange-600 border-orange-400 ring-1 ring-orange-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300'
                                }`}
                              >{cat}</button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className={`bg-white border rounded-2xl p-6 mb-4 transition-colors ${watchedValues.skillCategory ? 'border-gray-200 hover:border-gray-300' : 'border-dashed border-gray-200 opacity-60 pointer-events-none'}`}>
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">❋</span> Primary skills <span className="text-red-500">*</span>
                      {!watchedValues.skillCategory && <span className="text-[11px] text-gray-400 font-normal">(pick a category first)</span>}
                    </div>
                    <FormField control={form.control} name="primarySkills" render={({ field }) => {
                      const tags = field.value ? field.value.split(',').map(s => s.trim()).filter(Boolean) : [];
                      const suggested = (SKILL_CATEGORIES[watchedValues.skillCategory] || []).filter(s => !tags.includes(s));
                      const addTag = (t: string) => { if (!tags.includes(t)) field.onChange([...tags, t].join(', ')); };
                      return (
                        <FormItem>
                          <FormControl>
                            <SkillTagInput value={field.value} onChange={field.onChange} placeholder="Type a skill and press Add..." />
                          </FormControl>
                          {suggested.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Suggested for {watchedValues.skillCategory}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {suggested.map(s => (
                                  <button key={s} type="button" onClick={() => addTag(s)}
                                    className="px-3 py-1 rounded-full text-xs border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                                    + {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }} />
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('skills', 'experience')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
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
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Work experience</h1>
                    <p className="text-sm text-gray-400 mt-1">Add your employment and freelance history.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                      <FormItem>
                        <FormLabel className={fieldLabel}>Start date</FormLabel>
                        <FormControl>
                          <input
                            type="month"
                            className={fieldInput}
                            value={experienceExtra.startDate}
                            onChange={(e) => setExperienceExtra(s => ({ ...s, startDate: e.target.value }))}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel className={fieldLabel}>End date</FormLabel>
                        <FormControl>
                          <input
                            type="month"
                            className={fieldInput}
                            disabled={experienceExtra.currentlyWorking}
                            value={experienceExtra.endDate}
                            onChange={(e) => setExperienceExtra(s => ({ ...s, endDate: e.target.value }))}
                          />
                        </FormControl>
                        <label className="inline-flex items-center gap-2 mt-2 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                            checked={experienceExtra.currentlyWorking}
                            onChange={(e) => setExperienceExtra(s => ({ ...s, currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : s.endDate }))}
                          />
                          I currently work here
                        </label>
                      </FormItem>
                      <FormItem className="col-span-2">
                        <FormLabel className={fieldLabel}>What did you do here?</FormLabel>
                        <FormControl>
                          <textarea
                            className={`${fieldInput} min-h-[100px] resize-y`}
                            placeholder="Briefly describe your responsibilities, tech used, and key achievements..."
                            value={experienceExtra.description}
                            onChange={(e) => setExperienceExtra(s => ({ ...s, description: e.target.value }))}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('skills')}
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('experience', 'rates')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
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
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Rates & hours</h1>
                    <p className="text-sm text-gray-400 mt-1">Set your hourly rate and daily availability.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                        <span className="text-4xl font-serif text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>{currencySymbol}{parseInt(watchedValues.hourRate).toLocaleString()}</span>
                        <span className="text-sm text-gray-400">/hr</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                              <div className="text-[13px] font-medium text-gray-900">Available on weekends</div>
                              <div className="text-[11px] text-gray-400">Accept weekend project work</div>
                            </div>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('experience')}
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('rates', 'availability')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
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
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Availability</h1>
                    <p className="text-sm text-gray-400 mt-1">Tell clients exactly when and how much you can work.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">◑</span> Engagement type <span className="text-red-500">*</span>
                      <span className="text-[11px] text-gray-400 font-normal ml-2">Default: Part-time</span>
                    </div>
                    <FormField control={form.control} name="engagementType" render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 gap-3">
                          {ENGAGEMENT_TYPES.map(item => {
                            const selected = field.value === item.label;
                            return (
                              <button key={item.label} type="button"
                                onClick={() => field.onChange(item.label)}
                                className={`border rounded-xl p-4 cursor-pointer transition-all text-center ${
                                  selected ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-300' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-xl mb-1">{item.icon}</div>
                                <div className={`text-[13px] font-semibold mb-1 ${selected ? 'text-orange-600' : 'text-gray-900'}`}>{item.label}</div>
                                <div className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('rates')}
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('availability', 'languages')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
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
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Languages</h1>
                    <p className="text-sm text-gray-400 mt-1">List languages you can work in. Clients filter by this.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                                  selected ? 'bg-orange-50 text-orange-600 border-orange-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-orange-300'
                                }`}
                              >{lang}</button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
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
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                    <button type="button" onClick={() => markDoneAndContinue('languages', 'portfolio')}
                      className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
                      Continue → Portfolio
                    </button>
                  </div>
                </div>
              )}

              {/* PORTFOLIO PROJECTS */}
              {activePage === 'portfolio' && (
                <PortfolioSection
                  freelancerUserId={user?.userId || ''}
                  onBack={() => setActivePage('languages')}
                  onContinue={() => markDoneAndContinue('portfolio', 'links')}
                />
              )}

              {/* LINKS & SOCIALS */}
              {activePage === 'links' && (
                <div>
                  <div className="mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Final step</div>
                    <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Links & portfolio</h1>
                    <p className="text-sm text-gray-400 mt-1">Add your online presence so clients can learn more about you.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-gray-300 transition-colors">
                    <div className="text-[13px] font-semibold mb-4 flex items-center gap-2">
                      <span className="text-base">▷</span> Project URLs & portfolio
                    </div>
                    <FormField control={form.control} name="projectUrls" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Project URLs (GitHub, live demos, case studies)</FormLabel>
                        <FormControl>
                          <SkillTagInput value={field.value || ''} onChange={field.onChange} placeholder="Paste a project URL and press Add..." />
                        </FormControl>
                        <FormMessage />
                        <div className="mt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Sample GitHub projects — click to add</p>
                          <div className="flex flex-wrap gap-1.5">
                            {SAMPLE_PROJECT_URLS.map(url => {
                              const tags = field.value ? field.value.split(',').map(s => s.trim()).filter(Boolean) : [];
                              const already = tags.includes(url);
                              return (
                                <button key={url} type="button"
                                  disabled={already}
                                  onClick={() => field.onChange([...tags, url].join(', '))}
                                  className="px-3 py-1 rounded-full text-[11px] border border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                  {url.replace('https://github.com/', '')}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </FormItem>
                    )} />
                    <div className="mt-4">
                      <FormField control={form.control} name="portfolioURL" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabel}>Portfolio / Website (optional)</FormLabel>
                          <FormControl><input className={fieldInput} placeholder="https://yoursite.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">🎉</span>
                      <div>
                        <div className="text-base font-semibold font-serif mb-1" style={{ fontFamily: "'Georgia', serif" }}>Profile complete!</div>
                        <div className="text-[13px] text-gray-500">Your profile will be visible to clients and HR once published.</div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4 bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
                    >
                      {isLoading ? 'Saving...' : 'Publish profile ✓'}
                    </button>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setActivePage('languages')}
                      className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
                      ← Back
                    </button>
                  </div>
                </div>
              )}

            </form>
          </Form>
        </main>

        {/* Right Preview Pane */}
        <aside className="hidden lg:block sticky top-[112px] self-start max-h-[calc(100vh-128px)] overflow-y-auto bg-white border border-gray-200 rounded-2xl p-5">
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-4 flex items-center gap-2">
            Live preview
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            {/* Dark header */}
            <div className="bg-gray-100 p-5 relative">
              <div className="w-14 h-14 rounded-full bg-orange-500 text-gray-900 text-xl font-bold flex items-center justify-center font-serif border-2 border-gray-200 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                {initials}
              </div>
              <div className="text-[17px] font-semibold text-gray-900 tracking-tight">
                {watchedValues.fullName || 'Your Name'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {watchedValues.companyName || 'Freelancer'}
              </div>
              <div className="text-xs text-gray-600 mt-1.5">
                {watchedValues.experienceYears ? `${watchedValues.experienceYears} yrs experience` : 'Experience not set'}
              </div>
              {watchedValues.country && (
                <div className="absolute top-4 right-4 bg-gray-100 border border-gray-200 rounded-full text-[10px] text-gray-500 px-2.5 py-0.5">
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
                  <span className="text-xs text-gray-400">/hr</span>
                </div>
              )}

              {/* Skills */}
              {primarySkillsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {primarySkillsList.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2.5 py-0.5 rounded-full text-[11px] bg-orange-50 border border-orange-200 text-orange-600 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Info rows */}
              <div className="space-y-2 text-xs text-gray-500">
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
              <div className="flex items-center gap-1.5 mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available now
              </div>
            </div>
          </div>

          {/* Profile strength */}
          <div className="mt-5">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-3 flex items-center gap-2">
              Profile strength
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-2">
              {NAV_SECTIONS.flatMap(s => s.items).map(item => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${completedSections.has(item.id) ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <span className={completedSections.has(item.id) ? 'text-green-600' : 'text-gray-400'}>
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
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
          <DialogHeader className="text-center items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-200 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl text-slate-100">Profile Updated Successfully!</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Your profile has been saved and will be visible to clients and HR teams. You can update it anytime from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => { setShowSuccessModal(false); navigate('/freelancer'); }}
              className="flex-1 bg-orange-500 text-gray-900 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="flex-1 bg-transparent border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
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
