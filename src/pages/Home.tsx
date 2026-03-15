import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign,
  Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award,
  Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare, Briefcase,
  ChevronDown, Play, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import RequirementsGrid from '@/components/RequirementsGrid';
import wsLogo from '@/assets/worksupport360-logo.png';

const Home = () => {
  const popularSearches = ['React', 'Node.js', 'Python', 'AWS', 'DevOps', 'Data Science', '.NET', 'Angular'];

  const stats = [
    { value: '500+', label: 'Active Freelancers' },
    { value: '1,200+', label: 'Projects Delivered' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const techSkills = [
    { name: 'React', icon: Code }, { name: 'Node.js', icon: Database }, { name: 'Python', icon: Code },
    { name: 'AWS', icon: Cloud }, { name: 'DevOps', icon: Lock }, { name: 'Data Science', icon: TrendingUp },
    { name: 'Java', icon: Code }, { name: 'Angular', icon: Code }, { name: '.NET', icon: Database },
    { name: 'Azure', icon: Cloud }, { name: 'Machine Learning', icon: TrendingUp }, { name: 'Cybersecurity', icon: Shield },
  ];

  const testimonials = [
    { name: 'Rajesh K.', role: 'Full Stack Developer', location: 'Hyderabad', text: 'WorkSupport360 connected me with amazing clients. The privacy features give me peace of mind.', rating: 5, avatar: 'R' },
    { name: 'Priya M.', role: 'DevOps Engineer', location: 'Bangalore', text: 'Finally, a platform that respects my time. I can work on my terms without compromising.', rating: 5, avatar: 'P' },
    { name: 'Suresh R.', role: 'Data Scientist', location: 'Chennai', text: 'The matching system is incredible. I only get projects that match my skills perfectly.', rating: 5, avatar: 'S' },
    { name: 'Lakshmi S.', role: 'React Developer', location: 'Vizag', text: 'Great platform for IT professionals. Tracking engagements is seamless and intuitive.', rating: 5, avatar: 'L' },
  ];

  const howItWorks = [
    { step: '1', title: 'Create Your Profile', description: 'Sign up, upload your resume, and let our smart system auto-fill your skills.', icon: Laptop, color: 'bg-emerald-500' },
    { step: '2', title: 'Browse & Match', description: 'Find projects that match your skills or get matched by clients looking for talent.', icon: Search, color: 'bg-blue-500' },
    { step: '3', title: 'Express Interest', description: 'Click "I\'m Interested" on projects you love and get connected with clients.', icon: Heart, color: 'bg-orange-500' },
    { step: '4', title: 'Get Paid', description: 'Complete work, track earnings, and receive timely payments for your expertise.', icon: DollarSign, color: 'bg-emerald-600' },
  ];

  const trustedBy = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Startups'];

  return (
    <div className="flex flex-col bg-white text-gray-900 min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.2) 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find the perfect <br />
              <span className="text-emerald-400">IT freelance</span> services <br />
              for your business
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl">
              Connect with top-tier IT professionals. Privacy-first, flexible, and built for modern remote work.
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-xl max-w-xl">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <Input
                  placeholder="Search for skills or services..."
                  className="border-0 shadow-none text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 bg-transparent"
                />
              </div>
              <Button className="rounded-none rounded-r-lg h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold border-0">
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-slate-400">Popular:</span>
              {popularSearches.slice(0, 5).map(s => (
                <span key={s} className="text-sm px-3 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-emerald-400 hover:text-emerald-400 cursor-pointer transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Trusted By strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center gap-6"
          >
            <span className="text-sm text-slate-400 font-medium">Trusted by:</span>
            {trustedBy.map(name => (
              <span key={name} className="text-sm font-semibold text-slate-400/80 tracking-wide">{name}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== ROLE SELECTION ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How would you like to get started?</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Choose your path and join thousands of IT professionals and businesses</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Freelancer */}
            <Link to="/register?role=FreeLancer" className="group">
              <motion.div whileHover={{ y: -4 }} className="relative bg-white rounded-2xl border-2 border-gray-100 p-8 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">For Freelancers</Badge>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                  <Briefcase className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Become a Freelancer</h3>
                <p className="text-gray-500 text-sm mb-5">Offer your IT skills, set your own rates, and earn on your terms.</p>
                <ul className="space-y-2.5 mb-6">
                  {['Create your professional profile', 'Get matched with projects', 'Set your own schedule & rates', 'Privacy-protected identity'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Start as Freelancer <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            </Link>

            {/* Client */}
            <Link to="/register?role=Client" className="group">
              <motion.div whileHover={{ y: -4 }} className="relative bg-white rounded-2xl border-2 border-gray-100 p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">For Businesses</Badge>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Need Work Support</h3>
                <p className="text-gray-500 text-sm mb-5">Find verified IT professionals to power your projects.</p>
                <ul className="space-y-2.5 mb-6">
                  {['Browse skilled professionals', 'Post your requirements', 'Request free demos', 'Milestone-based payments'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Hire Talent <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LIVE REQUIREMENTS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-3 bg-emerald-50 text-emerald-600 border-emerald-200">🔥 Live Projects</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Latest Project Requirements</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Browse real client requirements. Find a project that matches your skills and express your interest!</p>
          </motion.div>
          <RequirementsGrid variant="public" maxItems={9} theme="light" />
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg" className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
              <Link to="/login">
                Login to See All & Apply <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {stats.map(stat => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Get started in just 4 simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`h-14 w-14 rounded-full ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Skills</h2>
            <p className="text-gray-500">Find talent across all major IT domains</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techSkills.map(skill => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
              >
                <skill.icon className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-sm text-gray-700">{skill.name}</span>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="font-medium text-sm text-emerald-600">+ 100 more</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Freelancers Say</h2>
            <p className="text-gray-500">Join thousands of satisfied IT professionals</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full bg-white">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 italic leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="font-bold text-emerald-600">{t.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.role} • {t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-lg text-slate-300 mb-8">
                Join WorkSupport360 today. Your privacy protected, your career elevated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8 bg-emerald-500 hover:bg-emerald-600 border-0 font-bold text-white">
                  <Link to="/register?role=FreeLancer">Get Started Free <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-white/30 text-white hover:bg-white/10 font-bold">
                  <Link to="/browse">Explore Talent</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
