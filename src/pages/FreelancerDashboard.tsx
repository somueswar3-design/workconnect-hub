import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2, Users, History, TrendingUp, Wallet, Star, Briefcase, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getAssignedProjects, getFreelancerStats } from '@/services/freelancerApi';
import { AssignedProject, FreelancerStats } from '@/types/project';
import FreelancerProfileCard from '@/components/FreelancerProfileCard';
import WorkHistoryTimeline from '@/components/WorkHistoryTimeline';
import ClientGridTable from '@/components/ClientGridTable';
import DashboardLayout from '@/layouts/DashboardLayout';
import ChangePassword from '@/pages/ChangePassword';

const ColorfulStatsCards = ({ stats }: { stats: FreelancerStats }) => {
  const cards = [
    {
      label: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-primary to-primary/70',
      change: '+12%',
      up: true,
    },
    {
      label: 'Settled Amount',
      value: `$${stats.settledAmount.toLocaleString()}`,
      icon: Wallet,
      gradient: 'from-emerald-500 to-emerald-400',
      change: '+8%',
      up: true,
    },
    {
      label: 'Pending Amount',
      value: `$${stats.pendingAmount.toLocaleString()}`,
      icon: Wallet,
      gradient: 'from-amber-500 to-amber-400',
      change: '-5%',
      up: false,
    },
    {
      label: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      gradient: 'from-violet-500 to-violet-400',
      change: '4.8★',
      up: true,
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: Briefcase,
      gradient: 'from-cyan-500 to-cyan-400',
      change: `${stats.completedProjects} done`,
      up: true,
    },
    {
      label: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      gradient: 'from-rose-500 to-rose-400',
      change: 'All time',
      up: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(card => (
        <Card key={card.label} className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
          <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} text-primary-foreground`}>
                <card.icon className="h-4 w-4" />
              </div>
              <span className={`text-xs flex items-center gap-0.5 ${card.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                {card.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

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
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your work summary.</p>
        </div>
      </div>

      {/* Colorful Stats */}
      {stats && <ColorfulStatsCards stats={stats} />}

      {/* Profile Card */}
      <FreelancerProfileCard />

      {/* Work History */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="py-4 px-5">
          <Tabs defaultValue="engaged" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg">Work Support History</CardTitle>
              <TabsList className="h-9">
                <TabsTrigger value="engaged" className="text-xs px-4 gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Engaged Clients
                  <Badge className="ml-1 h-5 text-xs bg-primary/10 text-primary border-primary/20">{activeProjects.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs px-4 gap-1.5">
                  <History className="h-3.5 w-3.5" /> Timeline View
                  <Badge variant="outline" className="ml-1 h-5 text-xs">{projects.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs px-4 gap-1.5">
                  <History className="h-3.5 w-3.5" /> Completed
                  <Badge variant="outline" className="ml-1 h-5 text-xs">{completedProjects.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="engaged" className="mt-0">
              <ClientGridTable projects={activeProjects} title="Engaged Clients" />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0">
              <WorkHistoryTimeline projects={projects} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <WorkHistoryTimeline projects={completedProjects} />
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
