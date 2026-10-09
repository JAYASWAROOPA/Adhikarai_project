import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Grid, MenuItem, Snackbar, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { officerService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { OfficerLoadState, OfficerMetricCard, OfficerPageHeader, OfficerPanel } from '../../components/officer/OfficerUI';
import { normalizeOfficerApplication } from './officerUtils';

const TREND_COLORS = { received: '#1a365d', verified: '#48bb78', rejected: '#e57373' };
const RANGES = { '7d': 7, '30d': 30, '3m': 90, '6m': 180 };

const OfficerAnalyticsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [sortBy, setSortBy] = useState('applications');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await officerService.getAnalytics();
      setApplications(data.applications.map(normalizeOfficerApplication));
    } catch (loadError) { setError(loadError.message || 'Unable to load analytics. Please retry.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => ({
    total: applications.length,
    verified: applications.filter((app) => ['Verified', 'Approved'].includes(app.status)).length,
    rejected: applications.filter((app) => app.status === 'Rejected').length,
    pending: applications.filter((app) => app.isPending).length
  }), [applications]);
  const approvalRate = counts.verified + counts.rejected ? Math.round(counts.verified / (counts.verified + counts.rejected) * 100) : 0;
  const rejectionRate = counts.verified + counts.rejected ? Math.round(counts.rejected / (counts.verified + counts.rejected) * 100) : 0;

  const bounds = useMemo(() => {
    const end = range === 'custom' && customTo ? new Date(`${customTo}T23:59:59`) : new Date();
    let start;
    if (range === 'custom' && customFrom) start = new Date(`${customFrom}T00:00:00`);
    else { start = new Date(end); start.setDate(start.getDate() - (RANGES[range] || 30)); }
    return { start, end };
  }, [range, customFrom, customTo]);
  const inRange = (value) => {
    const time = new Date(value).getTime();
    return Number.isFinite(time) && time >= bounds.start.getTime() && time <= bounds.end.getTime();
  };

  const trend = useMemo(() => {
    const dateInRange = (value) => {
      const time = new Date(value).getTime();
      return Number.isFinite(time) && time >= bounds.start.getTime() && time <= bounds.end.getTime();
    };
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '3m' ? 3 : range === '6m' ? 6 : 14;
    const points = Array.from({ length: days }, (_, index) => {
      const date = new Date(bounds.start.getTime() + ((bounds.end.getTime() - bounds.start.getTime()) * index / Math.max(days - 1, 1)));
      const daily = range === '7d' || range === '30d' || range === 'custom';
      const key = daily ? date.toISOString().slice(0, 10) : date.toISOString().slice(0, 7);
      return { key, label: daily ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date) : new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date), received: 0, verified: 0, rejected: 0 };
    });
    const bucketFor = (value) => {
      const time = new Date(value).getTime();
      if (!dateInRange(value)) return null;
      const bucketWidth = (bounds.end.getTime() - bounds.start.getTime()) / days || 1;
      const index = Math.min(days - 1, Math.floor((time - bounds.start.getTime()) / bucketWidth));
      return points[index] || null;
    };
    applications.forEach((app) => {
      const received = bucketFor(app.submittedDate);
      if (received) received.received += 1;
      app.verificationHistory.forEach((entry) => {
        const target = bucketFor(entry.timestamp);
        if (!target) return;
        const action = String(entry.action).toLowerCase();
        if (action.includes('reject')) target.rejected += 1;
        if (action.includes('verif') || action.includes('approv')) target.verified += 1;
      });
    });
    return points;
  }, [applications, bounds, range]);

  const schemeRows = useMemo(() => {
    const groups = new Map();
    applications.forEach((app) => {
      const current = groups.get(app.schemeName) || { scheme: app.schemeName, applications: 0, verified: 0, rejected: 0, pending: 0 };
      current.applications += 1;
      if (['Verified', 'Approved'].includes(app.status)) current.verified += 1;
      else if (app.status === 'Rejected') current.rejected += 1;
      else current.pending += 1;
      groups.set(app.schemeName, current);
    });
    return [...groups.values()].map((row) => ({ ...row, approval: row.applications ? Math.round(row.verified / row.applications * 100) : 0 }))
      .sort((a, b) => sortBy === 'approval' ? b.approval - a.approval : b.applications - a.applications);
  }, [applications, sortBy]);
  const districts = useMemo(() => {
    const groups = new Map();
    applications.forEach((app) => { const location = app.district || 'Not provided'; groups.set(location, (groups.get(location) || 0) + 1); });
    return [...groups].sort((a, b) => b[1] - a[1]);
  }, [applications]);
  const activity = applications.flatMap((app) => app.verificationHistory.map((entry) => ({ ...entry, appId: app.applicationId })))
    .filter((entry) => inRange(entry.timestamp));
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCount = activity.filter((entry) => entry.timestamp?.slice(0, 10) === todayKey && /verif|approv|reject/i.test(entry.action)).length;
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
  const weekCount = activity.filter((entry) => new Date(entry.timestamp) >= weekStart && /verif|approv|reject/i.test(entry.action)).length;
  const overdue = applications.filter((app) => app.isOverdue).length;

  const exportCsv = () => {
    const headers = ['Scheme', 'Applications', 'Verified', 'Rejected', 'Pending', 'Approval rate'];
    const rows = schemeRows.map((row) => [row.scheme, row.applications, row.verified, row.rejected, row.pending, `${row.approval}%`]);
    const summary = [
      ['Officer analytics summary'],
      ['Total applications', counts.total], ['Verified / approved', counts.verified], ['Rejected', counts.rejected],
      ['Pending', counts.pending], ['Approval rate', `${approvalRate}%`], ['Rejection rate', `${rejectionRate}%`],
      ['Processed today', todayCount], [], headers, ...rows
    ];
    const csv = summary.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'officer-analytics.csv'; link.click(); URL.revokeObjectURL(url);
    setNotice('Analytics CSV exported.');
  };
  const exportPdf = () => { window.print(); setNotice('Use your browser print dialog to save this report as PDF.'); };

  const makePolyline = (key, max) => trend.map((point, index) => {
    const x = 28 + index * (664 / Math.max(trend.length - 1, 1));
    const y = 198 - ((point[key] / Math.max(max, 1)) * 164);
    return `${x},${y}`;
  }).join(' ');
  const maxTrend = Math.max(1, ...trend.flatMap((point) => [point.received, point.verified, point.rejected]));

  const statusDistribution = [
    ['Pending', applications.filter((app) => app.status === 'Pending').length, '#ed8936'],
    ['Under Review', applications.filter((app) => app.status === 'Under Review').length, '#4299e1'],
    ['Verified', applications.filter((app) => app.status === 'Verified').length, '#48bb78'],
    ['Approved', applications.filter((app) => app.status === 'Approved').length, '#2f855a'],
    ['Rejected', counts.rejected, '#e57373']
  ];
  const totalForDonut = statusDistribution.reduce((sum, item) => sum + item[1], 0);
  let donutCursor = 0;
  const donut = totalForDonut ? `conic-gradient(${statusDistribution.map((item) => { const start = donutCursor; donutCursor += item[1] / totalForDonut * 100; return `${item[2]} ${start}% ${donutCursor}%`; }).join(',')})` : 'conic-gradient(#e2e8f0 0% 100%)';

  return <Box>
    <OfficerPageHeader title="Officer Analytics" subtitle="A workload and outcome summary based on your assigned applications." />
    <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity="success" onClose={() => setNotice('')} sx={{ width: '100%' }}>{notice}</Alert></Snackbar>
    <OfficerLoadState loading={loading} error={error} onRetry={load}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={exportCsv}>Export CSV</Button><Button variant="outlined" onClick={exportPdf}>Export PDF</Button>
      </Stack>
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Total Applications" value={counts.total} icon={<span>▤</span>} /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Verified / Approved" value={counts.verified} icon={<span>✓</span>} color="success.main" /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Rejected" value={counts.rejected} icon={<span>×</span>} color="error.main" /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Pending" value={counts.pending} icon={<span>◷</span>} color="warning.main" /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Approval Rate" value={`${approvalRate}%`} icon={<span>%</span>} color="success.main" /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Rejection Rate" value={`${rejectionRate}%`} icon={<span>%</span>} color="error.main" /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Avg. Verification Time" value="—" icon={<span>◷</span>} helper="Not provided by API" /></Grid>
        <Grid item xs={6} sm={4} lg={3}><OfficerMetricCard label="Processed Today" value={todayCount} icon={<span>✓</span>} helper="From recorded action history" /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} lg={8}><OfficerPanel title="Application trends" action={<TextField select size="small" label="Range" value={range} onChange={(e) => setRange(e.target.value)} sx={{ minWidth: 145 }}><MenuItem value="7d">Last 7 days</MenuItem><MenuItem value="30d">Last 30 days</MenuItem><MenuItem value="3m">Last 3 months</MenuItem><MenuItem value="6m">Last 6 months</MenuItem><MenuItem value="custom">Custom range</MenuItem></TextField>}>
          {range === 'custom' && <Stack direction="row" gap={1} sx={{ mb: 1 }}><TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }} value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} /><TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }} value={customTo} onChange={(e) => setCustomTo(e.target.value)} /></Stack>}
          <Box sx={{ width: '100%', overflowX: 'auto' }}><svg viewBox="0 0 720 235" width="100%" role="img" aria-label="Applications received, verified and rejected over time">
            {[0, 1, 2, 3].map((line) => <line key={line} x1="28" x2="692" y1={34 + line * 54} y2={34 + line * 54} stroke="#e2e8f0" />)}
            {Object.entries(TREND_COLORS).map(([key, color]) => <polyline key={key} points={makePolyline(key, maxTrend)} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />)}
            {trend.map((point, index) => <text key={point.key} x={28 + index * (664 / Math.max(trend.length - 1, 1))} y="224" textAnchor="middle" fontSize="10" fill="#718096">{index % Math.ceil(trend.length / 7) === 0 ? point.label : ''}</text>)}
          </svg></Box>
          <Stack direction="row" spacing={2} flexWrap="wrap">{Object.entries(TREND_COLORS).map(([key, color]) => <Typography key={key} variant="caption" sx={{ color }}><b>●</b> {key === 'received' ? 'Received' : key === 'verified' ? 'Verified' : 'Rejected'}</Typography>)}</Stack>
          {!activity.length && <Typography variant="caption" color="text.secondary">The API currently has no verification history in this date range; outcome lines will populate as officer actions are recorded.</Typography>}
        </OfficerPanel></Grid>
        <Grid item xs={12} lg={4}><OfficerPanel title="Application status distribution" sx={{ height: '100%' }}>
          <Stack direction={{ xs: 'column', sm: 'row', lg: 'column' }} alignItems="center" justifyContent="center" spacing={2}>
            <Box sx={{ width: 170, height: 170, borderRadius: '50%', background: donut, position: 'relative', flexShrink: 0, '&:after': { content: '""', position: 'absolute', inset: 36, borderRadius: '50%', bgcolor: 'background.paper' } }} />
            <Stack spacing={0.8}>{statusDistribution.map(([label, value, color]) => <Stack key={label} direction="row" gap={1} alignItems="center"><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} /><Typography variant="body2">{label}</Typography><Typography variant="body2" fontWeight={700}>{value}</Typography></Stack>)}</Stack>
          </Stack>
        </OfficerPanel></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} lg={8}><OfficerPanel title="Scheme-wise analytics" action={<TextField select size="small" label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><MenuItem value="applications">Applications</MenuItem><MenuItem value="approval">Approval rate</MenuItem></TextField>}>
          <TableContainer sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: 600 }}><TableHead><TableRow><TableCell>Scheme</TableCell><TableCell>Applications</TableCell><TableCell>Verified</TableCell><TableCell>Rejected</TableCell><TableCell>Pending</TableCell><TableCell>Approval</TableCell></TableRow></TableHead><TableBody>{schemeRows.map((row) => <TableRow key={row.scheme}><TableCell>{row.scheme}</TableCell><TableCell>{row.applications}</TableCell><TableCell>{row.verified}</TableCell><TableCell>{row.rejected}</TableCell><TableCell>{row.pending}</TableCell><TableCell><Chip size="small" label={`${row.approval}%`} color={row.approval >= 70 ? 'success' : 'default'} /></TableCell></TableRow>)}</TableBody></Table></TableContainer>
          {!schemeRows.length && <Typography color="text.secondary">No scheme data is available.</Typography>}
        </OfficerPanel></Grid>
        <Grid item xs={12} lg={4}><OfficerPanel title="Verification performance">
          <Stack spacing={1.25}><Typography><b>Average verification time:</b> Not provided</Typography><Typography><b>Fastest verification:</b> Not provided</Typography><Typography><b>Overdue pending:</b> {overdue}</Typography><Typography><b>Daily processed:</b> {todayCount}</Typography><Typography><b>Weekly processed:</b> {weekCount}</Typography><Typography variant="caption" color="text.secondary">The assigned-applications API exposes application stage and action history only. Time-to-decision and other officers’ workloads are not returned.</Typography></Stack>
        </OfficerPanel></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><OfficerPanel title="Officer performance"><Stack spacing={1}><Typography fontWeight={700}>{user?.name || 'Current officer'}</Typography><Typography variant="body2">Assigned applications: {counts.total}</Typography><Typography variant="body2">Verified: {counts.verified} · Rejected: {counts.rejected} · Pending: {counts.pending}</Typography><Typography variant="caption" color="text.secondary">Other officers’ performance isn’t available from this officer API.</Typography></Stack></OfficerPanel></Grid>
        <Grid item xs={12} md={6}><OfficerPanel title="Geographic distribution">{districts.length ? <Stack spacing={1}>{districts.map(([name, count]) => <Stack key={name} direction="row" justifyContent="space-between"><Typography variant="body2">{name}</Typography><Typography variant="body2" fontWeight={700}>{count}</Typography></Stack>)}</Stack> : <Typography color="text.secondary">District data is not available.</Typography>}</OfficerPanel></Grid>
      </Grid>
    </OfficerLoadState>
  </Box>;
};

export default OfficerAnalyticsPage;
