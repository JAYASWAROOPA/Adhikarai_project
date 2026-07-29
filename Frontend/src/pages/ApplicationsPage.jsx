import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  LinearProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';

const FIVE_STAGE_TIMELINE = [
  { id: 1, title: 'Applied', desc: 'Online application submitted via AI Auto-Fill Engine with QR verification hash.', date: 'Jul 20, 2026', status: 'completed' },
  { id: 2, title: 'Document Review', desc: 'Aadhaar, Income Cert & Passbook auto-verified against Smart Vault.', date: 'Jul 22, 2026', status: 'completed' },
  { id: 3, title: 'Officer Verification', desc: 'Assigned to Nodal Officer Suresh Patil (Andheri Revenue Portal).', date: 'Jul 25, 2026', status: 'active' },
  { id: 4, title: 'Approved / Rejected', desc: 'Final department authorization & sanction certificate generation.', date: 'Pending', status: 'upcoming' },
  { id: 5, title: 'Disbursement', desc: 'Direct Benefit Transfer (DBT) credit to Aadhaar-linked Bank Account.', date: 'Pending', status: 'upcoming' }
];

const ApplicationsPage = () => {
  const navigate = useNavigate();

  const applicationsList = [
    {
      id: 'APP-2026-9082',
      schemeName: 'Pradhan Mantri Awas Yojana (PMAY Urban 2.0)',
      department: 'Ministry of Housing & Urban Affairs',
      appliedDate: '2026-07-20',
      activeStep: 2, // 0-indexed: Stage 3 (Officer Verification)
      progress: 60,
      benefit: '₹2.67 Lakh Credit Subsidy',
      statusLabel: 'In Officer Verification',
      statusColor: 'warning'
    },
    {
      id: 'APP-2026-4412',
      schemeName: 'PM-KISAN Samman Nidhi',
      department: 'Ministry of Agriculture',
      appliedDate: '2026-06-15',
      activeStep: 4, // Stage 5 (Disbursement)
      progress: 100,
      benefit: '₹6,000 / Year DBT',
      statusLabel: 'Disbursed to Bank',
      statusColor: 'success'
    }
  ];

  const [selectedApp, setSelectedApp] = useState(applicationsList[0]);

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
        My Application Tracker & Status
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track real-time 5-stage lifecycle progress of your submitted government welfare applications.
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Applications List (40%) */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
            Your Submitted Applications ({applicationsList.length})
          </Typography>
          <Stack spacing={2}>
            {applicationsList.map((app) => {
              const isSelected = selectedApp.id === app.id;
              return (
                <Card
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  sx={{
                    p: 1,
                    borderRadius: 3,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: isSelected ? 'secondary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.50' : 'background.paper',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Chip label={app.id} size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                      <Chip label={app.statusLabel} color={app.statusColor} size="small" sx={{ fontWeight: 'bold' }} />
                    </Stack>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      {app.schemeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                      {app.department} • Applied {app.appliedDate}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="bold" color="secondary.main">
                        Benefit: {app.benefit}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">{app.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={app.progress} color={app.statusColor} sx={{ height: 6, borderRadius: 3 }} />
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          {/* Bookmarked / Saved Schemes Widget */}
          <Paper elevation={0} sx={{ p: 3, mt: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom display="flex" alignItems="center" gap={1}>
              <BookmarkIcon color="secondary" /> Saved Schemes (1)
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider', mt: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight="bold">Ayushman Bharat PM-JAY</Typography>
                <Chip label="95% Match" color="success" size="small" sx={{ fontWeight: 'bold' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                ₹5.00 Lakh Free Cashless Health Cover
              </Typography>
              <Button size="small" variant="contained" color="secondary" onClick={() => navigate('/schemes/3')} sx={{ mt: 1.5, fontWeight: 'bold' }}>
                Apply Now
              </Button>
            </Paper>
          </Paper>
        </Grid>

        {/* Right Side: 5-Stage Live Timeline Tracker (60%) */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {selectedApp.schemeName}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Application ID: <strong>{selectedApp.id}</strong> • Department: {selectedApp.department}
                </Typography>
              </Box>
              <Chip label={`${selectedApp.progress}% Processed`} color={selectedApp.statusColor} sx={{ fontWeight: 'bold' }} />
            </Box>

            <Divider sx={{ my: 2.5 }} />

            {/* 5-Stage Stepper Tracker */}
            <Typography variant="subtitle1" fontWeight="bold" color="secondary.main" sx={{ mb: 2 }}>
              5-Stage Real-Time Verification Lifecycle
            </Typography>

            <Stepper orientation="vertical" activeStep={selectedApp.activeStep}>
              {FIVE_STAGE_TIMELINE.map((stage, idx) => {
                const isCompleted = idx < selectedApp.activeStep;
                const isActive = idx === selectedApp.activeStep;

                return (
                  <Step key={stage.id} active={isActive || isCompleted} completed={isCompleted}>
                    <StepLabel
                      icon={
                        isCompleted ? (
                          <CheckCircleIcon color="success" />
                        ) : isActive ? (
                          <AccessTimeIcon color="warning" />
                        ) : undefined
                      }
                    >
                      <Typography variant="subtitle2" fontWeight="bold" color={isActive ? 'secondary.main' : isCompleted ? 'success.main' : 'text.secondary'}>
                        Stage {stage.id}: {stage.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1, lineHeight: 1.5 }}>
                        {stage.desc}
                      </Typography>
                      <Chip
                        label={isCompleted ? `Verified: ${stage.date}` : isActive ? `Active Status: In Progress` : `Pending`}
                        size="small"
                        color={isCompleted ? 'success' : isActive ? 'warning' : 'default'}
                        variant={isCompleted ? 'contained' : 'outlined'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicationsPage;
