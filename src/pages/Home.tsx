import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign,
  Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award,
  Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare, Briefcase,
  ChevronDown, Play, Search, BarChart3, FileText, Cpu, Palette,
  Building2, GraduationCap, Stethoscope, ShoppingCart, Landmark, Truck,
  Smartphone, Settings, PieChart, MonitorPlay, User, MapPin, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import RequirementsGrid from '@/components/RequirementsGrid';
import { useAuth } from '@/contexts/AuthContext';
import { getMockFreelancers } from '@/services/mockFreelancerData';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const projectsRef = useRef<HTMLDivElement>(null);

  // Get sample freelancers for the showcase
  const sampleFreelancers = useMemo(() => {
    const all = getMockFreelancers();
    return all.filter(f => f.availability === 'available').slice(0, 12);
  }, []);

  const popularSkills = [
    'React', 'Node.js', 'Python', 'AWS', 'DevOps', '.NET', 'Angular', 'Java',
    'TypeScript', 'Docker', 'Kubernetes', 'Azure', 'SQL Server', 'MongoDB',
    'Power BI', 'Salesforce', 'SAP', 'Terraform', 'GraphQL', 'Flutter',
    'iOS', 'Android', 'Golang', 'Rust', 'PHP', 'Laravel', 'Django',
    'Machine Learning', 'Data Engineering', 'Cybersecurity', 'Blockchain',
    'ServiceNow', 'Tableau', 'Snowflake', 'Figma', 'UI/UX Design',
  ];

  const stats = [
    { value: '500+', label: 'Active Freelancers' },
    { value: '1,200+', label: 'Projects Delivered' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const domains = [
    { name: 'IT & Software', icon: Code, color: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
    { name: 'Finance & Banking', icon: Landmark, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { name: 'Healthcare', icon: Stethoscope, color: 'bg-rose-500', lightBg: 'bg-rose-50', textColor: 'text-rose-600' },
    { name: 'HR & Recruitment', icon: Users, color: 'bg-violet-500', lightBg: 'bg-violet-50', textColor: 'text-violet-600' },
    { name: 'E-Commerce', icon: ShoppingCart, color: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
    { name: 'Data & Analytics', icon: BarChart3, color: 'bg-cyan-500', lightBg: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { name: 'Cloud & DevOps', icon: Cloud, color: 'bg-indigo-500', lightBg: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { name: 'Cybersecurity', icon: Shield, color: 'bg-red-500', lightBg: 'bg-red-50', textColor: 'text-red-600' },
    { name: 'Mobile Apps', icon: Smartphone, color: 'bg-pink-500', lightBg: 'bg-pink-50', textColor: 'text-pink-600' },
    { name: 'AI & Machine Learning', icon: Cpu, color: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
    { name: 'Education & EdTech', icon: GraduationCap, color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-600' },
    { name: 'Logistics & Supply Chain', icon: Truck, color: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600' },
    { name: 'UI/UX Design', icon: Palette, color: 'bg-fuchsia-500', lightBg: 'bg-fuchsia-50', textColor: 'text-fuchsia-600' },
    { name: 'ERP & CRM', icon: Settings, color: 'bg-slate-500', lightBg: 'bg-slate-50', textColor: 'text-slate-600' },
    { name: 'Digital Marketing', icon: MonitorPlay, color: 'bg-lime-600', lightBg: 'bg-lime-50', textColor: 'text-lime-700' },
    { name: 'Business Intelligence', icon: PieChart, color: 'bg-sky-500', lightBg: 'bg-sky-50', textColor: 'text-sky-600' },
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

  const handleHeroSearch = () => {
    setActiveSearch(heroSearch);
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSkillClick = (skill: string) => {
    setHeroSearch(skill);
    setActiveSearch(skill);
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
              Connect with top-tier IT professionals across every domain. Privacy-first, flexible, and built for modern remote work.
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-xl max-w-xl">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <Input
                  placeholder="Search for skills or services..."
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
                  className="border-0 shadow-none text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 bg-transparent"
                />
              </div>
              <Button
                onClick={handleHeroSearch}
                className="rounded-none rounded-r-lg h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold border-0"
              >
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-slate-400">Popular:</span>
              {popularSkills.slice(0, 6).map(s => (
                <span
                  key={s}
                  onClick={() => handleSkillClick(s)}
                  className="text-sm px-3 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-emerald-400 hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== POPULAR IT SKILLS ===== */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-emerald-50 text-emerald-600 border-emerald-200">Popular Skills</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trending IT Skills</h2>
            <p className="text-gray-500 text-sm">Click any skill to find matching projects</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {popularSkills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleSkillClick(skill)}
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-600 cursor-pointer transition-all"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE REQUIREMENTS ===== */}
      <section ref={projectsRef} className="py-16 bg-gray-50">
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
          <RequirementsGrid variant="public" maxItems={9} theme="light" externalSearch={activeSearch} hideFilters />
          {!isAuthenticated && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                <Link to="/register?role=FreeLancer">
                  Join to See All & Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== DOMAINS & TECHNOLOGIES ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-purple-50 text-purple-600 border-purple-200">All Domains</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Every Industry & Technology</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From IT to Healthcare, Finance to Logistics — find experts across every domain</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {domains.map((domain, i) => (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`${domain.lightBg} rounded-xl p-4 border border-transparent hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className={`h-10 w-10 rounded-lg ${domain.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  <domain.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className={`font-semibold text-sm ${domain.textColor}`}>{domain.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FIND FREELANCERS - WORK TYPES (guests only) ===== */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-orange-50 text-orange-600 border-orange-200">Find Freelancers</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Perfect for Your Work Needs</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Hire skilled IT freelancers — hourly, part-time, or full-time. Flexible engagement models to suit every project.</p>
            </div>

            {/* Work type cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {[
                { title: 'Hourly Basis', desc: 'Pay only for the hours worked. Ideal for short tasks, bug fixes, or consulting.', icon: Clock, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600', features: ['Flexible hours', 'No commitment', 'Pay as you go'] },
                { title: 'Part-Time', desc: 'Engage freelancers for 20 hrs/week. Perfect for ongoing support or side projects.', icon: Timer, color: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600', features: ['20 hrs/week', 'Dedicated support', 'Cost effective'] },
                { title: 'Full-Time', desc: 'Hire dedicated freelancers for 40 hrs/week. Best for long-term project needs.', icon: Briefcase, color: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600', features: ['40 hrs/week', 'Full dedication', 'Team integration'] },
              ].map((type, i) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate('/login')}
                  className="cursor-pointer group"
                >
                  <Card className="border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full bg-white">
                    <CardContent className="pt-6">
                      <div className={`h-12 w-12 rounded-xl ${type.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                        <type.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{type.desc}</p>
                      <ul className="space-y-2">
                        {type.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className={`h-3.5 w-3.5 ${type.textColor} shrink-0`} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className={`flex items-center gap-1.5 mt-4 text-sm font-semibold ${type.textColor} group-hover:gap-2.5 transition-all`}>
                        Hire Now <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Freelancer Services Grid */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Freelancer Services</h3>
                <p className="text-gray-500 text-sm">Browse popular services offered by our freelancers</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[
                  { title: 'Web Development', skills: 'React, Angular, Vue', icon: Code, color: 'bg-blue-500' },
                  { title: 'Mobile Apps', skills: 'React Native, Flutter', icon: Smartphone, color: 'bg-pink-500' },
                  { title: 'Cloud & DevOps', skills: 'AWS, Azure, Docker', icon: Cloud, color: 'bg-indigo-500' },
                  { title: 'Data Science', skills: 'Python, ML, AI', icon: BarChart3, color: 'bg-cyan-500' },
                  { title: 'UI/UX Design', skills: 'Figma, Adobe, CSS', icon: Palette, color: 'bg-fuchsia-500' },
                  { title: 'Cybersecurity', skills: 'Pentesting, SIEM', icon: Shield, color: 'bg-red-500' },
                  { title: 'Backend Dev', skills: 'Node.js, Java, .NET', icon: Database, color: 'bg-emerald-500' },
                  { title: 'ERP & CRM', skills: 'SAP, Salesforce', icon: Settings, color: 'bg-amber-500' },
                ].map((service, i) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate('/login')}
                    className="cursor-pointer group"
                  >
                    <Card className="border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all h-full bg-white">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg ${service.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <service.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">{service.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{service.skills}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Available Freelancers Mini Grid */}
            <div>
              <div className="text-center mb-8">
                <Badge className="mb-3 bg-blue-50 text-blue-600 border-blue-200">👨‍💻 Available Now</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Available Freelancers</h3>
                <p className="text-gray-500 text-sm">Verified professionals ready to start immediately</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
                {sampleFreelancers.map((freelancer, i) => (
                  <motion.div
                    key={freelancer.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate('/login')}
                    className="cursor-pointer group"
                  >
                    <Card className="border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all bg-white">
                      <CardContent className="p-3 text-center">
                        <div className="relative mx-auto mb-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center mx-auto">
                            <User className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="absolute -bottom-0.5 right-1/2 translate-x-[18px] h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                        </div>
                        <h4 className="font-semibold text-xs text-gray-900 truncate">{freelancer.aliasName}</h4>
                        <p className="text-[10px] text-gray-400 truncate">{freelancer.skills[0]}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <MapPin className="h-2.5 w-2.5 text-gray-400" />
                          <span className="text-[10px] text-gray-400 truncate">{freelancer.location}</span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 mt-1">{freelancer.hourlyRate}/hr</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button onClick={() => navigate('/login')} variant="outline" size="lg" className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                  View All 500+ Freelancers <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== ROLE SELECTION (only for non-authenticated users) ===== */}
      {!isAuthenticated && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">How would you like to get started?</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Choose your path and join thousands of IT professionals and businesses</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link to="/register?role=FreeLancer" className="group">
                <motion.div whileHover={{ y: -4 }} className="relative bg-white rounded-2xl border-2 border-gray-100 p-8 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">For Freelancers</Badge>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                    <Briefcase className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Register as a Freelancer</h3>
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
      )}

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 bg-gray-50">
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
                  <Link to="/register?role=Client">Hire Talent</Link>
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
