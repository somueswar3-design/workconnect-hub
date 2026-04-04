import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Power, PowerOff, Languages, Camera, Lock, Briefcase, Users, LogOut, ChevronRight, LayoutDashboard, Home, PlusCircle
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
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/freelancer' },
    { icon: User, label: 'My Profile', path: '/freelancer-profile' },
    { icon: Users, label: 'Engaged Clients', path: '/freelancer/clients' },
  ];

  const clientMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
    { icon: Briefcase, label: 'My Requests', path: '/client/demo-requests' },
    { icon: Users, label: 'Browse Talent', path: '/client/freelancers' },
    { icon: PlusCircle, label: 'Post Requirement', path: '/client/post-requirement' },
  ];

  const menuItems = userType === 'freelancer' ? freelancerMenuItems : clientMenuItems;
  const basePath = userType === 'freelancer' ? '/freelancer' : '/client';

  const settingsItems = [
    { icon: Lock, label: 'Change Password', path: `${basePath}/settings/password` },
  ];

  return (
    <aside className="w-56 min-h-screen bg-[#0D1B2E] border-r border-slate-700/50 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="WorkSupport360" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-bold">
            <span className="text-orange-500">Work</span>
            <span className="text-amber-500">Support</span>
            <span className="text-blue-600">360</span>
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-3 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-cyan-500/15 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-cyan-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">{user?.fullName || user?.email || 'User'}</p>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/30 text-cyan-400">
              {userType === 'freelancer' ? 'Freelancer' : 'Client'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      {userType === 'freelancer' && (
        <div className="px-3 py-2.5 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {activeStatus ? <Power className="h-3.5 w-3.5 text-emerald-400" /> : <PowerOff className="h-3.5 w-3.5 text-slate-500" />}
              <span className="text-xs font-medium text-slate-200">{activeStatus ? 'Online' : 'Offline'}</span>
            </div>
            <Switch checked={activeStatus} onCheckedChange={handleStatusToggle} className="data-[state=checked]:bg-emerald-500 scale-90" />
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
              isActivePath ? 'bg-cyan-500/15 text-cyan-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}

        {/* Settings Collapsible */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors">
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
                  isActivePath ? 'bg-cyan-500/15 text-cyan-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
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
      <div className="p-2 border-t border-slate-700/50">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
