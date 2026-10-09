import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, MenuItem, Pagination, Snackbar, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useLocation, useSearchParams } from 'react-router-dom';
import { officerService } from '../../services/api';
import { OfficerLoadState, OfficerMetricCard, OfficerPageHeader, OfficerPanel } from '../../components/officer/OfficerUI';
import { formatOfficerDate, getStatusColor, normalizeOfficerApplication } from './officerUtils';

const PAGE_SIZE = 8;

const OfficerVerificationsPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [scheme, setScheme] = useState('all');
  const [status, setStatus] = useState(location.pathname === '/officer/applications' ? 'all' : 'pending');
  const [priority, setPriority] = useState('all');
  const [district, setDistrict] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [dialogAction, setDialogAction] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await officerService.getApplications();
      const normalized = data.applications.map(normalizeOfficerApplication);
      setApplications(normalized);
      const target = searchParams.get('application');
      if (target) setSelected(normalized.find((item) => item.applicationId === target) || null);
    } catch (loadError) { setError(loadError.message || 'Unable to load applications. Please try again.'); }
    finally { setLoading(false); }
  }, [searchParams]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setStatus(location.pathname === '/officer/applications' ? 'all' : 'pending'); setPage(1); }, [location.pathname]);

  const schemes = useMemo(() => [...new Set(applications.map((app) => app.schemeName))], [applications]);
  const districts = useMemo(() => [...new Set(applications.map((app) => app.district).filter(Boolean))], [applications]);
  const pending = applications.filter((app) => app.isPending);
  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => applications.filter((app) => {
    const q = search.trim().toLowerCase();
    return (!q || [app.applicationId, app.applicantName, app.applicantEmail].some((value) => String(value || '').toLowerCase().includes(q)))
      && (scheme === 'all' || app.schemeName === scheme)
      && (status === 'all' || (status === 'pending' ? app.isPending : app.status === status))
      && (priority === 'all' || app.priority === priority)
      && (district === 'all' || app.district === district)
      && (!fromDate || app.submittedDate?.slice(0, 10) >= fromDate)
      && (!toDate || app.submittedDate?.slice(0, 10) <= toDate);
  }).sort((a, b) => {
    if (sort === 'oldest') return new Date(a.submittedDate) - new Date(b.submittedDate);
    if (sort === 'priority') return ({ high: 0, medium: 1, normal: 2 }[a.priority] ?? 3) - ({ high: 0, medium: 1, normal: 2 }[b.priority] ?? 3);
    return new Date(b.submittedDate) - new Date(a.submittedDate);
  }), [applications, search, scheme, status, priority, district, fromDate, toDate, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const persistAction = async (actionPayload, successText, closeDetails = false) => {
    if (!selected) return;
    setSaving(true);
    try {
      const result = await officerService.updateApplicationAction(selected.applicationId, actionPayload);
      const updated = normalizeOfficerApplication(result.application);
      setApplications((items) => items.map((app) => app.applicationId === updated.applicationId ? updated : app));
      setSelected(closeDetails ? null : updated);
      setNotice({ severity: 'success', text: successText });
      setMessage(''); setDialogAction('');
      return updated;
    } catch (actionError) {
      setNotice({ severity: 'error', text: actionError.message || 'Unable to save this action. Please retry.' });
      return null;
    } finally { setSaving(false); }
  };

  const submitDialogAction = async () => {
    if (!message.trim()) return;
    const actions = {
      reject: { status: 'REJECTED', action: 'Rejected', remarks: message.trim() },
      correction: { status: 'CORRECTION_REQUESTED', action: 'Correction requested', remarks: message.trim() },
      documents: { status: 'DOCUMENTS_MISSING', action: 'Additional documents requested', remarks: message.trim() },
      invalidDoc: { action: 'Document marked invalid', documentName: selectedDoc, documentStatus: 'Invalid', remarks: message.trim() }
    };
    const copy = { reject: 'Application rejected and reason recorded.', correction: 'Correction request recorded.', documents: 'Additional document request recorded.', invalidDoc: `${selectedDoc} marked invalid.` };
    await persistAction(actions[dialogAction], copy[dialogAction], true);
  };

  const openAction = (action) => { setMessage(''); setDialogAction(action); };
  const statusLabels = ['Pending', 'Under Review', 'Documents Missing', 'Verified', 'Approved', 'Rejected'];

  return (
    <Box>
      <OfficerPageHeader title="Pending Verification" subtitle="Review and verify applications submitted by citizens." />
      {notice && <Alert severity={notice.severity} sx={{ mb: 2 }} onClose={() => setNotice(null)}>{notice.text}</Alert>}
      <OfficerLoadState loading={loading} error={error} onRetry={load}>
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          <Grid item xs={6} sm={4} lg={2.4}><OfficerMetricCard label="Total Pending" value={pending.length} icon={<DescriptionOutlinedIcon />} color="warning.main" /></Grid>
          <Grid item xs={6} sm={4} lg={2.4}><OfficerMetricCard label="Today's Pending" value={pending.filter((app) => app.submittedDate?.slice(0, 10) === today).length} icon={<DescriptionOutlinedIcon />} /></Grid>
          <Grid item xs={6} sm={4} lg={2.4}><OfficerMetricCard label="High Priority" value={pending.filter((app) => app.priority === 'high').length} icon={<DescriptionOutlinedIcon />} color="error.main" /></Grid>
          <Grid item xs={6} sm={4} lg={2.4}><OfficerMetricCard label="Documents Missing" value={pending.filter((app) => app.status === 'Documents Missing').length} icon={<DescriptionOutlinedIcon />} color="warning.main" /></Grid>
          <Grid item xs={6} sm={4} lg={2.4}><OfficerMetricCard label="Overdue" value={pending.filter((app) => app.isOverdue).length} icon={<DescriptionOutlinedIcon />} color="error.main" /></Grid>
        </Grid>

        <OfficerPanel title={`Applications · ${pending.length} pending`}>
          <Grid container spacing={1.25} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} lg={3}><TextField fullWidth size="small" label="Search ID or applicant" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><TextField fullWidth select size="small" label="Scheme" value={scheme} onChange={(e) => { setScheme(e.target.value); setPage(1); }}><MenuItem value="all">All schemes</MenuItem>{schemes.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6} lg={2}><TextField fullWidth select size="small" label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><MenuItem value="pending">Pending applications</MenuItem><MenuItem value="all">All statuses</MenuItem>{statusLabels.filter((value) => value !== 'Pending').map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6} lg={1.5}><TextField fullWidth select size="small" label="Priority" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}><MenuItem value="all">All</MenuItem>{['high', 'medium', 'normal'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6} lg={1.5}><TextField fullWidth select size="small" label="District" value={district} onChange={(e) => { setDistrict(e.target.value); setPage(1); }}><MenuItem value="all">All districts</MenuItem>{districts.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField></Grid>
            <Grid item xs={6} sm={3} lg={1}><TextField fullWidth size="small" type="date" label="From" InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} /></Grid>
            <Grid item xs={6} sm={3} lg={1}><TextField fullWidth size="small" type="date" label="To" InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><TextField fullWidth select size="small" label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}><MenuItem value="newest">Newest first</MenuItem><MenuItem value="oldest">Oldest first</MenuItem><MenuItem value="priority">Priority</MenuItem></TextField></Grid>
          </Grid>
          <TableContainer sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: 920 }}>
            <TableHead><TableRow><TableCell>Application ID</TableCell><TableCell>Applicant</TableCell><TableCell>Scheme</TableCell><TableCell>Submitted</TableCell><TableCell>Documents</TableCell><TableCell>Priority</TableCell><TableCell>Status</TableCell><TableCell>Assigned Officer</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead>
            <TableBody>{visible.map((app) => <TableRow hover key={app.applicationId}>
              <TableCell>{app.applicationId}</TableCell><TableCell>{app.applicantName}<Typography variant="caption" display="block" color="text.secondary">{app.district || 'District unavailable'}</Typography></TableCell><TableCell>{app.schemeName}</TableCell><TableCell>{formatOfficerDate(app.submittedDate)}</TableCell><TableCell>{app.documents.length} listed</TableCell><TableCell><Chip size="small" label={app.isOverdue ? 'Overdue' : app.priority} color={app.isOverdue || app.priority === 'high' ? 'error' : app.priority === 'medium' ? 'warning' : 'default'} /></TableCell><TableCell><Chip size="small" label={app.status} color={getStatusColor(app.status)} /></TableCell><TableCell>{app.assignedOfficer || 'You'}</TableCell><TableCell align="right"><Button size="small" variant="contained" onClick={() => setSelected(app)}>Review</Button></TableCell>
            </TableRow>)}</TableBody>
          </Table></TableContainer>
          {!filtered.length && <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>{applications.length === 0 && status === 'pending' ? 'No applications are currently pending verification.' : 'No applications match your filters.'}</Typography>}
          {filtered.length > PAGE_SIZE && <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }} />}
        </OfficerPanel>
      </OfficerLoadState>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md" scroll="paper">
        {selected && <>
          <DialogTitle>Review application <Typography component="span" color="text.secondary">· {selected.applicationId}</Typography></DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><OfficerPanel title="Applicant information">
                <Stack spacing={1}><Typography><b>Name:</b> {selected.applicantName}</Typography><Typography><b>Email:</b> {selected.applicantEmail || 'Not provided by the assigned-applications API'}</Typography><Typography><b>Phone / address:</b> Not provided by the assigned-applications API</Typography><Typography><b>District:</b> {selected.district || 'Not provided'}</Typography><Typography><b>Application ID:</b> {selected.applicationId}</Typography></Stack>
              </OfficerPanel></Grid>
              <Grid item xs={12} md={6}><OfficerPanel title="Scheme & eligibility">
                <Stack spacing={1}><Typography><b>Scheme:</b> {selected.schemeName}</Typography><Typography><b>Department:</b> {selected.department || 'Not provided'}</Typography><Typography><b>Description / benefits:</b> Not provided by the assigned-applications API</Typography><Typography><b>Submitted:</b> {formatOfficerDate(selected.submittedDate)}</Typography><Typography><b>Income:</b> {selected.income || 'Not provided'}</Typography><Typography><b>Eligibility match:</b> {selected.matchPercentage != null ? `${selected.matchPercentage}%` : 'Not provided'}</Typography>
                  {selected.eligibilityCriteria?.length ? selected.eligibilityCriteria.map((criterion) => <Box key={criterion.criterion} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}><Typography variant="body2" fontWeight={700}>{criterion.criterion}</Typography><Typography variant="caption" display="block">Applicant: {criterion.applicantValue} · Required: {criterion.requiredValue}</Typography><Chip size="small" sx={{ mt: 0.5 }} label={criterion.result} color={criterion.result === 'Passed' ? 'success' : criterion.result === 'Failed' ? 'error' : 'warning'} /></Box>) : <Typography variant="caption" color="text.secondary">The current API does not return scheme rules or criterion values.</Typography>}
                </Stack>
              </OfficerPanel></Grid>
              <Grid item xs={12}><OfficerPanel title="Uploaded documents">
                {selected.documents.length ? <Stack divider={<Divider flexItem />}>
                  {selected.documents.map((doc) => <Stack key={doc.name} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1} sx={{ py: 1.25 }}>
                    <Box><Typography fontWeight={600}>{doc.name}</Typography><Typography variant="caption" color="text.secondary">{doc.status} · upload date and file preview/download URL not provided</Typography></Box>
                    <Stack direction="row" gap={1} flexWrap="wrap"><Chip size="small" label={doc.status} color={doc.status.toLowerCase().includes('verified') ? 'success' : 'warning'} /><Button size="small" disabled title="Document URL is not provided by the API">Preview</Button><Button size="small" color="success" onClick={() => persistAction({ action: 'Document verified', documentName: doc.name, documentStatus: 'Verified', remarks: `Verified ${doc.name}` }, `${doc.name} marked verified.`)}>Verify</Button><Button size="small" color="error" onClick={() => { setSelectedDoc(doc.name); openAction('invalidDoc'); }}>Invalid</Button><Button size="small" onClick={() => persistAction({ action: 'Document re-upload requested', documentName: doc.name, documentStatus: 'Re-upload requested', remarks: `Re-upload requested for ${doc.name}` }, `Re-upload requested for ${doc.name}.`)}>Request re-upload</Button></Stack>
                  </Stack>)}
                </Stack> : <Typography color="text.secondary">No documents were listed on this application.</Typography>}
              </OfficerPanel></Grid>
              <Grid item xs={12}><OfficerPanel title="Verification history">
                {selected.verificationHistory.length ? <Stack spacing={1.25}>{selected.verificationHistory.map((entry) => <Box key={entry.id} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}><Typography variant="body2" fontWeight={700}>{entry.action}</Typography><Typography variant="caption" color="text.secondary">{entry.officer}{entry.officerId ? ` · Officer ID ${entry.officerId}` : ''} · {formatOfficerDate(entry.timestamp, { dateStyle: 'medium', timeStyle: 'short' })}</Typography>{entry.remarks && <Typography variant="body2" sx={{ mt: 0.5 }}>{entry.remarks}</Typography>}</Box>)}</Stack> : <Typography color="text.secondary">No actions recorded for this application.</Typography>}
              </OfficerPanel></Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ flexWrap: 'wrap', p: 2 }}>
            <Button onClick={() => setSelected(null)}>Close</Button>
            <Button variant="outlined" color="warning" onClick={() => openAction('correction')}>Request correction</Button>
            <Button variant="outlined" onClick={() => openAction('documents')}>Request additional document</Button>
            <Button variant="contained" color="error" onClick={() => openAction('reject')}>Reject</Button>
            <Button variant="contained" color="success" disabled={saving} onClick={() => persistAction({ status: 'VERIFIED', action: 'Verified', remarks: 'Verified by officer after review.' }, 'Application verified successfully.')}>Approve / Verify</Button>
          </DialogActions>
        </>}
      </Dialog>

      <Dialog open={Boolean(dialogAction)} onClose={() => !saving && setDialogAction('')} fullWidth maxWidth="sm">
        <DialogTitle>{dialogAction === 'reject' ? 'Reject application' : dialogAction === 'correction' ? 'Request correction' : dialogAction === 'invalidDoc' ? `Mark ${selectedDoc} invalid` : 'Request additional document'}</DialogTitle>
        <DialogContent><TextField autoFocus fullWidth multiline minRows={3} sx={{ mt: 1 }} label={dialogAction === 'reject' ? 'Reason for rejection (required)' : dialogAction === 'invalidDoc' ? 'Reason (required)' : 'Message to applicant (required)'} value={message} onChange={(e) => setMessage(e.target.value)} /></DialogContent>
        <DialogActions><Button disabled={saving} onClick={(event) => { event.stopPropagation(); setDialogAction(''); }}>Cancel</Button><Button disabled={saving || !message.trim()} variant="contained" color={dialogAction === 'reject' ? 'error' : 'primary'} onClick={(event) => { event.stopPropagation(); submitDialogAction(); }}>{saving ? 'Saving…' : 'Confirm'}</Button></DialogActions>
      </Dialog>
      <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={notice?.severity || 'success'} onClose={() => setNotice(null)} sx={{ width: '100%' }}>{notice?.text}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OfficerVerificationsPage;
