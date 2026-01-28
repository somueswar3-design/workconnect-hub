import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '@/components/ProfileForm';
import { ProfileFormData } from '@/types/profile';
import { createProfile } from '@/services/mockApi';
import { toast } from 'sonner';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await createProfile(data);
      toast.success('Profile created successfully! You are now visible on the dashboard.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default Register;
