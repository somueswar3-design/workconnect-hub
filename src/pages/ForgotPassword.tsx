import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authApi } from '@/services/authApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import wsLogo from '@/assets/worksupport360-logo.png';

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
            <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password</CardTitle>
            <CardDescription className="text-gray-500">
              {sent ? 'Check your email for the reset link' : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!sent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input type="email" placeholder="you@example.com" className="pl-10 border-gray-200 focus-visible:ring-orange-500" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25" size="lg" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center text-gray-600 py-4">
                <p>We've sent a reset link to your email. Please check your inbox.</p>
              </div>
            )}
            <div className="text-center text-sm">
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium hover:underline inline-flex items-center gap-1">
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
