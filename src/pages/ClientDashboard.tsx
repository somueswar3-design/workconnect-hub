import { useState, useEffect } from 'react';
import { Loader2, Users, History } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getHiredFreelancers, getClientStats, HiredFreelancer, ClientStats } from '@/services/clientApi';
import ClientStatsCards from '@/components/ClientStatsCards';
import FreelancerGridTable from '@/components/FreelancerGridTable';
import DashboardLayout from '@/layouts/DashboardLayout';

const ClientDashboard = () => {
  const [freelancers, setFreelancers] = useState<HiredFreelancer[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [freelancersData, statsData] = await Promise.all([
        getHiredFreelancers(),
        getClientStats(),
      ]);
      setFreelancers(freelancersData);
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
  
  const activeFreelancers = freelancers.filter(f => f.status === 'active');
  const completedProjects = freelancers.filter(f => f.status === 'completed');
  
  if (isLoading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout userType="client">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
        </div>
        
        {/* Stats Row */}
        {stats && <ClientStatsCards stats={stats} />}
        
        {/* Freelancer Tables with Tabs */}
        <Card>
          <CardHeader className="py-3 px-4">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex items-center justify-between mb-3">
                <TabsList className="h-8">
                  <TabsTrigger value="active" className="text-xs px-3 gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Hired Freelancers
                    <Badge variant="secondary" className="ml-1 h-5 text-xs">{activeFreelancers.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs px-3 gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    Project History
                    <Badge variant="outline" className="ml-1 h-5 text-xs">{completedProjects.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active" className="mt-0">
                <FreelancerGridTable freelancers={activeFreelancers} title="Hired Freelancers" />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <FreelancerGridTable freelancers={completedProjects} title="Completed Projects" />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
