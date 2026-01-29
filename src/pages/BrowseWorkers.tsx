import { useState, useEffect } from 'react';
import { Search, Filter, Users, Loader2, Phone, Mail, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkerProfile } from '@/types/profile';
import { getProfiles, searchProfiles } from '@/services/mockApi';
import { getMaskedProfile } from '@/services/freelancerApi';
import InterestForm from '@/components/InterestForm';

const BrowseWorkers = () => {
  const [profiles, setProfiles] = useState<WorkerProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get unique skills from all profiles
  const allSkills = [...new Set(profiles.flatMap(p => p.skills))].sort();
  
  useEffect(() => {
    loadProfiles();
  }, []);
  
  useEffect(() => {
    filterProfiles();
  }, [profiles, searchQuery, skillFilter]);
  
  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await getProfiles();
      // Mask contact info for privacy
      const maskedData = data.map(getMaskedProfile);
      setProfiles(maskedData);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterProfiles = async () => {
    let result = profiles;
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.aliasName.toLowerCase().includes(query) ||
        p.skills.some(s => s.toLowerCase().includes(query)) ||
        p.location.toLowerCase().includes(query)
      );
    }
    
    // Apply skill filter
    if (skillFilter !== 'all') {
      result = result.filter(p => 
        p.skills.some(s => s.toLowerCase() === skillFilter.toLowerCase())
      );
    }
    
    setFilteredProfiles(result);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleConnect = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setIsDialogOpen(true);
  };
  
  const handleWhatsAppContact = () => {
    // Replace with actual admin WhatsApp number
    const adminWhatsApp = '+1234567890';
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
  
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse IT Professionals</h1>
        <p className="text-muted-foreground">
          Find skilled professionals for your projects. Contact details are protected.
        </p>
      </div>
      
      {/* Stats */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Badge variant="outline" className="text-base py-2 px-4">
          <Users className="h-4 w-4 mr-2" />
          {profiles.length} Members
        </Badge>
        <Badge className="text-base py-2 px-4 bg-green-500/10 text-green-600 border-green-500/20">
          {availableCount} Available Now
        </Badge>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, or location..."
            value={searchQuery}
            onChange={handleSearch}
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
        
        <Button 
          variant="secondary" 
          className="gap-2"
          onClick={handleWhatsAppContact}
        >
          <ExternalLink className="h-4 w-4" />
          Contact Admin
        </Button>
      </div>
      
      {/* Results Info */}
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="outline" className="font-normal">
          {filteredProfiles.length} professional{filteredProfiles.length !== 1 ? 's' : ''} found
        </Badge>
        {skillFilter !== 'all' && (
          <Badge variant="secondary">
            Skill: {skillFilter}
          </Badge>
        )}
        {searchQuery && (
          <Badge variant="secondary">
            Search: "{searchQuery}"
          </Badge>
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
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{profile.aliasName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.companyAlias}</p>
                  </div>
                  <Badge 
                    className={
                      profile.availability === 'available' 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : profile.availability === 'busy'
                        ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        : 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                    }
                  >
                    {profile.availability}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {profile.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 4} more
                    </Badge>
                  )}
                </div>
                
                {/* Info */}
                <div className="space-y-2 text-sm">
                  <p><strong>Experience:</strong> {profile.experience}</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p><strong>Rate:</strong> {profile.hourlyRate}/hr</p>
                </div>
                
                {/* Masked Contact (shows xxxx) */}
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{profile.mobile}</span>
                  </div>
                </div>
                
                {/* Connect Button */}
                <Button 
                  className="w-full" 
                  onClick={() => handleConnect(profile)}
                >
                  Interested / Request Demo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Interest Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Connect with {selectedWorker?.aliasName}
            </DialogTitle>
          </DialogHeader>
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

export default BrowseWorkers;
