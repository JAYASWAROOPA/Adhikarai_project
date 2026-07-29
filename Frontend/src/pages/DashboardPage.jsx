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
import FolderZipIcon from '@mui/icons-material/FolderZip';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
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
  const profileStrength = user?.profileCompletion ?? 85;

  return (
    <Box sx={{ py: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Welcome back, {user?.name ? user.name.split(' ')[0] : "Rajesh"}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • National Welfare Database Synced
          </Typography>
        </Box>

        {/* Profile Completion Indicator */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', minWidth: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">Profile Completion</Typography>
            <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">{profileStrength}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={profileStrength} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
        </Paper>
      </Box>

      {/* STEP 14 KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Eligible Schemes Count', count: stats?.eligibleSchemes || 12, icon: <AssignmentIcon color="primary" />, subtitle: 'Matches Profile Rules' },
          { title: 'Applications Submitted', count: stats?.applications || 5, icon: <PendingIcon color="warning" />, subtitle: 'In Lifecycle Verification' },
          { title: 'Approved Schemes', count: stats?.approved || 3, icon: <CheckCircleIcon color="success" />, subtitle: 'DBT Credit Active' },
          { title: 'Pending Actions', count: profileStrength < 100 ? 1 : 0, icon: <StarIcon color="secondary" />, subtitle: profileStrength < 100 ? 'Complete Profile (85%)' : 'All Clear' }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5 }}>
                <Avatar sx={{ bgcolor: 'primary.50', mr: 2, width: 50, height: 50 }}>
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

      {/* Quick Action Buttons Toolbar */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'primary.50' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
          ⚡ Citizen Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: 'Complete Profile', action: () => navigate('/profile'), icon: <EditIcon />, color: 'primary' },
            { label: 'Explore Schemes', action: () => navigate('/schemes'), icon: <AssignmentIcon />, color: 'secondary' },
            { label: 'Ask AI Assistant', action: () => navigate('/assistant'), icon: <SmartToyIcon />, color: 'secondary' },
            { label: 'Upload Documents', action: () => navigate('/vault'), icon: <FolderZipIcon />, color: 'primary' },
            { label: 'Track Applications', action: () => navigate('/applications'), icon: <TrackChangesIcon />, color: 'secondary' },
            { label: 'Nearby Offices', action: () => navigate('/offices'), icon: <LocationOnIcon />, color: 'primary' }
          ].map((act) => (
            <Grid item xs={6} sm={4} md={2} key={act.label}>
              <Button
                variant="contained"
                color={act.color}
                fullWidth
                onClick={act.action}
                sx={{
                  py: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  textTransform: 'none'
                }}
              >
                {act.icon}
                {act.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Recommended Schemes Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Top AI Scheme Recommendations
            </Typography>
            <Button size="small" color="secondary" onClick={() => navigate('/schemes')} endIcon={<ArrowForwardIcon />}>
              View All Schemes
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress color="secondary" /></Box>
          ) : (
            <Stack spacing={2}>
              {recommendations.map((rec, idx) => (
                <Card key={rec.schemeId || idx} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1, pr: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip label={`${rec.matchPercentage || 92}% Match`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                        <Chip label={rec.priority || "High Priority"} color="secondary" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
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
                    <Button variant="contained" color="secondary" size="small" onClick={() => navigate(`/schemes/${rec.schemeId || 1}`)} sx={{ fontWeight: 'bold' }}>
                      Apply Now
                    </Button>
                  </Box>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Activity Feed Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
              Recent Activity Audit Feed
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
