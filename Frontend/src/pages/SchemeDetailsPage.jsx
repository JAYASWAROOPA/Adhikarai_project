import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Stack,
  Divider,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { fetchMockSchemes } from '../services/api';

const SchemeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligibleStatus, setEligibleStatus] = useState(null);

  useEffect(() => {
    async function loadScheme() {
      setLoading(true);
      const schemesList = await fetchMockSchemes();
      const matched = schemesList.find((s) => s.id === parseInt(id || '1'));
      setScheme(matched || schemesList[0]);
      setLoading(false);
    }
    loadScheme();
  }, [id]);

  const handleCheckEligibility = () => {
    setEligibilityChecked(true);
    // Simple mock logic: if scheme id is 1, let's say user is eligible.
    if (scheme?.id === 1) {
      setEligibleStatus({
        status: 'Eligible',
        score: 92,
        missing: []
      });
    } else {
      setEligibleStatus({
        status: 'Possibly Eligible',
        score: 75,
        missing: ['Requires Farmer Classification']
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 3 }}>
        Back to Dashboard
      </Button>

      {/* Main Title & Badges */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>{scheme?.name}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip label={scheme?.department} color="primary" />
          <Chip label="Central Welfare" color="secondary" variant="outlined" />
          <Chip label="Housing & Subsidy" variant="outlined" />
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column (70%) */}
        <Grid item xs={12} md={8}>
          {/* Overview */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Scheme Overview</Typography>
            <Typography variant="body1" paragraph>
              {scheme?.description}. This program aims to provide housing/financial support directly to eligible beneficiaries across urban and rural sectors.
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }} color="secondary.main">
              Benefits: {scheme?.benefits}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} href="https://example.gov.in" target="_blank">
              Visit Official Website
            </Button>
          </Paper>

          {/* Eligibility Breakdown */}
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Detailed Eligibility Rules</Typography>
          <Box sx={{ mb: 3 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Age Criteria</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Applicant must be between **{scheme?.eligibilityAgeMin}** and **{scheme?.eligibilityAgeMax}** years of age.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Income Limits</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {scheme?.incomeLimit ? `Family's annual income must be below **₹${scheme.incomeLimit.toLocaleString()}**.` : 'No strict income ceiling apply to this scheme.'}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Location Constraints</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Applicable for Indian residents. Particular emphasis on local urban/rural ward boundaries as defined by state legislation.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Documents Required */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Required Documents</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {scheme?.documents.map((doc, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px solid #e2e8f0' }}>
                  <FormControlLabel
                    control={<Checkbox checked={doc === 'Aadhaar' || doc === 'Aadhar'} readOnly color="success" />}
                    label={<Typography variant="body2">{doc} (Mandatory)</Typography>}
                  />
                  <Button startIcon={<UploadFileIcon />} size="small" variant="outlined">
                    Upload
                  </Button>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Application Steps */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Application Process</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip label="1" color="primary" />
                <Typography variant="body2">Confirm eligibility using our AI Assistant or the sidebar analyzer.</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip label="2" color="primary" />
                <Typography variant="body2">Gather mandatory files (Aadhar Card, Income statement, bank accounts).</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip label="3" color="primary" />
                <Typography variant="body2">Click 'Apply Now' to submit details directly to the nodal department portal.</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column (30%) */}
        <Grid item xs={12} md={4}>
          {/* Eligibility Checker Card */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: eligibilityChecked ? 'success.main' : 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Eligibility Verification
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {!eligibilityChecked ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
                    Compare this scheme rules with your active profile details.
                  </Typography>
                  <Button variant="contained" color="secondary" fullWidth onClick={handleCheckEligibility}>
                    Check My Eligibility
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Alert severity={eligibleStatus?.status === 'Eligible' ? 'success' : 'warning'} icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                    {eligibleStatus?.status} ({eligibleStatus?.score}% Match)
                  </Alert>
                  {eligibleStatus?.missing.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">Action Needed:</Typography>
                      {eligibleStatus?.missing.map((item, idx) => (
                        <Typography key={idx} variant="caption" display="block" color="error.main">
                          • {item}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  <Button variant="outlined" color="primary" fullWidth onClick={() => navigate('/profile')}>
                    Update Profile
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" color="primary" size="large" fullWidth>
                Apply Now
              </Button>
              <Button variant="outlined" color="primary" fullWidth>
                Save for Later
              </Button>
              <Divider />
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button startIcon={<ShareIcon />} size="small">Share</Button>
                <Button startIcon={<FileDownloadIcon />} size="small">PDF</Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Scheme Stats Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Scheme Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Applicants</Typography>
                  <Typography variant="body2" fontWeight="bold">1.2 Million</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">89.4%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Processing Time</Typography>
                  <Typography variant="body2" fontWeight="bold">~ 14 Days</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchemeDetailsPage;
