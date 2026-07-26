import React from 'react';
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
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const ApplicationsPage = () => {
  // Mock data for tracker
  const trackingSteps = [
    { label: 'Eligibility Verified', description: 'AI verified match at 92%', date: 'Jul 24, 2026' },
    { label: 'Documents Gathered', description: 'Mandatory Aadhaar proof checked', date: 'Jul 25, 2026' },
    { label: 'Application Submitted', description: 'Acknowledgement Uploaded (Nodal Portal)', date: 'Jul 26, 2026' },
    { label: 'Under Verification', description: 'Pending Department Review', date: 'In Progress' }
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        My Tracker & Saved Schemes
      </Typography>

      <Grid container spacing={4}>
        {/* Saved Schemes List */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Saved Schemes (Bookmarked)
          </Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <BookmarkIcon color="secondary" />
                    <Typography variant="h6" fontWeight="bold">PM-KISAN Samman Nidhi</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">Ministry of Agriculture</Typography>
                </Box>
                <Chip label="85% Match" color="info" />
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Live Application Tracker */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Application Timeline Tracker
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Pradhan Mantri Awas Yojana
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 3 }}>
                Reference ID: ADH-2026-9082
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stepper orientation="vertical" activeStep={3}>
                {trackingSteps.map((step, index) => (
                  <Step key={index} active={true}>
                    <StepLabel
                      icon={index < 3 ? <CheckCircleIcon color="success" /> : undefined}
                    >
                      <Typography fontWeight="bold">{step.label}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                        {step.date}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicationsPage;
