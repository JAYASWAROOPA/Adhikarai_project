import React from 'react';
import { Box, Typography, Container, TextField, Button, Paper, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login logic
    navigate('/dashboard');
  };

  return (
    <Box sx={{ py: 10, display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h4" align="center" color="primary.main" gutterBottom fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Login to access your personalized schemes.
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email Address" type="email" variant="outlined" sx={{ mb: 3 }} required />
            <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ mb: 3 }} required />
            
            <Button variant="contained" color="secondary" size="large" fullWidth type="submit" sx={{ mb: 2 }}>
              Login to ADHIKARAI
            </Button>
          </form>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <MuiLink component={Link} to="/forgot-password" variant="body2" underline="hover">
              Forgot Password?
            </MuiLink>
            <MuiLink component={Link} to="/signup" variant="body2" underline="hover">
              Create an Account
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
