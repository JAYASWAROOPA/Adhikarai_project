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
  CircularProgress,
  Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BusinessIcon from '@mui/icons-material/Business';
import { contentService } from '../services/api';
import SchemeRequiredOfficesWidget from '../components/offices/SchemeRequiredOfficesWidget';

const SchemeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);

  useEffect(() => {
    async function loadScheme() {
      try {
        setLoading(true);
        const data = await contentService.getSchemeDetails(id || 1);
        setScheme(data);
      } catch (err) {
        console.error('Error fetching scheme details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScheme();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await contentService.submitApplication({ schemeId: scheme?.id, schemeName: scheme?.name });
      setAppSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const dept = scheme?.department;
  const benefits = typeof scheme?.benefits === 'object' ? scheme.benefits : { subsidy: scheme?.benefits || "Financial Subsidy" };
  const userElig = scheme?.userEligibility || { eligible: true, matchPercentage: 92, reasons: [] };

  return (
    <Box sx={{ py: 3 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/schemes')} sx={{ mb: 3 }}>
        Back to All Schemes
      </Button>

      {appSubmitted && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setAppSubmitted(false)}>
          Application submitted successfully! Track progress in your Applications Dashboard.
        </Alert>
      )}

      {/* Main Title & Badges */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
          {scheme?.name}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Chip icon={<BusinessIcon />} label={dept?.name || "Nodal Department"} color="primary" />
          <Chip label={scheme?.category || "Welfare Scheme"} color="secondary" variant="outlined" />
          <Chip label={`${userElig.matchPercentage}% Citizen Match`} color="success" />
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Main Details (Left 70%) */}
        <Grid item xs={12} md={8}>
          {/* Scheme Overview */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              Scheme Overview
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
              {scheme?.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" color="secondary.main" gutterBottom>
              Key Scheme Benefits:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {Object.entries(benefits).map(([key, val]) => (
                <Grid item xs={12} sm={4} key={key}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {key}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {val}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Detailed Eligibility Rules */}
          <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
            Database Eligibility Rules
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Accordion defaultExpanded sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Age & Demographic Rules</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Min Age: <strong>{scheme?.eligibility?.ageMin || 18} years</strong> | Max Age: <strong>{scheme?.eligibility?.ageMax || 65} years</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Categories Covered: <strong>{(scheme?.eligibility?.casteCategories || ["General", "OBC", "SC", "ST", "EWS"]).join(', ')}</strong>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Income Ceiling Criteria</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Maximum Annual Family Income: <strong>₹{scheme?.eligibility?.incomeLimit ? Number(scheme.eligibility.incomeLimit).toLocaleString() : "No Limit"}</strong>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Geographic Coverage</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Eligible States: <strong>{(scheme?.eligibility?.states || ["All States & UTs"]).join(', ')}</strong>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Required Documents Checklist */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              Mandatory Documents Checklist
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {scheme?.documents?.map((doc, idx) => {
                const docName = typeof doc === 'string' ? doc : doc.name || doc.document_name;
                const status = typeof doc === 'object' ? doc.uploadStatus : 'uploaded';
                return (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <FormControlLabel
                      control={<Checkbox checked={status === 'uploaded'} readOnly color="success" />}
                      label={
                        <Typography variant="body2" fontWeight="500">
                          {docName} {doc.required !== false && <span style={{ color: '#fc8181' }}>*</span>}
                        </Typography>
                      }
                    />
                    <Chip
                      label={status === 'uploaded' ? 'Verified' : 'Missing'}
                      color={status === 'uploaded' ? 'success' : 'error'}
                      size="small"
                      variant={status === 'uploaded' ? 'contained' : 'outlined'}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          {/* Scheme Required Offices Recommendation Widget */}
          <SchemeRequiredOfficesWidget schemeId={scheme?.id} schemeName={scheme?.name} />

          {/* Application Steps */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              Application Process & Timeline (Est. 15-30 Days)
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {(scheme?.applicationProcess || [
                "Verify eligibility on ADHIKARAI platform",
                "Upload required documents in Profile",
                "Submit online application for department verification"
              ]).map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {idx + 1}
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">{step}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Frequently Asked Questions (FAQs) Accordion */}
          <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              Frequently Asked Questions (FAQs)
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {[
                { q: "Is there any fee to apply through ADHIKARAI?", a: "No, applying through ADHIKARAI is 100% free for all Indian citizens." },
                { q: "Can I apply if my profile is only 85% complete?", a: "You can explore schemes and check eligibility, but profile must be 100% complete before final submission." },
                { q: "How long does document verification take?", a: "Nodal Officers process verification within 3 to 7 working days." }
              ].map((faq, fIdx) => (
                <Paper key={fIdx} elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">Q: {faq.q}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{faq.a}</Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Sidebar (Right 30%) */}
        <Grid item xs={12} md={4}>
          {/* User Eligibility Breakdown Card */}
          <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: userElig.eligible ? 'success.main' : 'warning.main' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Your AI Match Analysis
              </Typography>
              <Chip label={`${userElig.matchPercentage}% Match`} color="success" sx={{ mb: 2 }} />

              <Stack spacing={1} sx={{ mb: 2 }}>
                {userElig.reasons?.map((reason, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                    <Typography variant="caption" fontWeight="500">{reason}</Typography>
                  </Box>
                ))}
              </Stack>

              <Button variant="contained" color="secondary" fullWidth onClick={() => navigate(`/apply/${scheme?.id || 1}`)}>
                ⚡ Apply via AI Auto-Fill Engine
              </Button>
            </CardContent>
          </Card>

          {/* Department Metadata */}
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Nodal Department Info
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">{dept?.name}</Typography>
              {dept?.website && (
                <Button variant="text" size="small" href={dept.website} target="_blank" color="secondary" sx={{ mt: 1 }}>
                  Official Ministry Portal
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Scheme Live Analytics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Beneficiaries</Typography>
                  <Typography variant="body2" fontWeight="bold">{scheme?.statistics?.totalApplicants || "25,847"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">{scheme?.statistics?.successRate || "78"}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Avg Processing</Typography>
                  <Typography variant="body2" fontWeight="bold">{scheme?.statistics?.averageTime || "15 days"}</Typography>
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
