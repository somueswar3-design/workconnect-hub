import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  History, 
  Power, 
  PowerOff, 
  Languages, 
  Camera, 
  Lock, 
  Briefcase, 
  Users,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DashboardSidebarProps {
  userType: 'freelancer' | 'client';
  isActive?: boolean;
  onStatusChange?: (status: boolean) => void;
}

const DashboardSidebar = ({ userType, isActive = true, onStatusChange }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState(isActive);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleStatusToggle = () => {
    const newStatus = !activeStatus;
    setActiveStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const freelancerMenuItems = [
    { icon: User, label: 'My Profile', path: '/freelancer' },
    { icon: Users, label: 'Engaged Clients', path: '/freelancer/clients' },
    { icon: History, label: 'Work History', path: '/freelancer/history' },
    { icon: Briefcase, label: 'Skills & Experience', path: '/freelancer/skills' },
  ];

  const clientMenuItems = [
    { icon: User, label: 'My Profile', path: '/client' },
    { icon: Users, label: 'Hired Freelancers', path: '/client/freelancers' },
    { icon: History, label: 'Project History', path: '/client/history' },
  ];

  const menuItems = userType === 'freelancer' ? freelancerMenuItems : clientMenuItems;

  const settingsItems = [
    { icon: Languages, label: 'Language Preference', path: '/settings/language' },
    { icon: Camera, label: 'Update Photo', path: '/settings/photo' },
    { icon: Lock, label: 'Change Password', path: '/settings/password' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Briefcase className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-sidebar-foreground">IT</span>
            <span className="text-sidebar-primary">Work</span>
            <span className="text-sidebar-foreground">Help</span>
          </span>
        </div>
      </div>

      {/* Availability Status */}
      {userType === 'freelancer' && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeStatus ? (
                <Power className="h-4 w-4 text-green-400" />
              ) : (
                <PowerOff className="h-4 w-4 text-sidebar-foreground/60" />
              )}
              <span className="text-sm font-medium">
                {activeStatus ? 'Online' : 'Offline'}
              </span>
            </div>
            <Switch
              checked={activeStatus}
              onCheckedChange={handleStatusToggle}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <p className="text-xs text-sidebar-foreground/60 mt-1">
            {activeStatus ? 'Available for new projects' : 'Not accepting new work'}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActivePath = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActivePath 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}

        {/* Settings Collapsible */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              Profile Settings
            </div>
            <ChevronRight className={cn('h-4 w-4 transition-transform', settingsOpen && 'rotate-90')} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-1 mt-1">
            {settingsItems.map((item) => {
              const isActivePath = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActivePath 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <Badge variant="outline" className="text-xs border-sidebar-border text-sidebar-foreground/70">
              {userType === 'freelancer' ? 'Freelancer' : 'Client'}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
