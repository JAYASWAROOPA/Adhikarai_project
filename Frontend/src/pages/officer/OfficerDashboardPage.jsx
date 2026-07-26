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
  Button,
  CircularProgress
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { officerService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

const OfficerDashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const result = await officerService.getDashboard();
        setData(result);
      } catch (err) {
        console.error('Error loading officer dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
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
      {/* Officer Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Officer Verification Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome, {user?.name || "Officer"} ({user?.officerDetails?.designation || "District Welfare Officer"} • {user?.officerDetails?.jurisdiction || "Mumbai"})
          </Typography>
        </Box>
        <Chip label="Verification Authority Active" color="success" fontWeight="bold" />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Pending Applications Queue', count: stats?.pendingVerifications || 45, icon: <PendingActionsIcon color="warning" /> },
          { title: 'Completed Today', count: stats?.completedToday || 12, icon: <CheckCircleIcon color="success" /> },
          { title: 'Total Verified', count: stats?.totalVerified || 342, icon: <VerifiedUserIcon color="primary" /> },
          { title: 'Approval Rate', count: `${stats?.approvalRate || 82.5}%`, icon: <SpeedIcon color="secondary" /> }
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
        {/* Priority Verification Queue */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Priority Verification Queue
              </Typography>
              <Button size="small" onClick={() => navigate('/officer/verifications')} endIcon={<ArrowForwardIcon />}>
                View All Pending Queue
              </Button>
            </Box>

            <Stack spacing={2}>
              {data?.priorityQueue?.map((item) => (
                <Paper key={item.applicationId} elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip label={item.priority.toUpperCase()} color={item.priority === 'high' ? 'error' : 'warning'} size="small" />
                        <Typography variant="caption" color="text.secondary">Submitted: {item.submittedDate} ({item.daysPending} days ago)</Typography>
                      </Stack>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">{item.citizenName}</Typography>
                      <Typography variant="body2" color="secondary.main" fontWeight="bold">Scheme: {item.schemeName}</Typography>
                    </Box>
                    <Button variant="contained" color="secondary" size="small" onClick={() => navigate('/officer/verifications')}>
                      Verify Now
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Officer Activity Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
              Your Recent Verification Activity
            </Typography>
            <Stack spacing={2}>
              {data?.recentActivity?.map((act) => (
                <Box key={act.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: 'success.light', color: '#fff', width: 32, height: 32 }}>
                    <CheckCircleIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{act.action}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">Citizen: {act.citizen}</Typography>
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

export default OfficerDashboardPage;
