import { Link } from 'react-router-dom';
import { Briefcase, UserSearch, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RegisterChoice = () => {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Join <span className="text-primary">Work</span>
          <span className="text-secondary">Support</span>
          <span className="text-primary">360</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose how you want to use the platform
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Freelancer Registration */}
        <Card className="relative overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />
          <CardHeader className="pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary mb-4">
              <Briefcase className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">I'm a Freelancer</CardTitle>
            <CardDescription className="text-base">
              I want to offer my IT skills and get freelance work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Create your professional profile
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Upload resume for auto-fill
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Set your hourly rate & availability
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Get matched with projects
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Track earnings & payments
              </li>
            </ul>
            
            <Button asChild className="w-full mt-6 gap-2" size="lg">
              <Link to="/register/freelancer">
                Register as Freelancer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Client Registration */}
        <Card className="relative overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-secondary">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full" />
          <CardHeader className="pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary mb-4">
              <UserSearch className="h-7 w-7 text-secondary-foreground" />
            </div>
            <CardTitle className="text-2xl">I'm Looking for Talent</CardTitle>
            <CardDescription className="text-base">
              I want to find and hire IT professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-secondary" />
                Browse available professionals
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-secondary" />
                Search by skills & experience
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-secondary" />
                View profiles & hourly rates
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-secondary" />
                Express interest & connect
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-secondary" />
                Contact admin for support
              </li>
            </ul>
            
            <Button asChild className="w-full mt-6 gap-2 bg-secondary hover:bg-secondary/90" size="lg">
              <Link to="/browse">
                Browse Professionals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterChoice;
