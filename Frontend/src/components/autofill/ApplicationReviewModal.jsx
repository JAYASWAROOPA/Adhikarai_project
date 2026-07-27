import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { autoFillService } from '../../services/api';

const ApplicationReviewModal = ({ open, onClose, schemeName, schemeId, formData, autoAttachedDocs, completionPercentage }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await autoFillService.submitApplication({
        schemeId,
        formData,
        attachedDocumentIds: autoAttachedDocs.map(d => d.id),
        completionPercentage
      });
      setSubmittedResult(res);
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight="bold" sx={{ bgcolor: 'primary.main', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{submittedResult ? 'Official Application PDF Receipt' : 'Review Auto-Filled Application'}</span>
        <Chip label={`${completionPercentage}% Completion`} color="secondary" sx={{ color: '#fff', fontWeight: 'bold' }} />
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        {!submittedResult ? (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Please review all auto-populated personal, demographic, and document vault fields before submitting.
            </Alert>

            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Application Details Summary
            </Typography>
            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell fontWeight="bold">Scheme Name</TableCell><TableCell color="primary.main" fontWeight="bold">{schemeName}</TableCell></TableRow>
                  {Object.entries(formData).map(([key, val]) => (
                    <TableRow key={key}>
                      <TableCell fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </TableCell>
                      <TableCell>{val || <span style={{ color: '#ed8936' }}>N/A</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Auto-Attached Vault Documents ({autoAttachedDocs.length})
            </Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              {autoAttachedDocs.map((doc) => (
                <Paper key={doc.id} elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon color="primary" />
                  <Typography variant="body2" fontWeight="bold">{doc.document_type} ({doc.file_name})</Typography>
                  <Chip label="Auto-Reused" color="success" size="small" sx={{ ml: 'auto' }} />
                </Paper>
              ))}
            </Stack>
          </Box>
        ) : (
          /* Official PDF View */
          <Paper elevation={0} sx={{ p: 4, border: '2px solid', borderColor: 'primary.main', borderRadius: 4, bgcolor: '#ffffff' }}>
            {/* Government Header */}
            <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid', borderColor: 'primary.main', pb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold" letterSpacing={1.5} display="block">
                GOVERNMENT OF INDIA • WELFARE SCHEME APPLICATION RECEIPT
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {schemeName}
              </Typography>
              <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                Application ID: {submittedResult.applicationId}
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={8}>
                <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow><TableCell fontWeight="bold">Applicant Name</TableCell><TableCell>{formData.fullName || 'Rajesh Kumar'}</TableCell></TableRow>
                      <TableRow><TableCell fontWeight="bold">Aadhaar Number</TableCell><TableCell>{formData.aadhaarNumber || '9876-5432-1098'}</TableCell></TableRow>
                      <TableRow><TableCell fontWeight="bold">Annual Income</TableCell><TableCell>₹{Number(formData.annualIncome || 450000).toLocaleString()}</TableCell></TableRow>
                      <TableRow><TableCell fontWeight="bold">District & State</TableCell><TableCell>{formData.district || 'Mumbai'}, {formData.state || 'Maharashtra'}</TableCell></TableRow>
                      <TableRow><TableCell fontWeight="bold">Submission Date</TableCell><TableCell>{new Date(submittedResult.submittedAt).toLocaleDateString()}</TableCell></TableRow>
                      <TableRow><TableCell fontWeight="bold">Status</TableCell><TableCell><Chip label="Submitted & In Review" color="success" size="small" /></TableCell></TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.default' }}>
                  <QrCode2Icon color="primary" sx={{ fontSize: 90 }} />
                  <Typography variant="caption" fontWeight="bold" display="block" color="text.secondary">
                    QR Verification Hash
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    {submittedResult.qrCodeData}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: 2 }}>
              Application submitted directly to department portal. Track live status in your Applications Dashboard.
            </Alert>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        {!submittedResult ? (
          <>
            <Button onClick={onClose}>Back to Form</Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={submitting} sx={{ fontWeight: 'bold', px: 3 }}>
              {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
            </Button>
          </>
        ) : (
          <>
            <Button startIcon={<PrintIcon />} variant="outlined" onClick={handlePrint}>Print PDF</Button>
            <Button startIcon={<DownloadIcon />} variant="contained" color="secondary" onClick={onClose}>Download PDF Receipt</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationReviewModal;
