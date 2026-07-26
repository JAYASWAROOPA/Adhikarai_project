import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import PolicyIcon from '@mui/icons-material/Policy';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../store/useAuthStore';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    { label: 'Find Schemes', path: '/schemes', icon: <PolicyIcon /> },
    { label: 'AI Assistant', path: '/assistant', icon: <SmartToyIcon /> },
    { label: 'Applications', path: '/applications', icon: <AssignmentIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: '#fff' }}>
        <Typography variant="h6" fontWeight="bold">ADHIKARAI</Typography>
        <Typography variant="caption">{user?.role} Portal</Typography>
      </Box>
      <Divider />
      
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            component={NavLink} 
            to={item.path} 
            key={item.label}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&.active': {
                bgcolor: 'primary.light',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' }
              },
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        <ListItem button onClick={handleLogout} sx={{ color: 'error.main' }}>
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
