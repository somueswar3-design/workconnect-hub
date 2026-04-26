import { useState } from 'react';
import { useNavigate, Link, useSearchParams, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus, Briefcase, Users, CheckCircle2, Sparkles, Star, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authApi } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import wsLogo from '@/assets/worksupport360-logo.png';
import heroFreelancer from '@/assets/hero-freelancer.jpg';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';

const registerSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [searchParams] = useSearchParams();
  // Role is passed as a short opaque token (r=fl|cl) so it isn't human-readable in the URL.
  // Backend re-validates role independently, so this is presentation-only obfuscation.
  const roleToken = (searchParams.get('r') || '').toLowerCase();
  const roleFromToken = roleToken === 'cl' ? 'Client' : roleToken === 'fl' ? 'FreeLancer' : '';
  const [role, setRole] = useState(roleFromToken || 'FreeLancer');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isFreelancer = role.toLowerCase() === 'freelancer';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    const apiRole = isFreelancer ? 'FreeLancer' : 'Client';
    try {
      await authApi.sendOtp(data.email);
      toast.success('OTP sent! Please check your email.');
      navigate('/verify-otp', { state: { email: data.email, password: data.password, role: apiRole } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={wsLogo} alt="WorkSupport360" className="h-10 w-10 rounded-lg" />
            <span className="text-lg font-bold">
              <span className="text-orange-500">Work</span>
              <span className="text-amber-500">Support</span>
              <span className="text-blue-600">360</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-6">Join thousands of professionals & businesses on WorkSupport360.</p>

          {/* Role tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('FreeLancer')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                isFreelancer
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Register as a Freelancer
            </button>
            <button
              type="button"
              onClick={() => setRole('Client')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                !isFreelancer
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4" />
              Hire / Work Support
            </button>
          </div>

          {/* Google — role already chosen on this page, skip the picker */}
          <GoogleAuthButton
            label="Sign up with Google"
            presetRole={isFreelancer ? 'FreeLancer' : 'Client'}
          />

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Email form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-11 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        className="pl-10 pr-10 h-11 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" /> Create account</>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By continuing you agree to our{' '}
            <Link to="/terms-of-service" className="text-gray-600 hover:underline">Terms</Link> &{' '}
            <Link to="/privacy-policy" className="text-gray-600 hover:underline">Privacy Policy</Link>.
          </p>

          <div className="text-center text-sm mt-6">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-blue-600">
        <img
          src={heroFreelancer}
          alt="Freelancers collaborating"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 via-amber-600/70 to-blue-700/80" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider opacity-90">
              {isFreelancer ? 'For Freelancers' : 'For Businesses'}
            </span>
          </div>

          <motion.div
            key={isFreelancer ? 'fl' : 'cl'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">
              {isFreelancer ? (
                <>Find work you<br />love. <span className="text-amber-200">Get paid.</span></>
              ) : (
                <>Hire vetted talent.<br /><span className="text-amber-200">Ship faster.</span></>
              )}
            </h2>
            <p className="text-lg text-white/90 max-w-md">
              {isFreelancer
                ? 'Showcase your skills, connect with global clients, and grow your freelance career on a platform built for you.'
                : 'Access a curated network of skilled IT professionals. From hourly support to full-time engagements — we handle the rest.'}
            </p>

            <ul className="space-y-3 max-w-md">
              {(isFreelancer
                ? [
                    'Build a professional profile in minutes',
                    'Get matched with relevant projects',
                    'Track timesheets, invoices & earnings',
                    'Free to join — no platform fees for you',
                  ]
                : [
                    'Browse pre-vetted IT professionals',
                    'Hourly, part-time or full-time engagements',
                    'Schedule free demo sessions before hiring',
                    'Dedicated HR coordination & support',
                  ]
              ).map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-amber-200 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
            <div>
              <div className="flex items-center gap-1 text-amber-200">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-2xl font-bold">4.9</span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">Avg. rating</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="text-2xl font-bold">10k+</span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">Professionals</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Globe2 className="h-4 w-4" />
                <span className="text-2xl font-bold">25+</span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">Countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
