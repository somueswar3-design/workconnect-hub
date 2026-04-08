import { useState } from 'react';
import {
  Clock, CheckCircle2, XCircle, Loader2, FileText, MessageSquare, Calendar, Lock, AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Timesheet } from '@/types/timesheet';
import { format, parseISO, isWeekend } from 'date-fns';

const ClientTimesheets = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [clientComments, setClientComments] = useState('');
  // Per-entry (date-wise) comments
  const [entryComments, setEntryComments] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const openReview = (ts: Timesheet) => {
    setSelectedTimesheet(ts);
    setClientComments(ts.clientComments || '');
    // Initialize per-entry comments
    const comments: Record<string, string> = {};
    ts.entries.forEach(e => { comments[e.date] = ''; });
    setEntryComments(comments);
    setReviewOpen(true);
  };

  const handleApprove = () => {
    if (!selectedTimesheet) return;
    setProcessing(true);
    setTimeout(() => {
      setTimesheets(prev => prev.map(t => t.id === selectedTimesheet.id ? {
        ...t, status: 'approved' as const, clientComments, reviewedOn: new Date().toISOString()
      } : t));
      toast.success(`Timesheet Approved!`, {
        description: `${selectedTimesheet.freelancerName}'s timesheet for ${format(new Date(selectedTimesheet.year, selectedTimesheet.month - 1), 'MMM yyyy')} has been approved. Billing cycle will begin.`,
        duration: 5000,
      });
      setReviewOpen(false);
      setProcessing(false);
    }, 600);
  };

  const handleReject = () => {
    if (!selectedTimesheet) return;
    if (!clientComments.trim()) {
      toast.error('Please add comments explaining the rejection so the freelancer can fix and resubmit.');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      // Collect date-wise comments into overall comments
      const dateComments = Object.entries(entryComments)
        .filter(([_, c]) => c.trim())
        .map(([date, c]) => `${format(parseISO(date), 'dd MMM')}: ${c}`)
        .join('\n');
      const fullComments = dateComments ? `${clientComments}\n\n--- Date-wise issues ---\n${dateComments}` : clientComments;

      setTimesheets(prev => prev.map(t => t.id === selectedTimesheet.id ? {
        ...t, status: 'rejected' as const, clientComments: fullComments, reviewedOn: new Date().toISOString()
      } : t));
      toast.info('Timesheet Rejected', {
        description: 'Freelancer has been notified with your comments and can resubmit.',
        duration: 5000,
      });
      setReviewOpen(false);
      setProcessing(false);
    }, 600);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      submitted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return map[status] || '';
  };

  const pending = timesheets.filter(t => t.status === 'submitted');
  const reviewed = timesheets.filter(t => t.status === 'approved' || t.status === 'rejected');
  const isReviewable = selectedTimesheet?.status === 'submitted';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" /> Timesheet Approvals
        </h2>
        <p className="text-sm text-slate-400 mt-1">Review and approve timesheets submitted by your assigned freelancers</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">⏳ Pending Approval ({pending.length})</h3>
          {pending.map(ts => (
            <Card key={ts.id} className="border border-amber-500/20 bg-[#0D1B2E] hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => openReview(ts)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-100">{ts.projectTitle}</p>
                  <p className="text-sm text-slate-400">{ts.freelancerName} • {format(new Date(ts.year, ts.month - 1), 'MMMM yyyy')}</p>
                  <p className="text-xs text-slate-500 mt-1">Submitted: {ts.submittedOn ? new Date(ts.submittedOn).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-400">{ts.totalHours}h</p>
                    <p className="text-[10px] text-slate-500">Total Hours</p>
                  </div>
                  <Button size="sm" className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                    <FileText className="h-3.5 w-3.5" /> Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">📋 Reviewed ({reviewed.length})</h3>
          {reviewed.map(ts => (
            <Card key={ts.id} className="border border-slate-700/50 bg-[#0D1B2E] cursor-pointer" onClick={() => openReview(ts)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-200">{ts.projectTitle}</p>
                  <p className="text-sm text-slate-400">{ts.freelancerName} • {format(new Date(ts.year, ts.month - 1), 'MMM yyyy')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-300">{ts.totalHours}h</span>
                  <Badge className={statusBadge(ts.status)}>
                    {ts.status === 'approved' && <Lock className="h-3 w-3 mr-1 inline" />}
                    {ts.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {timesheets.length === 0 && (
        <Card className="border border-slate-700/50 bg-[#0D1B2E]">
          <CardContent className="py-16 text-center text-slate-400">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No timesheets to review</p>
            <p className="text-sm text-slate-500 mt-1">When freelancers submit timesheets, they'll appear here for your approval.</p>
          </CardContent>
        </Card>
      )}

      {/* ═══ REVIEW DIALOG ═══ */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-4xl bg-[#0D1B2E] border-slate-700/50 text-slate-100 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <FileText className="h-5 w-5 text-cyan-400" /> Review Timesheet
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedTimesheet?.freelancerName} — {selectedTimesheet?.projectTitle} — {selectedTimesheet ? format(new Date(selectedTimesheet.year, selectedTimesheet.month - 1), 'MMMM yyyy') : ''}
              {selectedTimesheet?.status === 'approved' && (
                <Badge className="ml-2 bg-emerald-500/10 text-emerald-400"><Lock className="h-3 w-3 mr-1 inline" />Approved — Locked</Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedTimesheet?.status === 'approved' && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              This timesheet is approved. The freelancer cannot modify it anymore.
            </div>
          )}

          {selectedTimesheet && (
            <>
              <div className="flex items-center gap-4 py-2">
                <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-2xl font-bold text-cyan-400">{selectedTimesheet.totalHours}h</p>
                  <p className="text-[10px] text-slate-500">Total Hours</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-sm font-medium text-slate-200">{selectedTimesheet.entries.length} days logged</p>
                  <p className="text-[10px] text-slate-500">Out of {new Date(selectedTimesheet.year, selectedTimesheet.month, 0).getDate()} days</p>
                </div>
                <Badge className={`text-xs ${statusBadge(selectedTimesheet.status)}`}>{selectedTimesheet.status}</Badge>
              </div>

              {/* Date-wise breakdown with per-entry comments */}
              <div className="flex-1 overflow-y-auto border border-slate-700/50 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700/50 hover:bg-transparent">
                      <TableHead className="text-slate-400">Date</TableHead>
                      <TableHead className="text-slate-400">Day</TableHead>
                      <TableHead className="text-slate-400 w-20">Hours</TableHead>
                      {isReviewable && <TableHead className="text-slate-400">Remarks / Issues</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTimesheet.entries.map(entry => {
                      const d = parseISO(entry.date);
                      const weekend = isWeekend(d);
                      return (
                        <TableRow key={entry.date} className={`border-slate-700/30 ${weekend ? 'bg-slate-800/30' : ''}`}>
                          <TableCell className="text-slate-200 text-xs font-medium">{format(d, 'dd MMM yyyy')}</TableCell>
                          <TableCell className={`text-xs ${weekend ? 'text-amber-400' : 'text-slate-400'}`}>{format(d, 'EEEE')}</TableCell>
                          <TableCell className="text-slate-100 font-semibold">{entry.hours}h</TableCell>
                          {isReviewable && (
                            <TableCell>
                              <Input
                                placeholder="Add remark for this date..."
                                value={entryComments[entry.date] || ''}
                                onChange={e => setEntryComments(prev => ({ ...prev, [entry.date]: e.target.value }))}
                                className="h-7 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-600"
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Freelancer notes */}
              {selectedTimesheet.freelancerNotes && (
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Freelancer Notes</p>
                  <p className="text-sm text-slate-300">{selectedTimesheet.freelancerNotes}</p>
                </div>
              )}

              {/* Overall client comments */}
              <div>
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Overall Comments
                </Label>
                <Textarea
                  className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                  rows={3}
                  placeholder="Add overall comments, feedback, or issues..."
                  value={clientComments}
                  onChange={e => setClientComments(e.target.value)}
                  disabled={selectedTimesheet.status === 'approved'}
                />
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Close</Button>
            {isReviewable && (
              <>
                <Button variant="outline" onClick={handleReject} disabled={processing} className="gap-1.5 text-red-400 border-red-500/20 hover:bg-red-500/10">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Reject & Send Back
                </Button>
                <Button onClick={handleApprove} disabled={processing} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Approve & Start Billing
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientTimesheets;
