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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PolicyIcon from '@mui/icons-material/Policy';
import { contentService, adminService } from '../../services/api';

const AdminSchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newScheme, setNewScheme] = useState({
    name: '',
    department: 'Ministry of Housing & Urban Affairs',
    category: 'Housing',
    description: '',
    benefits: '',
    incomeLimit: 600000,
    eligibilityAgeMin: 18,
    eligibilityAgeMax: 65,
    status: 'active'
  });

  useEffect(() => {
    async function loadSchemes() {
      const data = await contentService.getSchemes();
      setSchemes(data || []);
    }
    loadSchemes();
  }, []);

  const handleSaveScheme = async () => {
    await adminService.saveScheme(newScheme);
    setSchemes(prev => [...prev, { ...newScheme, id: Date.now() }]);
    setOpenModal(false);
    setSuccessMsg(`Scheme "${newScheme.name}" saved and published successfully!`);
    setNewScheme({ name: '', department: 'Ministry of Housing & Urban Affairs', category: 'Housing', description: '', benefits: '', incomeLimit: 600000, eligibilityAgeMin: 18, eligibilityAgeMax: 65, status: 'active' });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Government Scheme Engine (Full CRUD)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure welfare programs, define database eligibility rules, and manage required documents
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Create New Scheme
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* Scheme Cards Grid */}
      <Grid container spacing={3}>
        {schemes.map((s) => (
          <Grid item xs={12} md={6} key={s.id}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Chip label={s.category || "General"} color="primary" size="small" />
                  <Chip label={s.status || "active"} color="success" size="small" variant="outlined" />
                </Stack>
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                  {s.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {typeof s.department === 'object' ? s.department.name : s.department}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {s.description}
                </Typography>
                <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                  Benefit: {s.benefits}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<EditIcon />} fullWidth>
                  Edit Scheme & Rules
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Scheme Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold">Create New Government Welfare Scheme</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Scheme Name"
                fullWidth
                value={newScheme.name}
                onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newScheme.department}
                  label="Department"
                  onChange={(e) => setNewScheme({ ...newScheme, department: e.target.value })}
                >
                  <MenuItem value="Ministry of Housing & Urban Affairs">Ministry of Housing & Urban Affairs</MenuItem>
                  <MenuItem value="Ministry of Agriculture">Ministry of Agriculture</MenuItem>
                  <MenuItem value="Ministry of Health & Family Welfare">Ministry of Health & Family Welfare</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                fullWidth
                value={newScheme.category}
                onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={newScheme.description}
                onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Benefit Details"
                fullWidth
                value={newScheme.benefits}
                onChange={(e) => setNewScheme({ ...newScheme, benefits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Annual Income Ceiling (₹)"
                type="number"
                fullWidth
                value={newScheme.incomeLimit}
                onChange={(e) => setNewScheme({ ...newScheme, incomeLimit: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleSaveScheme}>Publish Scheme</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSchemesPage;
