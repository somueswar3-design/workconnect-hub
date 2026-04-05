import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, IndianRupee, DollarSign, Calendar, Clock, MapPin, Languages,
  Briefcase, Award, Eye, Video, ExternalLink, MessageCircle, Bell
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  getFreelancerInterests,
  getFreelancerDemoRequests,
  FreelancerInterestResponseDto,
  FreelancerDemoRequestDto,
} from '@/services/freelancerApi';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const FreelancerMyRequests = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState<FreelancerInterestResponseDto[]>([]);
  const [demoRequests, setDemoRequests] = useState<FreelancerDemoRequestDto[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(true);
  const [demosLoading, setDemosLoading] = useState(true);
  const [tab, setTab] = useState('interests');
  const [selectedInterest, setSelectedInterest] = useState<FreelancerInterestResponseDto | null>(null);

  useEffect(() => {
    const userId = user?.userId || '';
    getFreelancerInterests(userId)
      .then(i => setInterests(Array.isArray(i) ? i : []))
      .catch(() => setInterests([]))
      .finally(() => setInterestsLoading(false));

    getFreelancerDemoRequests(userId)
      .then(d => setDemoRequests(Array.isArray(d) ? d : []))
      .catch(() => setDemoRequests([]))
      .finally(() => setDemosLoading(false));
  }, [user?.userId]);

  const getCurrencySymbol = (currency?: string) => {
    if (!currency) return '$';
    const c = currency.toLowerCase();
    if (c.includes('india') || c.includes('inr') || c.includes('rupee')) return '₹';
    if (c.includes('eur')) return '€';
    if (c.includes('gbp') || c.includes('pound')) return '£';
    return '$';
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'interested' || s === 'pending') return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20';
    if (s === 'accepted' || s === 'approved' || s === 'confirmed') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
    if (s === 'rejected' || s === 'declined') return 'bg-red-500/15 text-red-300 border-red-500/20';
    if (s === 'scheduled') return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20';
    return 'bg-slate-700 text-slate-300';
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Target className="h-6 w-6 text-indigo-400" /> My Requests
        </h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="interests" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 text-slate-400">
            My Interests <Badge variant="outline" className="ml-2 border-slate-700/50 text-slate-400 text-[10px] px-1.5">{interests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="demos" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-slate-400">
            Scheduled Demos <Badge variant="outline" className="ml-2 border-slate-700/50 text-slate-400 text-[10px] px-1.5">{demoRequests.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* My Interests Tab */}
        <TabsContent value="interests" className="mt-4">
          {interestsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border border-slate-700/50 animate-pulse bg-[#0D1B2E]">
                  <CardContent className="p-5"><div className="h-5 bg-slate-700 rounded w-2/3 mb-3" /><div className="h-4 bg-slate-700 rounded w-1/3 mb-4" /><div className="h-3 bg-slate-700 rounded w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : interests.length === 0 ? (
            <Card className="border border-slate-700/50 bg-[#0D1B2E]">
              <CardContent className="py-14 text-center space-y-3">
                <Target className="h-12 w-12 mx-auto text-slate-600" />
                <h3 className="text-base font-medium text-slate-300">No interests submitted yet</h3>
                <p className="text-sm text-slate-500">Express interest in job openings from the dashboard to see them here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {interests.map((interest, idx) => (
                <motion.div key={interest.interestId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedInterest(interest)} className="cursor-pointer">
                  <Card className="border border-slate-700/50 hover:border-indigo-500/30 transition-all bg-[#0D1B2E] hover:shadow-indigo-500/10 hover:shadow-lg">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-100 text-base">{interest.requirement?.title || `Requirement #${interest.requirementId}`}</h3>
                          {interest.requirement?.description && (
                            <p className="text-sm text-slate-400 mt-1 leading-relaxed line-clamp-2">{interest.requirement.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <Badge className={`text-[11px] ${getStatusColor(interest.status)}`}>{interest.status}</Badge>
                          {interest.requirement?.status && (
                            <Badge variant="outline" className="text-[10px] border-slate-700/50 text-slate-500">{interest.requirement.status}</Badge>
                          )}
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {interest.requirement?.budget !== undefined && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <IndianRupee className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            <span className="text-slate-300 truncate">{interest.requirement.budget.toLocaleString()}</span>
                          </div>
                        )}
                        {interest.requirement?.minExperience !== undefined && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <Award className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                            <span className="text-slate-300 truncate">{interest.requirement.minExperience}+ yrs</span>
                          </div>
                        )}
                        {interest.requirement?.country && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="text-slate-300 truncate">{interest.requirement.country}</span>
                          </div>
                        )}
                        {interest.requirement?.language && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <Languages className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                            <span className="text-slate-300 truncate">{interest.requirement.language}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {interest.requirement?.skillsRequired && (
                        <div className="flex flex-wrap gap-1.5">
                          {interest.requirement.skillsRequired.split(',').map((skill, si) => (
                            <Badge key={si} className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[11px] px-2 py-0.5 font-normal">{skill.trim()}</Badge>
                          ))}
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-slate-700/50 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Applied: {new Date(interest.createdOn).toLocaleDateString()} {new Date(interest.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {interest.requirement?.createdOn && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Posted: {new Date(interest.requirement.createdOn).toLocaleDateString()}</span>
                        )}
                        <Eye className="h-3.5 w-3.5 ml-auto text-slate-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Scheduled Demos Tab */}
        <TabsContent value="demos" className="mt-4">
          {demosLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <Card key={i} className="border border-slate-700/50 animate-pulse bg-[#0D1B2E]">
                  <CardContent className="p-5"><div className="h-5 bg-slate-700 rounded w-2/3 mb-3" /><div className="h-4 bg-slate-700 rounded w-1/3" /></CardContent>
                </Card>
              ))}
            </div>
          ) : demoRequests.length === 0 ? (
            <Card className="border border-slate-700/50 bg-[#0D1B2E]">
              <CardContent className="py-14 text-center space-y-3">
                <Video className="h-12 w-12 mx-auto text-slate-600" />
                <h3 className="text-base font-medium text-slate-300">No demos scheduled yet</h3>
                <p className="text-sm text-slate-500">When admin assigns you a demo to connect with a client, it will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {demoRequests.map((demo, idx) => (
                <motion.div key={demo.demoId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="border border-slate-700/50 hover:border-cyan-500/30 transition-all bg-[#0D1B2E] hover:shadow-cyan-500/10 hover:shadow-lg">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-100 text-base">{demo.projectTitle}</h3>
                          <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> Client: {demo.clientName}</p>
                        </div>
                        <Badge className={`text-[11px] ${getStatusColor(demo.status)}`}>{demo.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {demo.budget !== undefined && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <DollarSign className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            <span className="text-slate-300">Budget: {demo.budget.toLocaleString()}</span>
                          </div>
                        )}
                        {demo.scheduledDate && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="text-slate-300">{new Date(demo.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {demo.scheduledTime && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/50 text-sm">
                            <Clock className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                            <span className="text-slate-300">{demo.scheduledTime} {demo.timezone || ''}</span>
                          </div>
                        )}
                      </div>

                      {demo.demoMeetingLink && (
                        <a href={demo.demoMeetingLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                            <ExternalLink className="h-3.5 w-3.5" /> Join Meeting
                          </Button>
                        </a>
                      )}

                      {demo.adminComments && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
                          <MessageCircle className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-slate-400 leading-relaxed">{demo.adminComments}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Requested: {new Date(demo.requestedOn).toLocaleDateString()} {new Date(demo.requestedOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Interest Detail Dialog */}
      <Dialog open={!!selectedInterest} onOpenChange={(open) => !open && setSelectedInterest(null)}>
        <DialogContent className="sm:max-w-lg border-slate-700/50 bg-[#0D1B2E] p-0 overflow-hidden" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Interest Details</DialogTitle>
          {selectedInterest && (
            <>
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500" />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-100">{selectedInterest.requirement?.title}</h2>
                  <Badge className={`${getStatusColor(selectedInterest.status)}`}>{selectedInterest.status}</Badge>
                </div>
                {selectedInterest.requirement?.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedInterest.requirement.description}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {selectedInterest.requirement?.budget !== undefined && (
                    <div className="p-3 rounded-lg bg-slate-800/50 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Budget</p>
                      <p className="text-sm font-semibold text-slate-200">{selectedInterest.requirement.budget.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedInterest.requirement?.minExperience !== undefined && (
                    <div className="p-3 rounded-lg bg-slate-800/50 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Experience</p>
                      <p className="text-sm font-semibold text-slate-200">{selectedInterest.requirement.minExperience}+ years</p>
                    </div>
                  )}
                  {selectedInterest.requirement?.country && (
                    <div className="p-3 rounded-lg bg-slate-800/50 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Country</p>
                      <p className="text-sm font-semibold text-slate-200">{selectedInterest.requirement.country}</p>
                    </div>
                  )}
                  {selectedInterest.requirement?.language && (
                    <div className="p-3 rounded-lg bg-slate-800/50 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Language</p>
                      <p className="text-sm font-semibold text-slate-200">{selectedInterest.requirement.language}</p>
                    </div>
                  )}
                </div>
                {selectedInterest.requirement?.skillsRequired && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterest.requirement.skillsRequired.split(',').map((s, i) => (
                        <Badge key={i} className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[11px]">{s.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-700/50 text-xs text-slate-500 space-y-1">
                  <p>Applied: {new Date(selectedInterest.createdOn).toLocaleString()}</p>
                  {selectedInterest.requirement?.createdOn && <p>Posted: {new Date(selectedInterest.requirement.createdOn).toLocaleString()}</p>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreelancerMyRequests;
