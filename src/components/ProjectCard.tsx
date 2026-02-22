import { Calendar, Clock, DollarSign, Star, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AssignedProject } from '@/types/project';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: AssignedProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };
  
  const paymentProgress = project.totalAmount > 0 
    ? (project.settledAmount / project.totalAmount) * 100 
    : 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.projectTitle}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{project.clientCompany}</span>
            </div>
          </div>
          <Badge className={statusColors[project.status]}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Started: {format(project.assignedDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{project.hoursWorked} hours worked</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Rate: {project.hourlyRate}/hr</span>
          </div>
          {project.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{project.rating} rating</span>
            </div>
          )}
        </div>
        
        {/* Financial Summary */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Earned</span>
            <span className="font-semibold">{project.totalAmount.toLocaleString()}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Settled: {project.settledAmount.toLocaleString()}</span>
              <span className="text-secondary">Pending: {project.pendingAmount.toLocaleString()}</span>
            </div>
            <Progress value={paymentProgress} className="h-2" />
          </div>
        </div>
        
        {/* Feedback */}
        {project.feedback && (
          <div className="p-3 rounded-lg border border-dashed">
            <p className="text-sm italic text-muted-foreground">
              "{project.feedback}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
