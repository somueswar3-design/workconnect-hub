import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2, Users, History } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getAssignedProjects, getFreelancerStats } from '@/services/freelancerApi';
import { AssignedProject, FreelancerStats } from '@/types/project';
import StatsCards from '@/components/StatsCards';
import ClientGridTable from '@/components/ClientGridTable';
import DashboardLayout from '@/layouts/DashboardLayout';
import ChangePassword from '@/pages/ChangePassword';

const FreelancerOverview = () => {
  const [projects, setProjects] = useState<AssignedProject[]>([]);
  const [stats, setStats] = useState<FreelancerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, statsData] = await Promise.all([getAssignedProjects(), getFreelancerStats()]);
      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </div>
      {stats && <StatsCards stats={stats} />}
      <Card>
        <CardHeader className="py-3 px-4">
          <Tabs defaultValue="engaged" className="w-full">
            <div className="flex items-center justify-between mb-3">
              <TabsList className="h-8">
                <TabsTrigger value="engaged" className="text-xs px-3 gap-1.5">
                  <Users className="h-3.5 w-3.5" />Engaged Clients
                  <Badge variant="secondary" className="ml-1 h-5 text-xs">{activeProjects.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs px-3 gap-1.5">
                  <History className="h-3.5 w-3.5" />History
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

const FreelancerDashboard = () => {
  return (
    <DashboardLayout userType="freelancer">
      <Routes>
        <Route path="/" element={<FreelancerOverview />} />
        <Route path="/clients" element={<FreelancerOverview />} />
        <Route path="/history" element={<FreelancerOverview />} />
        <Route path="/skills" element={<FreelancerOverview />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="/settings/*" element={<FreelancerOverview />} />
        <Route path="*" element={<FreelancerOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
