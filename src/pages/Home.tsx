import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, CheckCircle, Star, Laptop, Clock, DollarSign, Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Use alias names for yourself and your company. Your real identity stays hidden until you choose to reveal it.',
    },
    {
      icon: Users,
      title: 'Find Talent Fast',
      description: 'Browse available workers in real-time. See who\'s active and ready to help with your IT projects.',
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Upload your resume and let us auto-populate your profile. Get started in minutes, not hours.',
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Work when you want, where you want. Set your own schedule and availability status.',
    },
    {
      icon: DollarSign,
      title: 'Fair Compensation',
      description: 'Set your own hourly rates. Get paid for your expertise with transparent pricing.',
    },
    {
      icon: Globe,
      title: 'Remote First',
      description: 'Connect with clients globally. No geographic limitations on your career growth.',
    },
  ];
  
  const benefits = [
    'No commitment - work when you\'re free',
    'Set your own hourly rate',
    'Keep your company info private',
    'Connect with IT projects instantly',
    'Get matched with relevant projects',
    'Build your professional reputation',
  ];

  const techSkills = [
    { name: 'React', icon: Code },
    { name: 'Node.js', icon: Database },
    { name: 'Python', icon: Code },
    { name: 'AWS', icon: Cloud },
    { name: 'DevOps', icon: Lock },
    { name: 'Data Science', icon: TrendingUp },
  ];

  const stats = [
    { value: '500+', label: 'Active Freelancers' },
    { value: '1,200+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ];

  const testimonials = [
    {
      name: 'Alex M.',
      role: 'Full Stack Developer',
      text: 'ITWorkHelp connected me with amazing clients. The privacy features give me peace of mind while freelancing.',
      rating: 5,
    },
    {
      name: 'Sarah K.',
      role: 'DevOps Engineer',
      text: 'Finally, a platform that respects my time and privacy. I can work on my terms without compromising my current job.',
      rating: 5,
    },
    {
      name: 'Michael R.',
      role: 'Data Scientist',
      text: 'The matching system is incredible. I only get projects that match my skills and availability.',
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and upload your resume. Our smart system auto-fills your skills and experience.',
    },
    {
      step: '02',
      title: 'Set Your Availability',
      description: 'Toggle your status to show when you\'re ready for new projects. Stay in control.',
    },
    {
      step: '03',
      title: 'Get Matched',
      description: 'Clients browse and connect with you. Accept projects that fit your schedule.',
    },
    {
      step: '04',
      title: 'Get Paid',
      description: 'Complete work, track earnings, and receive timely payments for your expertise.',
    },
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              🚀 Join 500+ IT Professionals Already Thriving
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
              <span className="text-primary">IT</span>
              <span className="text-secondary">Work</span>
              <span className="text-primary">Help</span>
            </h1>
            <p className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
              Connect IT Professionals with Projects
            </p>
            <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
              The privacy-first freelancing platform for IT professionals. Work on your terms, 
              protect your identity, and connect with quality projects that match your expertise.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2 text-lg px-8 py-6">
                <Link to="/register">
                  Find Jobs / Support Work
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                <Link to="/browse">
                  Hire IT Talent
                  <Users className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary-foreground mb-1">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Skills We Cover */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Skills We Connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From frontend to backend, cloud to security - we cover all major IT domains
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {techSkills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2 px-6 py-3 rounded-full bg-background border hover:border-primary transition-colors">
                <skill.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{skill.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/10 border-secondary/20 border">
              <span className="font-medium text-secondary">+ 50 more skills</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold">
              Why Choose <span className="text-primary">IT</span>
              <span className="text-secondary">Work</span>
              <span className="text-primary">Help</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built the platform IT professionals have been waiting for - privacy-focused, 
              flexible, and designed for modern remote work.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps. From signup to your first payment.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-4" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Freelancers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied IT professionals who found their ideal work-life balance
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Work on Your Terms</h2>
            <p className="mb-8 text-muted-foreground">
              Take control of your career with flexibility that fits your lifestyle
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-left">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                For Businesses
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Need IT Support?</h2>
              <p className="text-muted-foreground mb-6">
                Browse our pool of verified IT professionals ready to help with your projects. 
                From quick fixes to long-term support, find the right talent instantly.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Browse by skills and experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>See real-time availability</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Request demos before committing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Secure and private communication</span>
                </li>
              </ul>
              <Button asChild size="lg" variant="outline" className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                <Link to="/browse">
                  Browse Available Talent
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl" />
              <Card className="relative border-none shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Headphones className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">24/7 IT Support</h3>
                      <p className="text-muted-foreground">On-demand professionals</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span>React Developer</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span>DevOps Engineer</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span>Python Expert</span>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Busy</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary/80">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Start Your Freelancing Journey?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Join ITWorkHelp today and connect with IT projects that match your skills. 
              Your privacy protected, your career elevated.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="gap-2 text-lg px-8">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/browse">
                  Explore Talent Pool
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Laptop className="h-6 w-6 text-primary" />
              <span className="font-bold">
                <span className="text-primary">IT</span>
                <span className="text-secondary">Work</span>
                <span className="text-primary">Help</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 ITWorkHelp. Connecting IT talent with opportunities.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-secondary" />
                Made for IT Professionals
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
