import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Badge,
  useMediaQuery
} from '@mui/material';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import PolicyIcon from '@mui/icons-material/Policy';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useEffect, useState } from 'react';
import { officerService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (role !== ROLES.OFFICER) return undefined;
    let active = true;
    officerService.getApplications().then((data) => {
      if (active) setPendingCount(data.applications.filter((app) => !['APPROVED', 'VERIFIED', 'REJECTED'].includes(String(app.status).toUpperCase())).length);
    }).catch(() => { if (active) setPendingCount(0); });
    return () => { active = false; };
  }, [role]);

  useEffect(() => { if (isMobile) onClose(); }, [location.pathname, isMobile, onClose]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (role === ROLES.ADMIN) {
      return [
        { label: 'Admin Dashboard', path: '/admin', icon: <DashboardIcon /> },
        { label: 'Users Management', path: '/admin/users', icon: <PeopleIcon /> },
        { label: 'Officers Management', path: '/admin/officers', icon: <SecurityIcon /> },
        { label: 'Scheme Engine', path: '/admin/schemes', icon: <PolicyIcon /> },
        { label: 'System Analytics', path: '/admin/analytics', icon: <AnalyticsIcon /> },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: <ReceiptLongIcon /> }
      ];
    }
    if (role === ROLES.OFFICER) {
      return [
        { label: 'Dashboard', path: '/officer/dashboard', icon: <DashboardIcon /> },
        { label: 'Pending Verification', path: '/officer/pending-verification', icon: <VerifiedUserIcon />, badge: pendingCount },
        { label: 'Analytics', path: '/officer/analytics', icon: <AnalyticsIcon /> },
        { label: 'Applications', path: '/officer/applications', icon: <AssignmentIcon /> },
        { label: 'Schemes', path: '/officer/schemes', icon: <PolicyIcon /> },
        { label: 'Notifications', path: '/officer/notifications', icon: <NotificationsOutlinedIcon /> },
        { label: 'Profile', path: '/officer/profile', icon: <PersonIcon /> },
        { label: 'Settings', path: '/officer/settings', icon: <SettingsOutlinedIcon /> }
      ];
    }
    // Default Citizen menu
    return [
      { label: 'Citizen Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
      { label: 'My Profile', path: '/profile', icon: <PersonIcon /> },
      { label: 'Nearby Offices', path: '/offices', icon: <LocationOnIcon /> },
      { label: 'Smart Vault', path: '/vault', icon: <FolderZipIcon /> },
      { label: 'Find Schemes', path: '/schemes', icon: <PolicyIcon /> },
      { label: 'AI Assistant', path: '/assistant', icon: <SmartToyIcon /> },
      { label: 'My Applications', path: '/applications', icon: <AssignmentIcon /> }
    ];
  };

  const navItems = getNavItems();

  const drawerContent = (
    <>
      <Box sx={{ p: 2.5, textAlign: 'center', bgcolor: 'primary.main', color: '#fff' }}>
        <Typography variant="h6" fontWeight="bold" letterSpacing={1}>ADHIKARAI</Typography>
        <Chip label={`${(role || 'citizen').toUpperCase()} PORTAL`} size="small" color={role === 'admin' ? 'error' : role === 'officer' ? 'secondary' : 'default'} sx={{ mt: 0.5, fontWeight: 'bold', color: '#fff' }} />
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem component={NavLink} to={item.path} key={item.label}
            onClick={isMobile ? onClose : undefined}
            end={['/admin', '/officer', '/officer/dashboard', '/officer/pending-verification', '/officer/applications', '/officer/schemes', '/officer/notifications', '/officer/profile', '/officer/settings', '/dashboard'].includes(item.path)}
            sx={{ color: 'text.secondary', textDecoration: 'none', py: 1.2, '&.active': { bgcolor: 'primary.light', color: '#fff', fontWeight: 'bold', '& .MuiListItemIcon-root': { color: '#fff' } }, '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
            {item.badge > 0 && <Badge badgeContent={item.badge} color="error" sx={{ mr: 2 }} />}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List><ListItem button onClick={handleLogout} sx={{ color: 'error.main', cursor: 'pointer' }}><ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}><LogoutIcon /></ListItemIcon><ListItemText primary="Logout" /></ListItem></List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ width: { md: drawerWidth }, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
