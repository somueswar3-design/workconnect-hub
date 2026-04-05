## Plan

### 1. Freelancer Dashboard — My Assignments
- Show list of assigned projects (from admin) with project title, client, rate, start/end dates, status
- Each assignment card shows key details

### 2. Client Dashboard — Assigned Freelancers
- Show currently assigned freelancers for the client with project details, rate, status

### 3. Freelancer Timesheet Submission
- Per assignment, "Submit Timesheet" action opens a monthly timesheet view
- Calendar-style grid showing each day of the month with hours input
- Filter by start/end date range
- **Bulk fill**: select date range and fill hours in bulk
- **Customize**: edit individual day hours
- Submit timesheet for client approval

### 4. Client Timesheet Approval
- Client sees pending timesheets from freelancers
- View date-wise hours breakdown
- Add comments per timesheet or per date
- Approve or reject timesheet

### Technical Approach
- All data via .NET API (mock locally for now until endpoints ready)
- Add Timesheet types and mock data
- Add timesheet tab to FreelancerDashboard and ClientDashboard

Does this plan look good?
