import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  Button
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminDashboard() {
      try {
        setLoading(true);
        const result = await adminService.getDashboard();
        setData(result);
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const stats = data?.stats;

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            System Admin Control Panel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            System-wide user control, nodal officer verification, and scheme administration
          </Typography>
        </Box>
        <Chip label="System Administrator Access" color="secondary" fontWeight="bold" />
      </Box>

      {/* System Alerts */}
      {data?.alerts?.map((alert) => (
        <Alert key={alert.id} severity={alert.type} icon={<WarningIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          {alert.message}
        </Alert>
      ))}

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Registered Citizens', count: stats?.activeCitizens?.toLocaleString() || '12,345', icon: <PeopleIcon color="primary" /> },
          { title: 'Nodal Officers', count: stats?.totalOfficers || 342, icon: <SecurityIcon color="secondary" /> },
          { title: 'Total Applications', count: stats?.totalApplications?.toLocaleString() || '8,472', icon: <AssignmentIcon color="primary" /> },
          { title: 'Pending Verifications', count: stats?.pendingVerifications?.toLocaleString() || '1,243', icon: <PendingActionsIcon color="warning" /> }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5 }}>
                <Avatar sx={{ bgcolor: 'action.hover', mr: 2, width: 48, height: 48 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">{stat.count}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="500">{stat.title}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Verification Status Breakdown */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Application Verification Breakdown
              </Typography>
              <Button size="small" onClick={() => navigate('/admin/analytics')} endIcon={<ArrowForwardIcon />}>
                Full Analytics
              </Button>
            </Box>
            <Grid container spacing={2}>
              {data?.charts?.verificationStatus?.map((item) => (
                <Grid item xs={4} key={item.name}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: item.color }}>
                      {item.value.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      {item.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Quick Management Shortcuts */}
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
            Admin Actions
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Manage Users', path: '/admin/users', icon: <PeopleIcon /> },
              { label: 'Manage Officers', path: '/admin/officers', icon: <SecurityIcon /> },
              { label: 'Scheme Engine', path: '/admin/schemes', icon: <AssignmentIcon /> },
              { label: 'Audit Logs', path: '/admin/audit-logs', icon: <CheckCircleIcon /> }
            ].map(item => (
              <Grid item xs={6} sm={3} key={item.label}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(item.path)}
                  sx={{ height: 80, display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 3 }}
                >
                  {item.icon}
                  <Typography variant="caption" fontWeight="bold">{item.label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* System Activity Log Sidebar */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
              Real-time Audit Feed
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {data?.recentActivities?.map((act) => (
                <Box key={act.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main', width: 36, height: 36, fontSize: '0.9rem' }}>
                    <CheckCircleIcon fontSize="small" color="primary" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{act.user}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{act.action}</Typography>
                    <Typography variant="caption" color="secondary.main">{act.timestamp}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
