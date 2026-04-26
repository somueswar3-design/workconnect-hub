import { useState } from 'react';
import { useNavigate, Link, Navigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, Sparkles, Star, Users, Globe2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/authApi';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import wsLogo from '@/assets/worksupport360-logo.png';
import heroFreelancer from '@/assets/hero-freelancer.jpg';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const storedRedirect = (() => { try { return sessionStorage.getItem('post_login_redirect'); } catch { return null; } })();
  const redirectTo = redirectParam || storedRedirect || '';
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authApi.login({ email, password, twoFactorCode: twoFactorCode || undefined });
      login(result.token, { email });
      toast.success('Login successful!');

      const claims = JSON.parse(atob(result.token.split('.')[1]));
      const role = String(claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'FreeLancer');
      const userId = String(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '');

      const consumeRedirect = () => {
        const target = redirectTo;
        try { sessionStorage.removeItem('post_login_redirect'); } catch {}
        return target;
      };

      if (role.toLowerCase() === 'freelancer') {
        try {
          const statusRes = await fetch(
            `${API_BASE_URL}/api/freelancer/profile-status?userId=${userId}`,
            { headers: { 'Authorization': `Bearer ${result.token}` } }
          );
          const statusData = await statusRes.json();
          const target = consumeRedirect();
          if (!statusData.profileUpdated) navigate('/freelancer-profile');
          else navigate(target || '/');
        } catch {
          navigate('/freelancer-profile');
        }
      } else {
        const target = consumeRedirect();
        navigate(target || '/');
      }
    } catch (error: any) {
      if (error.message?.toLowerCase().includes('two-factor') || error.message?.toLowerCase().includes('2fa')) {
        setShow2FA(true);
        toast.info('Please enter your 2FA code.');
      } else {
        toast.error(error.message || 'Invalid credentials.');
      }
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
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={wsLogo} alt="WorkSupport360" className="h-10 w-10 rounded-lg" />
            <span className="text-lg font-bold">
              <span className="text-orange-500">Work</span>
              <span className="text-amber-500">Support</span>
              <span className="text-blue-600">360</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-6">Sign in to continue to your dashboard.</p>

          <GoogleAuthButton label="Sign in with Google" />

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or sign in with email</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Link to="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {show2FA && (
              <div className="space-y-2">
                <Label htmlFor="2fa" className="text-gray-700">Two-Factor Code</Label>
                <Input
                  id="2fa"
                  type="text"
                  placeholder="Enter 2FA code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="h-11 border-gray-200 focus-visible:ring-orange-500"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="mr-2 h-4 w-4" /> Sign in</>
              )}
            </Button>
          </form>

          <div className="text-center text-sm mt-6">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold hover:underline">
              Register
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-amber-500 to-orange-500">
        <img
          src={heroFreelancer}
          alt="WorkSupport360 community"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 via-amber-600/70 to-orange-600/80" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider opacity-90">
              Welcome to WorkSupport360
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">
              Where talent meets <span className="text-amber-200">opportunity.</span>
            </h2>
            <p className="text-lg text-white/90 max-w-md">
              Sign in to manage projects, track timesheets, and connect with the global community of professionals & businesses.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-amber-200 to-orange-300" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-200">
                  {[0,1,2,3,4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-white/80 text-xs mt-0.5">Trusted by 10,000+ users</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
            <div>
              <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /><span className="text-2xl font-bold">100%</span></div>
              <p className="text-xs text-white/70 mt-0.5">Secure & verified</p>
            </div>
            <div>
              <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span className="text-2xl font-bold">10k+</span></div>
              <p className="text-xs text-white/70 mt-0.5">Professionals</p>
            </div>
            <div>
              <div className="flex items-center gap-1"><Globe2 className="h-4 w-4" /><span className="text-2xl font-bold">25+</span></div>
              <p className="text-xs text-white/70 mt-0.5">Countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
