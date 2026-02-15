import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Users, Loader2, Phone, Mail, Star, ChevronLeft, ChevronRight, Shield, Clock, Award, Zap, CheckCircle2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkerProfile } from '@/types/profile';
import { getProfiles } from '@/services/mockApi';
import { getMaskedProfile } from '@/services/freelancerApi';
import InterestForm from '@/components/InterestForm';

const promoSlides = [
  {
    title: "Find Your Perfect IT Professional",
    subtitle: "Browse skilled freelancers, request a FREE demo, and hire with confidence",
    description: "Our team coordinates everything — from demo scheduling to project kick-off. You focus on your business, we handle the rest.",
    gradient: "from-primary to-blue-700",
    icon: Users,
  },
  {
    title: "100% Free Demo Sessions",
    subtitle: "Try before you commit — no charges until you're satisfied",
    description: "Request a demo with any freelancer. Our team arranges a free session so you can evaluate skills, communication, and fit before any commitment.",
    gradient: "from-emerald-600 to-teal-700",
    icon: CheckCircle2,
  },
  {
    title: "Only 5% Service Commission",
    subtitle: "Transparent pricing with no hidden fees",
    description: "We charge only 5% commission on the agreed hourly rate. Payment starts only after admin approval and assignment. Fair, simple, and transparent.",
    gradient: "from-violet-600 to-purple-700",
    icon: Shield,
  },
  {
    title: "We Coordinate Everything",
    subtitle: "From interest to assignment — our team manages it all",
    description: "Select a freelancer → Request demo → Admin reviews → Free demo arranged → Approve & assign → Payment begins. You're in control at every step.",
    gradient: "from-orange-500 to-red-600",
    icon: Zap,
  },
];

const BrowseWorkers = () => {
  const [profiles, setProfiles] = useState<WorkerProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const allSkills = [...new Set(profiles.flatMap(p => p.skills))].sort();

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchQuery, skillFilter]);

  // Auto-rotate slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await getProfiles();
      const maskedData = data.map(getMaskedProfile);
      setProfiles(maskedData);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfiles = () => {
    let result = profiles;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.aliasName.toLowerCase().includes(query) ||
        p.skills.some(s => s.toLowerCase().includes(query)) ||
        p.location.toLowerCase().includes(query)
      );
    }
    if (skillFilter !== 'all') {
      result = result.filter(p =>
        p.skills.some(s => s.toLowerCase() === skillFilter.toLowerCase())
      );
    }
    setFilteredProfiles(result);
  };

  const handleConnect = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setIsDialogOpen(true);
  };

  const handleWhatsAppContact = () => {
    const adminWhatsApp = '+919441363687';
    const message = encodeURIComponent(
      `Hi, I'm interested in connecting with IT professionals on ITWorkHelp. Please help me find the right match.`
    );
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

  const handleInterestSubmit = () => {
    setIsDialogOpen(false);
    setSelectedWorker(null);
  };

  const availableCount = profiles.filter(p => p.availability === 'available').length;
  const CurrentIcon = promoSlides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Slider */}
      <div className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-r ${promoSlides[currentSlide].gradient} text-white transition-all duration-700`}
        >
          <div className="container py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <CurrentIcon className="h-8 w-8" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm">
                    ITWorkHelp
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {promoSlides[currentSlide].title}
                </h1>
                <p className="text-xl text-white/90 font-medium">
                  {promoSlides[currentSlide].subtitle}
                </p>
                <p className="text-white/75 text-base max-w-xl">
                  {promoSlides[currentSlide].description}
                </p>
              </div>

              {/* Process Steps */}
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3 min-w-[280px]">
                <h3 className="font-semibold text-lg mb-4">How It Works</h3>
                {[
                  { step: '1', text: 'Browse & select freelancer' },
                  { step: '2', text: 'Request FREE demo' },
                  { step: '3', text: 'Admin arranges demo' },
                  { step: '4', text: 'Approve & start work' },
                  { step: '5', text: 'Only 5% commission' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold">
                      {item.step}
                    </span>
                    <span className="text-sm text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => setCurrentSlide(prev => (prev - 1 + promoSlides.length) % promoSlides.length)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-2">
                {promoSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => setCurrentSlide(prev => (prev + 1) % promoSlides.length)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="text-base py-2 px-4 border-primary/30">
            <Users className="h-4 w-4 mr-2 text-primary" />
            {profiles.length} Professionals
          </Badge>
          <Badge className="text-base py-2 px-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <Zap className="h-4 w-4 mr-2" />
            {availableCount} Available Now
          </Badge>
          <Badge className="text-base py-2 px-4 bg-violet-500/10 text-violet-600 border-violet-500/20">
            <Shield className="h-4 w-4 mr-2" />
            Free Demo Available
          </Badge>
          <Badge className="text-base py-2 px-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
            <Award className="h-4 w-4 mr-2" />
            Only 5% Commission
          </Badge>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {allSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="font-normal">
            {filteredProfiles.length} professional{filteredProfiles.length !== 1 ? 's' : ''} found
          </Badge>
          {skillFilter !== 'all' && (
            <Badge variant="secondary">Skill: {skillFilter}</Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary">Search: "{searchQuery}"</Badge>
          )}
        </div>

        {/* Worker Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No professionals found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <FreelancerCard key={profile.id} profile={profile} onRequestDemo={handleConnect} />
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Can't find the right match?</h2>
          <p className="text-white/80 mb-4 max-w-lg mx-auto">
            Tell us your requirements and our team will find the perfect freelancer for you. Free consultation, zero commitment.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="font-semibold"
            onClick={handleWhatsAppContact}
          >
            Talk to Our Team
          </Button>
        </div>
      </div>

      {/* Interest / Demo Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Request Free Demo — {selectedWorker?.aliasName}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-2">
            Fill in your details. Our admin team will review your request, contact the freelancer, and arrange a <strong>completely free demo</strong> session for you.
          </p>
          {selectedWorker && (
            <InterestForm
              worker={selectedWorker}
              onSubmit={handleInterestSubmit}
              onWhatsAppContact={handleWhatsAppContact}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Freelancer Card Component ─── */
const FreelancerCard = ({ profile, onRequestDemo }: { profile: WorkerProfile; onRequestDemo: (p: WorkerProfile) => void }) => {
  const availabilityStyles = {
    available: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    busy: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    offline: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-border/60">
      {/* Colored top strip */}
      <div className={`h-1.5 bg-gradient-to-r ${
        profile.availability === 'available' ? 'from-emerald-400 to-teal-500' :
        profile.availability === 'busy' ? 'from-amber-400 to-orange-500' :
        'from-gray-300 to-gray-400'
      }`} />

      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">{profile.aliasName}</h3>
            <p className="text-sm text-muted-foreground">{profile.companyAlias}</p>
          </div>
          <Badge className={availabilityStyles[profile.availability]}>
            {profile.availability === 'available' ? '🟢 Available' :
             profile.availability === 'busy' ? '🟡 Busy' : '⚫ Offline'}
          </Badge>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-0">
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">+{profile.skills.length - 4}</Badge>
          )}
        </div>

        <Separator />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Experience</span>
            <p className="font-semibold text-foreground">{profile.experience}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Rate</span>
            <p className="font-semibold text-primary">{profile.hourlyRate}/hr</p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Location</span>
            <p className="font-semibold text-foreground">{profile.location}</p>
          </div>
        </div>

        {/* Masked Contact — last 2 digits mobile only */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{profile.mobile}</span>
          </div>
          <p className="text-xs text-muted-foreground/70 italic">
            Contact details revealed after admin approval
          </p>
        </div>

        {/* CTA */}
        <Button
          className="w-full font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          onClick={() => onRequestDemo(profile)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Request Free Demo
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrowseWorkers;
