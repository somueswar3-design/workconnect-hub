import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authApi.login({
        email,
        password,
        twoFactorCode: twoFactorCode || undefined,
      });
      login(result.token, {
        email: result.user?.email || email,
        role: result.user?.role || 'freelancer',
        fullName: result.user?.fullName,
        avatarUrl: result.user?.avatarUrl,
      });
      toast.success('Login successful!');
      const role = result.user?.role || 'freelancer';
      navigate(role === 'admin' ? '/admin' : role === 'client' ? '/client' : '/freelancer');
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0f2b46 70%, #0a1628 100%)' }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="flex flex-col items-center gap-4 opacity-[0.03]">
          <Monitor className="w-32 h-32 text-white" />
          <span className="text-7xl font-extrabold tracking-widest text-white">ITWorkHelp</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-md px-4">
        <Card className="relative border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

          <CardHeader className="relative text-center space-y-3 pb-2">
            <div className="flex items-center justify-center gap-2">
              <Monitor className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-semibold tracking-wide text-cyan-400">ITWorkHelp</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">Sign in to access your dashboard</CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-slate-900/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-slate-900/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {show2FA && (
                <div className="space-y-2">
                  <Label htmlFor="2fa" className="text-slate-300">Two-Factor Code</Label>
                  <Input id="2fa" type="text" placeholder="Enter 2FA code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="bg-slate-900/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500" />
                </div>
              )}

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white" size="lg" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-400">Don't have an account? </span>
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">Register here</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
