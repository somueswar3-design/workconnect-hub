import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Use alias names for yourself and your company. Your real identity stays hidden.',
    },
    {
      icon: Users,
      title: 'Find Talent Fast',
      description: 'Browse available workers in real-time. See who\'s active and ready to help.',
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Upload your resume and let us auto-populate your profile. Get started in minutes.',
    },
  ];
  
  const benefits = [
    'No commitment - work when you\'re free',
    'Set your own hourly rate',
    'Keep your company info private',
    'Connect with IT projects instantly',
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-primary">IT</span>
              <span className="text-secondary">Work</span>
              <span className="text-primary">Help</span>
            </h1>
            <p className="mb-4 text-xl text-muted-foreground sm:text-2xl">
              Connect IT professionals with projects
            </p>
            <p className="mb-8 text-lg text-muted-foreground">
              Available when you're free. Your privacy protected with aliases.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/register">
                  I'm a Freelancer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                <Link to="/browse">
                  Find Talent
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose <span className="text-primary">IT</span>
            <span className="text-secondary">Work</span>
            <span className="text-primary">Help</span>?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-8 text-3xl font-bold">Work on Your Terms</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-left">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-card">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-10 gap-2 bg-secondary hover:bg-secondary/90">
              <Link to="/register">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
