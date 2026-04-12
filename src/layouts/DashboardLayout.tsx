import { ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/worksupport360-logo.png';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'freelancer' | 'client';
  isActive?: boolean;
}

const DashboardLayout = ({ children, userType, isActive }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="flex flex-col h-screen bg-[#0A1628] text-slate-100">
      {/* Top Header Bar */}
      <header className="h-14 bg-[#0D1B2E] border-b border-slate-700/40 flex items-center justify-between px-6 shrink-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="WorkSupport360" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-black tracking-tight italic">
            <span className="text-orange-500">Work</span>
            <span className="text-orange-400">Support</span>
            <span className="text-white">360</span>
          </span>
        </Link>

        {/* Right side: role badge + user + logout */}
        <div className="flex items-center gap-3">
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
            {userType === 'freelancer' ? 'Freelancer' : 'Client'}
          </Badge>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-700 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-slate-200">
              {user?.fullName || user?.email || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors ml-1"
          >
            <X className="h-4 w-4" />
            <span className="text-xs">logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar userType={userType} isActive={isActive} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
