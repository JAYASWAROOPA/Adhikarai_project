import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '../store/useAuthStore';
import { fetchMockRecommendations, fetchMockSchemes } from '../services/api';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Mock loading delay
      setTimeout(async () => {
        const data = await fetchMockSchemes();
        setSchemes(data);
        setLoading(false);
      }, 500);
    }
    loadData();
  }, []);

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Welcome back, {user?.firstName}!</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="bold">Profile Strength</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 100, height: 8, bgcolor: 'grey.300', borderRadius: 4 }}>
              <Box sx={{ width: '85%', height: '100%', bgcolor: 'success.main', borderRadius: 4 }} />
            </Box>
            <Typography variant="caption">85%</Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Active Schemes', count: 124, icon: <AssignmentIcon color="primary" /> },
          { title: 'Pending Apps', count: 1, icon: <PendingIcon color="warning" /> },
          { title: 'Approved Benefits', count: 2, icon: <CheckCircleIcon color="success" /> },
          { title: 'AI Match Score', count: '92%', icon: <StarIcon color="secondary" /> }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Box sx={{ mr: 2, p: 1, bgcolor: 'action.hover', borderRadius: '50%' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{stat.count}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.title}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Recommended Schemes Carousel (Mocked as List) */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Recommended For You</Typography>
          {loading ? <CircularProgress /> : (
            <Stack spacing={2}>
              {schemes.map(s => (
                <Card key={s.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" color="primary.main">{s.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {s.department}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{s.description}</Typography>
                    <Chip label={`Benefit: ${s.benefits}`} size="small" color="secondary" variant="outlined"/>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label="92% Match" color="success" size="small" sx={{ mb: 1 }} />
                    <br />
                    <Button variant="contained" size="small" onClick={() => navigate(`/schemes/${s.id}`)}>
                      View Details
                    </Button>
                  </Box>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Quick Actions Grid */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Quick Actions</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Complete Profile', action: () => navigate('/profile'), color: 'primary' },
              { label: 'Chat with AI', action: () => navigate('/assistant'), color: 'secondary' },
              { label: 'My Applications', action: () => navigate('/applications'), color: 'primary' },
              { label: 'Find Schemes', action: () => navigate('/schemes'), color: 'primary' }
            ].map(action => (
              <Grid item xs={6} key={action.label}>
                <Button 
                  variant="outlined" 
                  color={action.color} 
                  fullWidth 
                  onClick={action.action}
                  sx={{ height: 80, display: 'flex', flexDirection: 'column' }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Activity</Typography>
            <ListActivity icon={<CheckCircleIcon color="success" />} text="Applied for PM-KISAN" time="2 hrs ago" />
            <ListActivity icon={<PersonIcon color="primary" />} text="Updated Income Details" time="1 day ago" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const ListActivity = ({ icon, text, time }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="body2" fontWeight="bold">{text}</Typography>
      <Typography variant="caption" color="text.secondary">{time}</Typography>
    </Box>
  </Box>
);

export default DashboardPage;
