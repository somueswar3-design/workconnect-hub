import { useState, useEffect } from 'react';
import { 
  Power,
  PowerOff,
  LogOut,
  Loader2,
  Users,
  CheckCircle2,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getAssignedProjects, getFreelancerStats, updateFreelancerStatus } from '@/services/freelancerApi';
import { AssignedProject, FreelancerStats } from '@/types/project';
import StatsCards from '@/components/StatsCards';
import ClientGridTable from '@/components/ClientGridTable';
import { useNavigate } from 'react-router-dom';

const FreelancerDashboard = () => {
  const [projects, setProjects] = useState<AssignedProject[]>([]);
  const [stats, setStats] = useState<FreelancerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, statsData] = await Promise.all([
        getAssignedProjects(),
        getFreelancerStats(),
      ]);
      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusToggle = async () => {
    setIsUpdatingStatus(true);
    try {
      const newStatus = !isActive;
      const result = await updateFreelancerStatus(newStatus);
      if (result.success) {
        setIsActive(newStatus);
        toast({
          title: newStatus ? 'Active' : 'Inactive',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const handleLogout = () => {
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/');
  };
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        
        <div className="flex items-center gap-3">
          {/* Status Toggle - Compact */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border text-sm">
            {isActive ? (
              <Power className="h-4 w-4 text-green-500" />
            ) : (
              <PowerOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={isActive ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
              disabled={isUpdatingStatus}
              className="scale-90"
            />
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Stats Row - Compact */}
      {stats && <StatsCards stats={stats} />}
      
      {/* Client Tables with Tabs */}
      <Card>
        <CardHeader className="py-3 px-4">
          <Tabs defaultValue="engaged" className="w-full">
            <div className="flex items-center justify-between mb-3">
              <TabsList className="h-8">
                <TabsTrigger value="engaged" className="text-xs px-3 gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Engaged Clients
                  <Badge variant="secondary" className="ml-1 h-5 text-xs">{activeProjects.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs px-3 gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  History
                  <Badge variant="outline" className="ml-1 h-5 text-xs">{completedProjects.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="engaged" className="mt-0">
              <ClientGridTable projects={activeProjects} title="Engaged Clients" />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <ClientGridTable projects={completedProjects} title="Completed Projects" />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default FreelancerDashboard;
