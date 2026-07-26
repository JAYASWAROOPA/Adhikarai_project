import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import EventIcon from '@mui/icons-material/Event';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import { officerService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OfficerVerificationsPage = () => {
  const navigate = useNavigate();
  const [pendingList, setPendingList] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  
  // Modals state
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [openRequestDocModal, setOpenRequestDocModal] = useState(false);
  const [docNotes, setDocNotes] = useState('');
  const [openInterviewModal, setOpenInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [openCertModal, setOpenCertModal] = useState(false);
  const [certData, setCertData] = useState(null);

  useEffect(() => {
    async function loadPending() {
      const data = await officerService.getPendingVerifications();
      setPendingList(data || []);
      if (data && data.length > 0) {
        setSelectedApp(data[0]);
      }
    }
    loadPending();
  }, []);

  const handleApprove = async () => {
    if (!selectedApp) return;
    await officerService.approveApplication(selectedApp.applicationId, 'Approved by Officer after document verification.');
    setActionMsg(`Application ${selectedApp.applicationId} approved successfully!`);
  };

  const handleRejectSubmit = async () => {
    if (!selectedApp) return;
    await officerService.rejectApplication(selectedApp.applicationId, rejectReason);
    setOpenRejectModal(false);
    setActionMsg(`Application ${selectedApp.applicationId} rejected.`);
    setRejectReason('');
  };

  const handleRequestDocsSubmit = async () => {
    if (!selectedApp) return;
    await officerService.requestDocuments(selectedApp.applicationId, docNotes);
    setOpenRequestDocModal(false);
    setActionMsg(`Document request sent to ${selectedApp.citizenName}`);
    setDocNotes('');
  };

  const handleScheduleSubmit = async () => {
    if (!selectedApp) return;
    await officerService.scheduleInterview(selectedApp.applicationId, { date: interviewDate, time: interviewTime });
    setOpenInterviewModal(false);
    setActionMsg(`Interview scheduled on ${interviewDate} at ${interviewTime}`);
  };

  const handleGenerateCert = async () => {
    if (!selectedApp) return;
    const cert = await officerService.generateCertificate(selectedApp.applicationId);
    setCertData(cert);
    setOpenCertModal(true);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Application Verification Workflow
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Inspect citizen documents, evaluate eligibility rules, approve/reject claims, or generate digital certificates
        </Typography>
      </Box>

      {actionMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionMsg('')}>
          {actionMsg}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column: Applications List */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
            Pending Queue ({pendingList.length})
          </Typography>
          <Stack spacing={2}>
            {pendingList.map((app) => (
              <Card
                key={app.applicationId}
                onClick={() => setSelectedApp(app)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: selectedApp?.applicationId === app.applicationId ? 'secondary.main' : 'divider',
                  bgcolor: selectedApp?.applicationId === app.applicationId ? 'action.hover' : 'background.paper'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Chip label={app.applicationId} size="small" color="primary" />
                    <Chip label={app.priority.toUpperCase()} color="error" size="small" />
                  </Stack>
                  <Typography variant="subtitle1" fontWeight="bold">{app.citizenName}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{app.schemeName}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Right Column: Verification Workspace */}
        <Grid item xs={12} md={8}>
          {selectedApp ? (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">{selectedApp.citizenName}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Aadhaar: {selectedApp.citizenAadhar} • Location: {selectedApp.citizenLocation}
                  </Typography>
                  <Button size="small" color="secondary" onClick={() => navigate(`/officer/citizens/${selectedApp.citizenId || 303}`)} sx={{ mt: 0.5, p: 0 }}>
                    View Complete Citizen Profile ➔
                  </Button>
                </Box>
                <Chip label={`Status: ${selectedApp.status}`} color="warning" fontWeight="bold" />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Automated Rules Engine Check */}
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'success.light', color: '#fff', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">AI / DB Eligibility Check:</Typography>
                <Typography variant="body2">{selectedApp.eligibilityRulesCheck}</Typography>
              </Paper>

              {/* Documents Verification List */}
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Document Authenticity Checklist
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 4 }}>
                {selectedApp.documents.map((doc, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon color="primary" />
                      <Typography variant="body2" fontWeight="bold">{doc.name}</Typography>
                    </Box>
                    <Chip
                      label={doc.status === 'verified' ? 'Verified' : 'Pending Review'}
                      color={doc.status === 'verified' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>

              {/* Officer Action Bar */}
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Officer Actions & Decision
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="success" fullWidth startIcon={<CheckCircleIcon />} onClick={handleApprove}>
                    Approve Application
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="error" fullWidth startIcon={<CancelIcon />} onClick={() => setOpenRejectModal(true)}>
                    Reject Application
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="warning" fullWidth startIcon={<HelpIcon />} onClick={() => setOpenRequestDocModal(true)}>
                    Request Docs
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="primary" fullWidth startIcon={<EventIcon />} onClick={() => setOpenInterviewModal(true)}>
                    Schedule Interview
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="secondary" fullWidth startIcon={<VerifiedIcon />} onClick={handleGenerateCert}>
                    Generate Cert
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Select an application from the queue to verify.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Reject Modal */}
      <Dialog open={openRejectModal} onClose={() => setOpenRejectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Reject Application</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectModal(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRejectSubmit}>Confirm Rejection</Button>
        </DialogActions>
      </Dialog>

      {/* Request Docs Modal */}
      <Dialog open={openRequestDocModal} onClose={() => setOpenRequestDocModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Request Additional Documents</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Specific Documents / Instructions Required"
            fullWidth
            multiline
            rows={3}
            value={docNotes}
            onChange={(e) => setDocNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDocModal(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleRequestDocsSubmit}>Send Request</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={openInterviewModal} onClose={() => setOpenInterviewModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Schedule Verification Interview</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              type="date"
              label="Interview Date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
            <TextField
              type="time"
              label="Interview Time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInterviewModal(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleScheduleSubmit}>Confirm Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Modal */}
      <Dialog open={openCertModal} onClose={() => setOpenCertModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Official Digital Verification Certificate</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center' }}>
          <VerifiedIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">GOVERNMENT OF INDIA BENEFIT CERTIFICATE</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>Certificate No: {certData?.certificateNumber}</Typography>
          <Paper elevation={0} sx={{ p: 2, my: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">QR Code Verification Hash:</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>{certData?.qrCodeData}</Typography>
          </Paper>
          <Typography variant="caption" color="text.secondary">Digitally signed by Nodal Officer Vikram Singh.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCertModal(false)}>Close</Button>
          <Button variant="contained" color="secondary">Download PDF</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfficerVerificationsPage;
