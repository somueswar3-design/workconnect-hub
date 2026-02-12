import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Monitor, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authApi } from '@/services/authApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email: data.email });
      setSent(true);
      toast.success('Password reset link sent to your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0f2b46 70%, #0a1628 100%)' }}
    >
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
            <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
            <CardDescription className="text-slate-400">
              {sent ? 'Check your email for the reset link' : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {!sent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input type="email" placeholder="you@example.com" className="pl-10 bg-slate-900/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white" size="lg" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center text-slate-300 py-4">
                <p>We've sent a reset link to your email. Please check your inbox.</p>
              </div>
            )}
            <div className="text-center text-sm">
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
