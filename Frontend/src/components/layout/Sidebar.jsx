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
  Button,
  ButtonGroup,
  Chip
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';

const drawerWidth = 260;

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const switchRole = useAuthStore((state) => state.switchRole);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = (targetRole) => {
    switchRole(targetRole);
    if (targetRole === ROLES.ADMIN) {
      navigate('/admin');
    } else if (targetRole === ROLES.OFFICER) {
      navigate('/officer');
    } else {
      navigate('/dashboard');
    }
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
        { label: 'Officer Dashboard', path: '/officer', icon: <DashboardIcon /> },
        { label: 'Pending Verifications', path: '/officer/verifications', icon: <VerifiedUserIcon /> },
        { label: 'Officer Analytics', path: '/officer/analytics', icon: <AnalyticsIcon /> }
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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2.5, textAlign: 'center', bgcolor: 'primary.main', color: '#fff' }}>
        <Typography variant="h6" fontWeight="bold" letterSpacing={1}>ADHIKARAI</Typography>
        <Chip
          label={`${role.toUpperCase()} PORTAL`}
          size="small"
          color={role === 'admin' ? 'error' : role === 'officer' ? 'secondary' : 'default'}
          sx={{ mt: 0.5, fontWeight: 'bold', color: '#fff' }}
        />
      </Box>
      <Divider />
      
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            component={NavLink} 
            to={item.path} 
            key={item.label}
            end={item.path === '/admin' || item.path === '/officer' || item.path === '/dashboard'}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              py: 1.2,
              '&.active': {
                bgcolor: 'primary.light',
                color: '#fff',
                fontWeight: 'bold',
                '& .MuiListItemIcon-root': { color: '#fff' }
              },
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
          </ListItem>
        ))}
      </List>



      <Divider />
      <List>
        <ListItem button onClick={handleLogout} sx={{ color: 'error.main', cursor: 'pointer' }}>
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
