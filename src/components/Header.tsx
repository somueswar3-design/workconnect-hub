import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Play, Briefcase, Users, ArrowRight, LayoutDashboard, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getFreelancerProfile, calculateProfilePercentage } from '@/services/freelancerApi';
import logo from '@/assets/worksupport360-logo.png';
import { encryptRole } from '@/lib/roleCipher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [showJoinChoice, setShowJoinChoice] = useState(false);

  useEffect(() => {
    const fetchPct = async () => {
      if (!isAuthenticated || user?.role?.toLowerCase() !== 'freelancer' || !user?.userId) return;
      if (user.profilePercentage !== undefined) return;
      try {
        const data = await getFreelancerProfile(user.userId);
        if (data) {
          const pct = calculateProfilePercentage(data);
          updateUser({ profilePercentage: pct, fullName: data.fullName || user.fullName });
        }
      } catch { /* silent */ }
    };
    fetchPct();
  }, [isAuthenticated, user?.userId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'client') return '/client';
    if (role === 'admin') return '/admin';
    return '/freelancer';
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="WorkSupport360" className="h-9 w-9 rounded-xl" />
            <span className="text-xl font-black tracking-tight italic">
  <span className="text-orange-500 mr-1">Work</span>
  <span className="text-orange-400 mr-1">Support</span>
  <span className="text-white">360</span>
</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors rounded-full hover:bg-gray-800"
            >
              <Play className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              How It Works
            </button>

            {!(isAuthenticated && user?.role?.toLowerCase() === 'freelancer') && (
              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    (window as any).__scrollToFreelancers?.();
                  } else {
                    navigate('/', { state: { scrollToFreelancers: true } });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors rounded-full hover:bg-gray-800"
              >
                <Users className="h-4 w-4" />
                Hire Talent
              </button>
            )}

            {!(isAuthenticated && user?.role?.toLowerCase() === 'client') && (
              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    (window as any).__scrollToWorks?.();
                  } else {
                    navigate('/', { state: { scrollToWorks: true } });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors rounded-full hover:bg-gray-800"
              >
                <Search className="h-4 w-4" />
                Find Work
              </button>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors rounded-full hover:bg-gray-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Works
                </Link>
                {user?.role?.toLowerCase() === 'client' && (
                  <button
                    onClick={() => {
                      if (location.pathname === '/') {
                        (window as any).__openPostRequirement?.();
                      } else {
                        navigate('/', { state: { openPostRequirement: true } });
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all rounded-full shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    Post a Requirement
                  </button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                        {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate">
                        {user?.fullName || user?.email || 'User'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {user?.role?.toLowerCase() === 'freelancer' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/freelancer-profile')} className="cursor-pointer">
                          <User className="h-4 w-4 mr-2" />
                          Update Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-gray-200 hover:text-white border border-gray-700 hover:bg-gray-800 bg-transparent transition-all duration-200"
                >
                  Log in
                </Link>
                <button
                  onClick={() => setShowJoinChoice(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 shadow-sm shadow-orange-500/25"
                >
                  Join free
                </button>
              </>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-200"
            >
              <Play className="h-3 w-3 fill-emerald-500" />
              Demo
            </button>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowJoinChoice(true)}
                className="text-xs px-3 py-1.5 rounded-full bg-orange-500 text-white font-semibold"
              >
                Join free
              </button>
            )}
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

      {/* Join Role Choice Dialog */}
      <Dialog open={showJoinChoice} onOpenChange={setShowJoinChoice}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              How would you like to join?
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <button
              onClick={() => { setShowJoinChoice(false); navigate(`/register?t=${encryptRole('FreeLancer')}`); }}
              className="group flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                <Briefcase className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Register as a Freelancer</h3>
                <p className="text-sm text-gray-500">I want to offer my IT skills and earn hourly, part-time, or full-time</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 mt-1 transition-colors" />
            </button>

            <button
              onClick={() => { setShowJoinChoice(false); navigate(`/register?t=${encryptRole('Client')}`); }}
              className="group flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Hire Freelancer / Work Support Freelancer</h3>
                <p className="text-sm text-gray-500">I want to hire IT professionals on hourly basis for my projects</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mt-1 transition-colors" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;