import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser, verifyOtp } from '@/services/authApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
];

const emailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255),
});

const mobileSchema = z.object({
  countryCode: z.string().min(1, 'Select country code'),
  mobile: z.string().regex(/^\d{7,15}$/, 'Enter a valid mobile number (7-15 digits)'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type MobileFormData = z.infer<typeof mobileSchema>;

const Register = () => {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [mobileForOtp, setMobileForOtp] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const navigate = useNavigate();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const mobileForm = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { countryCode: '+91', mobile: '' },
  });

  const handleEmailRegister = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await registerUser({ email: data.email });
      toast.success('Registration successful!');
      navigate('/register/freelancer');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileRegister = async (data: MobileFormData) => {
    setIsLoading(true);
    const fullMobile = `${data.countryCode}${data.mobile}`;
    try {
      await registerUser({ mobile: fullMobile });
      setMobileForOtp(fullMobile);
      setStep('otp');
      toast.success('OTP sent to your mobile number!');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp({ mobile: mobileForOtp, otp: otpValue });
      toast.success('OTP verified successfully!');
      navigate('/register/freelancer');
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await registerUser({ mobile: mobileForOtp });
      toast.success('OTP resent successfully!');
    } catch {
      toast.error('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 flex items-center justify-center min-h-[70vh]">
      <AnimatePresence mode="wait">
        {step === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-2">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Create Account
                </CardTitle>
                <CardDescription>
                  Register with your email or mobile number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="email" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(handleEmailRegister)} className="space-y-4">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            'Register with Email'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="mobile">
                    <Form {...mobileForm}>
                      <form onSubmit={mobileForm.handleSubmit(handleMobileRegister)} className="space-y-4">
                        <FormField
                          control={mobileForm.control}
                          name="countryCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Code</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background z-50">
                                  {countryCodes.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                      {c.flag} {c.country} ({c.code})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={mobileForm.control}
                          name="mobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="9876543210"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            'Send OTP'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-2">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Verify OTP
                </CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to {mobileForOtp}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={setOtpValue}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  className="w-full"
                  size="lg"
                  disabled={isLoading || otpValue.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    Resend OTP
                  </Button>
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => { setStep('register'); setOtpValue(''); }}
                      className="text-sm"
                    >
                      ← Back to Register
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
