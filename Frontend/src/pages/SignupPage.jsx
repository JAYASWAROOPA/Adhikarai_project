import React from 'react';
import { Box, Typography, Container, TextField, Button, Paper, Link as MuiLink, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Box sx={{ py: 10, display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h4" align="center" color="primary.main" gutterBottom fontWeight="bold">
            Create an Account
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Join ADHIKARAI to securely discover your benefits.
          </Typography>

          <form onSubmit={handleSignup}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" variant="outlined" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" variant="outlined" required />
              </Grid>
            </Grid>
            <TextField fullWidth label="Email Address" type="email" variant="outlined" sx={{ mb: 3 }} required />
            <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ mb: 3 }} required />
            
            <Button variant="contained" color="primary" size="large" fullWidth type="submit" sx={{ mb: 2 }}>
              Sign Up
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" underline="hover">
                Login here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
