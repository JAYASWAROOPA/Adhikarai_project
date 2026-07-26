import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
            
            {/* Action Buttons */}
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
