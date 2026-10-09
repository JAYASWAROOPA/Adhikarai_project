import React, { useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, CardActionArea, CardContent, CircularProgress,
  IconButton, Menu, MenuItem, Paper, Stack, Typography
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const OfficerPageHeader = ({ title, subtitle }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const name = user?.name || 'Officer';

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="primary.main">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {name} · {user?.employeeId || `Officer ${user?.id || ''}`} · {user?.officerDetails?.designation || 'Verification Officer'} · {new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(new Date())}
        </Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton aria-label="Notifications" title="Notifications" onClick={() => navigate('/officer/notifications')}><NotificationsOutlinedIcon /></IconButton>
        <Button onClick={(event) => setMenuAnchor(event.currentTarget)} startIcon={<Avatar sx={{ width: 30, height: 30 }}>{name.charAt(0)}</Avatar>} endIcon={<AccountCircleOutlinedIcon />}>
          {name}
        </Button>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => { setMenuAnchor(null); navigate('/officer/profile'); }}>Profile</MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); navigate('/officer/settings'); }}>Settings</MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); logout(); navigate('/login'); }}><LogoutIcon fontSize="small" sx={{ mr: 1 }} />Logout</MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
};

export const OfficerMetricCard = ({ label, value, icon, onClick, helper, color = 'primary.main' }) => {
  const content = (
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.25, '&:last-child': { pb: 2.25 } }}>
      <Avatar sx={{ bgcolor: 'action.hover', color, width: 46, height: 46 }}>{icon}</Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color, lineHeight: 1.15 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>{label}</Typography>
        {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
      </Box>
    </CardContent>
  );
  return <Card sx={{ height: '100%' }}>{onClick ? <CardActionArea onClick={onClick} sx={{ height: '100%' }}>{content}</CardActionArea> : content}</Card>;
};

export const OfficerPanel = ({ title, action, children, sx = {} }) => (
  <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, ...sx }}>
    {(title || action) && <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      {title && <Typography variant="h6" fontWeight={700} color="primary.main">{title}</Typography>}{action}
    </Stack>}
    {children}
  </Paper>
);

export const OfficerLoadState = ({ loading, error, onRetry, empty, children }) => {
  if (loading) return <Paper sx={{ py: 7, textAlign: 'center' }}><CircularProgress /><Typography color="text.secondary" sx={{ mt: 2 }}>Loading officer workspace…</Typography></Paper>;
  if (error) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>{error}</Alert>;
  if (empty) return <Paper sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">{empty}</Typography></Paper>;
  return children;
};
