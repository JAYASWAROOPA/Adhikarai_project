import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Box, Alert, Button, LinearProgress, Typography, Stack, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from './Sidebar';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'officer') return <Navigate to="/officer" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const completionPct = user?.profileCompletion ?? 85;
  const isCitizen = role === 'citizen';
  const isIncomplete = isCitizen && completionPct < 100;

  // Restrict application submission if profile is incomplete
  const isApplying = location.pathname.startsWith('/apply/');
  if (isIncomplete && isApplying) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: 'background.default' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textCenter: 'center', border: '1px solid', borderColor: 'warning.light' }}>
            <Box sx={{ textCenter: 'center', mx: 'auto', maxWidth: 500, textAlign: 'center' }}>
              <WarningAmberIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="warning.dark" gutterBottom>
                Profile Completion Required
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your citizen profile is currently at <strong>{completionPct}%</strong>. You must reach 100% completion before submitting official government scheme applications.
              </Typography>
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={completionPct} color="warning" sx={{ height: 10, borderRadius: 5, mb: 1 }} />
                <Typography variant="caption" fontWeight="bold" color="text.secondary">{completionPct}% Completed</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/profile')}
                endIcon={<ArrowForwardIcon />}
                sx={{ py: 1.5, px: 4, fontWeight: 'bold', borderRadius: 3 }}
              >
                Complete My Profile Now
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        {/* Prominent Profile Completion Alert Banner */}
        {isIncomplete && location.pathname !== '/profile' && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'warning.50',
              border: '1px solid',
              borderColor: 'warning.300',
              borderRadius: 3
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="warning.dark" display="flex" alignItems="center" gap={1}>
                  <WarningAmberIcon fontSize="small" /> Complete your profile to apply for government schemes ({completionPct}% Complete)
                </Typography>
                <LinearProgress variant="determinate" value={completionPct} color="warning" sx={{ height: 6, borderRadius: 3, mt: 1, maxWidth: 400 }} />
              </Box>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => navigate('/profile')}
                sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', borderRadius: 2 }}
              >
                Complete Profile
              </Button>
            </Stack>
          </Paper>
        )}

        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedRoute;
