import { ReactNode } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'freelancer' | 'client';
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar userType={userType} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
