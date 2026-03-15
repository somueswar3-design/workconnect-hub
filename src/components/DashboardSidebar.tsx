import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Power, PowerOff, Languages, Camera, Lock, Briefcase, Users, LogOut, ChevronRight, LayoutDashboard
} from 'lucide-react';
import logo from '@/assets/worksupport360-logo.png';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardSidebarProps {
  userType: 'freelancer' | 'client';
  isActive?: boolean;
  onStatusChange?: (status: boolean) => void;
}

const DashboardSidebar = ({ userType, isActive = true, onStatusChange }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeStatus, setActiveStatus] = useState(isActive ?? true);

  // Sync with prop when profile data loads
  useEffect(() => {
    if (isActive !== undefined) setActiveStatus(isActive);
  }, [isActive]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleStatusToggle = async () => {
    const newStatus = !activeStatus;
    const statusText = newStatus ? 'Available' : 'UnAvailable';
    const userId = user?.userId || '';
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7167';
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_BASE}/api/freelancer/availability?userId=${userId}&status=${statusText}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to update availability');
      setActiveStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      console.error('Availability update failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const freelancerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/freelancer' },
    { icon: User, label: 'My Profile', path: '/freelancer-profile' },
    { icon: Users, label: 'Engaged Clients', path: '/freelancer/clients' },
  ];

  const clientMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
    { icon: User, label: 'My Profile', path: '/client/profile' },
    { icon: Users, label: 'Hired Freelancers', path: '/client/freelancers' },
  ];

  const menuItems = userType === 'freelancer' ? freelancerMenuItems : clientMenuItems;
  const basePath = userType === 'freelancer' ? '/freelancer' : '/client';

  const settingsItems = [
    { icon: Lock, label: 'Change Password', path: `${basePath}/settings/password` },
  ];

  return (
    <aside className="w-56 min-h-screen bg-gradient-to-b from-background to-muted/30 border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <img src={logo} alt="WorkSupport360" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-bold">
            <span className="text-primary">Work</span>
            <span className="text-secondary">Support</span>
            <span className="text-primary">360</span>
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.fullName || user?.email || 'User'}</p>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
              {userType === 'freelancer' ? 'Freelancer' : 'Client'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      {userType === 'freelancer' && (
        <div className="px-3 py-2.5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {activeStatus ? <Power className="h-3.5 w-3.5 text-green-500" /> : <PowerOff className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="text-xs font-medium text-foreground">{activeStatus ? 'Online' : 'Offline'}</span>
            </div>
            <Switch checked={activeStatus} onCheckedChange={handleStatusToggle} className="data-[state=checked]:bg-green-500 scale-90" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActivePath = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path} className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActivePath ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}

        {/* Settings Collapsible */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <div className="flex items-center gap-2.5">
              <Settings className="h-4 w-4" />
              Settings
            </div>
            <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', settingsOpen && 'rotate-90')} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-3 space-y-0.5 mt-0.5">
            {settingsItems.map((item) => {
              const isActivePath = location.pathname === item.path;
              return (
                <NavLink key={item.path} to={item.path} className={cn(
                  'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors',
                  isActivePath ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}>
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
