import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign, Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award, Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-freelancer.jpg';
import teamImage from '@/assets/team-collaboration.jpg';
import successImage from '@/assets/business-success.jpg';
import developersTeamImage from '@/assets/developers-team.jpg';
import modernOfficeImage from '@/assets/modern-office.jpg';
import remoteWorkImage from '@/assets/remote-work.jpg';
import businessHandshakeImage from '@/assets/business-handshake.jpg';

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
    { name: 'Java', icon: Code },
    { name: 'Angular', icon: Code },
    { name: '.NET', icon: Database },
    { name: 'Azure', icon: Cloud },
    { name: 'Machine Learning', icon: TrendingUp },
    { name: 'Cybersecurity', icon: Shield },
  ];

  const stats = [
    { value: '500+', label: 'Active Freelancers' },
    { value: '1,200+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ];

  const testimonials = [
    {
      name: 'Rajesh K.',
      role: 'Full Stack Developer',
      company: 'Hyderabad',
      text: 'ITWorkHelp connected me with amazing clients. The privacy features give me peace of mind while freelancing alongside my regular job.',
      rating: 5,
    },
    {
      name: 'Priya M.',
      role: 'DevOps Engineer',
      company: 'Bangalore',
      text: 'Finally, a platform that respects my time and privacy. I can work on my terms without compromising my current position.',
      rating: 5,
    },
    {
      name: 'Suresh R.',
      role: 'Data Scientist',
      company: 'Chennai',
      text: 'The matching system is incredible. I only get projects that match my skills. Telugu language support made communication easy.',
      rating: 5,
    },
    {
      name: 'Lakshmi S.',
      role: 'React Developer',
      company: 'Vizag',
      text: 'Great platform for IT professionals. The client grid view helps me track all my engagements easily.',
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

  const industries = [
    { name: 'FinTech', icon: DollarSign },
    { name: 'Healthcare', icon: Heart },
    { name: 'E-Commerce', icon: Target },
    { name: 'EdTech', icon: BookOpen },
    { name: 'SaaS', icon: Cloud },
    { name: 'Startups', icon: Laptop },
  ];

  const clientBenefits = [
    { icon: ThumbsUp, title: 'Verified Professionals', description: 'All freelancers are verified and skill-assessed' },
    { icon: Clock, title: 'Quick Hiring', description: 'Find and hire talent within hours, not weeks' },
    { icon: MessageSquare, title: 'Multi-language Support', description: 'Communicate in Telugu, Hindi, or English' },
    { icon: Shield, title: 'Secure Payments', description: 'Protected transactions with milestone-based payments' },
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden py-16 lg:py-28">
        <div className="absolute inset-0">
          <img 
            src={developersTeamImage} 
            alt="IT Professional working remotely" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                🚀 Join 500+ IT Professionals Already Thriving
              </Badge>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-primary">IT</span>
                <span className="text-secondary">Work</span>
                <span className="text-primary">Help</span>
              </h1>
              <p className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
                Connect IT Professionals with Projects
              </p>
              <p className="mb-8 text-lg text-muted-foreground">
                The privacy-first freelancing platform for IT professionals. Work on your terms, 
                protect your identity, and connect with quality projects that match your expertise.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg" className="gap-2 text-lg px-8 py-6">
                  <Link to="/register">
                    Become a Freelancer
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Link to="/browse">
                    Need Work Support
                    <Users className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
                <img 
                  src={heroImage} 
                  alt="IT Professional working" 
                  className="relative rounded-3xl shadow-2xl border border-primary/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-primary">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary-foreground mb-1">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 bg-card">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Industries We Serve</h2>
            <p className="text-muted-foreground">Connecting IT talent across diverse sectors</p>
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            {industries.map((industry) => (
              <div key={industry.name} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <industry.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-center">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Work Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <img 
                src={remoteWorkImage} 
                alt="Remote work professional" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Work From Anywhere
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Seamless Remote Collaboration</h2>
              <p className="text-muted-foreground mb-6">
                Our platform is built for the modern remote workforce. Connect with clients through 
                video calls, share screens for live demos, and collaborate in real-time regardless of location.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Global Reach</h4>
                    <p className="text-sm text-muted-foreground">Work with clients worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Flexible Hours</h4>
                    <p className="text-sm text-muted-foreground">Work on your schedule</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Laptop className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Easy Demos</h4>
                    <p className="text-sm text-muted-foreground">Screen sharing & live sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Headphones className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">24/7 Support</h4>
                    <p className="text-sm text-muted-foreground">Help when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Skills We Cover */}
      <section className="py-14 lg:py-18 bg-card">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Skills We Connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From frontend to backend, cloud to security - we cover all major IT domains
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techSkills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border hover:border-primary transition-colors">
                <skill.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{skill.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border-secondary/20 border">
              <span className="font-medium text-sm text-secondary">+ 100 more skills</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-20">
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Office Section */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                Join Our Network
              </Badge>
              <h2 className="text-3xl font-bold mb-4">A Thriving Community of Professionals</h2>
              <p className="text-muted-foreground mb-6">
                Be part of a growing network of IT professionals who value flexibility, privacy, and 
                fair compensation. Our platform brings together the best talent from across India.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-background">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Top-Rated Freelancers</h4>
                    <p className="text-sm text-muted-foreground">Verified skills and client reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-background">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Diverse Talent Pool</h4>
                    <p className="text-sm text-muted-foreground">From freshers to senior architects</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-background">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Career Growth</h4>
                    <p className="text-sm text-muted-foreground">Build your portfolio and reputation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl" />
              <img 
                src={modernOfficeImage} 
                alt="Modern IT workspace" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps. From signup to your first payment.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-4" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
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

      {/* Client Benefits Section */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              For Businesses
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why Clients Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect IT professional for your project with our streamlined hiring process
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {clientBenefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6 rounded-2xl bg-background hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Freelancers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied IT professionals who found their ideal work-life balance
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Work on Your Terms</h2>
            <p className="mb-8 text-muted-foreground">
              Take control of your career with flexibility that fits your lifestyle
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-left">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                Need IT Support?
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Hire Top IT Talent Today</h2>
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
                  <span>Multi-language support: Telugu, Hindi, English</span>
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
              <img 
                src={businessHandshakeImage} 
                alt="Business partnership" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary/80">
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

      {/* Team Section with Image */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <img 
                src={teamImage} 
                alt="Team collaboration" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Empowering IT Professionals</h2>
              <p className="text-muted-foreground mb-6">
                We believe every IT professional deserves the opportunity to grow their career on their 
                own terms. ITWorkHelp bridges the gap between talented developers and businesses seeking 
                quality IT support.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-background">
                  <Headphones className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold">24/7 Support</h4>
                  <p className="text-sm text-muted-foreground">Always here to help you succeed</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <Shield className="h-6 w-6 text-secondary mb-2" />
                  <h4 className="font-semibold">Secure Platform</h4>
                  <p className="text-sm text-muted-foreground">Your data is always protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
