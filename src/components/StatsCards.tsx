import { DollarSign, CheckCircle2, Clock, Star, Briefcase, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FreelancerStats } from '@/types/project';

interface StatsCardsProps {
  stats: FreelancerStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      label: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Settled',
      value: `$${stats.settledAmount.toLocaleString()}`,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Pending',
      value: `$${stats.pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Active',
      value: stats.activeProjects.toString(),
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((item) => (
        <Card key={item.label} className="p-3">
          <CardContent className="p-0 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
