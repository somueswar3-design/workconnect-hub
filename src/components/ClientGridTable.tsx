import { Star, Clock, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AssignedProject } from '@/types/project';
import { format } from 'date-fns';

interface ClientGridTableProps {
  projects: AssignedProject[];
  title: string;
}

const ClientGridTable = ({ projects, title }: ClientGridTableProps) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No {title.toLowerCase()} found
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Project</TableHead>
            <TableHead className="font-semibold text-center">Duration</TableHead>
            <TableHead className="font-semibold text-center">Hours</TableHead>
            <TableHead className="font-semibold text-center">Rate</TableHead>
            <TableHead className="font-semibold text-right">Earned</TableHead>
            <TableHead className="font-semibold text-right">Settled</TableHead>
            <TableHead className="font-semibold text-right">Pending</TableHead>
            <TableHead className="font-semibold text-center">Rating</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const startDate = new Date(project.assignedDate);
            const endDate = project.dueDate ? new Date(project.dueDate) : new Date();
            const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const durationWeeks = Math.floor(durationDays / 7);
            
            return (
              <TableRow key={project.id} className="hover:bg-muted/30">
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{project.clientName}</p>
                    <p className="text-xs text-muted-foreground">{project.clientCompany}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium truncate max-w-[150px]" title={project.projectTitle}>
                    {project.projectTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(project.assignedDate, 'MMM d, yy')}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm">
                    {durationWeeks > 0 ? `${durationWeeks}w` : `${durationDays}d`}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">{project.hoursWorked}h</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm">{project.hourlyRate}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-semibold">${project.totalAmount.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-green-600">${project.settledAmount.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-secondary">${project.pendingAmount.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-center">
                  {project.rating ? (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{project.rating}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`${statusColors[project.status]} text-xs px-2 py-0.5`}>
                    {project.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientGridTable;
