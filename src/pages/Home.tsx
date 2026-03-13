import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign,
  Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award,
  Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare, Briefcase,
  ChevronDown, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import wsLogo from '@/assets/worksupport360-logo.png';
import remoteWorkImage from '@/assets/remote-work.jpg';
import modernOfficeImage from '@/assets/modern-office.jpg';
import businessHandshakeImage from '@/assets/business-handshake.jpg';
import teamImage from '@/assets/team-collaboration.jpg';

const HERO_VIDEO = 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

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
    { name: 'React', icon: Code }, { name: 'Node.js', icon: Database }, { name: 'Python', icon: Code },
    { name: 'AWS', icon: Cloud }, { name: 'DevOps', icon: Lock }, { name: 'Data Science', icon: TrendingUp },
    { name: 'Java', icon: Code }, { name: 'Angular', icon: Code }, { name: '.NET', icon: Database },
    { name: 'Azure', icon: Cloud }, { name: 'Machine Learning', icon: TrendingUp }, { name: 'Cybersecurity', icon: Shield },
  ];

  const stats = [
    { value: '500+', label: 'Active Freelancers' },
    { value: '1,200+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ];

  const testimonials = [
    { name: 'Rajesh K.', role: 'Full Stack Developer', company: 'Hyderabad', text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind while freelancing alongside my regular job.', rating: 5 },
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
    { name: 'FinTech', icon: DollarSign }, { name: 'Healthcare', icon: Heart },
    { name: 'E-Commerce', icon: Target }, { name: 'EdTech', icon: BookOpen },
    { name: 'SaaS', icon: Cloud }, { name: 'Startups', icon: Laptop },
  ];

  const clientBenefits = [
    { icon: ThumbsUp, title: 'Verified Professionals', description: 'All freelancers are verified and skill-assessed' },
    { icon: Clock, title: 'Quick Hiring', description: 'Find and hire talent within hours, not weeks' },
    { icon: MessageSquare, title: 'Multi-language Support', description: 'Communicate in Telugu, Hindi, or English' },
    { icon: Shield, title: 'Secure Payments', description: 'Protected transactions with milestone-based payments' },
  ];

  return (
    <div className="flex flex-col bg-[#0A1628] text-slate-100 relative overflow-hidden min-h-screen">

      {/* ===== FULL-SCREEN VIDEO HERO ===== */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/50 to-[#0A1628]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/70 via-transparent to-[#0A1628]/70" />

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 120 + i * 60,
                height: 120 + i * 60,
                left: `${15 + i * 14}%`,
                top: `${10 + i * 12}%`,
                background: i % 2 === 0
                  ? 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(26,110,255,0.08) 0%, transparent 70%)',
              }}
              animate={{
                x: [0, 30 - i * 10, 0],
                y: [0, 20 + i * 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_60px_rgba(0,212,255,0.3)] mx-auto">
                <img src={wsLogo} alt="WorkSupport360" className="w-full h-full object-contain p-1" />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-6 bg-cyan-500/15 text-cyan-300 border-cyan-500/30 backdrop-blur-sm text-sm px-5 py-2 font-medium tracking-wide">
                🚀 360° IT Solutions — On Demand
              </Badge>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Connect with Top
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                IT Professionals
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The privacy-first freelancing platform. Find skilled developers, designers & tech experts.
              Work on your terms, protect your identity, grow your career.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border-0 font-bold">
                  <Link to="/register?role=FreeLancer">
                    Become a Freelancer
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/20 hover:text-white backdrop-blur-sm font-bold">
                  <Link to="/register?role=Client">
                    Need Work Support
                    <Users className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs md:text-sm text-slate-400 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-cyan-400/60" />
        </motion.div>
      </section>

      {/* ===== ROLE SELECTION CARDS ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Get Started Today</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Choose your path and join our growing community of IT professionals</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Freelancer Card */}
            <Link to="/register?role=FreeLancer" className="group">
              <motion.div
                whileHover={{ y: -8 }}
                className="relative p-8 rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-cyan-900/20 to-[#0A1628] hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden"
              >
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
              </motion.div>
            </Link>

            {/* Client Card */}
            <Link to="/register?role=Client" className="group">
              <motion.div
                whileHover={{ y: -8 }}
                className="relative p-8 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-900/20 to-[#0A1628] hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 overflow-hidden"
              >
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
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="py-14 relative z-10 border-y border-white/5 bg-gradient-to-b from-[#0A1628] to-[#0d1d35]">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-white">Industries We Serve</h2>
            <p className="text-slate-400">Connecting IT talent across diverse sectors</p>
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            {industries.map((industry) => (
              <motion.div
                key={industry.name}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 hover:bg-cyan-900/20 transition-colors border border-slate-800 hover:border-cyan-500/30"
              >
                <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <industry.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-center text-slate-300">{industry.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REMOTE WORK SECTION ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative order-2 lg:order-1 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img src={remoteWorkImage} alt="Remote work professional" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10" />
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Work From Anywhere</Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">Seamless Remote Collaboration</h2>
              <p className="text-slate-400 mb-6">
                Our platform is built for the modern remote workforce. Connect with clients through
                video calls, share screens for live demos, and collaborate in real-time regardless of location.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Globe, color: 'cyan', title: 'Global Reach', desc: 'Work with clients worldwide' },
                  { icon: Clock, color: 'indigo', title: 'Flexible Hours', desc: 'Work on your schedule' },
                  { icon: Laptop, color: 'cyan', title: 'Easy Demos', desc: 'Screen sharing & live sessions' },
                  { icon: Headphones, color: 'indigo', title: '24/7 Support', desc: 'Help when you need it' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-5 w-5 text-${item.color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TECH SKILLS ===== */}
      <section className="py-16 relative z-10 bg-[#0d1d35]/50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-white">Skills We Connect</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From frontend to backend, cloud to security — we cover all major IT domains</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techSkills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.08, borderColor: 'rgba(0,212,255,0.5)' }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/50 border border-slate-700 transition-colors"
              >
                <skill.icon className="h-4 w-4 text-cyan-400" />
                <span className="font-medium text-sm text-slate-300">{skill.name}</span>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/10 border-indigo-500/20 border">
              <span className="font-medium text-sm text-indigo-400">+ 100 more skills</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">WorkSupport360</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We've built the platform IT professionals have been waiting for — privacy-focused,
              flexible, and designed for modern remote work.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-cyan-500/30 transition-all shadow-lg h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
                      <feature.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY SECTION ===== */}
      <section className="py-20 bg-[#0d1d35]/50 relative z-10">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Join Our Network</Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">A Thriving Community of Professionals</h2>
              <p className="text-slate-400 mb-6">
                Be part of a growing network of IT professionals who value flexibility, privacy, and
                fair compensation. Our platform brings together the best talent from across India.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Award, color: 'cyan', title: 'Top-Rated Freelancers', desc: 'Verified skills and client reviews' },
                  { icon: Users, color: 'indigo', title: 'Diverse Talent Pool', desc: 'From freshers to senior architects' },
                  { icon: TrendingUp, color: 'cyan', title: 'Career Growth', desc: 'Build your portfolio and reputation' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className={`h-12 w-12 rounded-full bg-${item.color}-500/10 flex items-center justify-center`}>
                      <item.icon className={`h-6 w-6 text-${item.color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img src={modernOfficeImage} alt="Modern IT workspace" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Get started in just 4 simple steps. From signup to your first payment.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLIENT BENEFITS ===== */}
      <section className="py-20 bg-[#0d1d35]/50 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">For Businesses</Badge>
            <h2 className="text-3xl font-bold mb-4 text-white">Why Clients Choose Us</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Find the perfect IT professional for your project with our streamlined hiring process</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {clientBenefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:shadow-xl hover:border-indigo-500/30 transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{benefit.title}</h3>
                <p className="text-sm text-slate-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">What Our Freelancers Say</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Join thousands of satisfied IT professionals who found their ideal work-life balance</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-slate-800 bg-slate-900/50 h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 bg-[#0d1d35]/50 relative z-10">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Work on Your Terms</h2>
            <p className="mb-8 text-slate-400">Take control of your career with flexibility that fits your lifestyle</p>
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

      {/* ===== HIRE TALENT ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Need IT Support?</Badge>
              <h2 className="text-3xl font-bold mb-4 text-white">Hire Top IT Talent Today</h2>
              <p className="text-slate-400 mb-6">
                Browse our pool of verified IT professionals ready to help with your projects.
                From quick fixes to long-term support, find the right talent instantly.
              </p>
              <ul className="space-y-3 mb-6">
                {['Browse by skills and experience', 'See real-time availability', 'Request demos before committing', 'Multi-language support: Telugu, Hindi, English'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Link to="/browse">Browse Available Talent <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img src={businessHandshakeImage} alt="Business partnership" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-cyan-900/80 to-indigo-900/80 backdrop-blur-md relative z-10 border-t border-white/10">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Start Your Freelancing Journey?</h2>
              <p className="mb-8 text-lg text-slate-300">
                Join WorkSupport360 today and connect with IT projects that match your skills.
                Your privacy protected, your career elevated.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8 bg-white text-indigo-900 hover:bg-slate-200 font-bold">
                  <Link to="/register?role=FreeLancer">Get Started Free <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-indigo-900 font-bold">
                  <Link to="/browse">Explore Talent Pool</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MISSION SECTION ===== */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img src={teamImage} alt="Team collaboration" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10" />
            </div>
            <div>
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Our Mission</Badge>
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
