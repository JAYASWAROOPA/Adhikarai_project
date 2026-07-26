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
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import { adminService } from '../../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const data = await adminService.getUsers();
      setUsers(data || []);
    }
    loadUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setOpenModal(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    await adminService.updateUser(selectedUser.id, selectedUser);
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    setOpenModal(false);
    setSuccessMsg(`User ${selectedUser.name} updated successfully!`);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system roles, permissions, and citizen access levels
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<PersonAddIcon />}>
          Add User
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* Search & Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by name, email, or Aadhaar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
          sx={{ flexGrow: 1, minWidth: 260 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter Role</InputLabel>
          <Select value={roleFilter} label="Filter Role" onChange={(e) => setRoleFilter(e.target.value)}>
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="officer">Officer</MenuItem>
            <MenuItem value="citizen">Citizen</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">Name & Email</TableCell>
              <TableCell fontWeight="bold">Role</TableCell>
              <TableCell fontWeight="bold">Department</TableCell>
              <TableCell fontWeight="bold">Status</TableCell>
              <TableCell fontWeight="bold">Date Joined</TableCell>
              <TableCell fontWeight="bold" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{u.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={u.role.toUpperCase()}
                    size="small"
                    color={u.role === 'admin' ? 'error' : u.role === 'officer' ? 'secondary' : 'primary'}
                  />
                </TableCell>
                <TableCell>{u.department || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={u.status}
                    size="small"
                    color={u.status === 'active' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{u.joined}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditClick(u)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Edit User Role & Permissions</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
              <TextField
                label="Email"
                fullWidth
                disabled
                value={selectedUser.email}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  label="Role"
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <MenuItem value="citizen">Citizen</MenuItem>
                  <MenuItem value="officer">Government Officer</MenuItem>
                  <MenuItem value="admin">System Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Account Status</InputLabel>
                <Select
                  value={selectedUser.status}
                  label="Account Status"
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="pending">Pending Verification</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleSaveUser}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
