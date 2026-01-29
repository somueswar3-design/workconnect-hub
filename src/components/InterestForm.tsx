import { useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { WorkerProfile } from '@/types/profile';
import { submitInterestForm } from '@/services/freelancerApi';
import { z } from 'zod';

interface InterestFormProps {
  worker: WorkerProfile;
  onSubmit: () => void;
  onWhatsAppContact: () => void;
}

const interestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number too long'),
  message: z.string().max(500, 'Message too long').optional(),
  preferredHourlyRate: z.string().max(20, 'Rate too long').optional(),
});

const InterestForm = ({ worker, onSubmit, onWhatsAppContact }: InterestFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredHourlyRate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = interestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await submitInterestForm({
        ...formData,
        workerId: worker.id,
      });
      
      if (response.success) {
        toast({
          title: 'Interest Submitted!',
          description: response.message,
        });
        onSubmit();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit interest. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Fill in your details to express interest in working with {worker.aliasName}.
        Rate: {worker.hourlyRate}/hr
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1-555-0123"
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="preferredHourlyRate">Your Budget (Hourly Rate)</Label>
        <Input
          id="preferredHourlyRate"
          name="preferredHourlyRate"
          value={formData.preferredHourlyRate}
          onChange={handleChange}
          placeholder="e.g., $50-75"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your project or requirements..."
          rows={3}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Interest
      </Button>
      
      <Separator />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Or contact admin directly via WhatsApp
        </p>
        <Button 
          type="button" 
          variant="outline" 
          className="gap-2"
          onClick={onWhatsAppContact}
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </Button>
      </div>
    </form>
  );
};

export default InterestForm;
