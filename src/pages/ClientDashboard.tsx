import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Users, Search, Briefcase, Clock, Languages, MapPin, 
  IndianRupee, DollarSign, Calendar, ChevronLeft, ChevronRight, 
  Star, Zap, Filter, X, Send
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getFreelancerProfiles, getFilteredFreelancers, FreelancerProfileDto, FreelancerFilterParams, requestDemo, RequestDemoDto } from '@/services/clientApi';
import DashboardLayout from '@/layouts/DashboardLayout';
import ChangePassword from '@/pages/ChangePassword';

const ITEMS_PER_PAGE = 10;

const freelancingExpLabel: Record<number, string> = {
  0: 'New', 1: '<1 Year', 2: '1-3 Years', 3: '3-5 Years', 4: '5+ Years',
};

const ClientOverview = () => {
  const [profiles, setProfiles] = useState<FreelancerProfileDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterMinExp, setFilterMinExp] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Demo dialog state
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerProfileDto | null>(null);
  const [demoForm, setDemoForm] = useState({
    projectTitle: '',
    description: '',
    clientBudget: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const loadProfiles = async (filters?: FreelancerFilterParams) => {
    setIsLoading(true);
    setHasError(false);
    try {
      let data: FreelancerProfileDto[];
      if (filters && (filters.skill || filters.language || filters.country || filters.minExperience !== undefined)) {
        data = await getFilteredFreelancers(filters);
        setIsFiltering(true);
      } else {
        data = await getFreelancerProfiles();
        setIsFiltering(false);
      }
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load freelancer profiles:', error);
      setHasError(true);
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProfiles(); }, []);

  const handleApplyFilters = () => {
    const filters: FreelancerFilterParams = {};
    if (filterSkill.trim()) filters.skill = filterSkill.trim();
    if (filterLanguage.trim()) filters.language = filterLanguage.trim();
    if (filterCountry.trim()) filters.country = filterCountry.trim();
    if (filterMinExp) filters.minExperience = Number(filterMinExp);
    loadProfiles(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterSkill('');
    setFilterLanguage('');
    setFilterCountry('');
    setFilterMinExp('');
    loadProfiles();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(profiles.length / ITEMS_PER_PAGE);
  const paginated = profiles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getCurrencySymbol = (country?: string) => {
    if (!country) return '$';
    const c = country.toLowerCase();
    if (c.includes('india')) return '₹';
    if (c.includes('united kingdom')) return '£';
    if (c.includes('euro')) return '€';
    return '$';
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDemoClick = (freelancer: FreelancerProfileDto) => {
    setSelectedFreelancer(freelancer);
    setDemoForm({
      projectTitle: '',
      description: '',
      clientBudget: '',
      contactEmail: user?.email || '',
      contactPhone: '',
    });
    setDemoOpen(true);
  };

  const handleDemoSubmit = async () => {
    if (!selectedFreelancer) return;
    if (!demoForm.projectTitle.trim() || !demoForm.contactEmail.trim()) {
      toast({ title: 'Validation', description: 'Project title and email are required', variant: 'destructive' });
      return;
    }

    setDemoSubmitting(true);
    try {
      const payload: RequestDemoDto = {
        id: 0,
        clientId: Number(user?.userId) || 0,
        freelancerId: selectedFreelancer.id,
        projectTitle: demoForm.projectTitle.trim(),
        description: demoForm.description.trim(),
        clientBudget: Number(demoForm.clientBudget) || 0,
        contactEmail: demoForm.contactEmail.trim(),
        contactPhone: demoForm.contactPhone.trim(),
        status: 'Pending',
        adminComments: '',
        createdOn: new Date().toISOString(),
      };
      await requestDemo(payload);
      toast({ title: '🎉 Demo Requested!', description: 'Thank you! Our admin team will coordinate the demo process with you shortly.' });
      setDemoOpen(false);
    } catch (error) {
      console.error('Demo request failed:', error);
      toast({ title: 'Error', description: 'Failed to submit demo request. Please try again.', variant: 'destructive' });
    } finally {
      setDemoSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Available Freelancers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{profiles.length} freelancers found</p>
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {isFiltering && <Badge className="bg-primary-foreground text-primary h-5 w-5 p-0 flex items-center justify-center text-[10px]">✓</Badge>}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Skill</Label>
                    <Input
                      placeholder="e.g. React, Java"
                      value={filterSkill}
                      onChange={e => setFilterSkill(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Language</Label>
                    <Input
                      placeholder="e.g. Telugu, Hindi"
                      value={filterLanguage}
                      onChange={e => setFilterLanguage(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Country</Label>
                    <Input
                      placeholder="e.g. India"
                      value={filterCountry}
                      onChange={e => setFilterCountry(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Min Experience (years)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 4"
                      value={filterMinExp}
                      onChange={e => setFilterMinExp(e.target.value)}
                      className="h-9"
                      min={0}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" onClick={handleApplyFilters} className="gap-1.5">
                    <Search className="h-3.5 w-3.5" /> Apply Filters
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleClearFilters} className="gap-1.5 text-muted-foreground">
                    <X className="h-3.5 w-3.5" /> Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, skill, language, country, role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border h-11"
        />
      </div>

      {/* Results Grid */}
      {paginated.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center space-y-4">
            <div className="h-20 w-20 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Freelancers Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((p, idx) => {
            const skills = p.primarySkills ? p.primarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
            const secondarySkills = p.secondarySkills ? p.secondarySkills.split(',').map(s => s.trim()).filter(Boolean) : [];
            const languages = p.languagesKnown ? p.languagesKnown.split(',').map(s => s.trim()).filter(Boolean) : [];
            const symbol = getCurrencySymbol(p.country);

            return (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <CardContent className="p-5">
                    {/* Top: Name + Availability */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {p.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-base">{p.fullName}</h3>
                          {p.currentCompanyRole && (
                            <p className="text-xs text-muted-foreground">{p.currentCompanyRole}{p.currentCompany ? ` at ${p.currentCompany}` : ''}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`text-[10px] shrink-0 ${p.freelancerUserStatus ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-muted text-muted-foreground'}`}>
                        {p.freelancerUserStatus ? '🟢 Available' : '⚫ Offline'}
                      </Badge>
                    </div>

                    {/* Experience Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" /> {p.experienceYears} yrs exp
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-3.5 w-3.5" /> {freelancingExpLabel[p.anyFreelnacingExperience] || 'N/A'} freelancing
                      </span>
                      {p.country && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {p.country}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {skills.slice(0, 6).map((skill, si) => (
                          <Badge key={si} className="bg-primary/10 text-primary border-primary/20 text-[11px] px-2 py-0.5 font-normal">{skill}</Badge>
                        ))}
                        {secondarySkills.slice(0, 3).map((skill, si) => (
                          <Badge key={`s-${si}`} variant="secondary" className="text-[11px] px-2 py-0.5 font-normal">{skill}</Badge>
                        ))}
                        {skills.length + secondarySkills.length > 9 && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">+{skills.length + secondarySkills.length - 9} more</Badge>
                        )}
                      </div>
                    )}

                    {/* Languages */}
                    {languages.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Languages className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">{languages.join(', ')}</span>
                      </div>
                    )}

                    {/* Bottom Row: Rate, Hours, Weekends, Demo Button */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 pt-3 border-t border-border text-sm">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        {p.hourRate && (
                          <span className="font-semibold text-foreground flex items-center gap-1">
                            {symbol === '₹' ? <IndianRupee className="h-3.5 w-3.5 text-primary" /> : <DollarSign className="h-3.5 w-3.5 text-primary" />}
                            {p.hourRate}/hr
                          </span>
                        )}
                        {p.hoursAvailablePerDay && (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {p.hoursAvailablePerDay} hrs/day
                          </span>
                        )}
                        {p.isAvailbleInweeknds && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-green-500/30 text-green-600">
                            <Calendar className="h-3 w-3 mr-1" /> Weekends
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="gap-1.5 h-8 text-xs font-semibold"
                        onClick={() => handleDemoClick(p)}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Request Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="h-9 px-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'string' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="h-9 w-9 p-0"
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="h-9 px-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground ml-3">
            Page {currentPage} of {totalPages} ({filtered.length} results)
          </span>
        </div>
      )}

      {/* Demo Request Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Request a Demo
            </DialogTitle>
            <DialogDescription>
              Request a demo session with <span className="font-semibold text-foreground">{selectedFreelancer?.fullName}</span>. Our admin team will coordinate the process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Project Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. E-commerce Website Development"
                value={demoForm.projectTitle}
                onChange={e => setDemoForm(f => ({ ...f, projectTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description</Label>
              <Textarea
                placeholder="Briefly describe your project requirements..."
                value={demoForm.description}
                onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Budget</Label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={demoForm.clientBudget}
                  onChange={e => setDemoForm(f => ({ ...f, clientBudget: e.target.value }))}
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Contact Phone</Label>
                <Input
                  placeholder="Your phone number"
                  value={demoForm.contactPhone}
                  onChange={e => setDemoForm(f => ({ ...f, contactPhone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Contact Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={demoForm.contactEmail}
                onChange={e => setDemoForm(f => ({ ...f, contactEmail: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDemoOpen(false)} disabled={demoSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleDemoSubmit} disabled={demoSubmitting} className="gap-1.5">
                {demoSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <DashboardLayout userType="client">
      <Routes>
        <Route path="/" element={<ClientOverview />} />
        <Route path="/freelancers" element={<ClientOverview />} />
        <Route path="/history" element={<ClientOverview />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="/settings/*" element={<ClientOverview />} />
        <Route path="*" element={<ClientOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;
