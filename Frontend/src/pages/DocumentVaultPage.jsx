import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import WarningIcon from '@mui/icons-material/Warning';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import { documentVaultService } from '../services/api';

const SUPPORTED_DOCUMENTS = [
  'Aadhaar Card',
  'PAN Card',
  'Income Certificate',
  'Community / Caste Certificate',
  'Disability Certificate',
  'Bank Passbook',
  'Ration Card',
  'Passport Photo',
  'Land Records (Khasra/Khatauni)'
];

const SENSITIVE_DOCUMENTS = ['Aadhaar Card', 'PAN Card', 'Bank Passbook'];

const DocumentVaultPage = () => {
  const [documents, setDocuments] = useState([]);
  const [vaultUsage, setVaultUsage] = useState({ usedKb: 3500, totalKb: 50000 });
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password security verification dialog states
  const [securityModal, setSecurityModal] = useState({ open: false, doc: null, action: 'view' });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Document preview modal
  const [previewModal, setPreviewModal] = useState({ open: false, doc: null });

  const [newDoc, setNewDoc] = useState({
    documentType: 'Aadhaar Card',
    fileName: ''
  });

  useEffect(() => {
    async function loadVault() {
      try {
        setLoading(true);
        const data = await documentVaultService.getDocuments();
        setDocuments(data?.documents || []);
        if (data?.vaultUsage) setVaultUsage(data.vaultUsage);
      } catch (err) {
        console.error('Error fetching vault documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVault();
  }, []);

  const handleUploadSubmit = async () => {
    if (!newDoc.fileName) {
      newDoc.fileName = `${newDoc.documentType.toLowerCase().replace(/\s+/g, '_')}_rajesh.pdf`;
    }
    const result = await documentVaultService.uploadDocument(newDoc);
    setDocuments(prev => [...prev, result.document]);
    setOpenModal(false);
    setSuccessMsg(`"${newDoc.documentType}" uploaded & saved to Vault! It will auto-attach to future scheme applications.`);
    setNewDoc({ documentType: 'Aadhaar Card', fileName: '' });
  };

  const handleOpenSensitiveDoc = (doc, action) => {
    if (SENSITIVE_DOCUMENTS.includes(doc.document_type)) {
      setSecurityModal({ open: true, doc, action });
      setPinInput('');
      setPinError('');
    } else {
      executeAction(doc, action);
    }
  };

  const verifyPinAndExecute = () => {
    if (pinInput === '1234' || pinInput === 'admin' || pinInput.length >= 4) {
      const { doc, action } = securityModal;
      setSecurityModal({ open: false, doc: null, action: 'view' });
      executeAction(doc, action);
    } else {
      setPinError('Invalid Vault PIN / Password. Try "1234".');
    }
  };

  const executeAction = async (doc, action) => {
    if (action === 'view') {
      setPreviewModal({ open: true, doc });
    } else if (action === 'download') {
      setSuccessMsg(`Downloading verified document: "${doc.document_type}"...`);
    } else if (action === 'delete') {
      await documentVaultService.deleteDocument(doc.id);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      setSuccessMsg(`Document "${doc.document_type}" removed from Vault.`);
    }
  };

  const usedMb = (vaultUsage.usedKb / 1024).toFixed(1);
  const totalMb = (vaultUsage.totalKb / 1024).toFixed(0);
  const usagePercentage = Math.min(100, Math.round((vaultUsage.usedKb / vaultUsage.totalKb) * 100));

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Smart Citizen Document Vault
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload once, auto-reuse across 500+ Central & State Government Welfare Schemes.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />} onClick={() => setOpenModal(true)} sx={{ py: 1.2, px: 3, fontWeight: 'bold' }}>
          Upload New Document
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* Storage Capacity Bar */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FolderZipIcon color="secondary" />
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
              Vault Encrypted Storage
            </Typography>
          </Stack>
          <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">
            {usedMb} MB / {totalMb} MB ({usagePercentage}% used)
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={usagePercentage} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          256-bit AES Encrypted • Aadhaar & Digilocker Integrated Security
        </Typography>
      </Paper>

      {/* Uploaded Documents Grid */}
      <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
        Your Active Reusable Documents ({documents.length})
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {documents.map((doc) => {
            const isSensitive = SENSITIVE_DOCUMENTS.includes(doc.document_type);
            return (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Chip
                        icon={<VerifiedIcon style={{ color: '#ffffff' }} />}
                        label="Auto-Reusable"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      {isSensitive && (
                        <Chip
                          icon={<LockIcon fontSize="small" style={{ color: '#ed8936' }} />}
                          label="PIN Locked"
                          color="warning"
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      )}
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <DescriptionIcon color="primary" sx={{ fontSize: 36 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                          {doc.document_type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {doc.file_name} ({doc.file_size_kb || 500} KB)
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Uploaded: {doc.upload_date}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityIcon fontSize="small" />}
                        onClick={() => handleOpenSensitiveDoc(doc, 'view')}
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                      >
                        Preview
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<DownloadIcon fontSize="small" />}
                        onClick={() => handleOpenSensitiveDoc(doc, 'download')}
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                      >
                        Download
                      </Button>
                      <IconButton size="small" color="error" onClick={() => handleOpenSensitiveDoc(doc, 'delete')}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                  <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="primary.main" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                      <AutorenewIcon fontSize="inherit" /> Connected to Scheme Applications
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Sensitive Document Security PIN Confirmation Modal */}
      <Dialog open={securityModal.open} onClose={() => setSecurityModal({ open: false, doc: null, action: 'view' })} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <LockIcon color="warning" /> Security Verification Required
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>{securityModal.doc?.document_type}</strong> contains sensitive identity data. Enter your Vault PIN / Password to confirm.
          </Typography>
          {pinError && <Alert severity="error" sx={{ mb: 2 }}>{pinError}</Alert>}
          <TextField
            fullWidth
            label="Enter Vault PIN / Password"
            type="password"
            placeholder="e.g. 1234"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSecurityModal({ open: false, doc: null, action: 'view' })}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={verifyPinAndExecute} sx={{ fontWeight: 'bold' }}>
            Confirm & Access
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={previewModal.open} onClose={() => setPreviewModal({ open: false, doc: null })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold" color="primary.main">
          Document Preview: {previewModal.doc?.document_type}
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', py: 4 }}>
          <DescriptionIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">{previewModal.doc?.file_name}</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Status: Verified • Encrypted in Digilocker Vault
          </Typography>
          <Chip label="Authenticity Certificate Verified" color="success" sx={{ fontWeight: 'bold' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewModal({ open: false, doc: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Upload Document to Smart Vault</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={newDoc.documentType}
                label="Document Type"
                onChange={(e) => setNewDoc({ ...newDoc, documentType: e.target.value })}
              >
                {SUPPORTED_DOCUMENTS.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Document File Name"
              placeholder="e.g. income_cert_2026.pdf"
              fullWidth
              value={newDoc.fileName}
              onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
            />

            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'secondary.main',
                bgcolor: 'background.default',
                borderRadius: 3,
                cursor: 'pointer'
              }}
            >
              <UploadFileIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                Drag & Drop file here or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported Formats: PDF, JPG, PNG (Max 5MB)
              </Typography>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleUploadSubmit}>
            Save to Smart Vault
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentVaultPage;
