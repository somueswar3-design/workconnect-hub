import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Users, Loader2, MapPin, Briefcase, DollarSign, Clock, Star, Calendar, Video, Mail, ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarWidget } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkerProfile } from '@/types/profile';
import { searchFreelancers, getAllSkills } from '@/services/mockFreelancerData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/components/ui/pagination';

const PAGE_SIZE = 20;

const experienceLevels = [
  { label: 'Any Experience', value: 'all' },
  { label: '1–3 Years', value: '1-3' },
  { label: '4–6 Years', value: '4-6' },
  { label: '7–10 Years', value: '7-10' },
  { label: '10+ Years', value: '10+' },
];

const rateRanges = [
  { label: 'Any Rate', value: 'all' },
  { label: 'Under $25/hr', value: '0-25' },
  { label: '$25 – $50/hr', value: '25-50' },
  { label: '$50 – $100/hr', value: '50-100' },
  { label: '$100+/hr', value: '100+' },
];

const availabilityOptions = [
  { label: 'All', value: 'all' },
  { label: 'Available Now', value: 'available' },
  { label: 'Busy', value: 'busy' },
];

const TalentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [rateFilter, setRateFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [detailProfile, setDetailProfile] = useState<WorkerProfile | null>(null);
  const [interviewDialog, setInterviewDialog] = useState<{ open: boolean; profile: WorkerProfile | null; bulk: boolean }>({ open: false, profile: null, bulk: false });
  const [interviewDate, setInterviewDate] = useState<Date | undefined>();
  const [interviewNotes, setInterviewNotes] = useState('');
  const { toast } = useToast();

  const allSkills = useMemo(() => getAllSkills(), []);

  const { profiles, total, totalPages } = useMemo(() => {
    const result = searchFreelancers({ query: searchQuery, skill: skillFilter, page: currentPage, pageSize: PAGE_SIZE });

    let filtered = result.profiles;

    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(p => {
        const years = parseInt(p.experience) || 0;
        if (experienceFilter === '1-3') return years >= 1 && years <= 3;
        if (experienceFilter === '4-6') return years >= 4 && years <= 6;
        if (experienceFilter === '7-10') return years >= 7 && years <= 10;
        if (experienceFilter === '10+') return years >= 10;
        return true;
      });
    }

    // Rate filter
    if (rateFilter !== 'all') {
      filtered = filtered.filter(p => {
        const rate = parseInt(p.hourlyRate?.replace(/[^0-9]/g, '') || '0');
        if (rateFilter === '0-25') return rate < 25;
        if (rateFilter === '25-50') return rate >= 25 && rate <= 50;
        if (rateFilter === '50-100') return rate >= 50 && rate <= 100;
        if (rateFilter === '100+') return rate >= 100;
        return true;
      });
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(p => p.availability === availabilityFilter);
    }

    return { profiles: filtered, total: filtered.length, totalPages: Math.ceil(filtered.length / PAGE_SIZE) };
  }, [searchQuery, skillFilter, experienceFilter, rateFilter, availabilityFilter, currentPage]);

  const toggleSelect = (id: string) => {
    setSelectedProfiles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedProfiles.length === profiles.length) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(profiles.map(p => p.id));
    }
  };

  const handleScheduleInterview = () => {
    if (!interviewDate) {
      toast({ title: 'Please select a date', variant: 'destructive' });
      return;
    }
    const count = interviewDialog.bulk ? selectedProfiles.length : 1;
    const name = interviewDialog.profile?.aliasName || `${count} freelancer(s)`;
    toast({
      title: '📅 Interview Scheduled!',
      description: `Interview with ${name} scheduled for ${format(interviewDate, 'PPP')}. Our HR team will coordinate and send calendar invites to all parties.`,
    });
    setInterviewDialog({ open: false, profile: null, bulk: false });
    setInterviewDate(undefined);
    setInterviewNotes('');
    if (interviewDialog.bulk) setSelectedProfiles([]);
  };

  const handleRequestDemo = (profile: WorkerProfile) => {
    toast({
      title: '🎉 Demo Requested!',
      description: `We've received your demo request for ${profile.aliasName}. Our team will arrange a free demo session and notify you via email at support@worksupport360.com.`,
    });
  };

  const activeFilters = [skillFilter !== 'all', experienceFilter !== 'all', rateFilter !== 'all', availabilityFilter !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSkillFilter('all');
    setExperienceFilter('all');
    setRateFilter('all');
    setAvailabilityFilter('all');
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">
              <Users className="h-3.5 w-3.5 mr-1.5" /> HR & Talent Search
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              Find the Right IT Talent for Your Team
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Search through our verified pool of IT professionals. Use advanced filters to narrow down by skills, 
              experience, hourly rate, and availability. Schedule interviews and request demos — all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search Bar */}
        <div className="flex flex-col gap-3 mb-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, location, company..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10 h-11"
            />
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilters > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                {activeFilters}
              </Badge>
            )}
            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <Card className="mb-6 border-dashed">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Skill</Label>
                  <Select value={skillFilter} onValueChange={(v) => { setSkillFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {allSkills.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Experience</Label>
                  <Select value={experienceFilter} onValueChange={(v) => { setExperienceFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Hourly Rate</Label>
                  <Select value={rateFilter} onValueChange={(v) => { setRateFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rateRanges.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Availability</Label>
                  <Select value={availabilityFilter} onValueChange={(v) => { setAvailabilityFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {activeFilters > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive" onClick={clearFilters}>
                    <X className="h-3 w-3 mr-1" /> Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions Bar */}
        {selectedProfiles.length > 0 && (
          <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Badge variant="secondary" className="font-semibold">{selectedProfiles.length} selected</Badge>
            <Button size="sm" className="gap-1.5" onClick={() => setInterviewDialog({ open: true, profile: null, bulk: true })}>
              <Calendar className="h-3.5 w-3.5" /> Schedule Bulk Interview
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => {
              toast({
                title: '📧 Demo Requests Sent!',
                description: `Demo requests sent for ${selectedProfiles.length} freelancer(s). Our team will coordinate all sessions.`,
              });
              setSelectedProfiles([]);
            }}>
              <Video className="h-3.5 w-3.5" /> Request Demos
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedProfiles([])}>Clear</Button>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={profiles.length > 0 && selectedProfiles.length === profiles.length}
              onCheckedChange={selectAll}
            />
            <span className="text-sm text-muted-foreground">
              {total.toLocaleString()} professional{total !== 1 ? 's' : ''} found
            </span>
          </div>
          {totalPages > 1 && (
            <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
          )}
        </div>

        {/* Results Grid */}
        {profiles.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No professionals found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map((profile) => (
              <FreelancerRow
                key={profile.id}
                profile={profile}
                selected={selectedProfiles.includes(profile.id)}
                onToggleSelect={() => toggleSelect(profile.id)}
                onViewDetail={() => setDetailProfile(profile)}
                onScheduleInterview={() => setInterviewDialog({ open: true, profile, bulk: false })}
                onRequestDemo={() => handleRequestDemo(profile)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
                {getPageNumbers().map((page, idx) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)} className="cursor-pointer">{page}</PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailProfile} onOpenChange={(o) => !o && setDetailProfile(null)}>
        <DialogContent className="max-w-lg">
          {detailProfile && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{detailProfile.aliasName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xl font-bold">
                    {detailProfile.aliasName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{detailProfile.aliasName}</p>
                    <p className="text-sm text-muted-foreground">{detailProfile.companyAlias}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{detailProfile.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{detailProfile.experience}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-muted-foreground">Hourly Rate</Label>
                  <p className="text-2xl font-bold text-primary">{detailProfile.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hour</span></p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Skills</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {detailProfile.skills.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">About</Label>
                  <p className="text-sm mt-1 leading-relaxed">{detailProfile.bio}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Availability</Label>
                  <Badge className={cn("mt-1 capitalize", detailProfile.availability === 'available' ? 'bg-emerald-500/10 text-emerald-600' : detailProfile.availability === 'busy' ? 'bg-amber-500/10 text-amber-600' : 'bg-gray-500/10 text-gray-500')}>
                    {detailProfile.availability}
                  </Badge>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button className="flex-1 gap-1.5" onClick={() => { setDetailProfile(null); setInterviewDialog({ open: true, profile: detailProfile, bulk: false }); }}>
                    <Calendar className="h-4 w-4" /> Schedule Interview
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1.5" onClick={() => { handleRequestDemo(detailProfile); setDetailProfile(null); }}>
                    <Video className="h-4 w-4" /> Request Demo
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Interview Scheduling Dialog */}
      <Dialog open={interviewDialog.open} onOpenChange={(o) => !o && setInterviewDialog({ open: false, profile: null, bulk: false })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {interviewDialog.bulk
                ? `Schedule Interview — ${selectedProfiles.length} Freelancer(s)`
                : `Schedule Interview — ${interviewDialog.profile?.aliasName}`
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Select Interview Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left mt-1.5", !interviewDate && "text-muted-foreground")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {interviewDate ? format(interviewDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarWidget
                    mode="single"
                    selected={interviewDate}
                    onSelect={setInterviewDate}
                    disabled={(date) => date < new Date()}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-sm">Notes for HR Team (Optional)</Label>
              <Textarea
                className="mt-1.5"
                placeholder="Any specific topics to cover, time preferences, etc."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                rows={3}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Our HR team will coordinate the interview and send calendar invites to all parties. 
              A confirmation email will be sent to your registered email address.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewDialog({ open: false, profile: null, bulk: false })}>Cancel</Button>
            <Button onClick={handleScheduleInterview} className="gap-1.5">
              <Calendar className="h-4 w-4" /> Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Freelancer Row Card ─── */
interface FreelancerRowProps {
  profile: WorkerProfile;
  selected: boolean;
  onToggleSelect: () => void;
  onViewDetail: () => void;
  onScheduleInterview: () => void;
  onRequestDemo: () => void;
}

const FreelancerRow = ({ profile, selected, onToggleSelect, onViewDetail, onScheduleInterview, onRequestDemo }: FreelancerRowProps) => (
  <Card className={cn("transition-all hover:shadow-md", selected && "ring-2 ring-primary/40 bg-primary/[0.02]")}>
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <Checkbox checked={selected} onCheckedChange={onToggleSelect} />
        
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary/50 flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 cursor-pointer" onClick={onViewDetail}>
          {profile.aliasName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={onViewDetail}>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{profile.aliasName}</h3>
            <Badge className={cn("text-[10px] h-5 capitalize", profile.availability === 'available' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : profile.availability === 'busy' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-gray-100 text-gray-500')}>
              {profile.availability}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{profile.experience}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{profile.companyAlias}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {profile.skills.slice(0, 4).map(s => (
              <Badge key={s} variant="outline" className="text-[10px] h-5 px-1.5">{s}</Badge>
            ))}
            {profile.skills.length > 4 && <Badge variant="outline" className="text-[10px] h-5 px-1.5">+{profile.skills.length - 4}</Badge>}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-primary">{profile.hourlyRate}</p>
          <p className="text-[10px] text-muted-foreground">per hour</p>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <Button size="sm" className="h-8 text-xs gap-1" onClick={onScheduleInterview}>
            <Calendar className="h-3 w-3" /> Interview
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={onRequestDemo}>
            <Video className="h-3 w-3" /> Demo
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TalentSearch;
