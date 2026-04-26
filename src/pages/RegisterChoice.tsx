import { Link } from 'react-router-dom';
import { Briefcase, Users, ArrowRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { encryptRole } from '@/lib/roleCipher';

const RegisterChoice = () => {
  const freelancerToken = encryptRole('FreeLancer');
  const clientToken = encryptRole('Client');
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background py-16 px-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Get Started in Minutes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
            Join <span className="text-primary">Work</span>
            <span className="text-secondary">Support</span>
            <span className="text-primary">360</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you're a skilled IT professional looking for opportunities 
            or a business seeking top talent — we've got you covered.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Freelancer Card */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/60 bg-card">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full" />
            <CardHeader className="pb-3 relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-5 shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                <Briefcase className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">I'm a Freelancer</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Showcase your IT expertise, set your own rates, and get matched with exciting projects worldwide.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 relative">
              <ul className="space-y-3">
                {[
                  'Build your professional profile in minutes',
                  'Upload your resume for smart auto-fill',
                  'Set your preferred hourly rate & availability',
                  'Get matched with relevant client projects',
                  'Track your earnings, timesheets & payments',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full gap-2 shadow-md shadow-primary/20 group-hover:shadow-lg" size="lg">
                <Link to={`/register?t=${freelancerToken}`}>
                  Register as a Freelancer
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Client / HR Card */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-secondary/60 bg-card">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-full" />
            <CardHeader className="pb-3 relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg shadow-secondary/25 group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8 text-secondary-foreground" />
                </div>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs font-semibold">
                  HR & Bulk Hiring
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">Hire IT Talent</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Search and hire skilled IT professionals for your team. 
                Access advanced filters, schedule interviews, and manage bulk hiring effortlessly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 relative">
              <ul className="space-y-3">
                {[
                  'Browse verified IT professionals by skill & experience',
                  'Filter by hourly rate, availability & location',
                  'Schedule interviews and request free demo sessions',
                  'Manage bulk hiring with advanced search tools',
                  'Dedicated support from our HR coordination team',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2.5">
                <Button asChild className="w-full gap-2 bg-secondary hover:bg-secondary/90 shadow-md shadow-secondary/20 group-hover:shadow-lg" size="lg">
                  <Link to={`/register?t=${clientToken}`}>
                    Register to Hire Talent
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full gap-2 border-secondary/30 text-secondary hover:bg-secondary/5" size="lg">
                  <Link to="/talent-search">
                    <Users className="h-4 w-4" />
                    Browse Professionals First
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterChoice;
