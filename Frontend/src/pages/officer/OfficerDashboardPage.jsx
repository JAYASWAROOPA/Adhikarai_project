import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
  LinearProgress, MenuItem, Pagination, Snackbar, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import { officerService } from '../../services/api';
import { OfficerLoadState, OfficerMetricCard, OfficerPageHeader, OfficerPanel } from '../../components/officer/OfficerUI';
import { formatOfficerDate, getStatusColor, normalizeOfficerApplication } from './officerUtils';

const PAGE_SIZE = 6;
const STATUS_CHART = ['Pending', 'Under Review', 'Verified', 'Approved', 'Rejected'];

const OfficerDashboardPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await officerService.getApplications();
      setApplications(data.applications.map(normalizeOfficerApplication));
    } catch (loadError) {
      setError(loadError.message || 'Unable to load applications. Please try again.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const schemes = useMemo(() => [...new Set(applications.map((app) => app.schemeName))], [applications]);
  const filtered = useMemo(() => applications.filter((app) => {
    const query = search.trim().toLowerCase();
    return (!query || [app.applicationId, app.applicantName, app.schemeName].some((value) => String(value || '').toLowerCase().includes(query)))
      && (statusFilter === 'all' || app.status === statusFilter)
      && (schemeFilter === 'all' || app.schemeName === schemeFilter)
      && (!dateFilter || app.submittedDate?.slice(0, 10) === dateFilter);
  }), [applications, search, statusFilter, schemeFilter, dateFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pending = applications.filter((app) => app.isPending);
  const verified = applications.filter((app) => ['Verified', 'Approved'].includes(app.status));
  const rejected = applications.filter((app) => app.status === 'Rejected');
  const attention = pending.filter((app) => app.isOverdue || app.priority === 'high');
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = applications.filter((app) => app.submittedDate?.slice(0, 10) === today).length;
  const activity = applications.flatMap((app) => app.verificationHistory.map((entry) => ({ ...entry, applicationId: app.applicationId, applicantName: app.applicantName })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  const handleDecision = async (status, action, remarks = '') => {
    try {
      const result = await officerService.updateApplicationAction(selected.applicationId, { status, action, remarks });
      setApplications((items) => items.map((app) => app.applicationId === selected.applicationId
        ? normalizeOfficerApplication(result.application) : app));
      setSelected(null);
      setNotice(`Application ${selected.applicationId} ${action.toLowerCase()}.`);
    } catch (actionError) { setNotice(actionError.message || 'Unable to save the decision.'); }
  };

  return (
    <Box>
      <OfficerPageHeader title="Officer Dashboard" subtitle="Your application queue, workload and latest verification activity." />
      <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={notice.startsWith('Unable') ? 'error' : 'success'} onClose={() => setNotice('')} sx={{ width: '100%' }}>{notice}</Alert>
      </Snackbar>
      <OfficerLoadState loading={loading} error={error} onRetry={load}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Total Applications" value={applications.length} icon={<DashboardOutlinedIcon />} onClick={() => navigate('/officer/applications')} /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Pending Verification" value={pending.length} icon={<PendingActionsOutlinedIcon />} color="warning.main" onClick={() => navigate('/officer/pending-verification')} /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Verified / Approved" value={verified.length} icon={<VerifiedOutlinedIcon />} color="success.main" onClick={() => navigate('/officer/applications')} /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Rejected Applications" value={rejected.length} icon={<CancelOutlinedIcon />} color="error.main" onClick={() => navigate('/officer/applications')} /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Requiring Attention" value={attention.length} icon={<PriorityHighOutlinedIcon />} color="error.main" onClick={() => navigate('/officer/pending-verification')} helper="Overdue or high priority" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Schemes in Queue" value={schemes.length} icon={<PolicyOutlinedIcon />} onClick={() => navigate('/officer/schemes')} /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Today's Applications" value={todayCount} icon={<TodayOutlinedIcon />} onClick={() => navigate('/officer/applications')} /></Grid>
          <Grid item xs={12} sm={6} lg={3}><OfficerMetricCard label="Avg. Processing Time" value="—" icon={<TimerOutlinedIcon />} helper="Not provided by the API" onClick={() => navigate('/officer/analytics')} /></Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <OfficerPanel title="Application Status Overview" sx={{ height: '100%' }}>
              <Stack spacing={1.6}>
                {STATUS_CHART.map((status) => {
                  const count = applications.filter((app) => app.status === status).length;
                  const percent = applications.length ? (count / applications.length) * 100 : 0;
                  return <Box key={status}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}><Typography variant="body2">{status}</Typography><Typography variant="body2" fontWeight={700}>{count}</Typography></Stack>
                    <LinearProgress variant="determinate" value={percent} color={getStatusColor(status)} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>;
                })}
              </Stack>
            </OfficerPanel>
          </Grid>
          <Grid item xs={12} md={7}>
            <OfficerPanel title="Priority / Attention" action={<Button size="small" onClick={() => navigate('/officer/pending-verification')}>Open queue</Button>} sx={{ height: '100%' }}>
              {attention.length ? <Stack spacing={1.25}>{attention.slice(0, 4).map((app) => <Stack key={app.applicationId} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Box><Stack direction="row" gap={1} alignItems="center"><Chip size="small" color="error" label={app.isOverdue ? 'Overdue' : 'High priority'} /><Typography variant="caption">{app.applicationId}</Typography></Stack><Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>{app.applicantName} · {app.schemeName}</Typography></Box>
                <Button size="small" variant="outlined" onClick={() => navigate(`/officer/pending-verification?application=${encodeURIComponent(app.applicationId)}`)}>Review</Button>
              </Stack>)}</Stack> : <Typography color="text.secondary">No applications currently require immediate attention.</Typography>}
            </OfficerPanel>
          </Grid>
        </Grid>

        <OfficerPanel title="Recent Applications" action={<Button onClick={() => navigate('/officer/pending-verification')}>View verification queue</Button>} sx={{ mb: 3 }}>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}><TextField fullWidth size="small" placeholder="Search ID, applicant or scheme" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
            <Grid item xs={12} sm={4} md={2}><TextField fullWidth select size="small" label="Status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}><MenuItem value="all">All statuses</MenuItem>{STATUS_CHART.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={4} md={3}><TextField fullWidth select size="small" label="Scheme" value={schemeFilter} onChange={(e) => { setSchemeFilter(e.target.value); setPage(1); }}><MenuItem value="all">All schemes</MenuItem>{schemes.map((scheme) => <MenuItem key={scheme} value={scheme}>{scheme}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={4} md={3}><TextField fullWidth size="small" type="date" label="Submitted date" InputLabelProps={{ shrink: true }} value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} /></Grid>
          </Grid>
          <TableContainer sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: 850 }}>
            <TableHead><TableRow><TableCell>Application ID</TableCell><TableCell>Applicant</TableCell><TableCell>Scheme</TableCell><TableCell>Submitted</TableCell><TableCell>Status</TableCell><TableCell>Priority</TableCell><TableCell>Assigned Officer</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead>
            <TableBody>{visible.map((app) => <TableRow key={app.applicationId} hover>
              <TableCell>{app.applicationId}</TableCell><TableCell>{app.applicantName}</TableCell><TableCell>{app.schemeName}</TableCell><TableCell>{formatOfficerDate(app.submittedDate)}</TableCell><TableCell><Chip size="small" label={app.status} color={getStatusColor(app.status)} /></TableCell><TableCell><Chip size="small" variant="outlined" label={app.priority} color={app.priority === 'high' ? 'error' : 'default'} /></TableCell><TableCell>{app.assignedOfficer || 'You'}</TableCell><TableCell align="right"><Stack direction="row" justifyContent="flex-end"><Button size="small" onClick={() => setSelected(app)}>View</Button>{app.isPending && <Button size="small" onClick={() => navigate(`/officer/pending-verification?application=${encodeURIComponent(app.applicationId)}`)}>Verify</Button>}</Stack></TableCell>
            </TableRow>)}</TableBody>
          </Table></TableContainer>
          {!filtered.length && <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>No applications match these filters.</Typography>}
          {filtered.length > PAGE_SIZE && <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }} />}
        </OfficerPanel>

        <OfficerPanel title="Recent Activity">
          {activity.length ? <Stack spacing={1.5}>{activity.map((entry) => <Stack key={entry.id} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={0.5} sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.25 }}><Box><Typography variant="body2" fontWeight={700}>{entry.action}</Typography><Typography variant="caption" color="text.secondary">{entry.applicationId} · {entry.applicantName}{entry.remarks ? ` · ${entry.remarks}` : ''}</Typography></Box><Typography variant="caption" color="text.secondary">{formatOfficerDate(entry.timestamp, { dateStyle: 'medium', timeStyle: 'short' })}</Typography></Stack>)}</Stack> : <Typography color="text.secondary">No officer actions have been recorded yet.</Typography>}
        </OfficerPanel>
      </OfficerLoadState>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Application details</DialogTitle>
        <DialogContent dividers>{selected && <Stack spacing={1.25}>
          <Typography><b>ID:</b> {selected.applicationId}</Typography><Typography><b>Applicant:</b> {selected.applicantName}</Typography><Typography><b>Scheme:</b> {selected.schemeName}</Typography><Typography><b>Department:</b> {selected.department || 'Not provided'}</Typography><Typography><b>District:</b> {selected.district || 'Not provided'}</Typography><Typography><b>Submitted:</b> {formatOfficerDate(selected.submittedDate)}</Typography><Typography><b>Status:</b> {selected.status}</Typography><Typography><b>Documents:</b> {selected.documents.map((doc) => doc.name).join(', ') || 'None listed'}</Typography>
        </Stack>}</DialogContent>
        <DialogActions><Button onClick={() => setSelected(null)}>Close</Button>{selected?.isPending && <Button variant="contained" color="success" onClick={() => handleDecision('VERIFIED', 'Verified')}>Verify</Button>}</DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfficerDashboardPage;
