import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, Save, Plus, X, Camera, LogOut, 
  Languages, Lock, ChevronDown, Star, DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FreelancerFormData {
  fullName: string;
  email: string;
  mobile: string;
  location: string;
  experience: string;
  hourlyRate: string;
  bio: string;
  skills: string[];
  primaryLanguage: string;
  otherLanguages: string[];
  companyAlias: string;
  availability: 'available' | 'busy' | 'offline';
}

const FreelancerDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FreelancerFormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: '',
    location: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    skills: [],
    primaryLanguage: 'English',
    otherLanguages: [],
    companyAlias: '',
    availability: 'available',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: 'Image must be less than 5MB', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.experience.trim()) newErrors.experience = 'Experience is required';
    if (!form.hourlyRate.trim()) newErrors.hourlyRate = 'Hourly rate is required';
    if (!form.primaryLanguage) newErrors.primaryLanguage = 'Primary language is required';
    if (form.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (!form.bio.trim()) newErrors.bio = 'Bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fill all mandatory fields', variant: 'destructive' });
      return;
    }
    updateUser({ fullName: form.fullName, avatarUrl: avatarPreview || undefined });
    toast({ title: 'Profile Saved', description: 'Your profile has been updated successfully.' });
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
      if (errors.skills) setErrors(e => ({ ...e, skills: '' }));
    }
  };

  const removeSkill = (skill: string) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const update = (field: keyof FreelancerFormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const languageOptions = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Urdu'];

  const toggleOtherLanguage = (lang: string) => {
    setForm(p => ({
      ...p,
      otherLanguages: p.otherLanguages.includes(lang)
        ? p.otherLanguages.filter(l => l !== lang)
        : [...p.otherLanguages, lang],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                {form.fullName || 'Freelancer Profile'}
              </h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <ChevronDown className="h-4 w-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/freelancer/settings/password')}>
                  <Lock className="h-4 w-4 mr-2" /> Change Password
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar Upload */}
          <div className="flex flex-col items-center gap-4 lg:w-56 shrink-0">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-40 w-40 rounded-full bg-muted border-4 border-primary/20 shadow-xl flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">Click to upload photo<br />(Max 5MB)</p>
            <Badge className={`${form.availability === 'available' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted text-muted-foreground'}`}>
              {form.availability === 'available' ? '🟢 Available' : '⚫ Offline'}
            </Badge>
          </div>

          {/* Right: Profile Form */}
          <div className="flex-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Personal Details</h2>
                  <Badge variant="outline" className="text-xs">All fields mandatory *</Badge>
                </div>
                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your full name" className={`pl-9 ${errors.fullName ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className={`pl-9 ${errors.email ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Mobile Number *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.mobile} onChange={e => update('mobile', e.target.value)} placeholder="+91-XXX-XXX-XXXX" className={`pl-9 ${errors.mobile ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.location} onChange={e => update('location', e.target.value)} placeholder="City, Country" className={`pl-9 ${errors.location ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Experience *</Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="e.g. 5+ Years" className={`pl-9 ${errors.experience ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.experience && <p className="text-xs text-destructive mt-1">{errors.experience}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Hourly Rate *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} placeholder="e.g. $75" className={`pl-9 ${errors.hourlyRate ? 'border-destructive' : ''}`} />
                    </div>
                    {errors.hourlyRate && <p className="text-xs text-destructive mt-1">{errors.hourlyRate}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Company / Alias</Label>
                    <div className="relative mt-1">
                      <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={form.companyAlias} onChange={e => update('companyAlias', e.target.value)} placeholder="Company or brand name" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Primary Language *</Label>
                    <Select value={form.primaryLanguage} onValueChange={v => update('primaryLanguage', v)}>
                      <SelectTrigger className={`mt-1 ${errors.primaryLanguage ? 'border-destructive' : ''}`}>
                        <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.primaryLanguage && <p className="text-xs text-destructive mt-1">{errors.primaryLanguage}</p>}
                  </div>
                </div>

                {/* Other Languages */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Other Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.filter(l => l !== form.primaryLanguage).map(lang => (
                      <Badge
                        key={lang}
                        variant={form.otherLanguages.includes(lang) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors ${form.otherLanguages.includes(lang) ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
                        onClick={() => toggleOtherLanguage(lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label className="text-sm font-medium">About Me / Bio *</Label>
                  <Textarea
                    value={form.bio}
                    onChange={e => { update('bio', e.target.value); }}
                    placeholder="Describe your expertise, work style, and what you bring to the table..."
                    rows={3}
                    className={`mt-1 ${errors.bio ? 'border-destructive' : ''}`}
                  />
                  {errors.bio && <p className="text-xs text-destructive mt-1">{errors.bio}</p>}
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Skills & Technologies *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map(skill => (
                      <Badge key={skill} className="bg-primary/10 text-primary border-primary/20 gap-1 pr-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Type a skill and press Enter"
                      className={`max-w-xs ${errors.skills ? 'border-destructive' : ''}`}
                    />
                    <Button size="sm" variant="outline" onClick={addSkill} type="button">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  {errors.skills && <p className="text-xs text-destructive mt-1">{errors.skills}</p>}
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gap-2 px-8">
                    <Save className="h-4 w-4" /> Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
