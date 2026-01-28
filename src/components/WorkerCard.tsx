import { WorkerProfile } from '@/types/profile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';

interface WorkerCardProps {
  profile: WorkerProfile;
}

const WorkerCard = ({ profile }: WorkerCardProps) => {
  const getStatusColor = (status: WorkerProfile['availability']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };
  
  const getStatusBadge = (status: WorkerProfile['availability']) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'offline':
        return 'outline';
    }
  };
  
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <span 
                className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card ${getStatusColor(profile.availability)}`} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {profile.aliasName}
              </h3>
              <p className="text-sm text-muted-foreground">{profile.companyAlias}</p>
            </div>
          </div>
          <Badge variant={getStatusBadge(profile.availability)} className="capitalize">
            {profile.availability}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs border-primary/30 text-primary">
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{profile.skills.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            <span className="truncate">{profile.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-secondary" />
            <span>{profile.experience}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium col-span-2">
            <DollarSign className="h-3.5 w-3.5 text-secondary" />
            <span>{profile.hourlyRate}/hr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;
