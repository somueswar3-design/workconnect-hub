import { useState, useMemo } from 'react';
import { 
  Clock, Calendar, Send, Save, ChevronLeft, ChevronRight, 
  Loader2, CheckCircle2, XCircle, FileText, Briefcase, Filter, Lock, AlertCircle, Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarWidget } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Timesheet, TimesheetEntry } from '@/types/timesheet';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, parseISO, isBefore, isAfter, isEqual } from 'date-fns';
import { cn } from '@/lib/utils';

const FreelancerTimesheets = () => {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  // Current month/year for the editor
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [freelancerNotes, setFreelancerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTimesheetId, setEditingTimesheetId] = useState<string | null>(null);

  // Bulk fill state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkFromDate, setBulkFromDate] = useState<Date | undefined>();
  const [bulkToDate, setBulkToDate] = useState<Date | undefined>();
  const [bulkHours, setBulkHours] = useState('8');
  const [bulkSkipWeekends, setBulkSkipWeekends] = useState(true);

  // From/To date filter
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>();
  const [filterToDate, setFilterToDate] = useState<Date | undefined>();

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(new Date(currentYear, currentMonth - 1));
    const end = endOfMonth(start);
    return eachDayOfInterval({ start, end });
  }, [currentMonth, currentYear]);

  const filteredDays = useMemo(() => {
    return daysInMonth.filter(day => {
      if (filterFromDate && isBefore(day, filterFromDate)) return false;
      if (filterToDate && isAfter(day, filterToDate)) return false;
      return true;
    });
  }, [daysInMonth, filterFromDate, filterToDate]);

  const openNewTimesheet = () => {
    setEditingTimesheetId(null);
    setFreelancerNotes('');
    setFilterFromDate(undefined);
    setFilterToDate(undefined);
    setEntries(daysInMonth.map(d => ({
      date: format(d, 'yyyy-MM-dd'),
      hours: 0,
      notes: '',
    })));
    setEditorOpen(true);
  };

  const openExistingTimesheet = (ts: Timesheet) => {
    setEditingTimesheetId(ts.id);
    setCurrentMonth(ts.month);
    setCurrentYear(ts.year);
    setFreelancerNotes(ts.freelancerNotes || '');
    setFilterFromDate(undefined);
    setFilterToDate(undefined);

    const start = startOfMonth(new Date(ts.year, ts.month - 1));
    const end = endOfMonth(start);
    const allDays = eachDayOfInterval({ start, end });
    setEntries(allDays.map(d => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const existing = ts.entries.find(e => e.date === dateStr);
      return existing || { date: dateStr, hours: 0, notes: '' };
    }));
    setEditorOpen(true);
  };

  const updateEntry = (date: string, value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    const num = sanitized === '' ? 0 : Math.min(24, Math.max(0, parseFloat(sanitized) || 0));
    setEntries(prev => prev.map(e => e.date === date ? { ...e, hours: num } : e));
  };

  const handleBulkFill = () => {
    if (!bulkFromDate || !bulkToDate) {
      toast.error('Please select both From and To dates');
      return;
    }
    if (isAfter(bulkFromDate, bulkToDate)) {
      toast.error('From date must be before To date');
      return;
    }
    const hours = Math.min(24, Math.max(0, Number(bulkHours) || 8));
    setEntries(prev => prev.map(e => {
      const d = parseISO(e.date);
      if ((isAfter(d, bulkFromDate) || isEqual(d, bulkFromDate)) && (isBefore(d, bulkToDate) || isEqual(d, bulkToDate))) {
        if (bulkSkipWeekends && isWeekend(d)) return e;
        return { ...e, hours };
      }
      return e;
    }));
    setBulkOpen(false);
    toast.success(`${hours}h applied to selected date range`);
  };

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);

  const existingTimesheet = editingTimesheetId ? timesheets.find(t => t.id === editingTimesheetId) : null;
  const isLocked = existingTimesheet?.status === 'approved';
  const isSubmitted = existingTimesheet?.status === 'submitted';
  const isEditable = !isLocked && !isSubmitted;
  const isRejected = existingTimesheet?.status === 'rejected';

  const buildTimesheet = (status: 'draft' | 'submitted'): Timesheet => ({
    id: editingTimesheetId || `ts-${Date.now()}`,
    assignmentId: 0,
    freelancerUserId: parseInt(user?.userId || '0'),
    freelancerName: user?.fullName || 'Freelancer',
    clientUserId: 0,
    clientName: '',
    projectTitle: `Timesheet - ${format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}`,
    month: currentMonth,
    year: currentYear,
    entries: entries.filter(e => e.hours > 0),
    totalHours,
    status,
    submittedOn: status === 'submitted' ? new Date().toISOString() : undefined,
    freelancerNotes,
  });

  const handleSaveDraft = () => {
    const ts = buildTimesheet('draft');
    setTimesheets(prev => {
      const filtered = prev.filter(t => t.id !== ts.id);
      return [...filtered, ts];
    });
    setEditingTimesheetId(ts.id);
    toast.success('Draft saved successfully');
  };

  const handleSubmitTimesheet = () => {
    if (totalHours === 0) {
      toast.error('Please fill in hours before submitting');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ts = buildTimesheet('submitted');
      setTimesheets(prev => {
        const filtered = prev.filter(t => t.id !== ts.id);
        return [...filtered, ts];
      });
      toast.success('Timesheet submitted for approval!', {
        description: 'Your billing cycle will start once the client approves. You will be notified of the status.',
        duration: 5000,
      });
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
    // Regenerate entries for new month
    const start = startOfMonth(new Date(y, m - 1));
    const end = endOfMonth(start);
    const allDays = eachDayOfInterval({ start, end });
    setEntries(allDays.map(d => ({ date: format(d, 'yyyy-MM-dd'), hours: 0, notes: '' })));
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-400" /> My Timesheets
          </h2>
          <p className="text-sm text-slate-400 mt-1">Fill hours by date and submit for client approval</p>
        </div>
        <Button onClick={openNewTimesheet} className="gap-1.5 bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4" /> New Timesheet
        </Button>
      </div>

      {timesheets.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Your Timesheets</p>
          {timesheets.map(ts => (
            <Card key={ts.id} className="border border-slate-700/50 bg-[#0D1B2E] hover:border-slate-600/50 transition-all cursor-pointer" onClick={() => openExistingTimesheet(ts)}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{format(new Date(ts.year, ts.month - 1), 'MMMM yyyy')}</p>
                    <p className="text-xs text-slate-400">{ts.totalHours}h total • {ts.entries.length} days logged</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${statusBadge(ts.status)}`}>{ts.status}</Badge>
                  {ts.status === 'approved' && <Lock className="h-4 w-4 text-emerald-400" />}
                  {ts.clientComments && <span className="text-amber-400" title={ts.clientComments}>💬</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {timesheets.length === 0 && (
        <Card className="border border-slate-700/50 bg-[#0D1B2E]">
          <CardContent className="py-16 text-center text-slate-400">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No timesheets yet</p>
            <p className="text-sm text-slate-500 mt-1">Click "New Timesheet" to start filling hours for the current month.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-4xl bg-[#0D1B2E] border-slate-700/50 text-slate-100 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <FileText className="h-5 w-5 text-cyan-400" /> Timesheet — {format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill hours for each date. Only numbers allowed (max 24h per day).
              {isSubmitted && <Badge className="ml-2 bg-amber-500/10 text-amber-400">Pending Approval</Badge>}
              {isLocked && <Badge className="ml-2 bg-emerald-500/10 text-emerald-400"><Lock className="h-3 w-3 mr-1 inline" />Approved — Locked</Badge>}
              {isRejected && <Badge className="ml-2 bg-red-500/10 text-red-400">Rejected — Please Resubmit</Badge>}
            </DialogDescription>
          </DialogHeader>

          {isLocked && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              This timesheet has been approved and cannot be modified.
            </div>
          )}

          {isSubmitted && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-300 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              This timesheet is pending client approval. You cannot edit it until the client responds.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-slate-700/50 text-slate-300" onClick={() => changeMonth(-1)} disabled={!isEditable}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-slate-200 w-32 text-center">
                {format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}
              </span>
              <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-slate-700/50 text-slate-300" onClick={() => changeMonth(1)} disabled={!isEditable}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                    <Calendar className="h-3 w-3" />
                    {filterFromDate ? format(filterFromDate, 'dd MMM') : 'From'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#0D1B2E] border-slate-700/50" align="start">
                  <CalendarWidget
                    mode="single"
                    selected={filterFromDate}
                    onSelect={setFilterFromDate}
                    defaultMonth={new Date(currentYear, currentMonth - 1)}
                    className={cn("text-slate-100 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                    <Calendar className="h-3 w-3" />
                    {filterToDate ? format(filterToDate, 'dd MMM') : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#0D1B2E] border-slate-700/50" align="start">
                  <CalendarWidget
                    mode="single"
                    selected={filterToDate}
                    onSelect={setFilterToDate}
                    defaultMonth={new Date(currentYear, currentMonth - 1)}
                    className={cn("text-slate-100 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {(filterFromDate || filterToDate) && (
                <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-400" onClick={() => { setFilterFromDate(undefined); setFilterToDate(undefined); }}>
                  Clear
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Total: {totalHours}h</Badge>
              {isEditable && (
                <Button size="sm" variant="outline" className="gap-1 text-xs h-7 border-slate-700/50 text-slate-300 hover:bg-slate-700/50" onClick={() => {
                  setBulkFromDate(daysInMonth[0]);
                  setBulkToDate(daysInMonth[daysInMonth.length - 1]);
                  setBulkOpen(true);
                }}>
                  <Filter className="h-3 w-3" /> Bulk Fill
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto border border-slate-700/50 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-28">Date</TableHead>
                  <TableHead className="text-slate-400 w-16">Day</TableHead>
                  <TableHead className="text-slate-400 w-24">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDays.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const entry = entries.find(e => e.date === dateStr) || { date: dateStr, hours: 0, notes: '' };
                  const weekend = isWeekend(day);
                  return (
                    <TableRow key={dateStr} className={`border-slate-700/30 ${weekend ? 'bg-slate-800/30' : ''} hover:bg-slate-800/50`}>
                      <TableCell className="text-slate-200 text-xs font-medium">{format(day, 'dd MMM yyyy')}</TableCell>
                      <TableCell className={`text-xs ${weekend ? 'text-amber-400' : 'text-slate-400'}`}>{format(day, 'EEE')}</TableCell>
                      <TableCell>
                        {isEditable ? (
                          <Input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            value={entry.hours || ''}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                updateEntry(dateStr, val);
                              }
                            }}
                            placeholder="0"
                            className="h-7 w-20 text-xs bg-[#0A1628] border-slate-700/50 text-slate-200 text-center"
                          />
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-slate-200 font-medium">{entry.hours || 0}h</span>
                            {isLocked && <Lock className="h-3 w-3 text-emerald-400" />}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {isRejected && existingTimesheet?.clientComments && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Client Feedback — Please fix and resubmit</p>
              <p className="text-sm text-red-300">{existingTimesheet.clientComments}</p>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-slate-300">Notes</Label>
            <Textarea
              className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
              rows={2}
              placeholder="Any notes for the client..."
              value={freelancerNotes}
              onChange={e => setFreelancerNotes(e.target.value)}
              disabled={!isEditable}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)} className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50">Close</Button>
            {isEditable && (
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

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="sm:max-w-sm bg-[#0D1B2E] border-slate-700/50 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Bulk Fill Hours</DialogTitle>
            <DialogDescription className="text-slate-400">Select date range and apply hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-slate-300">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 justify-start text-left text-xs h-9 border-slate-700/50 text-slate-300 bg-[#0A1628]">
                      <Calendar className="h-3 w-3 mr-2" />
                      {bulkFromDate ? format(bulkFromDate, 'dd MMM yyyy') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#0D1B2E] border-slate-700/50">
                    <CalendarWidget mode="single" selected={bulkFromDate} onSelect={setBulkFromDate} defaultMonth={new Date(currentYear, currentMonth - 1)} className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm text-slate-300">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 justify-start text-left text-xs h-9 border-slate-700/50 text-slate-300 bg-[#0A1628]">
                      <Calendar className="h-3 w-3 mr-2" />
                      {bulkToDate ? format(bulkToDate, 'dd MMM yyyy') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#0D1B2E] border-slate-700/50">
                    <CalendarWidget mode="single" selected={bulkToDate} onSelect={setBulkToDate} defaultMonth={new Date(currentYear, currentMonth - 1)} className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className="text-sm text-slate-300">Hours per Day (numbers only)</Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                className="mt-1 bg-[#0A1628] border-slate-700/50 text-slate-200"
                value={bulkHours}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) setBulkHours(val);
                }}
                placeholder="8"
              />
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
