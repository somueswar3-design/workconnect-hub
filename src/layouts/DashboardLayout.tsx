import { ReactNode } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'freelancer' | 'client';
  isActive?: boolean;
}

const DashboardLayout = ({ children, userType, isActive }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar userType={userType} isActive={isActive} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
