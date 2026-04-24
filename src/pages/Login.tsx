import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/authApi';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import wsLogo from '@/assets/worksupport360-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authApi.login({
        email,
        password,
        twoFactorCode: twoFactorCode || undefined,
      });
      login(result.token, { email });
      toast.success('Login successful!');

      const claims = JSON.parse(atob(result.token.split('.')[1]));
      const role = String(claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'FreeLancer');
      const userId = String(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '');

      if (role.toLowerCase() === 'freelancer') {
        try {
          const statusRes = await fetch(
            `${API_BASE_URL}/api/freelancer/profile-status?userId=${userId}`,
            { headers: { 'Authorization': `Bearer ${result.token}` } }
          );
          const statusData = await statusRes.json();
          if (!statusData.profileUpdated) {
            navigate('/freelancer-profile');
          } else {
            navigate('/');
          }
        } catch {
          navigate('/freelancer-profile');
        }
      } else {
        navigate('/');
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
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-500">Sign in to access your dashboard</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {show2FA && (
                <div className="space-y-2">
                  <Label htmlFor="2fa" className="text-gray-700">Two-Factor Code</Label>
                  <Input id="2fa" type="text" placeholder="Enter 2FA code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="border-gray-200 focus-visible:ring-orange-500" />
                </div>
              )}

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25" size="lg" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium hover:underline">Register here</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
