import { Link, useLocation } from 'react-router-dom';
import { Briefcase, UserPlus, Home, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] text-slate-100  overflow-hidden">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {/* Logo Icon with Gradient and Glow */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <Briefcase className="h-6 w-6 text-white" />
          </div>

          {/* Logo Text with Gradient */}
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              IT
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Work
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              Help
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {/* Home Link */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/')
              ? 'text-white bg-white/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {/* Become a Freelancer (Primary CTA - Gradient) */}
          <Link
            to="/register"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md ${isActive('/register')
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-700 text-white ring-2 ring-cyan-400/50'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5'
              }`}
          >
            <Users className="h-4 w-4" />
            <span>Become a Freelancer</span>
          </Link>

          {/* Need Work Support (Secondary CTA - Outline) */}
          <Link
            to="/browse"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/browse')
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white'
              }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Need Work Support</span>
          </Link>

          {/* Login Link (Minimal) */}
          <Link
            to="/login"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/login')
              ? 'text-cyan-400'
              : 'text-slate-400 hover:text-cyan-300'
              }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Login</span>
          </Link>
        </nav>

        {/* Mobile Menu Button (Placeholder for simplicity) */}
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
