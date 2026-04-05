import { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, Send, Save, ChevronLeft, ChevronRight, 
  Loader2, CheckCircle2, XCircle, FileText, Briefcase, Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAssignments, AssignmentDto } from '@/services/freelancerApi';
import { Timesheet, TimesheetEntry } from '@/types/timesheet';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, parseISO } from 'date-fns';

const FreelancerTimesheets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDto | null>(null);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  // Timesheet editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [freelancerNotes, setFreelancerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Bulk fill state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [bulkHours, setBulkHours] = useState('8');
  const [bulkSkipWeekends, setBulkSkipWeekends] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const a = await getAssignments(user?.userId || '');
        setAssignments(Array.isArray(a) ? a.filter(x => x.projectId !== 0) : []);
      } catch {
        setAssignments([]);
      }
      setLoading(false);
    };
    load();
  }, [user?.userId]);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(new Date(currentYear, currentMonth - 1));
    const end = endOfMonth(start);
    return eachDayOfInterval({ start, end });
  }, [currentMonth, currentYear]);

  const openTimesheetEditor = (assignment: AssignmentDto) => {
    setSelectedAssignment(assignment);
    setFreelancerNotes('');
    
    // Check if timesheet exists for this month
    const existing = timesheets.find(
      t => t.assignmentId === assignment.projectId && t.month === currentMonth && t.year === currentYear
    );
    
    if (existing) {
      setEntries([...existing.entries]);
      setFreelancerNotes(existing.freelancerNotes || '');
    } else {
      // Initialize empty entries for all days
      setEntries(daysInMonth.map(d => ({
        date: format(d, 'yyyy-MM-dd'),
        hours: 0,
        notes: '',
      })));
    }
    setEditorOpen(true);
  };

  const updateEntry = (date: string, field: 'hours' | 'notes', value: number | string) => {
    setEntries(prev => prev.map(e => e.date === date ? { ...e, [field]: value } : e));
  };

  const handleBulkFill = () => {
    if (!bulkStartDate || !bulkEndDate) {
      toast({ title: 'Select date range', variant: 'destructive' });
      return;
    }
    const start = parseISO(bulkStartDate);
    const end = parseISO(bulkEndDate);
    const hours = Number(bulkHours) || 8;

    setEntries(prev => prev.map(e => {
      const d = parseISO(e.date);
      if (d >= start && d <= end) {
        if (bulkSkipWeekends && isWeekend(d)) return e;
        return { ...e, hours };
      }
      return e;
    }));
    setBulkOpen(false);
    toast({ title: '✅ Hours filled', description: `${hours}h applied to selected date range.` });
  };

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);

  const existingTimesheet = selectedAssignment ? timesheets.find(
    t => t.assignmentId === selectedAssignment.projectId && t.month === currentMonth && t.year === currentYear
  ) : null;

  const handleSaveDraft = () => {
    if (!selectedAssignment) return;
    const ts: Timesheet = {
      id: existingTimesheet?.id || `ts-${Date.now()}`,
      assignmentId: selectedAssignment.projectId,
      freelancerUserId: parseInt(user?.userId || '0'),
      freelancerName: user?.fullName || 'Freelancer',
      clientUserId: selectedAssignment.clientId,
      clientName: selectedAssignment.clientName,
      projectTitle: selectedAssignment.projectName,
      month: currentMonth,
      year: currentYear,
      entries: entries.filter(e => e.hours > 0),
      totalHours,
      status: 'draft',
      freelancerNotes,
    };
    setTimesheets(prev => {
      const filtered = prev.filter(t => t.id !== ts.id);
      return [...filtered, ts];
    });
    toast({ title: '💾 Draft Saved' });
  };

  const handleSubmitTimesheet = () => {
    if (!selectedAssignment) return;
    if (totalHours === 0) {
      toast({ title: 'No hours logged', description: 'Please fill in hours before submitting.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ts: Timesheet = {
        id: existingTimesheet?.id || `ts-${Date.now()}`,
        assignmentId: selectedAssignment.projectId,
        freelancerUserId: parseInt(user?.userId || '0'),
        freelancerName: user?.fullName || 'Freelancer',
        clientUserId: selectedAssignment.clientId,
        clientName: selectedAssignment.clientName,
        projectTitle: selectedAssignment.projectName,
        month: currentMonth,
        year: currentYear,
        entries: entries.filter(e => e.hours > 0),
        totalHours,
        status: 'submitted',
        submittedOn: new Date().toISOString(),
        freelancerNotes,
      };
      setTimesheets(prev => {
        const filtered = prev.filter(t => t.id !== ts.id);
        return [...filtered, ts];
      });
      toast({ title: '✅ Timesheet Submitted!', description: 'Sent to client for approval.' });
      setEditorOpen(false);
      setSubmitting(false);
    }, 800);
  };

  const changeMonth = (delta: number) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const getTimesheetForAssignment = (assignmentId: number) => {
    return timesheets.filter(t => t.assignmentId === assignmentId);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      submitted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return map[status] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" /> My Timesheets
        </h2>
        <p className="text-sm text-slate-400 mt-1">Submit monthly timesheets for your assignments</p>
      </div>

      {/* Assignments with timesheet actions */}
      {assignments.length === 0 ? (
        <Card className="border border-slate-700/50 bg-[#0D1B2E]">
          <CardContent className="py-16 text-center text-slate-400">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No assignments yet</p>
            <p className="text-sm text-slate-500 mt-1">Once you're assigned to a project, you can submit timesheets here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const sheets = getTimesheetForAssignment(a.projectId);
            return (
              <Card key={a.projectId} className="border border-slate-700/50 bg-[#0D1B2E] hover:border-slate-600/50 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-100">{a.projectName}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">Client: {a.clientName}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        {a.startDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.startDate).toLocaleDateString()}</span>}
                        {a.endDate && <span>→ {new Date(a.endDate).toLocaleDateString()}</span>}
                        <Badge className={a.status?.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'}>{a.status}</Badge>
                      </div>
                    </div>
                    <Button size="sm" className="gap-1.5 bg-cyan-600 hover:bg-cyan-700 shrink-0" onClick={() => openTimesheetEditor(a)}>
                      <FileText className="h-3.5 w-3.5" /> Submit Timesheet
                    </Button>
                  </div>

                  {/* Existing timesheets for this assignment */}
                  {sheets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/40">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Submitted Timesheets</p>
                      <div className="flex flex-wrap gap-2">
                        {sheets.map(ts => (
                          <div key={ts.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 text-xs">
                            <span className="text-slate-300">{format(new Date(ts.year, ts.month - 1), 'MMM yyyy')}</span>
                            <span className="text-slate-400">{ts.totalHours}h</span>
                            <Badge className={`text-[10px] px-1.5 ${statusBadge(ts.status)}`}>{ts.status}</Badge>
                            {ts.clientComments && <span className="text-amber-400" title={ts.clientComments}>💬</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ═══ TIMESHEET EDITOR DIALOG ═══ */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-4xl bg-[#0D1B2E] border-slate-700/50 text-slate-100 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <FileText className="h-5 w-5 text-cyan-400" /> Timesheet — {selectedAssignment?.projectName}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Client: {selectedAssignment?.clientName}
              {existingTimesheet?.status === 'submitted' && <Badge className="ml-2 bg-amber-500/10 text-amber-400">Pending Approval</Badge>}
              {existingTimesheet?.status === 'approved' && <Badge className="ml-2 bg-emerald-500/10 text-emerald-400">Approved</Badge>}
              {existingTimesheet?.status === 'rejected' && <Badge className="ml-2 bg-red-500/10 text-red-400">Rejected</Badge>}
            </DialogDescription>
          </DialogHeader>

          {/* Month navigation + Bulk fill */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-slate-700/50 text-slate-300" onClick={() => changeMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-slate-200 w-32 text-center">
                {format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}
              </span>
              <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-slate-700/50 text-slate-300" onClick={() => changeMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Total: {totalHours}h</Badge>
              <Button size="sm" variant="outline" className="gap-1 text-xs h-7 border-slate-700/50 text-slate-300 hover:bg-slate-700/50" onClick={() => {
                setBulkStartDate(format(daysInMonth[0], 'yyyy-MM-dd'));
                setBulkEndDate(format(daysInMonth[daysInMonth.length - 1], 'yyyy-MM-dd'));
                setBulkOpen(true);
              }}>
                <Filter className="h-3 w-3" /> Bulk Fill
              </Button>
            </div>
          </div>

          {/* Timesheet Grid */}
          <div className="flex-1 overflow-y-auto border border-slate-700/50 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-28">Date</TableHead>
                  <TableHead className="text-slate-400 w-16">Day</TableHead>
                  <TableHead className="text-slate-400 w-24">Hours</TableHead>
                  <TableHead className="text-slate-400">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daysInMonth.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const entry = entries.find(e => e.date === dateStr) || { date: dateStr, hours: 0, notes: '' };
                  const weekend = isWeekend(day);
                  return (
                    <TableRow key={dateStr} className={`border-slate-700/30 ${weekend ? 'bg-slate-800/30' : ''} hover:bg-slate-800/50`}>
                      <TableCell className="text-slate-200 text-xs font-medium">{format(day, 'dd MMM')}</TableCell>
                      <TableCell className={`text-xs ${weekend ? 'text-amber-400' : 'text-slate-400'}`}>{format(day, 'EEE')}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          value={entry.hours || ''}
                          onChange={e => updateEntry(dateStr, 'hours', Number(e.target.value))}
                          className="h-7 w-16 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200"
                          disabled={existingTimesheet?.status === 'submitted' || existingTimesheet?.status === 'approved'}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.notes || ''}
                          onChange={e => updateEntry(dateStr, 'notes', e.target.value)}
                          placeholder="Optional notes..."
                          className="h-7 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 placeholder:text-slate-600"
                          disabled={existingTimesheet?.status === 'submitted' || existingTimesheet?.status === 'approved'}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Client comments if rejected */}
          {existingTimesheet?.status === 'rejected' && existingTimesheet.clientComments && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Client Feedback</p>
              <p className="text-sm text-red-300">{existingTimesheet.clientComments}</p>
            </div>
          )}

          {/* Freelancer notes */}
          <div>
            <Label className="text-sm font-medium text-slate-300">Notes</Label>
            <Textarea
              className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
              rows={2}
              placeholder="Any notes for the client..."
              value={freelancerNotes}
              onChange={e => setFreelancerNotes(e.target.value)}
              disabled={existingTimesheet?.status === 'submitted' || existingTimesheet?.status === 'approved'}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Close</Button>
            {(!existingTimesheet || existingTimesheet.status === 'draft' || existingTimesheet.status === 'rejected') && (
              <>
                <Button variant="outline" onClick={handleSaveDraft} className="gap-1.5 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
                <Button onClick={handleSubmitTimesheet} disabled={submitting} className="gap-1.5 bg-cyan-600 hover:bg-cyan-700">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ BULK FILL DIALOG ═══ */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="sm:max-w-sm bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Bulk Fill Hours</DialogTitle>
            <DialogDescription className="text-slate-400">Fill hours for a date range. Customize individual days after.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-slate-300">Start Date</Label>
                <Input type="date" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                  value={bulkStartDate} onChange={e => setBulkStartDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm text-slate-300">End Date</Label>
                <Input type="date" className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                  value={bulkEndDate} onChange={e => setBulkEndDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="text-sm text-slate-300">Hours per Day</Label>
              <Input type="number" min={0} max={24} step={0.5} className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                value={bulkHours} onChange={e => setBulkHours(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={bulkSkipWeekends} onChange={e => setBulkSkipWeekends(e.target.checked)}
                className="rounded border-slate-700/50" id="skipWeekends" />
              <Label htmlFor="skipWeekends" className="text-sm text-slate-300 cursor-pointer">Skip weekends</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)} className="border-slate-700/50 text-slate-300">Cancel</Button>
            <Button onClick={handleBulkFill} className="bg-cyan-600 hover:bg-cyan-700">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreelancerTimesheets;
