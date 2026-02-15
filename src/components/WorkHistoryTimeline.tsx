import { Star, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AssignedProject } from '@/types/project';
import { format } from 'date-fns';

interface WorkHistoryTimelineProps {
  projects: AssignedProject[];
}

const WorkHistoryTimeline = ({ projects }: WorkHistoryTimelineProps) => {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No work history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => {
        const paymentProgress = project.totalAmount > 0 
          ? (project.settledAmount / project.totalAmount) * 100 
          : 0;

        const statusConfig = {
          active: { color: 'bg-emerald-500', label: 'Active', badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
          completed: { color: 'bg-primary', label: 'Completed', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
          paused: { color: 'bg-amber-500', label: 'Paused', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
        };

        const config = statusConfig[project.status];

        return (
          <Card key={project.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            {/* Colored top strip */}
            <div className={`h-1 ${config.color}`} />
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Left: Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{project.projectTitle}</h3>
                      <p className="text-sm text-muted-foreground">{project.clientName} · {project.clientCompany}</p>
                    </div>
                    <Badge className={config.badgeClass}>{config.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                  
                  {/* Date & Hours Row */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(project.assignedDate), 'MMM dd, yyyy')}
                      {project.dueDate && ` — ${format(new Date(project.dueDate), 'MMM dd, yyyy')}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {project.hoursWorked}h @ {project.hourlyRate}
                    </span>
                    {project.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        {project.rating}/5
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Financials */}
                <div className="lg:w-56 shrink-0 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Total Earned</span>
                    <span className="text-lg font-bold text-foreground">${project.totalAmount.toLocaleString()}</span>
                  </div>
                  <Progress value={paymentProgress} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" /> ${project.settledAmount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <DollarSign className="h-3 w-3" /> ${project.pendingAmount.toLocaleString()} pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {project.feedback && (
                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs text-muted-foreground italic">"{project.feedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WorkHistoryTimeline;
