import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Play } from 'lucide-react';
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
import {
  Dialog, DialogContent,
} from '@/components/ui/dialog';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="WorkSupport360" className="h-9 w-9 rounded-xl" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-emerald-600">Work</span>
              <span className="text-gray-800">Support</span>
              <span className="text-blue-600">360</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50"
            >
              <Play className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              How It Works
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
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
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/login') ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
                >
                  Join Free
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full"
            >
              <Play className="h-3 w-3 fill-emerald-500" />
              Demo
            </button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Demo Video Dialog */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-2xl">
          <div className="aspect-video w-full">
            <iframe
              src="/demo-explainer.html"
              className="w-full h-full border-0"
              title="How WorkSupport360 Works"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
