import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, UserPlus, Home, Users, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-300">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">IT</span>
            <span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">Work</span>
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Help</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant={isActive('/') ? 'secondary' : 'ghost'}
            asChild
            size="sm"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
          >
            <Link to="/register" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Become a Freelancer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant={isActive('/browse') ? 'default' : 'outline'}
            asChild
            size="sm"
            className={!isActive('/browse') ? 'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground' : ''}
          >
            <Link to="/browse" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Need Work Support
            </Link>
          </Button>

          <Button
            variant={isActive('/login') ? 'default' : 'ghost'}
            asChild
            size="sm"
          >
            <Link to="/login" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-card p-4 flex flex-col gap-2 animate-fade-in">
          <Button variant={isActive('/') ? 'secondary' : 'ghost'} asChild className="justify-start">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Home
            </Link>
          </Button>
          <Button asChild className="justify-start bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Become a Freelancer <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="justify-start border-secondary text-secondary">
            <Link to="/browse" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Need Work Support
            </Link>
          </Button>
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Login
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
