import { ReactNode } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'freelancer' | 'client';
  isActive?: boolean;
}

const DashboardLayout = ({ children, userType, isActive }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0A1628] text-slate-100">
      <DashboardSidebar userType={userType} isActive={isActive} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
