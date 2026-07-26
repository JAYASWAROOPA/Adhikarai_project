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
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { adminService } from '../../services/api';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      const data = await adminService.getAuditLogs();
      setLogs(data || []);
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l =>
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          System Audit Logs & Security Traces
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Immutable audit record of user role modifications, verification actions, and administrative updates
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Filter audit logs by action, user, or IP address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'primary.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">Timestamp</TableCell>
              <TableCell fontWeight="bold">User / Role</TableCell>
              <TableCell fontWeight="bold">Action</TableCell>
              <TableCell fontWeight="bold">Payload / Details</TableCell>
              <TableCell fontWeight="bold">IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell><Typography variant="caption" fontWeight="bold">{new Date(log.timestamp).toLocaleString()}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{log.userName}</Typography>
                  <Chip label={log.role} size="small" color={log.role === 'admin' ? 'error' : 'secondary'} />
                </TableCell>
                <TableCell><Chip label={log.action} size="small" color="primary" variant="outlined" /></TableCell>
                <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{log.details}</Typography></TableCell>
                <TableCell><Typography variant="caption">{log.ipAddress}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminAuditLogsPage;
