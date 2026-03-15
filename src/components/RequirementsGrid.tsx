import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Briefcase, DollarSign, Clock, Filter, Users,
  Sparkles, IndianRupee, Globe, Languages, ChevronDown, Heart
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
}

const RequirementsGrid = ({ variant = 'public', maxItems }: RequirementsGridProps) => {
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getClientRequirements();
        // Sort by recent first
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

  const filtered = requirements.filter(r => {
    const q = searchQuery.toLowerCase();
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
      toast({ title: 'Login Required', description: 'Please login to express interest in this requirement.' });
      navigate('/login');
      return;
    }
    setInterestDialog(req);
    setComment('');
  };

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
      toast({ title: '✅ Interest Submitted!', description: `You've expressed interest in "${interestDialog.title}".` });
      setInterestDialog(null);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit interest. Please try again.', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="border border-slate-700/50 animate-pulse bg-slate-900/50">
            <CardContent className="p-5">
              <div className="h-5 bg-slate-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
              <div className="h-3 bg-slate-700 rounded w-full mb-2" />
              <div className="h-3 bg-slate-700 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by skill, title, keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/80 border-slate-700/50 text-slate-200 placeholder:text-slate-500"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 border-slate-700/50 text-slate-300 hover:bg-slate-800"
        >
          <Filter className="h-4 w-4" /> Filters
          <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
        <Badge variant="outline" className="px-3 py-2 text-xs shrink-0 border-slate-700/50 text-slate-400 self-center">
          {filtered.length} requirements
        </Badge>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-3">
          <Select value={filterSkill} onValueChange={setFilterSkill}>
            <SelectTrigger className="w-48 bg-slate-900/80 border-slate-700/50 text-slate-300">
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {allSkills.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-48 bg-slate-900/80 border-slate-700/50 text-slate-300">
              <SelectValue placeholder="Filter by Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {allCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {(filterSkill || filterCountry) && (
            <Button variant="ghost" size="sm" onClick={() => { setFilterSkill(''); setFilterCountry(''); }} className="text-cyan-400 hover:text-cyan-300">
              Clear Filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Cards Grid */}
      {displayItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-20 w-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <Briefcase className="h-10 w-10 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Requirements Found</h3>
          <p className="text-slate-500 text-sm">Check back soon — new projects are posted daily!</p>
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
                <Card className="border border-slate-700/40 bg-gradient-to-br from-slate-900/90 to-slate-800/50 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all h-full group">
                  <CardContent className="p-5 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-slate-100 text-sm leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 flex-1">
                        {req.title}
                      </h3>
                      <Badge className={`shrink-0 text-[10px] ${
                        req.status?.toLowerCase() === 'open' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {req.status || 'Open'}
                      </Badge>
                    </div>

                    {/* Description */}
                    {req.description && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{req.description}</p>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {skills.slice(0, 4).map((skill, si) => (
                          <Badge key={si} className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[10px] px-1.5 py-0 font-normal">
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 4 && (
                          <Badge className="bg-slate-700/50 text-slate-400 text-[10px] px-1.5 py-0">+{skills.length - 4}</Badge>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-4 mt-auto">
                      {req.budget > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-slate-300">
                          <DollarSign className="h-3 w-3 text-cyan-400" /> {req.budget.toLocaleString()}
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
                      {req.language && (
                        <span className="flex items-center gap-1">
                          <Languages className="h-3 w-3" /> {req.language}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {getTimeAgo(req.createdOn)}
                      </span>
                      {isInterested ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[11px] gap-1">
                          <Heart className="h-3 w-3 fill-emerald-400" /> Interested
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleInterestClick(req)}
                          className="h-7 text-xs gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 shadow-sm"
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
        <DialogContent className="sm:max-w-md border-slate-700/50 bg-[#0D1B2E]">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Express Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <p className="text-sm font-medium text-cyan-400">{interestDialog?.title}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{interestDialog?.description}</p>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Add a comment (optional)</label>
              <Textarea
                placeholder="Why you're a great fit for this project..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="bg-slate-900/80 border-slate-700/50 text-slate-200 placeholder:text-slate-500"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSubmitInterest} disabled={submitting} className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0">
                {submitting ? 'Submitting...' : '🚀 Submit Interest'}
              </Button>
              <Button variant="outline" onClick={() => setInterestDialog(null)} className="border-slate-700/50 text-slate-300">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequirementsGrid;
