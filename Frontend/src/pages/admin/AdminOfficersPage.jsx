import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import SecurityIcon from '@mui/icons-material/Security';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import { adminService } from '../../services/api';

const AdminOfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    employeeId: '',
    designation: 'District Welfare Officer',
    department: 'Ministry of Housing',
    jurisdiction: 'Mumbai District',
    verificationLimit: 50
  });

  useEffect(() => {
    async function loadOfficers() {
      const data = await adminService.getOfficers();
      setOfficers(data || []);
    }
    loadOfficers();
  }, []);

  const handleCreateSubmit = async () => {
    await adminService.createOfficer(newOfficer);
    setOfficers(prev => [...prev, { ...newOfficer, id: Date.now(), completedVerifications: 0, status: 'active' }]);
    setOpenCreateModal(false);
    setSuccessMsg(`Officer ${newOfficer.name} created and verified!`);
    setNewOfficer({ name: '', email: '', employeeId: '', designation: 'District Welfare Officer', department: 'Ministry of Housing', jurisdiction: 'Mumbai District', verificationLimit: 50 });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Government Officers Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign verification authority, departmental jurisdiction, and review daily officer throughput
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddModeratorIcon />} onClick={() => setOpenCreateModal(true)}>
          Create Officer Account
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* Officers Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">Officer Name</TableCell>
              <TableCell fontWeight="bold">Employee ID</TableCell>
              <TableCell fontWeight="bold">Department & Designation</TableCell>
              <TableCell fontWeight="bold">Jurisdiction</TableCell>
              <TableCell fontWeight="bold">Daily Limit</TableCell>
              <TableCell fontWeight="bold">Completed Verifications</TableCell>
              <TableCell fontWeight="bold">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {officers.map((off) => (
              <TableRow key={off.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{off.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{off.email}</Typography>
                </TableCell>
                <TableCell><Chip label={off.employeeId} size="small" variant="outlined" /></TableCell>
                <TableCell>
                  <Typography variant="body2">{off.designation}</Typography>
                  <Typography variant="caption" color="text.secondary">{off.department}</Typography>
                </TableCell>
                <TableCell>{off.jurisdiction}</TableCell>
                <TableCell>{off.verificationLimit} / day</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color="success.main">{off.completedVerifications}</Typography>
                </TableCell>
                <TableCell><Chip label={off.status} color="success" size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Officer Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Provision New Nodal Officer Account</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={newOfficer.name}
              onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
            />
            <TextField
              label="Official Email Address"
              fullWidth
              value={newOfficer.email}
              onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
            />
            <TextField
              label="Employee Code / ID"
              fullWidth
              value={newOfficer.employeeId}
              onChange={(e) => setNewOfficer({ ...newOfficer, employeeId: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={newOfficer.department}
                label="Department"
                onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
              >
                <MenuItem value="Ministry of Housing">Ministry of Housing & Urban Affairs</MenuItem>
                <MenuItem value="Ministry of Agriculture">Ministry of Agriculture & Farmers Welfare</MenuItem>
                <MenuItem value="Ministry of Health">Ministry of Health & Family Welfare</MenuItem>
                <MenuItem value="Ministry of Social Justice">Ministry of Social Justice & Empowerment</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Jurisdiction (District/State)"
              fullWidth
              value={newOfficer.jurisdiction}
              onChange={(e) => setNewOfficer({ ...newOfficer, jurisdiction: e.target.value })}
            />
            <TextField
              label="Daily Verification Limit"
              type="number"
              fullWidth
              value={newOfficer.verificationLimit}
              onChange={(e) => setNewOfficer({ ...newOfficer, verificationLimit: Number(e.target.value) })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleCreateSubmit}>Verify & Create Officer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOfficersPage;
