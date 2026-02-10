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
    { icon: Shield, title: 'Privacy Protected', description: 'Use alias names for yourself and your company. Your real identity stays hidden until you choose to reveal it.' },
    { icon: Users, title: 'Find Talent Fast', description: "Browse available workers in real-time. See who's active and ready to help with your IT projects." },
    { icon: Zap, title: 'Quick Setup', description: 'Upload your resume and let us auto-populate your profile. Get started in minutes, not hours.' },
    { icon: Clock, title: 'Flexible Hours', description: 'Work when you want, where you want. Set your own schedule and availability status.' },
    { icon: DollarSign, title: 'Fair Compensation', description: 'Set your own hourly rates. Get paid for your expertise with transparent pricing.' },
    { icon: Globe, title: 'Remote First', description: 'Connect with clients globally. No geographic limitations on your career growth.' },
  ];

  const benefits = [
    "No commitment - work when you're free",
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
    { name: 'Rajesh K.', role: 'Full Stack Developer', company: 'Hyderabad', text: 'ITWorkHelp connected me with amazing clients. The privacy features give me peace of mind while freelancing alongside my regular job.', rating: 5 },
    { name: 'Priya M.', role: 'DevOps Engineer', company: 'Bangalore', text: 'Finally, a platform that respects my time and privacy. I can work on my terms without compromising my current position.', rating: 5 },
    { name: 'Suresh R.', role: 'Data Scientist', company: 'Chennai', text: 'The matching system is incredible. I only get projects that match my skills. Telugu language support made communication easy.', rating: 5 },
    { name: 'Lakshmi S.', role: 'React Developer', company: 'Vizag', text: 'Great platform for IT professionals. The client grid view helps me track all my engagements easily.', rating: 5 },
  ];

  const howItWorks = [
    { step: '01', title: 'Create Your Profile', description: 'Sign up and upload your resume. Our smart system auto-fills your skills and experience.' },
    { step: '02', title: 'Set Your Availability', description: "Toggle your status to show when you're ready for new projects. Stay in control." },
    { step: '03', title: 'Get Matched', description: 'Clients browse and connect with you. Accept projects that fit your schedule.' },
    { step: '04', title: 'Get Paid', description: 'Complete work, track earnings, and receive timely payments for your expertise.' },
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
    <div className="flex flex-col overflow-hidden relative">
      {/* CSS Styles for the Animation */}
      <style>{`
        @keyframes floatBlob {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 40px); }
        }
        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: scaleX(0.9); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes typeArm {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(8deg); }
        }
        @keyframes steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-20px) scaleX(1.5); opacity: 0; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-80px) rotate(10deg); opacity: 0; }
        }
        .animate-float-blob { animation: floatBlob 10s infinite alternate ease-in-out; }
        .code-line-anim { animation: typing 2s infinite ease-in-out; }
        .arm-anim { animation: typeArm 1.5s infinite alternate ease-in-out; transform-origin: top center; }
        .steam-anim { animation: steam 2s infinite ease-out; opacity: 0; }
        .float-icon-anim { animation: floatUp 4s infinite linear; opacity: 0; }
      `}</style>

      {/* Background Ambient Blobs */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float-blob pointer-events-none" />
      <div className="absolute bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-blob pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Text */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold tracking-wide">
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">IT</span>
                  <span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">Work</span>
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Help</span>
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Connect IT Professionals with Projects
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mt-4">
                  The privacy-first freelancing platform for IT professionals. Work on your terms,
                  protect your identity, and connect with quality projects that match your expertise.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:opacity-90">
                  <Link to="/register">
                    Become a Freelancer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Link to="/browse">
                    Need Work Support
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Side: Developer Animation */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-2xl" />

              {/* Animation Scene Container */}
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Floating Icons */}
                <div className="absolute top-4 left-4 text-3xl float-icon-anim" style={{ animationDelay: '0s' }}>
                  <Code className="h-8 w-8 text-primary/60" />
                </div>
                <div className="absolute top-8 right-8 text-2xl float-icon-anim" style={{ animationDelay: '1.5s' }}>
                  <span className="text-secondary/60 font-mono font-bold">{'{...}'}</span>
                </div>
                <div className="absolute bottom-24 left-2 text-xl float-icon-anim" style={{ animationDelay: '3s' }}>
                  <span className="text-primary/40 font-mono">#CSS</span>
                </div>

                {/* Character */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                  {/* Head */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 mx-auto relative">
                    <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-foreground/70" />
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-foreground/70" />
                  </div>
                  {/* Body */}
                  <div className="w-16 h-14 bg-primary rounded-t-lg mx-auto -mt-1" />
                  {/* Arms */}
                  <div className="absolute top-12 -left-3 w-4 h-10 bg-primary rounded-full arm-anim" />
                  <div className="absolute top-12 -right-3 w-4 h-10 bg-primary rounded-full arm-anim" style={{ animationDelay: '0.3s' }} />
                </div>

                {/* Laptop */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  {/* Screen */}
                  <div className="w-40 h-24 bg-foreground/90 rounded-t-lg p-2 relative overflow-hidden">
                    <div className="w-full h-full bg-background/10 rounded p-1.5 space-y-1.5">
                      {/* Code Lines */}
                      <div className="h-1.5 w-3/4 bg-primary/60 rounded-full code-line-anim" />
                      <div className="h-1.5 w-1/2 bg-secondary/60 rounded-full code-line-anim" style={{ animationDelay: '0.5s' }} />
                      <div className="h-1.5 w-2/3 bg-primary/40 rounded-full code-line-anim" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                  {/* Keyboard */}
                  <div className="w-48 h-2 bg-muted-foreground/60 rounded-b-lg mx-auto" />
                </div>

                {/* Desk */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 h-2 bg-muted-foreground/30 rounded-full" />

                {/* Coffee */}
                <div className="absolute bottom-10 right-8">
                  <div className="w-6 h-7 bg-secondary/70 rounded-b-lg rounded-t-sm relative">
                    <div className="absolute -right-2 top-1 w-2 h-3 border-2 border-secondary/70 rounded-r-full" />
                    <div className="absolute -top-3 left-1 w-1 h-3 bg-muted-foreground/30 rounded-full steam-anim" />
                    <div className="absolute -top-4 left-3 w-1 h-3 bg-muted-foreground/20 rounded-full steam-anim" style={{ animationDelay: '0.8s' }} />
                  </div>
                </div>
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
              <div key={industry.name} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors cursor-pointer hover:scale-105 duration-200">
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
              <img src={remoteWorkImage} alt="Remote work professional" className="relative rounded-3xl shadow-2xl w-full hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">Work From Anywhere</Badge>
              <h2 className="text-3xl font-bold">Seamless Remote Collaboration</h2>
              <p className="text-muted-foreground">
                Our platform is built for the modern remote workforce. Connect with clients through
                video calls, share screens for live demos, and collaborate in real-time regardless of location.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Globe, title: 'Global Reach', desc: 'Work with clients worldwide' },
                  { icon: Clock, title: 'Flexible Hours', desc: 'Work on your schedule' },
                  { icon: Laptop, title: 'Easy Demos', desc: 'Screen sharing & live sessions' },
                  { icon: Headphones, title: '24/7 Support', desc: 'Help when you need it' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-200">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
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
              <div key={skill.name} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border hover:border-primary transition-colors cursor-pointer hover:scale-105 duration-200">
                <skill.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{skill.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border-secondary/20 border animate-pulse">
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
              <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
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
            <div className="space-y-6">
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">Join Our Network</Badge>
              <h2 className="text-3xl font-bold">A Thriving Community of Professionals</h2>
              <p className="text-muted-foreground">
                Be part of a growing network of IT professionals who value flexibility, privacy, and
                fair compensation. Our platform brings together the best talent from across India.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Award, title: 'Top-Rated Freelancers', desc: 'Verified skills and client reviews' },
                  { icon: Users, title: 'Diverse Talent Pool', desc: 'From freshers to senior architects' },
                  { icon: TrendingUp, title: 'Career Growth', desc: 'Build your portfolio and reputation' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4 p-4 rounded-xl bg-background hover:translate-x-2 transition-transform duration-200">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl" />
              <img src={modernOfficeImage} alt="Modern IT workspace" className="relative rounded-3xl shadow-2xl w-full hover:scale-[1.02] transition-transform duration-300" />
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
                <div className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200">
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
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">For Businesses</Badge>
            <h2 className="text-3xl font-bold mb-4">Why Clients Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect IT professional for your project with our streamlined hiring process
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {clientBenefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6 rounded-2xl bg-background hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
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
              <Card key={testimonial.name} className="border-none shadow-lg h-full hover:-translate-y-2 transition-transform duration-300">
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
                <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-background border hover:border-primary/50 transition-colors hover:translate-x-1 duration-200">
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
            <div className="space-y-6">
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">Need IT Support?</Badge>
              <h2 className="text-3xl font-bold">Hire Top IT Talent Today</h2>
              <p className="text-muted-foreground">
                Browse our pool of verified IT professionals ready to help with your projects.
                From quick fixes to long-term support, find the right talent instantly.
              </p>
              <ul className="space-y-3">
                {['Browse by skills and experience', 'See real-time availability', 'Request demos before committing', 'Multi-language support: Telugu, Hindi, English'].map((item) => (
                  <li key={item} className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-200">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
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
              <img src={businessHandshakeImage} alt="Business partnership" className="relative rounded-3xl shadow-2xl w-full hover:scale-[1.02] transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
        <div className="container relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="mx-auto max-w-3xl text-center relative z-10">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Start Your Freelancing Journey?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Join ITWorkHelp today and connect with IT projects that match your skills.
              Your privacy protected, your career elevated.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-lg">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
              <img src={teamImage} alt="ITWorkHelp team collaboration" className="relative rounded-3xl shadow-2xl w-full hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">Our Mission</Badge>
              <h2 className="text-3xl font-bold">Empowering IT Professionals</h2>
              <p className="text-muted-foreground">
                We believe every IT professional deserves the opportunity to grow their career on their
                own terms. ITWorkHelp bridges the gap between talented developers and businesses seeking
                quality IT support.
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl blur-2xl pointer-events-none" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-background">
                  <Headphones className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">24/7 Support</h4>
                    <p className="text-sm text-muted-foreground">Always here to help you succeed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-background">
                  <Shield className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Secure Platform</h4>
                    <p className="text-sm text-muted-foreground">Your data is always protected</p>
                  </div>
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
