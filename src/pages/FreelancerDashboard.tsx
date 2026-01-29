import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Power,
  PowerOff,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getAssignedProjects, getFreelancerStats, updateFreelancerStatus } from '@/services/freelancerApi';
import { AssignedProject, FreelancerStats } from '@/types/project';
import ProjectCard from '@/components/ProjectCard';
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
          title: newStatus ? 'Active Mode' : 'Inactive Mode',
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
    <div className="container py-8">
      {/* Header with Status Toggle */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your projects and track earnings
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
            {isActive ? (
              <Power className="h-5 w-5 text-green-500" />
            ) : (
              <PowerOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-muted-foreground">
                {isActive ? 'Accepting work' : 'Not available'}
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
              disabled={isUpdatingStatus}
            />
          </div>
          
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${stats.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settled Amount</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.settledAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Received payments
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${stats.pendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${
                      star <= Math.round(stats.averageRating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Earnings Summary */}
      {stats && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Earnings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Payment Progress</span>
                <span className="font-medium">
                  {Math.round((stats.settledAmount / stats.totalEarnings) * 100)}% Settled
                </span>
              </div>
              <Progress 
                value={(stats.settledAmount / stats.totalEarnings) * 100} 
                className="h-3"
              />
              <div className="grid grid-cols-3 gap-4 text-center pt-4">
                <div>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedProjects}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalClients}</p>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Active Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Projects
          </h2>
          <Badge variant="outline">{activeProjects.length} active</Badge>
        </div>
        
        {activeProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No active projects</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-8" />
      
      {/* Completed Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Completed Projects
          </h2>
          <Badge variant="secondary">{completedProjects.length} completed</Badge>
        </div>
        
        {completedProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No completed projects yet</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
