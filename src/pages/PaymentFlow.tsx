import { useState } from 'react';
import {
  DollarSign, ArrowRight, CheckCircle2, Clock, AlertCircle, Send, Loader2, Building2, FileText, CreditCard, XCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { QuotationRequest, FundTransfer, BankDetails } from '@/types/invoice';
import { format } from 'date-fns';

const PaymentFlow = () => {
  const { user } = useAuth();

  // Quotation state
  const [quotations, setQuotations] = useState<QuotationRequest[]>([
    {
      id: 'q-1',
      clientUserId: 201, clientName: 'TechCorp Inc.',
      freelancerUserId: 101, freelancerName: 'Ravi Kumar',
      freelancerHourlyRate: '₹800',
      clientOfferedRate: '₹700',
      projectTitle: 'React Dashboard Development',
      status: 'pending',
      createdOn: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  // Fund transfers
  const [transfers, setTransfers] = useState<FundTransfer[]>([
    {
      id: 'ft-1', invoiceId: 'inv-1', freelancerUserId: 101, freelancerName: 'Ravi Kumar',
      bankDetailsId: 'bank-1', amount: 50000, currency: 'INR',
      status: 'completed', transactionRef: 'TXN20250115001',
      initiatedOn: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedOn: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ft-2', invoiceId: 'inv-2', freelancerUserId: 102, freelancerName: 'Priya Sharma',
      bankDetailsId: 'bank-2', amount: 35000, currency: 'INR',
      status: 'processing',
      initiatedOn: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ]);

  const [respondOpen, setRespondOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null);
  const [counterRate, setCounterRate] = useState('');

  const handleAcceptQuotation = (q: QuotationRequest) => {
    setQuotations(prev => prev.map(qt => qt.id === q.id ? { ...qt, status: 'accepted', respondedOn: new Date().toISOString() } : qt));
    toast.success('Quotation accepted!', { description: `You accepted the client rate of ${q.clientOfferedRate}/hr for ${q.projectTitle}.` });
  };

  const handleRejectQuotation = (q: QuotationRequest) => {
    setQuotations(prev => prev.map(qt => qt.id === q.id ? { ...qt, status: 'rejected', respondedOn: new Date().toISOString() } : qt));
    toast.info('Quotation rejected');
  };

  const handleCounterOffer = () => {
    if (!selectedQuotation || !counterRate.trim()) {
      toast.error('Please enter a counter offer rate');
      return;
    }
    setQuotations(prev => prev.map(qt => qt.id === selectedQuotation.id ? {
      ...qt, status: 'counter_offer', counterOfferRate: counterRate, respondedOn: new Date().toISOString()
    } : qt));
    toast.success('Counter offer sent!');
    setRespondOpen(false);
  };

  const quotationStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
      counter_offer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return map[status] || '';
  };

  const transferStatusColor = (status: string) => {
    const map: Record<string, string> = {
      initiated: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return map[status] || '';
  };

  const transferStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated': return <Clock className="h-4 w-4 text-amber-400" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quotations Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-cyan-400" /> Quotation & Payments
        </h2>
        <p className="text-sm text-slate-400 mt-1">Manage client quotations, fund transfers, and payment status</p>
      </div>

      {/* Quotation Requests */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Quotation Requests
        </h3>
        {quotations.map(q => (
          <Card key={q.id} className="border border-slate-700/50 bg-[#0D1B2E]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-100">{q.projectTitle}</p>
                  <p className="text-sm text-slate-400">Client: {q.clientName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Your Rate: <span className="text-slate-200 font-medium">{q.freelancerHourlyRate}/hr</span></span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Client Offers: <span className="text-cyan-400 font-medium">{q.clientOfferedRate}/hr</span></span>
                    {q.counterOfferRate && (
                      <>
                        <ArrowRight className="h-3 w-3" />
                        <span>Counter: <span className="text-blue-400 font-medium">{q.counterOfferRate}/hr</span></span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${quotationStatusColor(q.status)}`}>{q.status.replace('_', ' ')}</Badge>
                  {q.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <Button size="sm" onClick={() => handleAcceptQuotation(q)} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedQuotation(q); setCounterRate(''); setRespondOpen(true); }} className="h-7 text-xs border-blue-500/20 text-blue-400 hover:bg-blue-500/10">Counter</Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectQuotation(q)} className="h-7 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10">Reject</Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="bg-slate-700/30" />

      {/* Fund Transfers */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" /> Fund Transfers
        </h3>
        {transfers.map(ft => (
          <Card key={ft.id} className="border border-slate-700/50 bg-[#0D1B2E]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${ft.status === 'completed' ? 'bg-emerald-500/10' : ft.status === 'processing' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
                    {transferStatusIcon(ft.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">{ft.freelancerName}</p>
                    <p className="text-xs text-slate-400">
                      Initiated: {format(new Date(ft.initiatedOn), 'dd MMM yyyy HH:mm')}
                      {ft.completedOn && ` • Completed: ${format(new Date(ft.completedOn), 'dd MMM yyyy HH:mm')}`}
                    </p>
                    {ft.transactionRef && <p className="text-[10px] text-slate-500 mt-0.5">Ref: {ft.transactionRef}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-cyan-400">₹{ft.amount.toLocaleString()}</p>
                  <Badge className={`text-xs ${transferStatusColor(ft.status)}`}>{ft.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Flow Steps Visual */}
      <Card className="border border-slate-700/50 bg-[#0D1B2E]">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Payment Flow</h3>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {[
              { label: 'Quotation', icon: FileText, color: 'text-amber-400' },
              { label: 'Accept', icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'Assignment', icon: Building2, color: 'text-purple-400' },
              { label: 'Timesheet', icon: Clock, color: 'text-blue-400' },
              { label: 'Invoice', icon: FileText, color: 'text-cyan-400' },
              { label: 'Payment', icon: CreditCard, color: 'text-emerald-400' },
              { label: 'Completed', icon: CheckCircle2, color: 'text-green-400' },
            ].map((step, idx, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/50`}>
                    <step.icon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{step.label}</span>
                </div>
                {idx < arr.length - 1 && <ArrowRight className="h-3 w-3 text-slate-600 shrink-0 mb-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Counter Offer Dialog */}
      <Dialog open={respondOpen} onOpenChange={setRespondOpen}>
        <DialogContent className="sm:max-w-sm bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle>Counter Offer</DialogTitle>
            <DialogDescription className="text-slate-400">
              Propose your rate for {selectedQuotation?.projectTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-[10px] text-slate-500 uppercase">Your Rate</p>
                <p className="font-semibold text-slate-200">{selectedQuotation?.freelancerHourlyRate}/hr</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-[10px] text-slate-500 uppercase">Client Offer</p>
                <p className="font-semibold text-cyan-400">{selectedQuotation?.clientOfferedRate}/hr</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-slate-300">Your Counter Rate (/hr)</Label>
              <Input value={counterRate} onChange={e => setCounterRate(e.target.value)} placeholder="e.g. ₹750" className="bg-[#0A1628] border-slate-700/50 text-slate-200" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondOpen(false)} className="border-slate-700/50 text-slate-300">Cancel</Button>
            <Button onClick={handleCounterOffer} className="bg-blue-600 hover:bg-blue-700 gap-1.5">
              <Send className="h-4 w-4" /> Send Counter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentFlow;
