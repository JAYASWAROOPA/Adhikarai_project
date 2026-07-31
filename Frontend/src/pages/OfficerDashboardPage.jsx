import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useAuthStore } from '../store/useAuthStore';

const OfficerDashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  const [applications, setApplications] = useState([
    {
      id: "APP-2026-9082",
      applicantName: "Rajesh Kumar",
      applicantEmail: "citizen@adhikarai.gov.in",
      schemeName: "Pradhan Mantri Awas Yojana (PMAY Urban 2.0)",
      department: "Ministry of Housing & Urban Affairs",
      district: "Mumbai Suburban",
      income: "₹4,50,000",
      appliedDate: "2026-07-20",
      status: "UNDER_REVIEW",
      stage: "Stage 3 of 5 (Officer Verification)",
      attachedDocs: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
      matchPercentage: 92,
      officerNotes: null
    },
    {
      id: "APP-2026-7811",
      applicantName: "Priya Sharma",
      applicantEmail: "priya.s@gmail.com",
      schemeName: "Ayushman Bharat PM-JAY",
      department: "National Health Authority",
      district: "Mumbai City",
      income: "₹2,20,000",
      appliedDate: "2026-07-24",
      status: "UNDER_REVIEW",
      stage: "Stage 2 of 5 (Document Verification)",
      attachedDocs: ["Aadhaar Card", "Ration Card (BPL)"],
      matchPercentage: 95,
      officerNotes: null
    }
  ]);

  const [selectedApp, setSelectedApp] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [actionType, setActionType] = useState('APPROVE');
  const [remarks, setRemarks] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleOpenActionModal = (app, action) => {
    setSelectedApp(app);
    setActionType(action);
    setRemarks(action === 'APPROVE' ? 'All mandatory documents verified. Application approved.' : 'Remarks required.');
    setOpenModal(true);
  };

  const handleConfirmAction = () => {
    if (!selectedApp) return;

    const newStatus = actionType === 'APPROVE' ? 'APPROVED' : actionType === 'REJECT' ? 'REJECTED' : 'DOC_REQUESTED';
    setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: newStatus, officerNotes: remarks } : a));

    setToastMsg(`Application ${selectedApp.id} updated to ${newStatus}.`);
    setOpenModal(false);
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip icon={<BadgeIcon style={{ color: '#fff' }} />} label="Nodal Verification Officer Portal" color="secondary" sx={{ fontWeight: 'bold' }} />
            <Chip label="Department Verification Desk" color="primary" variant="outlined" />
          </Stack>
          <Typography variant="h3" fontWeight="bold" color="primary.main">
            Officer Verification Workspace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Officer: <strong>{user?.name || "Suresh Patil (Nodal Officer)"}</strong> • Ministry of Housing & Urban Affairs (Mumbai Suburban)
          </Typography>
        </Box>
      </Box>

      {toastMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{toastMsg}</Alert>}

      {/* Applications List */}
      <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
        Assigned Citizen Applications ({applications.length})
      </Typography>

      <Grid container spacing={3}>
        {applications.map((app) => (
          <Grid item xs={12} key={app.id}>
            <Card sx={{ p: 1, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip label={app.id} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                      <Chip label={`${app.matchPercentage}% AI Match`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                      <Chip label={app.status} color={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'error' : 'warning'} size="small" sx={{ fontWeight: 'bold' }} />
                    </Stack>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">{app.applicantName}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{app.applicantEmail} • Applied {app.appliedDate}</Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">{app.schemeName}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">Income: {app.income} • District: {app.district}</Typography>
                    <Typography variant="caption" color="text.primary" fontWeight="bold" display="block" sx={{ mt: 0.5 }}>
                      Docs: {app.attachedDocs.join(', ')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                    {app.status === 'UNDER_REVIEW' ? (
                      <Stack direction="row" spacing={1} justifyContent={{ md: 'flex-end' }}>
                        <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleOpenActionModal(app, 'APPROVE')} sx={{ fontWeight: 'bold' }}>
                          Approve
                        </Button>
                        <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleOpenActionModal(app, 'REJECT')} sx={{ fontWeight: 'bold' }}>
                          Reject
                        </Button>
                        <Button variant="outlined" color="warning" size="small" startIcon={<RateReviewIcon />} onClick={() => handleOpenActionModal(app, 'DOC_REQ')} sx={{ fontWeight: 'bold' }}>
                          Request Docs
                        </Button>
                      </Stack>
                    ) : (
                      <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight="bold" display="block" color={app.status === 'APPROVED' ? 'success.main' : 'error.main'}>
                          Decision: {app.status}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{app.officerNotes}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Verification Action Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Officer Decision: {actionType === 'APPROVE' ? 'Approve Application' : actionType === 'REJECT' ? 'Reject Application' : 'Request Additional Documents'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Applicant: {selectedApp?.applicantName} ({selectedApp?.id})
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Scheme: {selectedApp?.schemeName}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Officer Official Remarks / Decision Notes"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" color={actionType === 'APPROVE' ? 'success' : actionType === 'REJECT' ? 'error' : 'warning'} onClick={handleConfirmAction} sx={{ fontWeight: 'bold' }}>
            Submit Official Decision
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfficerDashboardPage;
