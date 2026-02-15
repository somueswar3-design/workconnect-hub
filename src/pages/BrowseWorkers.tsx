import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Users, Loader2, Phone, Mail, Star, ChevronLeft, ChevronRight, Shield, Clock, Award, Zap, CheckCircle2, Eye, MapPin, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { WorkerProfile } from '@/types/profile';
import { searchFreelancers, getAllSkills } from '@/services/mockFreelancerData';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const PAGE_SIZE = 24;

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
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const allSkills = useMemo(() => getAllSkills(), []);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Auto-rotate slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, skillFilter]);

  const { profiles, total, totalPages } = useMemo(() => {
    if (isLoading) return { profiles: [], total: 0, totalPages: 0 };
    return searchFreelancers({
      query: searchQuery,
      skill: skillFilter,
      page: currentPage,
      pageSize: PAGE_SIZE,
    });
  }, [searchQuery, skillFilter, currentPage, isLoading]);

  const handleRequestDemo = (profile: WorkerProfile) => {
    toast({
      title: "🎉 Thank you for your interest!",
      description: `We've noted your interest in ${profile.aliasName}. Our team will review, contact the freelancer, and get back to you with demo details shortly. Stay tuned!`,
    });
  };

  const availableCount = useMemo(() => {
    if (isLoading) return 0;
    return searchFreelancers({ query: '', skill: 'all', page: 1, pageSize: 1 }).total;
  }, [isLoading]);

  const CurrentIcon = promoSlides[currentSlide].icon;

  // Pagination range
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Slider */}
      <div className="relative overflow-hidden">
        <div className={`bg-gradient-to-r ${promoSlides[currentSlide].gradient} text-white transition-all duration-700`}>
          <div className="container py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <CurrentIcon className="h-7 w-7" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm">ITWorkHelp</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{promoSlides[currentSlide].title}</h1>
                <p className="text-lg text-white/90 font-medium">{promoSlides[currentSlide].subtitle}</p>
                <p className="text-white/75 text-sm max-w-xl">{promoSlides[currentSlide].description}</p>
              </div>
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-2.5 min-w-[260px]">
                <h3 className="font-semibold text-base mb-3">How It Works</h3>
                {[
                  { step: '1', text: 'Browse & select freelancer' },
                  { step: '2', text: 'Request FREE demo' },
                  { step: '3', text: 'Admin arranges demo' },
                  { step: '4', text: 'Approve & start work' },
                  { step: '5', text: 'Only 5% commission' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">{item.step}</span>
                    <span className="text-xs text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-7 w-7" onClick={() => setCurrentSlide(prev => (prev - 1 + promoSlides.length) % promoSlides.length)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1.5">
                {promoSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                ))}
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-7 w-7" onClick={() => setCurrentSlide(prev => (prev + 1) % promoSlides.length)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="outline" className="py-1.5 px-3 border-primary/30">
            <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />{availableCount.toLocaleString()} Professionals
          </Badge>
          <Badge className="py-1.5 px-3 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <Zap className="h-3.5 w-3.5 mr-1.5" />Free Demo Available
          </Badge>
          <Badge className="py-1.5 px-3 bg-violet-500/10 text-violet-600 border-violet-500/20">
            <Shield className="h-3.5 w-3.5 mr-1.5" />Only 5% Commission
          </Badge>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3 mb-5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, skills, location, company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-1.5" />
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

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal text-xs">
              {total.toLocaleString()} result{total !== 1 ? 's' : ''}
            </Badge>
            {skillFilter !== 'all' && <Badge variant="secondary" className="text-xs">Skill: {skillFilter}</Badge>}
            {searchQuery && <Badge variant="secondary" className="text-xs">Search: "{searchQuery}"</Badge>}
          </div>
          {totalPages > 1 && (
            <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
          )}
        </div>

        {/* Worker Grid — compact small cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No professionals found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {profiles.map((profile) => (
                <CompactFreelancerCard key={profile.id} profile={profile} onRequestDemo={handleRequestDemo} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((page, idx) =>
                      page === 'ellipsis' ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-1">Can't find the right match?</h2>
          <p className="text-white/80 mb-3 text-sm max-w-lg mx-auto">
            Tell us your requirements and our team will find the perfect freelancer for you. Free consultation, zero commitment.
          </p>
          <Button variant="secondary" size="sm" className="font-semibold" onClick={() => {
            const message = encodeURIComponent('Hi, I\'m interested in connecting with IT professionals on ITWorkHelp. Please help me find the right match.');
            window.open(`https://wa.me/+919441363687?text=${message}`, '_blank');
          }}>
            Talk to Our Team
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ─── Compact Freelancer Card ─── */
const CompactFreelancerCard = ({ profile, onRequestDemo }: { profile: WorkerProfile; onRequestDemo: (p: WorkerProfile) => void }) => {
  const statusColor = profile.availability === 'available'
    ? 'bg-emerald-500' : profile.availability === 'busy'
    ? 'bg-amber-500' : 'bg-gray-400';

  const statusLabel = profile.availability === 'available'
    ? 'Online' : profile.availability === 'busy'
    ? 'Busy' : 'Offline';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden border-border/60">
      <CardContent className="p-3 space-y-2">
        {/* Name + Status dot */}
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-sm font-bold text-foreground truncate flex-1">{profile.aliasName}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className="text-[10px] text-muted-foreground">{statusLabel}</span>
          </div>
        </div>

        {/* Company */}
        <p className="text-[11px] text-muted-foreground truncate">{profile.companyAlias}</p>

        {/* Skills — show 2 max */}
        <div className="flex flex-wrap gap-1">
          {profile.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-0">
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 2 && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">+{profile.skills.length - 2}</Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-0.5 text-[11px]">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Briefcase className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{profile.experience}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
            <span className="font-semibold text-primary">{profile.hourlyRate}/hr</span>
          </div>
        </div>

        {/* Masked Contact */}
        <div className="rounded bg-muted/50 px-2 py-1.5 space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Mail className="h-2.5 w-2.5" />{profile.email}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Phone className="h-2.5 w-2.5" />{profile.mobile}
          </div>
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="w-full text-xs h-7 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          onClick={() => onRequestDemo(profile)}
        >
          Request Demo
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrowseWorkers;
