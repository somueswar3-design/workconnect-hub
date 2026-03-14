import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { getFreelancerProfile } from '@/services/freelancerApi';
import {
  Loader2, User, Briefcase, Clock, Languages, X, Plus,
  Monitor, ChevronRight, ChevronLeft, CheckCircle2, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import wsLogo from '@/assets/worksupport360-logo.png';
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

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'skills', label: 'Skills & Experience', icon: Briefcase },
  { id: 'availability', label: 'Availability', icon: Clock },
  { id: 'about', label: 'About & Links', icon: Monitor },
];

const genderMap: Record<string, number> = { male: 0, female: 1, other: 2, 'prefer-not': 3 };
const reverseGenderMap: Record<number, string> = { 0: 'male', 1: 'female', 2: 'other', 3: 'prefer-not' };
const freelancingExpMap: Record<string, number> = { new: 0, '0-1': 1, '1-3': 2, '3-5': 3, '5+': 4 };
const reverseFreelancingExpMap: Record<number, string> = { 0: 'new', 1: '0-1', 2: '1-3', 3: '3-5', 4: '5+' };

const SkillTagInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => {
  const [input, setInput] = useState('');
  const tags = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed].join(', '));
      setInput('');
    }
  };
  const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag).join(', '));

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-orange-500 h-9 text-sm"
        />
        <Button type="button" size="sm" onClick={addTag} className="bg-orange-500 hover:bg-orange-600 shrink-0 h-9 px-3">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <Badge key={tag} className="bg-orange-100 text-orange-700 border-orange-200 gap-1 pr-1 text-xs">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-900 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const FreelancerProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
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
      toast.success('Profile saved successfully!');
      navigate('/freelancer');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const stepFields: Record<number, (keyof ProfileFormData)[]> = {
    0: ['fullName', 'gender', 'country', 'phoneNumber'],
    1: ['primarySkills', 'skillSetDesc', 'experienceYears', 'anyFreelancingExperience'],
    2: ['languagesKnown', 'speakingLanguage', 'hoursAvailablePerDay', 'hourRate'],
    3: ['bioDescription'],
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const valid = await form.trigger(fields);
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep(s => Math.max(s - 1, 0));

  const ic = "border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-orange-500 h-9 text-sm";
  const lc = "text-gray-700 text-sm";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-xl font-bold text-gray-900">Build Your Freelancer Profile</h1>
            <p className="text-gray-500 text-xs">Complete your profile to get matched with clients</p>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button key={s.id} type="button" onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive ? 'bg-orange-500 text-white shadow-md' :
                    isDone ? 'bg-orange-100 text-orange-700 cursor-pointer' :
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-orange-500/10 border border-orange-100 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

                    {/* Step 0: Personal */}
                    {step === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-orange-500" />
                          <h3 className="font-semibold text-gray-900">Personal Information</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Full Name *</FormLabel>
                              <FormControl><Input placeholder="John Doe" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="gender" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Gender *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className={ic}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Country *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className={ic}><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                                <SelectContent className="max-h-[250px]">
                                  {countries.map(c => (
                                    <SelectItem key={c.code} value={c.name}>{c.name} ({c.currencySymbol})</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Phone Number *</FormLabel>
                              <FormControl><Input placeholder="7306549295" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem className="sm:col-span-2"><FormLabel className={lc}>Company Name <span className="text-gray-400 text-xs">(Optional)</span></FormLabel>
                              <FormControl><Input placeholder="Your company" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                      </div>
                    )}

                    {/* Step 1: Skills & Experience */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="h-5 w-5 text-emerald-500" />
                          <h3 className="font-semibold text-gray-900">Skills & Experience</h3>
                        </div>
                        <FormField control={form.control} name="primarySkills" render={({ field }) => (
                          <FormItem><FormLabel className={lc}>Primary Skills *</FormLabel>
                            <FormControl><SkillTagInput value={field.value} onChange={field.onChange} placeholder="e.g. React, Java, AWS..." /></FormControl>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="secondarySkills" render={({ field }) => (
                          <FormItem><FormLabel className={lc}>Secondary Skills</FormLabel>
                            <FormControl><SkillTagInput value={field.value || ''} onChange={field.onChange} placeholder="e.g. Docker, Redis..." /></FormControl>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="skillSetDesc" render={({ field }) => (
                          <FormItem><FormLabel className={lc}>Skill Set Description *</FormLabel>
                            <FormControl><Textarea placeholder="Describe your expertise..." className={`${ic} min-h-[60px]`} {...field} /></FormControl>
                            <FormMessage /></FormItem>
                        )} />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField control={form.control} name="experienceYears" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Total IT Experience (Years) *</FormLabel>
                              <FormControl><Input type="number" placeholder="e.g. 5" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="anyFreelancingExperience" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Freelancing Experience *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className={ic}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="new">New to Freelancing</SelectItem>
                                  <SelectItem value="0-1">Less than 1 Year</SelectItem>
                                  <SelectItem value="1-3">1 - 3 Years</SelectItem>
                                  <SelectItem value="3-5">3 - 5 Years</SelectItem>
                                  <SelectItem value="5+">5+ Years</SelectItem>
                                </SelectContent>
                              </Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="currentCompany" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Current Company</FormLabel>
                              <FormControl><Input placeholder="Company name" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="currentCompanyRole" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Current Role</FormLabel>
                              <FormControl><Input placeholder="Senior Developer" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Languages & Availability */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <h3 className="font-semibold text-gray-900">Languages & Availability</h3>
                        </div>
                        <FormField control={form.control} name="languagesKnown" render={({ field }) => (
                          <FormItem><FormLabel className={lc}>Languages Known *</FormLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                              {languageOptions.map(lang => {
                                const selected = field.value ? field.value.split(',').map(s => s.trim()).includes(lang) : false;
                                return (
                                  <button key={lang} type="button"
                                    onClick={() => {
                                      const current = field.value ? field.value.split(',').map(s => s.trim()).filter(Boolean) : [];
                                      field.onChange(selected ? current.filter(l => l !== lang).join(', ') : [...current, lang].join(', '));
                                    }}
                                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                      selected ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300'
                                    }`}
                                  >{lang}</button>
                                );
                              })}
                            </div>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="speakingLanguage" render={({ field }) => (
                          <FormItem><FormLabel className={lc}>Preferred Speaking Language *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger className={ic}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {languageOptions.map(lang => (
                                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select><FormMessage /></FormItem>
                        )} />
                        <div className="grid gap-4 sm:grid-cols-3">
                          <FormField control={form.control} name="hoursAvailablePerDay" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Hours/Day *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className={ic}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="1-2">1 - 2 Hours</SelectItem>
                                  <SelectItem value="2-4">2 - 4 Hours</SelectItem>
                                  <SelectItem value="4-6">4 - 6 Hours</SelectItem>
                                  <SelectItem value="6-8">6 - 8 Hours</SelectItem>
                                  <SelectItem value="8+">8+ Hours</SelectItem>
                                </SelectContent>
                              </Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="hourRate" render={({ field }) => {
                            const selectedCountry = form.watch('country');
                            const symbol = getCurrencySymbol(selectedCountry);
                            return (
                              <FormItem><FormLabel className={lc}>Rate ({symbol}/hr) *</FormLabel>
                                <FormControl><Input placeholder="e.g. 500" className={ic} {...field} /></FormControl>
                                <FormMessage /></FormItem>
                            );
                          }} />
                          <FormField control={form.control} name="isAvailableInWeekends" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 pt-7">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange}
                                  className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                              </FormControl>
                              <FormLabel className="text-gray-700 text-sm !mt-0">Weekends</FormLabel>
                            </FormItem>
                          )} />
                        </div>
                      </div>
                    )}

                    {/* Step 3: About & Links */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Monitor className="h-5 w-5 text-violet-500" />
                          <h3 className="font-semibold text-gray-900">About You</h3>
                        </div>
                        <FormField control={form.control} name="bioDescription" render={({ field }) => (
                          <FormItem><FormLabel className={lc}>Bio / About *</FormLabel>
                            <FormControl><Textarea placeholder="Tell us about yourself..." className={`${ic} min-h-[80px]`} {...field} /></FormControl>
                            <FormMessage /></FormItem>
                        )} />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField control={form.control} name="linkedInProfile" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>LinkedIn Profile</FormLabel>
                              <FormControl><Input placeholder="https://linkedin.com/in/..." className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="portfolioURL" render={({ field }) => (
                            <FormItem><FormLabel className={lc}>Portfolio URL</FormLabel>
                              <FormControl><Input placeholder="https://yoursite.com" className={ic} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons - always visible at bottom */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}
                    className="gap-1.5 text-sm">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>

                  <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>

                  {step < STEPS.length - 1 ? (
                    <Button type="button" onClick={goNext}
                      className="gap-1.5 bg-orange-500 hover:bg-orange-600 text-sm">
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}
                      className="gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-sm">
                      {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> :
                        <>Submit Profile <CheckCircle2 className="h-4 w-4" /></>}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileForm;
