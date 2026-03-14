import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, MapPin, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/worksupport360-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    if (user?.role?.toLowerCase() === 'client') return '/client';
    if (user?.role?.toLowerCase() === 'admin') return '/admin';
    return '/freelancer';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] text-slate-100 overflow-hidden">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="WorkSupport360" className="h-10 w-10 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300" />
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Work</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400">Support</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-300 to-blue-400">360</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-all duration-200">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
                      {user?.fullName || user?.email || 'User'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/freelancer-profile')} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <a
                href="tel:9441363687"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span className="font-medium">9441363687</span>
              </a>
              <a
                href="mailto:info@worksupport360.com"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Mail className="h-4 w-4 text-cyan-400" />
                <span className="font-medium hidden lg:inline">info@worksupport360.com</span>
              </a>

              <div className="w-px h-6 bg-slate-700 mx-1" />

              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 shadow-md"
              >
                <span>Get Started</span>
              </Link>
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/login') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;