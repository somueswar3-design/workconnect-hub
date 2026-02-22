import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Loader2, User, MapPin, Briefcase, Clock, Languages, X, Plus,
  Monitor, Sparkles, ChevronRight, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import wsLogo from '@/assets/worksupport360-logo.png';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Please select gender'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  primarySkills: z.string().min(1, 'Add at least one primary skill'),
  secondarySkills: z.string().optional(),
  skillSet: z.string().min(1, 'Please describe your skill set'),
  experienceYears: z.string().min(1, 'Experience is required'),
  freelancerExperience: z.string().min(1, 'Freelancer experience is required'),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  languagesKnown: z.array(z.string()).min(1, 'Select at least one language'),
  speakingLanguage: z.string().min(1, 'Select preferred speaking language'),
  supportHours: z.string().min(1, 'Please enter support hours'),
  timingAvailability: z.string().min(1, 'Select availability timing'),
  weekendAvailability: z.boolean().optional(),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const languageOptions = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Urdu'];
const timingOptions = [
  'Morning (6AM - 12PM)',
  'Afternoon (12PM - 6PM)',
  'Evening (6PM - 10PM)',
  'Night (10PM - 6AM)',
  'Flexible / Any Time',
  'US Shift (6PM - 3AM IST)',
  'UK Shift (1PM - 10PM IST)',
];

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

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag).join(', '));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="bg-slate-900/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
        />
        <Button type="button" size="sm" onClick={addTag} className="bg-cyan-600 hover:bg-cyan-700 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 gap-1 pr-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white ml-1">
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
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '', gender: '', location: '', city: '', state: '',
      primarySkills: '', secondarySkills: '', skillSet: '',
      experienceYears: '', freelancerExperience: '', currentCompany: '', currentRole: '',
      languagesKnown: [], speakingLanguage: '', supportHours: '',
      timingAvailability: '', weekendAvailability: false, hourlyRate: '',
      bio: '', linkedinUrl: '', portfolioUrl: '',
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Submit to API
      console.log('Profile data:', data);
      toast.success('Profile created successfully! Please login to continue.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const sectionClass = "space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/5";
  const inputClass = "bg-slate-900/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500";
  const labelClass = "text-slate-300";

  return (
    <div
      className="relative min-h-screen py-8 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0f2b46 70%, #0a1628 100%)' }}
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-5">
            <img src={wsLogo} alt="WorkSupport360" className="h-14 w-14 rounded-xl shadow-2xl shadow-orange-500/30 ring-2 ring-orange-400/20" />
            <span className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Work</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400">Support</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-300 to-blue-400">360</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 border border-orange-500/30 mb-4 shadow-lg shadow-orange-500/10">
            <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-amber-300">Complete Your Profile</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-indigo-300">Build Your Freelancer Profile</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Please fill in your details so we can match you with the best clients. 
            A complete profile increases your chances of getting assigned projects by <span className="text-orange-400 font-bold">5x</span>!
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-cyan-500/10 border border-orange-500/20 flex items-start gap-3 shadow-lg shadow-orange-500/5">
          <CheckCircle2 className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-orange-300">Why fill this form?</span> Your profile details help us assign the right clients to you. 
              The more information you provide, the better matches we find. We protect your privacy — your personal details are never shared without consent.
            </p>
          </div>
        </div>

        <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
          
          <CardHeader className="relative pb-2">
            <CardTitle className="text-xl text-white">Profile Details</CardTitle>
            <CardDescription className="text-slate-400">Fields marked with * are required</CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                
                {/* Personal Information */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Personal Information</h3>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Full Name *</FormLabel>
                        <FormControl><Input placeholder="John Doe" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select gender" /></SelectTrigger>
                          </FormControl>
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
                  </div>
                </div>

                {/* Location */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-semibold text-white">Location</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Country *</FormLabel>
                        <FormControl><Input placeholder="India" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>State *</FormLabel>
                        <FormControl><Input placeholder="Telangana" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>City *</FormLabel>
                        <FormControl><Input placeholder="Hyderabad" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Skills & Expertise</h3>
                  </div>

                  <FormField control={form.control} name="primarySkills" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Primary Skills * <span className="text-slate-500 text-xs">(Your strongest skills)</span></FormLabel>
                      <FormControl>
                        <SkillTagInput value={field.value} onChange={field.onChange} placeholder="e.g. React, Java, AWS..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="secondarySkills" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Secondary Skills <span className="text-slate-500 text-xs">(Nice-to-have skills)</span></FormLabel>
                      <FormControl>
                        <SkillTagInput value={field.value || ''} onChange={field.onChange} placeholder="e.g. Docker, Redis, GraphQL..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="skillSet" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Skill Set Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your technical expertise, certifications, and specializations..." className={`${inputClass} min-h-[80px]`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Experience */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Experience</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="experienceYears" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Total IT Experience *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select experience" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-1">0 - 1 Year</SelectItem>
                            <SelectItem value="1-3">1 - 3 Years</SelectItem>
                            <SelectItem value="3-5">3 - 5 Years</SelectItem>
                            <SelectItem value="5-8">5 - 8 Years</SelectItem>
                            <SelectItem value="8-12">8 - 12 Years</SelectItem>
                            <SelectItem value="12+">12+ Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="freelancerExperience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Freelancing Experience *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select experience" /></SelectTrigger>
                          </FormControl>
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="currentCompany" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Current Company <span className="text-slate-500 text-xs">(Optional, kept private)</span></FormLabel>
                        <FormControl><Input placeholder="Company name" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentRole" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Current Role <span className="text-slate-500 text-xs">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="Senior Developer" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Languages */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-pink-400" />
                    <h3 className="font-semibold text-white">Languages</h3>
                  </div>
                  
                  <FormField control={form.control} name="languagesKnown" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Languages Known * <span className="text-slate-500 text-xs">(Select all that apply)</span></FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {languageOptions.map(lang => (
                          <label key={lang} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors">
                            <Checkbox
                              checked={field.value?.includes(lang)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, lang]);
                                } else {
                                  field.onChange(field.value.filter((l: string) => l !== lang));
                                }
                              }}
                              className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                            />
                            <span className="text-sm text-slate-300">{lang}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="speakingLanguage" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Preferred Speaking Language *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}><SelectValue placeholder="Select primary language" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageOptions.map(lang => (
                            <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Availability & Timing */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Availability & Timing</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="supportHours" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Hours Available Per Day *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select hours" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-2">1 - 2 Hours</SelectItem>
                            <SelectItem value="2-4">2 - 4 Hours</SelectItem>
                            <SelectItem value="4-6">4 - 6 Hours</SelectItem>
                            <SelectItem value="6-8">6 - 8 Hours</SelectItem>
                            <SelectItem value="8+">8+ Hours (Full Time)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="timingAvailability" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Preferred Timing *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClass}><SelectValue placeholder="Select timing" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timingOptions.map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="hourlyRate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Hourly Rate (₹/hr) *</FormLabel>
                        <FormControl><Input placeholder="e.g. 500" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weekendAvailability" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                          />
                        </FormControl>
                        <FormLabel className="text-slate-300 !mt-0">Available on Weekends</FormLabel>
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* About & Links */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-5 w-5 text-violet-400" />
                    <h3 className="font-semibold text-white">About You</h3>
                  </div>
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Bio / About *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself, your expertise, and what kind of projects you're looking for..." className={`${inputClass} min-h-[100px]`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>LinkedIn Profile <span className="text-slate-500 text-xs">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/..." className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Portfolio URL <span className="text-slate-500 text-xs">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="https://yoursite.com" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Profile...</>
                  ) : (
                    <>Submit Profile <ChevronRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>

                <p className="text-center text-xs text-slate-500">
                  By submitting, you agree to our Terms of Service and Privacy Policy. 
                  Your information is kept confidential and only shared with matched clients.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FreelancerProfileForm;
