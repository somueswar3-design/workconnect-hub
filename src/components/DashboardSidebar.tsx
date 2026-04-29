import { NavLink, useLocation } from 'react-router-dom';
import { 
  User, Lock, Briefcase, Clock, Receipt, Building2, Home,
  LayoutDashboard, ChevronRight, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DashboardSidebarProps {
  userType: 'freelancer' | 'client';
  isActive?: boolean;
  onStatusChange?: (status: boolean) => void;
}

const DashboardSidebar = ({ userType }: DashboardSidebarProps) => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const basePath = userType === 'freelancer' ? '/freelancer' : '/client';

  const freelancerSections = [
    {
      title: 'MY WORK',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/freelancer', color: 'text-cyan-500' },
        { icon: Briefcase, label: 'My projects', path: '/freelancer/my-requests', color: 'text-orange-500' },
        { icon: Clock, label: 'Timesheets', path: '/freelancer/timesheets', color: 'text-emerald-500' },
        { icon: Receipt, label: 'My invoices', path: '/freelancer/invoices', color: 'text-violet-500' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { icon: User, label: 'My profile', path: '/freelancer/profile', color: 'text-pink-500' },
        { icon: Building2, label: 'Bank details', path: '/freelancer/bank-details', color: 'text-blue-500' },
      ],
    },
  ];

  const clientSections = [
    {
      title: 'MY WORK',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/client', color: 'text-cyan-500' },
        { icon: Briefcase, label: 'My projects', path: '/client/post-requirement', color: 'text-orange-500' },
        { icon: Clock, label: 'Timesheets', path: '/client/timesheets', color: 'text-emerald-500' },
        { icon: Receipt, label: 'My invoices', path: '/client/invoices', color: 'text-violet-500' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { icon: User, label: 'My profile', path: '/client/profile', color: 'text-pink-500' },
      ],
    },
  ];

  const sections = userType === 'freelancer' ? freelancerSections : clientSections;

  const settingsItems = [
    { icon: Lock, label: 'Change Password', path: `${basePath}/settings/password` },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Navigation Sections */}
      <nav className="flex-1 py-4">
        {sections.map((section, idx) => (
          <div key={section.title} className={cn(idx > 0 && 'mt-6')}>
            <p className="px-5 mb-2 text-[11px] font-bold tracking-widest text-orange-500 uppercase">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActivePath = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path + item.label}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 border-l-[3px]',
                      isActivePath
                        ? 'bg-orange-50 text-orange-600 border-orange-500'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4 shrink-0', isActivePath ? 'text-orange-500' : item.color)} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Settings */}
        <div className="mt-6">
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all border-l-[3px] border-transparent">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-500" />
                Settings
              </div>
              <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', settingsOpen && 'rotate-90')} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5">
              {settingsItems.map((item) => {
                const isActivePath = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 pl-8 pr-5 py-2 text-sm transition-all border-l-[3px]',
                      isActivePath
                        ? 'bg-orange-50 text-orange-600 border-orange-500'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
