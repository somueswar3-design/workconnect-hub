import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Users, Shield, Zap, CheckCircle, Star, Clock, DollarSign, Globe, Headphones, Code, Database, Cloud, Lock, TrendingUp, Award, Laptop, BookOpen, Target, Heart, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroSlider from '@/components/HeroSlider';
import teamImage from '@/assets/team-collaboration.jpg';
import modernOfficeImage from '@/assets/modern-office.jpg';
import remoteWorkImage from '@/assets/remote-work.jpg';
import businessHandshakeImage from '@/assets/business-handshake.jpg';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const }
  }
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const }
  }
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const
  }
};

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
    <div className="flex flex-col overflow-hidden">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="py-10 bg-primary">
        <div className="container">
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                variants={staggerItem}
              >
                <motion.p 
                  className="text-4xl font-bold text-primary-foreground mb-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 bg-card">
        <div className="container">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold mb-2">Industries We Serve</h2>
            <p className="text-muted-foreground">Connecting IT talent across diverse sectors</p>
          </motion.div>
          <motion.div 
            className="grid gap-4 grid-cols-3 md:grid-cols-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {industries.map((industry) => (
              <motion.div 
                key={industry.name} 
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors cursor-pointer"
                variants={staggerItem}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <industry.icon className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-center">{industry.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Remote Work Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div 
              className="relative order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"
                animate={floatAnimation}
              />
              <motion.img 
                src={remoteWorkImage} 
                alt="Remote work professional" 
                className="relative rounded-3xl shadow-2xl w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div 
              className="order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Work From Anywhere
                </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold mb-4"
                variants={staggerItem}
              >
                Seamless Remote Collaboration
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                variants={staggerItem}
              >
                Our platform is built for the modern remote workforce. Connect with clients through 
                video calls, share screens for live demos, and collaborate in real-time regardless of location.
              </motion.p>
              <motion.div 
                className="grid gap-4 sm:grid-cols-2"
                variants={staggerContainer}
              >
                {[
                  { icon: Globe, title: 'Global Reach', desc: 'Work with clients worldwide', primary: true },
                  { icon: Clock, title: 'Flexible Hours', desc: 'Work on your schedule', primary: false },
                  { icon: Laptop, title: 'Easy Demos', desc: 'Screen sharing & live sessions', primary: true },
                  { icon: Headphones, title: '24/7 Support', desc: 'Help when you need it', primary: false },
                ].map((item) => (
                  <motion.div 
                    key={item.title}
                    className="flex items-start gap-3"
                    variants={staggerItem}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className={`h-10 w-10 rounded-lg ${item.primary ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon className={`h-5 w-5 ${item.primary ? 'text-primary' : 'text-secondary'}`} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Skills We Cover */}
      <section className="py-14 lg:py-18 bg-card">
        <div className="container">
          <motion.div 
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Skills We Connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From frontend to backend, cloud to security - we cover all major IT domains
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {techSkills.map((skill) => (
              <motion.div 
                key={skill.name} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border hover:border-primary transition-colors cursor-pointer"
                variants={staggerItem}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <skill.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{skill.name}</span>
              </motion.div>
            ))}
            <motion.div 
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border-secondary/20 border"
              variants={staggerItem}
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: ["0 0 0px hsl(var(--secondary))", "0 0 20px hsl(var(--secondary) / 0.3)", "0 0 0px hsl(var(--secondary))"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="font-medium text-sm text-secondary">+ 100 more skills</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="mb-4 text-3xl font-bold">
              Why Choose <span className="text-primary">IT</span>
              <span className="text-secondary">Work</span>
              <span className="text-primary">Help</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built the platform IT professionals have been waiting for - privacy-focused, 
              flexible, and designed for modern remote work.
            </p>
          </motion.div>
          <motion.div 
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -10 }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern Office Section */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                  Join Our Network
                </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold mb-4"
                variants={staggerItem}
              >
                A Thriving Community of Professionals
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                variants={staggerItem}
              >
                Be part of a growing network of IT professionals who value flexibility, privacy, and 
                fair compensation. Our platform brings together the best talent from across India.
              </motion.p>
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
              >
                {[
                  { icon: Award, title: 'Top-Rated Freelancers', desc: 'Verified skills and client reviews', primary: true },
                  { icon: Users, title: 'Diverse Talent Pool', desc: 'From freshers to senior architects', primary: false },
                  { icon: TrendingUp, title: 'Career Growth', desc: 'Build your portfolio and reputation', primary: true },
                ].map((item) => (
                  <motion.div 
                    key={item.title}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background"
                    variants={staggerItem}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <motion.div 
                      className={`h-12 w-12 rounded-full ${item.primary ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={`h-6 w-6 ${item.primary ? 'text-primary' : 'text-secondary'}`} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl"
                animate={floatAnimation}
              />
              <motion.img 
                src={modernOfficeImage} 
                alt="Modern IT workspace" 
                className="relative rounded-3xl shadow-2xl w-full"
                whileHover={{ scale: 1.02, rotate: -1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps. From signup to your first payment.
            </p>
          </motion.div>
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {howItWorks.map((item, index) => (
              <motion.div 
                key={item.step} 
                className="relative"
                variants={staggerItem}
              >
                {index < howItWorks.length - 1 && (
                  <motion.div 
                    className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-4"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  />
                )}
                <motion.div 
                  className="flex flex-col items-center text-center"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client Benefits Section */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              For Businesses
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why Clients Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect IT professional for your project with our streamlined hiring process
            </p>
          </motion.div>
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {clientBenefits.map((benefit) => (
              <motion.div 
                key={benefit.title} 
                className="text-center p-6 rounded-2xl bg-background hover:shadow-lg transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <benefit.icon className="h-7 w-7 text-secondary" />
                </motion.div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">What Our Freelancers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied IT professionals who found their ideal work-life balance
            </p>
          </motion.div>
          <motion.div 
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={staggerItem}
                whileHover={{ y: -10 }}
              >
                <Card className="border-none shadow-lg h-full">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="flex gap-1 mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
                        >
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <p className="text-muted-foreground mb-4 text-sm italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="font-semibold text-primary">{testimonial.name[0]}</span>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="mb-4 text-3xl font-bold"
              variants={staggerItem}
            >
              Work on Your Terms
            </motion.h2>
            <motion.p 
              className="mb-8 text-muted-foreground"
              variants={staggerItem}
            >
              Take control of your career with flexibility that fits your lifestyle
            </motion.p>
            <motion.div 
              className="grid gap-3 sm:grid-cols-2 text-left"
              variants={staggerContainer}
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={benefit} 
                  className="flex items-center gap-3 p-4 rounded-lg bg-background border hover:border-primary/50 transition-colors"
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  </motion.div>
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                  Need IT Support?
                </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold mb-4"
                variants={staggerItem}
              >
                Hire Top IT Talent Today
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                variants={staggerItem}
              >
                Browse our pool of verified IT professionals ready to help with your projects. 
                From quick fixes to long-term support, find the right talent instantly.
              </motion.p>
              <motion.ul 
                className="space-y-3 mb-6"
                variants={staggerContainer}
              >
                {[
                  'Browse by skills and experience',
                  'See real-time availability',
                  'Request demos before committing',
                  'Multi-language support: Telugu, Hindi, English',
                ].map((item, index) => (
                  <motion.li 
                    key={item}
                    className="flex items-center gap-3"
                    variants={staggerItem}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="h-5 w-5 text-secondary" />
                    </motion.div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div 
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline" className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Link to="/browse">
                    Browse Available Talent
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl"
                animate={floatAnimation}
              />
              <motion.img 
                src={businessHandshakeImage} 
                alt="Business partnership" 
                className="relative rounded-3xl shadow-2xl w-full"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
        <div className="container relative">
          {/* Animated background elements */}
          <motion.div 
            className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          
          <motion.div 
            className="mx-auto max-w-3xl text-center relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl"
              variants={fadeInUp}
            >
              Ready to Start Your Freelancing Journey?
            </motion.h2>
            <motion.p 
              className="mb-8 text-lg text-primary-foreground/80"
              variants={fadeInUp}
            >
              Join ITWorkHelp today and connect with IT projects that match your skills. 
              Your privacy protected, your career elevated.
            </motion.p>
            <motion.div 
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              variants={staggerContainer}
            >
              <motion.div 
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="secondary" className="gap-2 text-lg px-8">
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/browse">
                    Explore Talent Pool
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section with Image */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"
                animate={floatAnimation}
              />
              <motion.img 
                src={teamImage} 
                alt="Team collaboration" 
                className="relative rounded-3xl shadow-2xl w-full"
                whileHover={{ scale: 1.02, rotate: -1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Our Mission
                </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold mb-4"
                variants={staggerItem}
              >
                Empowering IT Professionals
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                variants={staggerItem}
              >
                We believe every IT professional deserves the opportunity to grow their career on their 
                own terms. ITWorkHelp bridges the gap between talented developers and businesses seeking 
                quality IT support.
              </motion.p>
              <motion.div 
                className="grid gap-4 sm:grid-cols-2"
                variants={staggerContainer}
              >
                <motion.div 
                  className="p-4 rounded-lg bg-background"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Headphones className="h-6 w-6 text-primary mb-2" />
                  </motion.div>
                  <h4 className="font-semibold">24/7 Support</h4>
                  <p className="text-sm text-muted-foreground">Always here to help you succeed</p>
                </motion.div>
                <motion.div 
                  className="p-4 rounded-lg bg-background"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Shield className="h-6 w-6 text-secondary mb-2" />
                  </motion.div>
                  <h4 className="font-semibold">Secure Platform</h4>
                  <p className="text-sm text-muted-foreground">Your data is always protected</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
