import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Paper,
  LinearProgress,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import StarIcon from '@mui/icons-material/Star';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuthStore } from '../store/useAuthStore';
import { contentService } from '../services/api';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [dash, activity, recs] = await Promise.all([
          contentService.getDashboardData(),
          contentService.getRecentActivity(),
          contentService.getRecommendations()
        ]);

        setDashboardData(dash);
        setRecentActivity(activity || []);
        setRecommendations(recs?.recommendations || recs || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = dashboardData?.stats;
  const timeline = dashboardData?.timeline?.steps || [];
  const profileStrength = stats?.profileStrength || 85;

  return (
    <Box sx={{ py: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Welcome back, {user?.firstName || dashboardData?.user?.name || "Citizen"}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Database Synced
          </Typography>
        </Box>

        {/* Profile Strength Indicator */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', minWidth: 260 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">Profile Strength</Typography>
            <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">{profileStrength}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={profileStrength} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
        </Paper>
      </Box>

      {/* Quick Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Eligible Schemes', count: stats?.eligibleSchemes || 12, icon: <AssignmentIcon color="primary" />, color: 'primary.50' },
          { title: 'Active Applications', count: stats?.applications || 5, icon: <PendingIcon color="warning" />, color: 'warning.light' },
          { title: 'Approved Benefits', count: stats?.approved || 3, icon: <CheckCircleIcon color="success" />, color: 'success.light' },
          { title: 'AI Match Score', count: '92%', icon: <StarIcon color="secondary" />, color: 'secondary.light' }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5 }}>
                <Avatar sx={{ bgcolor: 'primary.50', mr: 2, width: 48, height: 48 }}>
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

      {/* Profile Completion Timeline */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Profile Completion Steps
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {timeline.map((step) => (
            <Grid item xs={12} sm={2.4} key={step.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color={step.completed ? "success" : "disabled"} sx={{ fontSize: 20 }} />
                <Typography variant="body2" fontWeight={step.completed ? "bold" : "normal"} color={step.completed ? "text.primary" : "text.secondary"}>
                  {step.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Recommended Schemes Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              AI Scheme Recommendations
            </Typography>
            <Button size="small" onClick={() => navigate('/schemes')} endIcon={<ArrowForwardIcon />}>
              View All
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress color="secondary" /></Box>
          ) : (
            <Stack spacing={2.5}>
              {recommendations.map((rec, idx) => (
                <Card key={rec.schemeId || idx} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1, pr: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip label={`${rec.matchPercentage || 92}% Match`} color="success" size="small" />
                        <Chip label={rec.priority || "High Priority"} color="secondary" variant="outlined" size="small" />
                      </Stack>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {rec.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        Reason: {rec.reason}
                      </Typography>
                      <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                        Benefit: {rec.benefits}
                      </Typography>
                    </Box>
                    <Button variant="contained" color="secondary" size="small" onClick={() => navigate(`/schemes/${rec.schemeId || 1}`)}>
                      Apply Now
                    </Button>
                  </Box>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Quick Actions & Recent Activity Sidebar */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Complete Profile', action: () => navigate('/profile'), icon: <EditIcon /> },
              { label: 'AI Navigator', action: () => navigate('/assistant'), icon: <SmartToyIcon color="secondary" /> },
              { label: 'My Applications', action: () => navigate('/applications'), icon: <DescriptionIcon color="primary" /> },
              { label: 'Search Schemes', action: () => navigate('/schemes'), icon: <AssignmentIcon /> }
            ].map(act => (
              <Grid item xs={6} key={act.label}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={act.action}
                  sx={{
                    height: 85,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 1,
                    borderRadius: 3,
                    borderColor: 'divider'
                  }}
                >
                  {act.icon}
                  <Typography variant="caption" fontWeight="bold">{act.label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
              Recent Activity Feed
            </Typography>
            <Stack spacing={2}>
              {recentActivity.map((act) => (
                <Box key={act.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'action.hover', fontSize: '1rem' }}>
                    {act.icon || '📄'}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{act.action}</Typography>
                    <Typography variant="caption" color="text.secondary">{act.timestamp}</Typography>
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

export default DashboardPage;
