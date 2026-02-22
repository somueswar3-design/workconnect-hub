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
import { countries, getCurrencySymbol } from '@/data/countries';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Please select gender'),
  country: z.string().min(1, 'Please select a country'),
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
          className="border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-orange-500"
        />
        <Button type="button" size="sm" onClick={addTag} className="bg-orange-500 hover:bg-orange-600 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} className="bg-orange-100 text-orange-700 border-orange-200 gap-1 pr-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-900 ml-1">
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
      fullName: '', gender: '', country: '',
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

  const sectionClass = "space-y-4 p-5 rounded-xl bg-orange-50/50 border border-orange-100";
  const inputClass = "border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-orange-500 focus-visible:border-orange-500";
  const labelClass = "text-gray-700";

  return (
    <div
      className="relative min-h-screen py-8 px-4 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 41px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-5">
            <img src={wsLogo} alt="WorkSupport360" className="h-14 w-14 rounded-xl shadow-lg" />
            <span className="text-2xl font-bold">
              <span className="text-orange-500">Work</span>
              <span className="text-amber-500">Support</span>
              <span className="text-blue-600">360</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 mb-4 shadow-sm">
            <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-semibold text-orange-600">Complete Your Profile</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900">Build Your Freelancer Profile</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Please fill in your details so we can match you with the best clients. 
            A complete profile increases your chances of getting assigned projects by <span className="text-orange-500 font-bold">5x</span>!
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-blue-50 border border-orange-200 flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-orange-600">Why fill this form?</span> Your profile details help us assign the right clients to you. 
              The more information you provide, the better matches we find. We protect your privacy — your personal details are never shared without consent.
            </p>
          </div>
        </div>

        <Card className="border border-orange-100 bg-white shadow-xl shadow-orange-500/10 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gray-900">Profile Details</CardTitle>
            <CardDescription className="text-gray-500">Fields marked with * are required</CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                
                {/* Personal Information */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
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
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">Location</h3>
                  </div>
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Country *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}><SelectValue placeholder="Select your country" /></SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {countries.map(c => (
                            <SelectItem key={c.code} value={c.name}>
                              {c.name} ({c.currencySymbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Skills & Expertise */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-semibold text-gray-900">Skills & Expertise</h3>
                  </div>

                  <FormField control={form.control} name="primarySkills" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Primary Skills * <span className="text-gray-400 text-xs">(Your strongest skills)</span></FormLabel>
                      <FormControl>
                        <SkillTagInput value={field.value} onChange={field.onChange} placeholder="e.g. React, Java, AWS..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="secondarySkills" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Secondary Skills <span className="text-gray-400 text-xs">(Nice-to-have skills)</span></FormLabel>
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
                    <Briefcase className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold text-gray-900">Experience</h3>
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
                        <FormLabel className={labelClass}>Current Company <span className="text-gray-400 text-xs">(Optional, kept private)</span></FormLabel>
                        <FormControl><Input placeholder="Company name" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentRole" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Current Role <span className="text-gray-400 text-xs">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="Senior Developer" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Languages */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-pink-500" />
                    <h3 className="font-semibold text-gray-900">Languages</h3>
                  </div>
                  
                  <FormField control={form.control} name="languagesKnown" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Languages Known * <span className="text-gray-400 text-xs">(Select all that apply)</span></FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {languageOptions.map(lang => (
                          <label key={lang} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
                            <Checkbox
                              checked={field.value?.includes(lang)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, lang]);
                                } else {
                                  field.onChange(field.value.filter((l: string) => l !== lang));
                                }
                              }}
                              className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <span className="text-sm text-gray-700">{lang}</span>
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
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">Availability & Timing</h3>
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
                    <FormField control={form.control} name="hourlyRate" render={({ field }) => {
                      const selectedCountry = form.watch('country');
                      const symbol = getCurrencySymbol(selectedCountry);
                      return (
                        <FormItem>
                          <FormLabel className={labelClass}>Hourly Rate ({symbol}/hr) *</FormLabel>
                          <FormControl><Input placeholder="e.g. 500" className={inputClass} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }} />
                    <FormField control={form.control} name="weekendAvailability" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                        </FormControl>
                        <FormLabel className="text-gray-700 !mt-0">Available on Weekends</FormLabel>
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* About & Links */}
                <div className={sectionClass}>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-5 w-5 text-violet-500" />
                    <h3 className="font-semibold text-gray-900">About You</h3>
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
                        <FormLabel className={labelClass}>LinkedIn Profile <span className="text-gray-400 text-xs">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/..." className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Portfolio URL <span className="text-gray-400 text-xs">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="https://yoursite.com" className={inputClass} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg py-6 shadow-lg shadow-orange-500/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Profile...</>
                  ) : (
                    <>Submit Profile <ChevronRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>

                <p className="text-center text-xs text-gray-400">
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
