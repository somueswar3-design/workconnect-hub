import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign, Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award, Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Imports kept for reference, though images are removed from Hero section
import heroImage from '@/assets/hero-freelancer.jpg';
import wsLogo from '@/assets/worksupport360-logo.png';
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
      text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind while freelancing alongside my regular job.',
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
    <div className="flex flex-col bg-[#0f172a] text-slate-100 relative overflow-hidden min-h-screen">

      {/* CSS Styles for the Animation - Injected here */}
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
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-500/30 rounded-full blur-[100px] animate-float-blob -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/30 rounded-full blur-[100px] animate-float-blob -z-10 pointer-events-none" style={{ animationDelay: '5s' }}></div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-28 z-10 min-h-[600px] flex items-center">
        <div className="container relative">
          <div className="text-center mb-12">
           <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl flex items-center gap-5 justify-center">
              <img src={wsLogo} alt="WorkSupport360" className="h-20 w-20 rounded-2xl shadow-2xl shadow-orange-500/30 ring-2 ring-orange-400/20" />
              <span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Work</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400">Support</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-300 to-blue-400">360</span>
              </span>
            </h1>
            <p className="mb-10 text-lg text-slate-400 max-w-2xl mx-auto">
              The privacy-first freelancing platform for IT professionals. Work on your terms,
              protect your identity, and connect with quality projects.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Become a Freelancer */}
            <Link to="/register" className="group">
              <div className="relative p-8 rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-cyan-900/20 to-indigo-900/20 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-colors" />
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/30">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Become a Freelancer</h2>
                  <p className="text-slate-400 mb-5">Offer your IT skills, set your rates, and earn on your terms</p>
                  <ul className="space-y-2 mb-6">
                    {['Create professional profile', 'Get matched with clients', 'Set your own schedule', 'Earn with transparency'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-3 transition-all">
                    Register as Freelancer <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Need Work Support */}
            <Link to="/register" className="group">
              <div className="relative p-8 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-900/20 to-purple-900/20 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl group-hover:bg-indigo-400/20 transition-colors" />
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Need Work Support</h2>
                  <p className="text-slate-400 mb-5">Find verified IT professionals to help with your projects</p>
                  <ul className="space-y-2 mb-6">
                    {['Browse skilled professionals', 'Search by skills & experience', 'Request free demos', 'Milestone-based payments'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold group-hover:gap-3 transition-all">
                    Register as Client <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-gradient-to-r from-cyan-900/50 to-indigo-900/50 backdrop-blur-sm border-y border-white/5 z-10 relative">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-1">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 bg-[#0f172a] z-10 relative">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-white">Industries We Serve</h2>
            <p className="text-slate-400">Connecting IT talent across diverse sectors</p>
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            {industries.map((industry) => (
              <div key={industry.name} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 hover:bg-cyan-900/20 transition-colors border border-slate-800">
                <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <industry.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-center text-slate-300">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Work Section */}
      <section className="py-16 lg:py-20 z-10 relative">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative order-2 lg:order-1 rounded-2xl overflow-hidden border border-slate-700">
              <img
                src={remoteWorkImage}
                alt="Remote work professional"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10"></div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                Work From Anywhere
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">Seamless Remote Collaboration</h2>
              <p className="text-slate-400 mb-6">
                Our platform is built for the modern remote workforce. Connect with clients through
                video calls, share screens for live demos, and collaborate in real-time regardless of location.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Global Reach</h4>
                    <p className="text-sm text-slate-400">Work with clients worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Flexible Hours</h4>
                    <p className="text-sm text-slate-400">Work on your schedule</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Laptop className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Easy Demos</h4>
                    <p className="text-sm text-slate-400">Screen sharing & live sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Headphones className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">24/7 Support</h4>
                    <p className="text-sm text-slate-400">Help when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Skills We Cover */}
      <section className="py-14 lg:py-18 bg-[#0f172a] z-10 relative">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-white">Skills We Connect</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From frontend to backend, cloud to security - we cover all major IT domains
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techSkills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <skill.icon className="h-4 w-4 text-cyan-400" />
                <span className="font-medium text-sm text-slate-300">{skill.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/10 border-indigo-500/20 border">
              <span className="font-medium text-sm text-indigo-400">+ 100 more skills</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 z-10 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-white">
             Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Work</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Support</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">360</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We've built the platform IT professionals have been waiting for - privacy-focused,
              flexible, and designed for modern remote work.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-cyan-500/30 transition-all shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Office Section */}
      <section className="py-16 lg:py-20 bg-[#0f172a] z-10 relative">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Join Our Network
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">A Thriving Community of Professionals</h2>
              <p className="text-slate-400 mb-6">
                Be part of a growing network of IT professionals who value flexibility, privacy, and
                fair compensation. Our platform brings together the best talent from across India.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Top-Rated Freelancers</h4>
                    <p className="text-sm text-slate-400">Verified skills and client reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Diverse Talent Pool</h4>
                    <p className="text-sm text-slate-400">From freshers to senior architects</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Career Growth</h4>
                    <p className="text-sm text-slate-400">Build your portfolio and reputation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700">
              <img
                src={modernOfficeImage}
                alt="Modern IT workspace"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 z-10 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get started in just 4 simple steps. From signup to your first payment.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent -translate-x-4" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Benefits Section */}
      <section className="py-16 lg:py-20 bg-[#0f172a] z-10 relative">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              For Businesses
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-white">Why Clients Choose Us</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Find the perfect IT professional for your project with our streamlined hiring process
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {clientBenefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:shadow-xl hover:border-indigo-500/30 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{benefit.title}</h3>
                <p className="text-sm text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 z-10 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">What Our Freelancers Say</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of satisfied IT professionals who found their ideal work-life balance
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-slate-800 bg-slate-900/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-indigo-400 text-indigo-400" />
                    ))}
                  </div>
                  <p className="text-slate-400 mb-4 text-sm italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <span className="font-semibold text-cyan-400">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-20 bg-[#0f172a] z-10 relative">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Work on Your Terms</h2>
            <p className="mb-8 text-slate-400">
              Take control of your career with flexibility that fits your lifestyle
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-left">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors">
                  <CheckCircle className="h-5 w-5 text-cyan-400 shrink-0" />
                  <span className="text-sm text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-16 lg:py-20 z-10 relative">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Need IT Support?
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">Hire Top IT Talent Today</h2>
              <p className="text-slate-400 mb-6">
                Browse our pool of verified IT professionals ready to help with your projects.
                From quick fixes to long-term support, find the right talent instantly.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-slate-300">Browse by skills and experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-slate-300">See real-time availability</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-slate-300">Request demos before committing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-slate-300">Multi-language support: Telugu, Hindi, English</span>
                </li>
              </ul>
              <Button asChild size="lg" variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Link to="/browse">
                  Browse Available Talent
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700">
              <img
                src={businessHandshakeImage}
                alt="Business partnership"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-cyan-900/80 to-indigo-900/80 backdrop-blur-md z-10 relative border-t border-white/10">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your Freelancing Journey?
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Join WorkSupport360 today and connect with IT projects that match your skills.
              Your privacy protected, your career elevated.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="gap-2 text-lg px-8 bg-white text-indigo-900 hover:bg-slate-200">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-indigo-900">
                <Link to="/browse">
                  Explore Talent Pool
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Image */}
      <section className="py-16 lg:py-20 bg-[#0f172a] z-10 relative">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700">
              <img
                src={teamImage}
                alt="Team collaboration"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10"></div>
            </div>
            <div>
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">Empowering IT Professionals</h2>
              <p className="text-slate-400 mb-6">
                We believe every IT professional deserves the opportunity to grow their career on their
                own terms. WorkSupport360 bridges the gap between talented developers and businesses seeking
                quality IT support.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                  <Headphones className="h-6 w-6 text-cyan-400 mb-2" />
                  <h4 className="font-semibold text-white">24/7 Support</h4>
                  <p className="text-sm text-slate-400">Always here to help you succeed</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                  <Shield className="h-6 w-6 text-indigo-400 mb-2" />
                  <h4 className="font-semibold text-white">Secure Platform</h4>
                  <p className="text-sm text-slate-400">Your data is always protected</p>
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