import { useState, useEffect } from 'react';
import { Search, Filter, Users, UserCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WorkerCard from '@/components/WorkerCard';
import { WorkerProfile } from '@/types/profile';
import { getProfiles, searchProfiles } from '@/services/mockApi';

const Dashboard = () => {
  const [profiles, setProfiles] = useState<WorkerProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    loadProfiles();
  }, []);
  
  useEffect(() => {
    filterProfiles();
  }, [profiles, searchQuery, statusFilter]);
  
  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await getProfiles();
      setProfiles(data);
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
      result = await searchProfiles(searchQuery);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.availability === statusFilter);
    }
    
    setFilteredProfiles(result);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const availableCount = profiles.filter(p => p.availability === 'available').length;
  const busyCount = profiles.filter(p => p.availability === 'busy').length;
  const offlineCount = profiles.filter(p => p.availability === 'offline').length;
  
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
        <p className="text-muted-foreground">
          Find available IT professionals ready to help with your projects
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid gap-4 mb-8 sm:grid-cols-3">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <UserCheck className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{availableCount}</p>
            <p className="text-sm text-muted-foreground">Available Now</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
            <Users className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{busyCount}</p>
            <p className="text-sm text-muted-foreground">Currently Busy</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500/10">
            <Users className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{offlineCount}</p>
            <p className="text-sm text-muted-foreground">Offline</p>
          </div>
        </div>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workers</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Results Info */}
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="outline" className="font-normal">
          {filteredProfiles.length} worker{filteredProfiles.length !== 1 ? 's' : ''} found
        </Badge>
        {statusFilter !== 'all' && (
          <Badge variant="secondary" className="capitalize">
            {statusFilter}
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
          <h3 className="text-lg font-medium mb-2">No workers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <WorkerCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
