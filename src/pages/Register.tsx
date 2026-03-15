import { useState } from 'react';
import { useNavigate, Link, useSearchParams, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authApi } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import wsLogo from '@/assets/worksupport360-logo.png';

const registerSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || '';
  const [role, setRole] = useState(roleParam);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const isFreelancer = role.toLowerCase() === 'freelancer';

  // Redirect if already logged in
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
      await authApi.register({ email: data.email, password: data.password, role: apiRole });
      toast.success('Registration successful!');
      try {
        const result = await authApi.login({ email: data.email, password: data.password });
        login(result.token, { email: data.email });
        if (isFreelancer) {
          navigate('/freelancer-profile');
        } else {
          navigate('/client');
        }
      } catch {
        toast.info('Please log in with your new credentials.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If no role selected yet, show role chooser
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
          <Card className="border border-orange-100 bg-white shadow-xl shadow-orange-500/10 rounded-2xl overflow-hidden">
            <CardHeader className="text-center space-y-3 pb-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src={wsLogo} alt="WorkSupport360" className="h-12 w-12 rounded-xl" />
                <span className="text-lg font-bold">
                  <span className="text-orange-500">Work</span>
                  <span className="text-amber-500">Support</span>
                  <span className="text-blue-600">360</span>
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">How would you like to join?</CardTitle>
              <CardDescription className="text-gray-500">Choose your path to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <button
                onClick={() => setRole('FreeLancer')}
                className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left"
              >
                <div className="h-14 w-14 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                  <Briefcase className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Become a Freelancer</p>
                  <p className="text-sm text-gray-500">Offer your skills and find projects</p>
                </div>
              </button>
              <button
                onClick={() => setRole('Client')}
                className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
              >
                <div className="h-14 w-14 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Need Work Support</p>
                  <p className="text-sm text-gray-500">Find talented professionals for your projects</p>
                </div>
              </button>
              <div className="text-center text-sm pt-2">
                <span className="text-gray-500">Already have an account? </span>
                <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium hover:underline">Sign in here</Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <Card className="border border-orange-100 bg-white shadow-xl shadow-orange-500/10 rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={wsLogo} alt="WorkSupport360" className="h-12 w-12 rounded-xl" />
              <span className="text-lg font-bold">
                <span className="text-orange-500">Work</span>
                <span className="text-amber-500">Support</span>
                <span className="text-blue-600">360</span>
              </span>
            </div>

            {/* Role badge */}
            <div className={`inline-flex items-center gap-2 mx-auto px-4 py-2 rounded-full text-sm font-medium ${isFreelancer ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              {isFreelancer ? <Briefcase className="h-4 w-4" /> : <Users className="h-4 w-4" />}
              {isFreelancer ? 'Registering as Freelancer' : 'Registering as Client'}
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">
              {isFreelancer ? 'Become a Freelancer' : 'Get Work Support'}
            </CardTitle>
            <CardDescription className="text-gray-500">
              {isFreelancer ? 'Create your freelancer account' : 'Register as a client to find talent'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input type="email" placeholder="you@example.com" className="pl-10 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500" {...field} />
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
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500" {...field} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25" size="lg" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>}
                </Button>
              </form>
            </Form>

            {/* Change role link */}
            <div className="text-center">
              <button onClick={() => setRole('')} className="text-sm text-gray-400 hover:text-orange-500 underline">
                Change role selection
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium hover:underline">Sign in here</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
