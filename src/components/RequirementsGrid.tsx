import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Briefcase, DollarSign, Clock, Filter, Globe, Languages, ChevronDown, Heart, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getClientRequirements, ClientRequirementResponse } from '@/services/clientApi';
import { submitFreelancerInterest } from '@/services/freelancerApi';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface RequirementsGridProps {
  variant?: 'public' | 'freelancer';
  maxItems?: number;
  theme?: 'light' | 'dark';
  externalSearch?: string;
  hideFilters?: boolean;
}

const RequirementsGrid = ({ variant = 'public', maxItems, theme = 'dark', externalSearch = '', hideFilters = false }: RequirementsGridProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<ClientRequirementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [interestDialog, setInterestDialog] = useState<ClientRequirementResponse | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [interestedIds, setInterestedIds] = useState<Set<number>>(new Set());

  const isLight = theme === 'light';
  const showFilterUI = !hideFilters;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getClientRequirements();
        const sorted = data.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
        setRequirements(sorted);
      } catch (err) {
        console.error('Failed to load requirements:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const allSkills = Array.from(new Set(
    requirements.flatMap(r => r.skillsRequired?.split(',').map(s => s.trim()).filter(Boolean) || [])
  ));
  const allCountries = Array.from(new Set(requirements.map(r => r.country).filter(Boolean)));

  const combinedSearch = externalSearch || searchQuery;

  const filtered = requirements.filter(r => {
    const q = combinedSearch.toLowerCase();
    const matchesSearch = !q ||
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.skillsRequired?.toLowerCase().includes(q);
    const matchesSkill = !filterSkill || r.skillsRequired?.toLowerCase().includes(filterSkill.toLowerCase());
    const matchesCountry = !filterCountry || r.country?.toLowerCase() === filterCountry.toLowerCase();
    return matchesSearch && matchesSkill && matchesCountry;
  });

  const displayItems = maxItems ? filtered.slice(0, maxItems) : filtered;

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleInterestClick = (req: ClientRequirementResponse) => {
    if (!isAuthenticated) {
      toast({ title: 'Login Required', description: 'Please create an account or login to express interest.' });
      navigate('/register?role=FreeLancer');
      return;
    }
    setInterestDialog(req);
    setComment('');
  };

  const [successPopup, setSuccessPopup] = useState<string | null>(null);

  const handleSubmitInterest = async () => {
    if (!interestDialog || !user?.userId) return;
    setSubmitting(true);
    try {
      await submitFreelancerInterest({
        id: 0,
        requirementId: interestDialog.id,
        freelancerUserId: Number(user.userId) || 0,
        comment: comment || '',
        status: 'Interested',
        createdOn: new Date().toISOString(),
      });
      setInterestedIds(prev => new Set(prev).add(interestDialog.id));
      setInterestDialog(null);
      setSuccessPopup(interestDialog.title);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit interest. Please try again.', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className={`animate-pulse ${isLight ? 'border-gray-200 bg-gray-50' : 'border-slate-700/50 bg-slate-900/50'}`}>
            <CardContent className="p-5">
              <div className={`h-5 rounded w-3/4 mb-3 ${isLight ? 'bg-gray-200' : 'bg-slate-700'}`} />
              <div className={`h-4 rounded w-1/2 mb-4 ${isLight ? 'bg-gray-200' : 'bg-slate-700'}`} />
              <div className={`h-3 rounded w-full mb-2 ${isLight ? 'bg-gray-200' : 'bg-slate-700'}`} />
              <div className={`h-3 rounded w-2/3 ${isLight ? 'bg-gray-200' : 'bg-slate-700'}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters - only show when not hidden */}
      {showFilterUI && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-gray-400' : 'text-slate-500'}`} />
              <Input
                placeholder="Search by skill, title, keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`pl-10 ${isLight ? 'bg-white border-gray-200 text-gray-800 placeholder:text-gray-400' : 'bg-slate-900/80 border-slate-700/50 text-slate-200 placeholder:text-slate-500'}`}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 ${isLight ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-slate-700/50 text-slate-300 hover:bg-slate-800'}`}
            >
              <Filter className="h-4 w-4" /> Filters
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            <Badge variant="outline" className={`px-3 py-2 text-xs shrink-0 self-center ${isLight ? 'border-gray-200 text-gray-500' : 'border-slate-700/50 text-slate-400'}`}>
              {filtered.length} requirements
            </Badge>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-3">
              <Select value={filterSkill || 'all'} onValueChange={v => setFilterSkill(v === 'all' ? '' : v)}>
                <SelectTrigger className={`w-48 ${isLight ? 'bg-white border-gray-200 text-gray-700' : 'bg-slate-900/80 border-slate-700/50 text-slate-300'}`}>
                  <SelectValue placeholder="Filter by Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterCountry || 'all'} onValueChange={v => setFilterCountry(v === 'all' ? '' : v)}>
                <SelectTrigger className={`w-48 ${isLight ? 'bg-white border-gray-200 text-gray-700' : 'bg-slate-900/80 border-slate-700/50 text-slate-300'}`}>
                  <SelectValue placeholder="Filter by Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {allCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filterSkill || filterCountry) && (
                <Button variant="ghost" size="sm" onClick={() => { setFilterSkill(''); setFilterCountry(''); }} className={isLight ? 'text-emerald-600 hover:text-emerald-700' : 'text-cyan-400 hover:text-cyan-300'}>
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* Show active search indicator when using external search */}
      {externalSearch && (
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1">
            <Search className="h-3 w-3" /> Showing results for "{externalSearch}"
          </Badge>
          <span className="text-xs text-gray-400">{filtered.length} found</span>
        </div>
      )}

      {/* Cards Grid */}
      {displayItems.length === 0 ? (
        <div className="text-center py-16">
          <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isLight ? 'bg-gray-100' : 'bg-slate-800'}`}>
            <Briefcase className={`h-10 w-10 ${isLight ? 'text-gray-400' : 'text-slate-500'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>No Requirements Found</h3>
          <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-slate-500'}`}>Check back soon — new projects are posted daily!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((req, idx) => {
            const skills = req.skillsRequired?.split(',').map(s => s.trim()).filter(Boolean) || [];
            const isInterested = interestedIds.has(req.id);
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className={`transition-all h-full group ${
                  isLight
                    ? 'bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg'
                    : 'border border-slate-700/40 bg-gradient-to-br from-slate-900/90 to-slate-800/50 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5'
                }`}>
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className={`font-semibold text-sm leading-snug transition-colors line-clamp-2 flex-1 ${
                        isLight ? 'text-gray-900 group-hover:text-emerald-600' : 'text-slate-100 group-hover:text-cyan-400'
                      }`}>
                        {req.title}
                      </h3>
                      <Badge className={`shrink-0 text-[10px] ${
                        req.status?.toLowerCase() === 'open'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : isLight ? 'bg-gray-100 text-gray-500' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {req.status || 'Open'}
                      </Badge>
                    </div>

                    {req.description && (
                      <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{req.description}</p>
                    )}

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {skills.slice(0, 4).map((skill, si) => (
                          <Badge key={si} className={`text-[10px] px-1.5 py-0 font-normal ${
                            isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                          }`}>
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 4 && (
                          <Badge className={`text-[10px] px-1.5 py-0 ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-slate-700/50 text-slate-400'}`}>+{skills.length - 4}</Badge>
                        )}
                      </div>
                    )}

                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] mb-4 mt-auto ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>
                      {req.budget > 0 && (
                        <span className={`flex items-center gap-1 font-semibold ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>
                          <DollarSign className={`h-3 w-3 ${isLight ? 'text-emerald-500' : 'text-cyan-400'}`} /> {req.budget.toLocaleString()}
                        </span>
                      )}
                      {req.minExperience > 0 && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {req.minExperience}+ yrs
                        </span>
                      )}
                      {req.country && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {req.country}
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-gray-100' : 'border-slate-700/40'}`}>
                      <span className={`text-[10px] flex items-center gap-1 ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>
                        <Clock className="h-3 w-3" /> {getTimeAgo(req.createdOn)}
                      </span>
                      {isInterested ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[11px] gap-1">
                          <Heart className="h-3 w-3 fill-emerald-500" /> Interested
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleInterestClick(req)}
                          className="h-7 text-xs gap-1 bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm"
                        >
                          <Heart className="h-3 w-3" /> I'm Interested
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Interest Dialog */}
      <Dialog open={!!interestDialog} onOpenChange={() => setInterestDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-700">{interestDialog?.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{interestDialog?.description}</p>
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Add a comment (optional)</label>
              <Textarea
                placeholder="Why you're a great fit for this project..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSubmitInterest} disabled={submitting} className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                {submitting ? 'Submitting...' : '🚀 Submit Interest'}
              </Button>
              <Button variant="outline" onClick={() => setInterestDialog(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={!!successPopup} onOpenChange={() => setSuccessPopup(null)}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex flex-col items-center py-4 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center"
            >
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900">Interest Submitted! 🎉</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You've successfully expressed interest in <span className="font-semibold text-gray-700">"{successPopup}"</span>. The client will review your profile and get back to you soon.
            </p>
            <Button onClick={() => setSuccessPopup(null)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequirementsGrid;
