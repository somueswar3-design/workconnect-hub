import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Clock, Edit2, Save, X, Star, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FreelancerProfileData {
  fullName: string;
  email: string;
  mobile: string;
  location: string;
  companyAlias: string;
  experience: string;
  hourlyRate: string;
  bio: string;
  skills: string[];
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
}

const defaultProfile: FreelancerProfileData = {
  fullName: '',
  email: '',
  mobile: '',
  location: 'Hyderabad, India',
  companyAlias: '',
  experience: '3+ Years',
  hourlyRate: '$75',
  bio: '',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  languages: ['English', 'Telugu', 'Hindi'],
  availability: 'available',
};

const FreelancerProfileCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<FreelancerProfileData>({
    ...defaultProfile,
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: 'Profile Updated', description: 'Your work details have been saved successfully.' });
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const availabilityColors = {
    available: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-muted-foreground/40',
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Gradient Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary via-primary/80 to-accent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0djEyaDEyVjE0SDM2ek0xMiAxNHYxMmgxMlYxNEgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card shadow-xl flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card ${availabilityColors[profile.availability]}`} />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <CardContent className="pt-16 pb-6 space-y-6">
        {/* Name & Quick Info */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            {isEditing ? (
              <Input
                value={profile.fullName}
                onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                className="text-xl font-bold mb-1"
                placeholder="Your Full Name"
              />
            ) : (
              <h2 className="text-xl font-bold text-foreground">{profile.fullName || 'Update Your Name'}</h2>
            )}
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {profile.companyAlias || 'Freelancer'} · {profile.experience}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
              {profile.hourlyRate}/hr
            </Badge>
            <Badge variant="outline" className="capitalize">{profile.availability}</Badge>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            {isEditing ? (
              <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="h-8 text-sm" />
            ) : (
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{profile.email || 'Add email'}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
            <div className="p-2 rounded-lg bg-accent/10">
              <Phone className="h-4 w-4 text-accent" />
            </div>
            {isEditing ? (
              <Input value={profile.mobile} onChange={e => setProfile(p => ({ ...p, mobile: e.target.value }))} placeholder="+91-XXX-XXX-XXXX" className="h-8 text-sm" />
            ) : (
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="text-sm font-medium">{profile.mobile || 'Add mobile'}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="p-2 rounded-lg bg-secondary/10">
              <MapPin className="h-4 w-4 text-secondary" />
            </div>
            {isEditing ? (
              <Input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} className="h-8 text-sm" />
            ) : (
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{profile.location}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            {isEditing ? (
              <Input value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} className="h-8 text-sm" />
            ) : (
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium">{profile.experience}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">About Me</Label>
          {isEditing ? (
            <Textarea
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              placeholder="Describe your expertise and work style..."
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio || 'Tell clients about your experience, work style, and what makes you great at what you do.'}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Skills & Technologies</Label>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <Badge key={skill} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-1">
                {skill}
                {isEditing && (
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
                )}
              </Badge>
            ))}
            {isEditing && (
              <div className="flex items-center gap-1">
                <Input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Add skill"
                  className="h-7 w-28 text-xs"
                />
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={addSkill}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Languages</Label>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map(lang => (
              <Badge key={lang} variant="outline" className="bg-accent/5 border-accent/20 text-accent">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileCard;
