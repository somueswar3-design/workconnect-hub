import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileFormData } from '@/types/profile';
import { parseResume } from '@/services/mockApi';
import { toast } from 'sonner';

const profileSchema = z.object({
  aliasName: z.string().min(2, 'Alias name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  companyAlias: z.string().min(2, 'Company alias must be at least 2 characters'),
  skills: z.string().min(3, 'Please enter at least one skill'),
  experience: z.string().min(1, 'Please enter your experience'),
  location: z.string().min(2, 'Please enter your location'),
  hourlyRate: z.string().min(1, 'Please enter your hourly rate'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
});

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

const ProfileForm = ({ onSubmit, isLoading }: ProfileFormProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      aliasName: '',
      email: '',
      mobile: '',
      companyAlias: '',
      skills: '',
      experience: '',
      location: '',
      hourlyRate: '',
      bio: '',
    },
  });
  
  const handleResumeUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setResumeFile(file);
    setIsParsing(true);
    
    try {
      const parsedData = await parseResume(file);
      
      // Auto-populate form fields with parsed data
      if (parsedData.skills) form.setValue('skills', parsedData.skills);
      if (parsedData.experience) form.setValue('experience', parsedData.experience);
      if (parsedData.bio) form.setValue('bio', parsedData.bio);
      
      toast.success('Resume parsed successfully! Fields auto-populated.');
    } catch (error) {
      toast.error('Failed to parse resume. Please fill in the fields manually.');
    } finally {
      setIsParsing(false);
    }
  }, [form]);
  
  const removeResume = () => {
    setResumeFile(null);
  };
  
  const handleSubmit = async (data: ProfileFormData) => {
    await onSubmit({ ...data, resume: resumeFile || undefined });
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create Your Profile</CardTitle>
        <CardDescription>
          Register as a worker and start getting hired. Your personal details will be hidden using aliases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Resume Upload Section */}
            <div className="space-y-3">
              <FormLabel>Resume Upload</FormLabel>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{resumeFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeResume}
                      disabled={isParsing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={isParsing}
                    />
                    <div className="space-y-2">
                      {isParsing ? (
                        <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                      ) : (
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                      )}
                      <p className="text-sm font-medium">
                        {isParsing ? 'Parsing resume...' : 'Click to upload your resume'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF or Word document (max 5MB)
                      </p>
                    </div>
                  </label>
                )}
              </div>
              <FormDescription>
                Upload your resume to auto-populate profile fields
              </FormDescription>
            </div>
            
            {/* Personal Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="aliasName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alias Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="TechNinja" {...field} />
                    </FormControl>
                    <FormDescription>Your public display name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyAlias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Alias *</FormLabel>
                    <FormControl>
                      <Input placeholder="TechCorp" {...field} />
                    </FormControl>
                    <FormDescription>Hidden company name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1-555-0123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Professional Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience *</FormLabel>
                    <FormControl>
                      <Input placeholder="5 years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate *</FormLabel>
                    <FormControl>
                      <Input placeholder="$50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills *</FormLabel>
                  <FormControl>
                    <Input placeholder="React, TypeScript, Node.js, AWS" {...field} />
                  </FormControl>
                  <FormDescription>Separate skills with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself and your expertise..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading || isParsing}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
