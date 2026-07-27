import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { autoFillService } from '../../services/api';
import ApplicationReviewModal from './ApplicationReviewModal';

const AutoFillEngine = ({ schemeId = 1, schemeName = "Pradhan Mantri Awas Yojana (PMAY)" }) => {
  const [loading, setLoading] = useState(true);
  const [autoFillData, setAutoFillData] = useState(null);
  const [formData, setFormData] = useState({});
  const [openReviewModal, setOpenReviewModal] = useState(false);

  useEffect(() => {
    async function loadAutoFill() {
      try {
        setLoading(true);
        const data = await autoFillService.getAutoFill(schemeId);
        setAutoFillData(data);
        setFormData(data.prefilledData || {});
      } catch (err) {
        console.error('Error fetching auto-fill data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAutoFill();
  }, [schemeId]);

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const requiredFields = autoFillData?.requiredFields || [];
  const autofilledFields = autoFillData?.autofilledFields || [];
  const autoAttachedDocs = autoFillData?.autoAttachedDocuments || [];
  const missingDocs = autoFillData?.missingDocuments || [];
  
  // Recalculate dynamic completion percentage based on current state
  const filledCount = requiredFields.filter(f => formData[f.field_key] !== undefined && formData[f.field_key] !== '').length + autoAttachedDocs.length;
  const totalRequired = requiredFields.filter(f => f.is_required).length + (autoAttachedDocs.length + missingDocs.length);
  const currentCompletion = Math.min(100, Math.round((filledCount / (totalRequired || 1)) * 100));

  return (
    <Box sx={{ py: 2 }}>
      {/* Header Banner */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip icon={<AutoFixHighIcon style={{ color: '#ed8936' }} />} label="AI Auto Form-Filling Active" color="secondary" sx={{ fontWeight: 'bold' }} />
              <Chip label="Zero Redundant Uploads" color="primary" variant="outlined" />
            </Stack>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {schemeName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Your profile data and document vault have been matched automatically. Review and edit before final submission.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper', textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">Application Completion Meter</Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">{currentCompletion}%</Typography>
              <LinearProgress variant="determinate" value={currentCompletion} color="secondary" sx={{ height: 8, borderRadius: 4, mt: 1 }} />
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Dynamic Form Grid */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Dynamic Application Form Fields
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fields marked with <Chip label="✓ Auto-filled from Profile" color="success" size="small" sx={{ mx: 0.5 }} /> were populated automatically.
        </Typography>

        <Grid container spacing={3}>
          {requiredFields.map((field) => {
            const isAutoFilled = autofilledFields.includes(field.field_key);
            const value = formData[field.field_key] || '';
            const isEmpty = !value && field.is_required;

            return (
              <Grid item xs={12} sm={6} key={field.field_key}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      {field.field_label} {field.is_required && <span style={{ color: '#fc8181' }}>*</span>}
                    </Typography>
                    {isAutoFilled ? (
                      <Chip icon={<CheckCircleIcon fontSize="small" />} label="Auto-filled from Profile" color="success" size="small" variant="contained" />
                    ) : isEmpty ? (
                      <Chip icon={<WarningIcon fontSize="small" />} label="Required - Please fill" color="warning" size="small" variant="contained" />
                    ) : (
                      <Chip label="User Input" size="small" variant="outlined" />
                    )}
                  </Box>

                  {field.field_type === 'select' ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={value}
                        onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select {field.field_label}</MenuItem>
                        {field.options?.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      type={field.field_type === 'number' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: isAutoFilled ? 'rgba(72, 187, 120, 0.05)' : isEmpty ? 'rgba(237, 137, 54, 0.05)' : 'inherit',
                          borderColor: isAutoFilled ? 'success.main' : isEmpty ? 'warning.main' : 'inherit'
                        }
                      }}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Smart Document Vault Auto-Attaching Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Smart Document Vault Attachments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Required scheme documents auto-attached from your Vault without requiring manual re-upload.
        </Typography>

        <Grid container spacing={2}>
          {autoAttachedDocs.map((doc) => (
            <Grid item xs={12} sm={6} key={doc.id}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', color: '#fff', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <DescriptionIcon />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{doc.document_type}</Typography>
                    <Typography variant="caption">{doc.file_name}</Typography>
                  </Box>
                </Stack>
                <Chip label="Auto-Attached" color="success" variant="contained" size="small" sx={{ bgcolor: '#fff', color: 'success.main', fontWeight: 'bold' }} />
              </Paper>
            </Grid>
          ))}

          {missingDocs.map((docType, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.light', color: '#fff', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <WarningIcon />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{docType}</Typography>
                    <Typography variant="caption">Missing in Vault</Typography>
                  </Box>
                </Stack>
                <Button size="small" variant="contained" color="secondary" href="/vault">
                  Upload to Vault
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Review Button */}
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => setOpenReviewModal(true)}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Review Application & Generate PDF
        </Button>
      </Box>

      {/* Review & PDF Generator Modal */}
      <ApplicationReviewModal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        schemeName={schemeName}
        schemeId={schemeId}
        formData={formData}
        autoAttachedDocs={autoAttachedDocs}
        completionPercentage={currentCompletion}
      />
    </Box>
  );
};

export default AutoFillEngine;
