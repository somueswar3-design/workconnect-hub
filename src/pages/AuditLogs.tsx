import { useState } from 'react';
import {
  ClipboardList, Search, Filter, Calendar, User, ArrowRight, CheckCircle2, FileText, CreditCard, Users, Briefcase, Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { AuditLog } from '@/types/invoice';
import { format } from 'date-fns';

const MOCK_LOGS: AuditLog[] = [
  { id: '1', action: 'User Registered', category: 'registration', userId: 101, userName: 'Ravi Kumar', userRole: 'Freelancer', details: 'New freelancer account created', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '2', action: 'Profile Updated', category: 'profile', userId: 101, userName: 'Ravi Kumar', userRole: 'Freelancer', details: 'Updated skills and hourly rate to ₹800/hr', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: '3', action: 'Demo Requested', category: 'demo', userId: 201, userName: 'TechCorp Admin', userRole: 'Client', entityType: 'demo', entityId: 'D-001', details: 'Requested demo with Ravi Kumar for React Dashboard project', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '4', action: 'Demo Approved', category: 'demo', userId: 1, userName: 'Admin', userRole: 'Admin', entityType: 'demo', entityId: 'D-001', details: 'Demo approved and scheduled', timestamp: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString() },
  { id: '5', action: 'Assignment Created', category: 'assignment', userId: 1, userName: 'Admin', userRole: 'Admin', entityType: 'assignment', entityId: 'A-001', details: 'Project "React Dashboard" created. Monthly: ₹50,000, Advance: ₹20,000', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '6', action: 'Timesheet Submitted', category: 'timesheet', userId: 101, userName: 'Ravi Kumar', userRole: 'Freelancer', entityType: 'timesheet', entityId: 'TS-001', details: 'Submitted 176 hours for January 2025', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: '7', action: 'Timesheet Approved', category: 'timesheet', userId: 201, userName: 'TechCorp Admin', userRole: 'Client', entityType: 'timesheet', entityId: 'TS-001', details: 'Approved timesheet. Billing cycle started.', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: '8', action: 'Invoice Generated', category: 'invoice', userId: 1, userName: 'System', userRole: 'System', entityType: 'invoice', entityId: 'INV-001', details: 'Invoice ₹55,000 (incl. 10% fee) generated for Jan 2025', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: '9', action: 'Payment Initiated', category: 'payment', userId: 1, userName: 'Admin', userRole: 'Admin', entityType: 'payment', entityId: 'PAY-001', details: 'Fund transfer ₹50,000 initiated to Ravi Kumar (HDFC ••1234)', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: '10', action: 'Payment Completed', category: 'payment', userId: 1, userName: 'System', userRole: 'System', entityType: 'payment', entityId: 'PAY-001', details: 'Payment of ₹50,000 completed. Ref: TXN123456', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const categoryConfig: Record<string, { icon: typeof User; color: string; bg: string }> = {
  registration: { icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
  profile: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  assignment: { icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  timesheet: { icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  invoice: { icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  payment: { icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  demo: { icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  system: { icon: Shield, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const logs = MOCK_LOGS;

  const filtered = logs
    .filter(l => filterCategory === 'all' || l.category === filterCategory)
    .filter(l =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-cyan-400" /> Audit Logs
        </h2>
        <p className="text-sm text-slate-400 mt-1">Complete activity trail of all platform operations</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Search logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-[#0D1B2E] border-slate-700/50 text-slate-200 placeholder:text-slate-500" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40 bg-[#0D1B2E] border-slate-700/50 text-slate-200">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-[#0D1B2E] border-slate-700/50">
            <SelectItem value="all" className="text-slate-200">All Categories</SelectItem>
            <SelectItem value="registration" className="text-slate-200">Registration</SelectItem>
            <SelectItem value="profile" className="text-slate-200">Profile</SelectItem>
            <SelectItem value="demo" className="text-slate-200">Demo</SelectItem>
            <SelectItem value="assignment" className="text-slate-200">Assignment</SelectItem>
            <SelectItem value="timesheet" className="text-slate-200">Timesheet</SelectItem>
            <SelectItem value="invoice" className="text-slate-200">Invoice</SelectItem>
            <SelectItem value="payment" className="text-slate-200">Payment</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="border-slate-700/50 text-slate-400 shrink-0">{filtered.length} logs</Badge>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.map((log, idx) => {
          const config = categoryConfig[log.category] || categoryConfig.system;
          const Icon = config.icon;
          return (
            <div key={log.id} className="flex gap-3 group">
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                {idx < filtered.length - 1 && <div className="w-px flex-1 bg-slate-700/30 my-1" />}
              </div>
              <Card className="flex-1 border border-slate-700/50 bg-[#0D1B2E] mb-2 group-hover:border-slate-600/50 transition-all">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-100 text-sm">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                        <span className="flex items-center gap-0.5"><User className="h-3 w-3" />{log.userName}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 border-slate-700/50">{log.userRole}</Badge>
                        {log.entityId && (
                          <>
                            <span>•</span>
                            <span>{log.entityType}: {log.entityId}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-500">{format(new Date(log.timestamp), 'dd MMM yyyy')}</p>
                      <p className="text-[10px] text-slate-600">{format(new Date(log.timestamp), 'HH:mm:ss')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="border border-slate-700/50 bg-[#0D1B2E]">
          <CardContent className="py-12 text-center text-slate-400">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No logs found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditLogs;
