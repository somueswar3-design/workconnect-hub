import { NavLink, useLocation } from 'react-router-dom';
import { 
  User, Lock, Briefcase, Clock, Receipt, Building2, DollarSign, 
  LayoutDashboard, Search, FileText, ChevronRight, Settings
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
        { icon: LayoutDashboard, label: 'Dashboard', path: '/freelancer' },
        { icon: Briefcase, label: 'My projects', path: '/freelancer/my-requests' },
        { icon: Clock, label: 'Timesheets', path: '/freelancer/timesheets' },
        { icon: Receipt, label: 'My invoices', path: '/freelancer/invoices' },
      ],
    },
    {
      title: 'FIND WORK',
      items: [
        { icon: Search, label: 'Browse projects', path: '/' },
        { icon: FileText, label: 'My applications', path: '/freelancer/payments' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { icon: User, label: 'My profile', path: '/freelancer/profile' },
        { icon: Building2, label: 'Bank details', path: '/freelancer/bank-details' },
      ],
    },
  ];

  const clientSections = [
    {
      title: 'MY WORK',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
        { icon: Briefcase, label: 'My projects', path: '/client/post-requirement' },
        { icon: Clock, label: 'Timesheets', path: '/client/timesheets' },
        { icon: Receipt, label: 'My invoices', path: '/client/invoices' },
      ],
    },
    {
      title: 'FIND WORK',
      items: [
        { icon: Search, label: 'Browse professionals', path: '/' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { icon: User, label: 'My profile', path: '/client/profile' },
      ],
    },
  ];

  const sections = userType === 'freelancer' ? freelancerSections : clientSections;

  const settingsItems = [
    { icon: Lock, label: 'Change Password', path: `${basePath}/settings/password` },
  ];

  return (
    <aside className="w-60 min-h-screen bg-[#0D1B2E] border-r border-slate-700/40 flex flex-col shrink-0">
      {/* Navigation Sections */}
      <nav className="flex-1 py-4">
        {sections.map((section, idx) => (
          <div key={section.title} className={cn(idx > 0 && 'mt-6')}>
            <p className="px-5 mb-2 text-[11px] font-bold tracking-widest text-orange-500/80 uppercase">
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
                      'flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150',
                      isActivePath
                        ? 'bg-orange-500/15 text-orange-400 border-l-3 border-orange-500'
                        : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 border-l-3 border-transparent'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
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
            <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition-all border-l-3 border-transparent">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
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
                      'flex items-center gap-3 pl-8 pr-5 py-2 text-sm transition-all border-l-3',
                      isActivePath
                        ? 'bg-orange-500/15 text-orange-400 border-orange-500'
                        : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 border-transparent'
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
