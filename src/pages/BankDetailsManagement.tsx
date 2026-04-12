import { useState } from 'react';
import {
  Building2, Plus, Edit, Trash2, Star, CheckCircle2, CreditCard, Loader2, Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BankDetails } from '@/types/invoice';

const BankDetailsManagement = () => {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankDetails[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    swiftCode: '',
    branchName: '',
    accountType: 'savings' as 'savings' | 'current',
  });

  const resetForm = () => {
    setForm({ accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', swiftCode: '', branchName: '', accountType: 'savings' });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (bank: BankDetails) => {
    setEditingId(bank.id);
    setForm({
      accountHolderName: bank.accountHolderName,
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      swiftCode: bank.swiftCode || '',
      branchName: bank.branchName || '',
      accountType: bank.accountType,
    });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.accountHolderName.trim() || !form.bankName.trim() || !form.accountNumber.trim() || !form.ifscCode.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (editingId) {
        setBankAccounts(prev => prev.map(b => b.id === editingId ? {
          ...b, ...form, updatedOn: new Date().toISOString()
        } : b));
        toast.success('Bank account updated');
      } else {
        const newBank: BankDetails = {
          id: `bank-${Date.now()}`,
          freelancerUserId: parseInt(user?.userId || '0'),
          ...form,
          isDefault: bankAccounts.length === 0,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
        setBankAccounts(prev => [...prev, newBank]);
        toast.success('Bank account added');
      }
      setFormOpen(false);
      setSaving(false);
      resetForm();
    }, 500);
  };

  const setDefault = (id: string) => {
    setBankAccounts(prev => prev.map(b => ({ ...b, isDefault: b.id === id })));
    toast.success('Default bank account updated');
  };

  const deleteAccount = (id: string) => {
    const account = bankAccounts.find(b => b.id === id);
    if (account?.isDefault && bankAccounts.length > 1) {
      toast.error('Set another account as default before deleting');
      return;
    }
    setBankAccounts(prev => prev.filter(b => b.id !== id));
    toast.success('Bank account removed');
  };

  const maskAccount = (num: string) => {
    if (num.length <= 4) return num;
    return '••••' + num.slice(-4);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-400" /> Bank Details
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage your bank accounts for receiving payments</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-300 text-sm">
        <Shield className="h-4 w-4 shrink-0" />
        Your bank details are securely stored and only shared when processing approved invoice payments.
      </div>

      {bankAccounts.length > 0 ? (
        <div className="space-y-3">
          {bankAccounts.map(bank => (
            <Card key={bank.id} className={`border ${bank.isDefault ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-700/50'} bg-[#0D1B2E]`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${bank.isDefault ? 'bg-cyan-500/15' : 'bg-slate-700/50'} flex items-center justify-center`}>
                      <CreditCard className={`h-5 w-5 ${bank.isDefault ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-100">{bank.bankName}</p>
                        {bank.isDefault && <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]">Default</Badge>}
                      </div>
                      <p className="text-sm text-slate-400">{bank.accountHolderName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>A/C: {maskAccount(bank.accountNumber)}</span>
                        <span>IFSC: {bank.ifscCode}</span>
                        {bank.swiftCode && <span>SWIFT: {bank.swiftCode}</span>}
                        <span className="capitalize">{bank.accountType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!bank.isDefault && (
                      <Button size="sm" variant="outline" onClick={() => setDefault(bank.id)} className="h-7 text-xs border-slate-700/50 text-slate-300 hover:bg-slate-700/50 gap-1">
                        <Star className="h-3 w-3" /> Set Default
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(bank)} className="h-7 text-xs border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteAccount(bank.id)} className="h-7 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-slate-700/50 bg-[#0D1B2E]">
          <CardContent className="py-16 text-center text-slate-400">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No bank accounts added</p>
            <p className="text-sm text-slate-500 mt-1">Add your bank details to receive payments for approved invoices.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Bank Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">{editingId ? 'Edit' : 'Add'} Bank Account</DialogTitle>
            <DialogDescription className="text-slate-400">Enter your bank details for receiving payments.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm text-slate-300">Account Holder Name *</Label>
              <Input value={form.accountHolderName} onChange={e => setForm(f => ({ ...f, accountHolderName: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="Full name as per bank" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-slate-300">Bank Name *</Label>
              <Input value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="e.g. HDFC Bank" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-slate-300">Account Number *</Label>
              <Input value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="Your account number" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm text-slate-300">IFSC Code *</Label>
                <Input value={form.ifscCode} onChange={e => setForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="e.g. HDFC0001234" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-slate-300">SWIFT Code</Label>
                <Input value={form.swiftCode} onChange={e => setForm(f => ({ ...f, swiftCode: e.target.value.toUpperCase() }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="For international" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm text-slate-300">Branch</Label>
                <Input value={form.branchName} onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))} className="bg-[#0A1628] border-slate-700/50 text-slate-200" placeholder="Branch name" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-slate-300">Account Type</Label>
                <Select value={form.accountType} onValueChange={v => setForm(f => ({ ...f, accountType: v as 'savings' | 'current' }))}>
                  <SelectTrigger className="bg-[#0A1628] border-slate-700/50 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0D1B2E] border-slate-700/50">
                    <SelectItem value="savings" className="text-slate-200">Savings</SelectItem>
                    <SelectItem value="current" className="text-slate-200">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} className="border-slate-700/50 text-slate-300">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-700 gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {editingId ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankDetailsManagement;
