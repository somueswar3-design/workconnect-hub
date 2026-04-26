import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Users, Loader2, Star, MapPin, Briefcase, X, Grid3x3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { WorkerProfile } from '@/types/profile';
import {
  searchFreelancers,
  getAllSkills,
  getEmploymentType,
  getRating,
  getExperienceLevel,
} from '@/services/mockFreelancerData';
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

const PAGE_SIZE = 12;


const EMPLOYMENT_OPTIONS = [
  { id: 'full-time', label: 'Full-time' },
  { id: 'part-time', label: 'Part-time' },
  { id: 'hourly', label: 'Hourly / Contract' },
  { id: 'project', label: 'Project-based' },
];

const EXPERIENCE_OPTIONS = [
  { id: 'entry', label: 'Entry Level' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'expert', label: 'Expert' },
];

const BrowseWorkers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Filters
  const [rateRange, setRateRange] = useState<[number, number]>([15, 150]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [availableNow, setAvailableNow] = useState(false);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('best');

  const { toast } = useToast();
  const allSkills = useMemo(() => getAllSkills(), []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, skillFilter, rateRange, employmentTypes, availableNow, experienceLevels]);

  const { profiles, total, totalPages } = useMemo(() => {
    if (isLoading) return { profiles: [], total: 0, totalPages: 0 };
    return searchFreelancers({
      query: searchQuery,
      skill: skillFilter,
      minRate: rateRange[0],
      maxRate: rateRange[1],
      employmentTypes,
      availability: availableNow ? ['available'] : undefined,
      experienceLevels,
      page: currentPage,
      pageSize: PAGE_SIZE,
    });
  }, [searchQuery, skillFilter, rateRange, employmentTypes, availableNow, experienceLevels, currentPage, isLoading]);

  const handleHireNow = (profile: WorkerProfile) => {
    toast({
      title: '🎉 Request received!',
      description: `We've noted your interest in ${profile.aliasName}. Our team will arrange a free demo and contact you shortly.`,
    });
  };

  const toggleArr = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSkillFilter('all');
    setRateRange([15, 150]);
    setEmploymentTypes([]);
    setAvailableNow(false);
    setExperienceLevels([]);
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (skillFilter !== 'all' ? 1 : 0) +
    (rateRange[0] !== 15 || rateRange[1] !== 150 ? 1 : 0) +
    employmentTypes.length +
    (availableNow ? 1 : 0) +
    experienceLevels.length;

  const CurrentIcon = promoSlides[currentSlide].icon;

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
    <div className="min-h-screen bg-slate-50">
      <div className="container py-6">
        {/* Page heading */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Browse Freelancers</h1>
          <p className="text-sm text-slate-500 mt-1">Find the right professional and request a free demo — our team handles the rest.</p>
        </div>

        {/* Search bar */}
        <div className="mb-5 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search freelancers by name, skill, location…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* ─── Filters Sidebar ─── */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-orange-100 text-orange-600 border-0 text-[10px] h-5">{activeFilterCount}</Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-orange-500 hover:text-orange-600"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Hourly Rate */}
              <FilterSection title="💰 Hourly Rate">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Min</span>
                  <span className="font-semibold text-slate-900">${rateRange[0]}</span>
                  <span>Max</span>
                  <span className="font-semibold text-slate-900">${rateRange[1]}</span>
                </div>
                <Slider
                  value={rateRange}
                  onValueChange={v => setRateRange([v[0], v[1]] as [number, number])}
                  min={5}
                  max={300}
                  step={5}
                  className="my-3"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { l: 'Under $30', r: [5, 30] },
                    { l: '$15–$80', r: [15, 80] },
                    { l: '$50–$150', r: [50, 150] },
                    { l: '$100+', r: [100, 300] },
                  ].map(p => {
                    const active = rateRange[0] === p.r[0] && rateRange[1] === p.r[1];
                    return (
                      <button
                        key={p.l}
                        onClick={() => setRateRange([p.r[0], p.r[1]] as [number, number])}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-orange-50 border-orange-400 text-orange-600'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {p.l}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Employment Type */}
              <FilterSection title="💼 Employment Type">
                <div className="space-y-2.5">
                  {EMPLOYMENT_OPTIONS.map(opt => (
                    <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <Checkbox
                        checked={employmentTypes.includes(opt.id)}
                        onCheckedChange={() => setEmploymentTypes(toggleArr(employmentTypes, opt.id))}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Availability */}
              <FilterSection title="🟢 Availability">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-700">Available now</span>
                  <Switch
                    checked={availableNow}
                    onCheckedChange={setAvailableNow}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </label>
              </FilterSection>

              {/* Experience */}
              <FilterSection title="🎓 Experience Level" last>
                <div className="space-y-2.5">
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <Checkbox
                        checked={experienceLevels.includes(opt.id)}
                        onCheckedChange={() => setExperienceLevels(toggleArr(experienceLevels, opt.id))}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Skill quick filter */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Skills
              </h3>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSkillFilter('all')}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    skillFilter === 'all'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  All
                </button>
                {allSkills.slice(0, 30).map(s => (
                  <button
                    key={s}
                    onClick={() => setSkillFilter(s)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      skillFilter === s
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ─── Results ─── */}
          <main>
            {/* Active filters chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-500 self-center">Active filters:</span>
                {searchQuery && (
                  <ActiveChip label={`"${searchQuery}"`} onClear={() => setSearchQuery('')} />
                )}
                {skillFilter !== 'all' && (
                  <ActiveChip label={skillFilter} onClear={() => setSkillFilter('all')} />
                )}
                {(rateRange[0] !== 15 || rateRange[1] !== 150) && (
                  <ActiveChip label={`$${rateRange[0]}–$${rateRange[1]}/hr`} onClear={() => setRateRange([15, 150])} />
                )}
                {employmentTypes.map(t => (
                  <ActiveChip key={t} label={t} onClear={() => setEmploymentTypes(employmentTypes.filter(x => x !== t))} />
                ))}
                {availableNow && <ActiveChip label="Available now" onClear={() => setAvailableNow(false)} />}
                {experienceLevels.map(t => (
                  <ActiveChip key={t} label={t} onClear={() => setExperienceLevels(experienceLevels.filter(x => x !== t))} />
                ))}
                <button onClick={clearAllFilters} className="text-xs font-medium text-orange-500 hover:text-orange-600 ml-auto self-center">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Results bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{total.toLocaleString()}</span> freelancers found
              </p>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                  >
                    <option value="best">Best Match</option>
                    <option value="rate-low">Rate: Low to High</option>
                    <option value="rate-high">Rate: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded ${view === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-slate-400'}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded ${view === 'list' ? 'bg-orange-50 text-orange-600' : 'text-slate-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No freelancers found</h3>
                <p className="text-sm text-slate-500 mb-4">Try adjusting your filters</p>
                <Button onClick={clearAllFilters} variant="outline">Clear filters</Button>
              </div>
            ) : (
              <>
                <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
                  {profiles.map(p => (
                    <FreelancerCard key={p.id} profile={p} onHire={handleHireNow} compact={view === 'list'} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {getPageNumbers().map((pg, idx) =>
                          pg === 'ellipsis' ? (
                            <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                          ) : (
                            <PaginationItem key={pg}>
                              <PaginationLink
                                isActive={pg === currentPage}
                                onClick={() => setCurrentPage(pg)}
                                className={`cursor-pointer ${pg === currentPage ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:text-white' : ''}`}
                              >
                                {pg}
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
          </main>
        </div>
      </div>
    </div>
  );
};

/* ─── Filter section wrapper ─── */
const FilterSection = ({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) => (
  <div className={`py-4 ${last ? '' : 'border-b border-slate-100'}`}>
    <h4 className="text-sm font-semibold text-slate-900 mb-3">{title}</h4>
    {children}
  </div>
);

/* ─── Active filter chip ─── */
const ActiveChip = ({ label, onClear }: { label: string; onClear: () => void }) => (
  <button
    onClick={onClear}
    className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-100"
  >
    {label}
    <X className="h-3 w-3" />
  </button>
);

/* ─── Freelancer Card (Hire Now style) ─── */
const FreelancerCard = ({
  profile,
  onHire,
  compact,
}: {
  profile: WorkerProfile;
  onHire: (p: WorkerProfile) => void;
  compact?: boolean;
}) => {
  const initials = profile.aliasName.replace(/[0-9]/g, '').slice(0, 2).toUpperCase();
  const { rating, reviews } = getRating(profile.id);
  const employmentType = getEmploymentType(profile.id);
  const expLevel = getExperienceLevel(profile.experience);

  // Deterministic avatar color
  const colors = [
    'bg-orange-500', 'bg-purple-500', 'bg-blue-500', 'bg-emerald-600',
    'bg-rose-500', 'bg-teal-600', 'bg-indigo-500', 'bg-amber-600',
  ];
  const color = colors[parseInt(profile.id, 10) % colors.length];

  const isOnline = profile.availability === 'available';
  const isTopRated = rating >= 4.7;
  const isNew = parseInt(profile.id, 10) % 11 === 0;

  return (
    <Card className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-200 overflow-hidden">
      <CardContent className="p-5">
        {/* Header: avatar + name */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`relative flex-shrink-0 w-14 h-14 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
            {initials}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">{profile.aliasName}</h3>
            <p className="text-xs text-slate-500 truncate">{profile.companyAlias}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-900 ml-1">{rating.toFixed(1)}</span>
              <span className="text-[11px] text-slate-400">({reviews})</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {isTopRated && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-700 tracking-wide">
              Top Rated
            </span>
          )}
          {isNew && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-violet-100 text-violet-700 tracking-wide">
              New
            </span>
          )}
          {isOnline && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 tracking-wide">
              Online
            </span>
          )}
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 tracking-wide flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" />
            {profile.location}
          </span>
        </div>

        {/* Skills */}
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.skills.slice(0, 3).map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                {s}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 font-medium">
                +{profile.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer: rate + Hire Now */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <p className="text-lg font-bold text-slate-900 leading-none">
              {profile.hourlyRate}<span className="text-xs font-medium text-slate-500">/hr</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 capitalize flex items-center gap-1">
              <Briefcase className="h-2.5 w-2.5" />
              {employmentType}
            </p>
          </div>
          <Button
            onClick={() => onHire(profile)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 h-9 rounded-lg shadow-sm"
          >
            Hire Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowseWorkers;
