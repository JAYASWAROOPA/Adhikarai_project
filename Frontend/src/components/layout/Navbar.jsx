import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Chip, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return '/admin';
    if (role === ROLES.OFFICER) return '/officer';
    return '/dashboard';
  };

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              textDecoration: 'none',
              color: 'inherit',
              letterSpacing: 1.2
            }}
          >
            ADHIKARAI
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/schemes">
              Schemes
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/contact">
              Contact
            </Button>

            {isAuthenticated ? (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2 }}>
                <Chip
                  label={role?.toUpperCase()}
                  size="small"
                  color={role === 'admin' ? 'error' : role === 'officer' ? 'secondary' : 'default'}
                  sx={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(getDashboardPath())}
                >
                  My Portal
                </Button>
              </Stack>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ ml: 2, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/signup"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
