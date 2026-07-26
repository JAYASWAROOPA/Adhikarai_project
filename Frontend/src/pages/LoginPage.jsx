import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Paper, Link as MuiLink, Alert, Stack, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { DEFAULT_USERS, ROLES } from '../constants/roles';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const switchRole = useAuthStore((state) => state.switchRole);

  const [email, setEmail] = useState('citizen@adhikarai.gov.in');
  const [password, setPassword] = useState('Citizen@2026#Apply');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.includes('admin')) {
      switchRole(ROLES.ADMIN);
      navigate('/admin');
    } else if (email.includes('officer')) {
      switchRole(ROLES.OFFICER);
      navigate('/officer');
    } else {
      switchRole(ROLES.CITIZEN);
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (roleKey) => {
    const user = DEFAULT_USERS[roleKey];
    setEmail(user.email);
    setPassword(user.password);
    switchRole(roleKey);
    if (roleKey === 'admin') navigate('/admin');
    else if (roleKey === 'officer') navigate('/officer');
    else navigate('/dashboard');
  };

  return (
    <Box sx={{ py: 8, display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" align="center" color="primary.main" gutterBottom fontWeight="bold">
            ADHIKARAI Portal Sign In
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Access Citizen Scheme Navigator, Officer Verification Portal, or System Admin Panel
          </Typography>

          {/* Quick Demo Login Preset Buttons */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" sx={{ mb: 1, textAlign: 'center' }}>
              QUICK TEST ACCOUNTS (1-CLICK LOGIN):
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip label="Citizen Account" color="primary" onClick={() => handleQuickLogin('citizen')} clickable />
              <Chip label="Officer Account" color="secondary" onClick={() => handleQuickLogin('officer')} clickable />
              <Chip label="Admin Account" color="error" onClick={() => handleQuickLogin('admin')} clickable />
            </Stack>
          </Paper>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2.5 }}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            <Button variant="contained" color="secondary" size="large" fullWidth type="submit" sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 'bold' }}>
              Sign In to ADHIKARAI
            </Button>
          </form>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <MuiLink component={Link} to="/forgot-password" variant="body2" underline="hover">
              Forgot Password?
            </MuiLink>
            <MuiLink component={Link} to="/signup" variant="body2" underline="hover">
              Create Citizen Account
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
