import { Link, useLocation } from 'react-router-dom';
import { Briefcase, UserPlus, Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-primary">IT</span>
            <span className="text-secondary">Work</span>
            <span className="text-primary">Help</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-1">
          <Button 
            variant={isActive('/') ? 'default' : 'ghost'} 
            asChild
            size="sm"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/register') ? 'secondary' : 'outline'} 
            asChild
            size="sm"
            className={isActive('/register') ? '' : 'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground'}
          >
            <Link to="/register" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Become a Freelancer</span>
            </Link>
          </Button>

          <Button 
            variant={isActive('/browse') ? 'default' : 'ghost'} 
            asChild
            size="sm"
          >
            <Link to="/browse" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Need Work Support</span>
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/login') ? 'default' : 'outline'} 
            asChild
            size="sm"
          >
            <Link to="/login" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
