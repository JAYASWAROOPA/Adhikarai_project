import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Divider,
  MenuItem
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useAuthStore } from '../store/useAuthStore';

const AdminDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const [officers, setOfficers] = useState([
    { id: 201, name: "Suresh Patil", email: "officer@adhikarai.gov.in", department: "Ministry of Housing & Urban Affairs", district: "Mumbai Suburban", verificationLimit: "₹5,00,000", status: "ACTIVE", createdDate: "2026-07-01" },
    { id: 202, name: "Meenakshi Sundaram", email: "meenakshi.officer@adhikarai.gov.in", department: "Ministry of Agriculture & Farmers Welfare", district: "Chennai / Kanchipuram", verificationLimit: "₹10,00,000", status: "ACTIVE", createdDate: "2026-07-10" }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tempPassword: '',
    department: 'Ministry of Housing & Urban Affairs',
    district: 'Mumbai Suburban',
    verificationLimit: '₹5,00,000'
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateOfficer = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.tempPassword) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const newOff = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      district: formData.district,
      verificationLimit: formData.verificationLimit,
      status: "ACTIVE",
      createdDate: new Date().toISOString().split('T')[0]
    };

    setOfficers([newOff, ...officers]);
    setSuccessMsg(`Official Nodal Officer account provisioned for ${formData.name} (${formData.email}).`);
    setFormData({
      name: '',
      email: '',
      tempPassword: '',
      department: 'Ministry of Housing & Urban Affairs',
      district: 'Mumbai Suburban',
      verificationLimit: '₹5,00,000'
    });
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip icon={<AdminPanelSettingsIcon style={{ color: '#fff' }} />} label="System Administrator Access" color="error" sx={{ fontWeight: 'bold' }} />
            <Chip label="Master Control Center" color="primary" variant="outlined" />
          </Stack>
          <Typography variant="h3" fontWeight="bold" color="primary.main">
            Admin Console & Officer Provisioning
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage Nodal Officer credentials, system analytics, and platform security audit logs.
          </Typography>
        </Box>
      </Box>

      {/* KPI Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Registered Citizens', count: '54,200', icon: <SupervisorAccountIcon color="primary" />, subtitle: 'Active Citizens' },
          { title: 'Active Nodal Officers', count: officers.length, icon: <PersonAddIcon color="secondary" />, subtitle: 'Department Verifiers' },
          { title: 'Welfare Schemes Managed', count: '520', icon: <AssessmentIcon color="success" />, subtitle: 'Central + State' },
          { title: 'Disbursed Benefits', count: '₹142.5 Cr', icon: <SecurityIcon color="warning" />, subtitle: 'DBT Direct Credit' }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5 }}>
                <Avatar sx={{ bgcolor: 'primary.50', mr: 2, width: 48, height: 48 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">{stat.count}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">{stat.title}</Typography>
                  <Typography variant="caption" color="secondary.main">{stat.subtitle}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Left Side: Create Officer Form (45%) */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom display="flex" alignItems="center" gap={1}>
              <PersonAddIcon color="secondary" /> Provision New Officer Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Officers cannot self-register. Generate official email and temporary credentials.
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{errorMsg}</Alert>}

            <form onSubmit={handleCreateOfficer}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Officer Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Varma"
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Official Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="officer.name@adhikarai.gov.in"
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Temporary Password"
                  type="password"
                  value={formData.tempPassword}
                  onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                  placeholder="Assign secure temp password"
                  required
                />
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Assigned Ministry / Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <MenuItem value="Ministry of Housing & Urban Affairs">Ministry of Housing & Urban Affairs</MenuItem>
                  <MenuItem value="Ministry of Agriculture & Farmers Welfare">Ministry of Agriculture & Farmers Welfare</MenuItem>
                  <MenuItem value="National Health Authority">National Health Authority</MenuItem>
                  <MenuItem value="Ministry of Social Justice & Empowerment">Ministry of Social Justice & Empowerment</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Assigned District"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Mumbai Suburban"
                />
                <Button type="submit" variant="contained" color="secondary" size="large" sx={{ py: 1.5, fontWeight: 'bold' }}>
                  ⚡ Provision Officer Account
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Right Side: Active Nodal Officers Roster (55%) */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom display="flex" alignItems="center" gap={1}>
              <SupervisorAccountIcon color="primary" /> Active Nodal Officers Roster ({officers.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Officers authorized to verify and approve citizen applications.
            </Typography>

            <Table sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Officer Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>District</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {officers.map((off) => (
                  <TableRow key={off.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary.main">{off.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{off.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.85rem">{off.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.85rem">{off.district}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={off.status} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
