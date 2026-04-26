import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { authApi } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';
import wsLogo from '@/assets/worksupport360-logo.png';
import { AuthErrorAlert } from '@/components/AuthErrorAlert';
import { toFriendlyAuthError, type FriendlyAuthError } from '@/lib/authErrors';

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = (location.state as any)?.email || localStorage.getItem('pending_otp_email') || '';
  const password = (location.state as any)?.password || '';
  const role = (location.state as any)?.role || 'FreeLancer';
  const firstName = (location.state as any)?.firstName || '';
  const lastName = (location.state as any)?.lastName || '';
  const fullName = (location.state as any)?.fullName || `${firstName} ${lastName}`.trim();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [authError, setAuthError] = useState<FriendlyAuthError | null>(null);

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
      return;
    }
    localStorage.setItem('pending_otp_email', email);
    inputs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const handleChange = (idx: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      toast.error(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }
    setVerifying(true);
    try {
      await authApi.verifyOtp(email, code);
      toast.success('Email verified! Creating your account...');
      if (password) {
        try {
          await authApi.register({
            email,
            password,
            role,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            fullName: fullName || undefined,
          });
        } catch (regErr: any) {
          // Ignore "already exists" so users can re-verify
          const msg = String(regErr?.message || '').toLowerCase();
          if (!msg.includes('exist') && !msg.includes('already')) {
            throw regErr;
          }
        }

        // Auto-login: skip the manual login screen and drop the user on the
        // home page directly with their session ready.
        try {
          const result = await authApi.login({ email, password });
          login(result.token, { email, fullName: fullName || undefined });
          localStorage.removeItem('pending_otp_email');
          toast.success(`Welcome${fullName ? `, ${fullName}` : ''}!`);
          navigate('/', { replace: true });
          return;
        } catch (loginErr: any) {
          // Auto-login failed → fall back to login page with prefilled email
          toast.info('Account created. Please sign in to continue.');
        }
      }
      localStorage.removeItem('pending_otp_email');
      navigate('/login', { state: { verified: true, email } });
    } catch (error: any) {
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setResending(true);
    try {
      await authApi.resendOtp(email);
      setSecondsLeft(60);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
      toast.success('A new OTP has been sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_: string, a: string, b: string, c: string) => `${a}${'*'.repeat(Math.max(b.length, 1))}${c}`)
    : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-10">
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

            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">Verify your email</CardTitle>
            <CardDescription className="text-gray-500">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-gray-800">{maskedEmail || 'your email'}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* OTP boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="h-12 w-10 sm:h-14 sm:w-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white text-gray-900"
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              disabled={verifying || digits.join('').length !== OTP_LENGTH}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 h-11"
            >
              {verifying ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</>
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4" /> Verify Email</>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              Didn't receive a code?{' '}
              {secondsLeft > 0 ? (
                <span className="text-gray-400">Resend in {secondsLeft}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-orange-500 hover:text-orange-600 font-semibold inline-flex items-center gap-1"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} /> Resend code
                </button>
              )}
            </div>

            <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
              Wrong email?{' '}
              <Link to="/register" className="text-orange-500 font-medium hover:underline">
                Go back to register
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
