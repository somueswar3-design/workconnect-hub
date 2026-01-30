import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Users, CheckCircle, Star, Wallet, Clock } from 'lucide-react';
import { ClientStats } from '@/services/clientApi';

interface ClientStatsCardsProps {
  stats: ClientStats;
}

const ClientStatsCards = ({ stats }: ClientStatsCardsProps) => {
  const statItems = [
    {
      label: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Paid Amount',
      value: `$${stats.paidAmount.toLocaleString()}`,
      icon: Wallet,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Pending Payment',
      value: `$${stats.pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      label: 'Active Freelancers',
      value: stats.activeFreelancers.toString(),
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Completed Projects',
      value: stats.completedProjects.toString(),
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      label: 'Avg Rating Given',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((stat) => (
        <Card key={stat.label} className="border shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg font-bold truncate">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientStatsCards;
