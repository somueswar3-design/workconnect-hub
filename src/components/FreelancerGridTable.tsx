import { HiredFreelancer } from '@/services/clientApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface FreelancerGridTableProps {
  freelancers: HiredFreelancer[];
  title: string;
}

const FreelancerGridTable = ({ freelancers, title }: FreelancerGridTableProps) => {
  if (freelancers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {title.toLowerCase()} found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold">Freelancer</TableHead>
            <TableHead className="text-xs font-semibold">Project</TableHead>
            <TableHead className="text-xs font-semibold">Skills</TableHead>
            <TableHead className="text-xs font-semibold text-center">Hours</TableHead>
            <TableHead className="text-xs font-semibold text-right">Rate</TableHead>
            <TableHead className="text-xs font-semibold text-right">Total</TableHead>
            <TableHead className="text-xs font-semibold text-right">Paid</TableHead>
            <TableHead className="text-xs font-semibold text-right">Pending</TableHead>
            <TableHead className="text-xs font-semibold text-center">Rating</TableHead>
            <TableHead className="text-xs font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {freelancers.map((freelancer) => (
            <TableRow key={freelancer.id} className="hover:bg-muted/30">
              <TableCell className="py-2">
                <div>
                  <p className="font-medium text-sm">{freelancer.freelancerName}</p>
                  <p className="text-xs text-muted-foreground">@{freelancer.freelancerAlias}</p>
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="max-w-[200px]">
                  <p className="font-medium text-sm truncate">{freelancer.projectTitle}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(freelancer.hiredDate, 'MMM dd, yyyy')}
                    {freelancer.endDate && (
                      <span> - {format(freelancer.endDate, 'MMM dd, yyyy')}</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                  {freelancer.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      +{freelancer.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {freelancer.hoursWorked}h
                </div>
              </TableCell>
              <TableCell className="py-2 text-right text-sm font-medium">
                {freelancer.hourlyRate}
              </TableCell>
              <TableCell className="py-2 text-right">
                <div className="flex items-center justify-end gap-1 text-sm font-medium">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  {freelancer.totalAmount.toLocaleString()}
                </div>
              </TableCell>
              <TableCell className="py-2 text-right text-sm text-green-600 font-medium">
                ${freelancer.paidAmount.toLocaleString()}
              </TableCell>
              <TableCell className="py-2 text-right text-sm text-amber-600 font-medium">
                ${freelancer.pendingAmount.toLocaleString()}
              </TableCell>
              <TableCell className="py-2 text-center">
                {freelancer.rating ? (
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{freelancer.rating}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="py-2">
                <Badge
                  variant={freelancer.status === 'active' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    freelancer.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                      : freelancer.status === 'completed'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : ''
                  }`}
                >
                  {freelancer.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FreelancerGridTable;
