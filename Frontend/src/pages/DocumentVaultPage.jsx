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

const DocumentVaultPage = () => {
  const [documents, setDocuments] = useState([]);
  const [vaultUsage, setVaultUsage] = useState({ usedKb: 3500, totalKb: 50000 });
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
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

  const handleDelete = async (id, docName) => {
    await documentVaultService.deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    setSuccessMsg(`Document "${docName}" removed from Vault.`);
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
          {documents.map((doc) => (
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
                    <IconButton size="small" color="error" onClick={() => handleDelete(doc.id, doc.document_type)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <DescriptionIcon color="primary" sx={{ fontSize: 32 }} />
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

                  {doc.expiry_date ? (
                    <Chip
                      icon={<WarningIcon fontSize="small" />}
                      label={`Expires: ${doc.expiry_date}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Chip label="Permanent Validity" size="small" color="default" variant="outlined" sx={{ mt: 1 }} />
                  )}
                </CardContent>
                <Box sx={{ p: 2, pt: 0, bgcolor: 'primary.50', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="primary.main" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                    <AutorenewIcon fontSize="inherit" /> Connected to 12 Scheme Workflows
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
