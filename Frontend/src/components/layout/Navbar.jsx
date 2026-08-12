import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import PolicyIcon from '@mui/icons-material/Policy';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return '/admin';
    if (role === ROLES.OFFICER) return '/officer';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Schemes', path: '/schemes', icon: <PolicyIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactSupportIcon /> }
  ];

  const handleMobileNav = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={2}
      sx={{
        backdropFilter: 'blur(10px)',
        bgcolor: 'primary.main',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              textDecoration: 'none',
              color: '#ffffff',
              letterSpacing: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            ADHIKARAI
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: isActive ? 'secondary.main' : '#ffffff',
                    fontWeight: isActive ? 800 : 500,
                    borderBottom: isActive ? '2px solid' : '2px solid transparent',
                    borderColor: isActive ? 'secondary.main' : 'transparent',
                    borderRadius: 0,
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': { color: 'secondary.main' }
                  }}
                >
                  {link.label}
                </Button>
              );
            })}

            {isAuthenticated ? (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(getDashboardPath())}
                  sx={{ fontWeight: 'bold', borderRadius: 2 }}
                >
                  My Portal
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    useAuthStore.getState().logout();
                    navigate('/login');
                  }}
                  sx={{ borderColor: 'rgba(255,255,255,0.5)', fontWeight: 'bold', borderRadius: 2 }}
                >
                  Logout
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1.5} sx={{ ml: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ borderColor: 'rgba(255,255,255,0.5)', fontWeight: 'bold', borderRadius: 2 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/signup"
                  sx={{ fontWeight: 'bold', borderRadius: 2 }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Box>

          {/* Mobile Hamburger Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: 'background.paper', p: 2 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            ADHIKARAI
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.label}
              onClick={() => handleMobileNav(link.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: location.pathname === link.path ? 'action.hover' : 'transparent',
                color: location.pathname === link.path ? 'secondary.main' : 'text.primary'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {isAuthenticated ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Logged in as <strong>{user?.name}</strong>
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => handleMobileNav(getDashboardPath())}
              startIcon={<DashboardIcon />}
            >
              Go to My Portal
            </Button>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleMobileNav('/login')}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => handleMobileNav('/signup')}
              startIcon={<PersonAddIcon />}
            >
              Sign Up
            </Button>
          </Stack>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
