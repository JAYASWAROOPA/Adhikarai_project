import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  Alert,
  Stack,
  Chip,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuthStore } from '../store/useAuthStore';
import { DEFAULT_USERS, ROLES } from '../constants/roles';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const switchRole = useAuthStore((state) => state.switchRole);

  const [identifier, setIdentifier] = useState('citizen@adhikarai.gov.in'); // Accepts Email or Mobile
  const [password, setPassword] = useState('Citizen@2026#Apply');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email/Mobile and Password.');
      return;
    }

    const val = identifier.toLowerCase();
    let targetRole = ROLES.CITIZEN;
    let targetPath = '/dashboard';

    if (val.includes('admin')) {
      targetRole = ROLES.ADMIN;
      targetPath = '/admin';
    } else if (val.includes('officer')) {
      targetRole = ROLES.OFFICER;
      targetPath = '/officer';
    }

    login(identifier, password);
    switchRole(targetRole);
    navigate(targetPath);
  };

  const handleQuickLogin = (roleKey) => {
    const user = DEFAULT_USERS[roleKey];
    setIdentifier(user.email);
    setPassword(user.password);
    login(user.email, user.password);
    switchRole(roleKey);
    if (roleKey === 'admin') navigate('/admin');
    else if (roleKey === 'officer') navigate('/officer');
    else navigate('/dashboard');
  };

  return (
    <Box sx={{ py: 8, display: 'flex', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textCenter: 'center', mb: 3, textAlign: 'center' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
              <LockOutlinedIcon fontSize="large" />
            </Box>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              ADHIKARAI Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Official Portal for Citizens, Verification Officers & Administrators
            </Typography>
          </Box>

          {/* Quick Demo Preset Account Chips */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'primary.50', borderRadius: 3, border: '1px solid', borderColor: 'primary.100' }}>
            <Typography variant="caption" fontWeight="bold" color="primary.main" display="block" sx={{ mb: 1, textAlign: 'center' }}>
              ⚡ DEMO PRESET ACCOUNTS (1-CLICK SIGN IN):
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip label="Citizen Account" color="primary" onClick={() => handleQuickLogin('citizen')} clickable sx={{ fontWeight: 'bold' }} />
              <Chip label="Officer Account" color="secondary" onClick={() => handleQuickLogin('officer')} clickable sx={{ fontWeight: 'bold' }} />
              <Chip label="Admin Account" color="error" onClick={() => handleQuickLogin('admin')} clickable sx={{ fontWeight: 'bold' }} />
            </Stack>
          </Paper>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address or Mobile Number"
              variant="outlined"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              sx={{ mb: 2.5 }}
              placeholder="e.g. citizen@adhikarai.gov.in or 9876543210"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="secondary"
                  />
                }
                label={<Typography variant="body2">Remember Me</Typography>}
              />
              <MuiLink component={Link} to="/forgot-password" variant="body2" underline="hover" color="secondary">
                Forgot Password?
              </MuiLink>
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              type="submit"
              sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 800, borderRadius: 3 }}
            >
              Sign In to ADHIKARAI
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              New to ADHIKARAI?{' '}
              <MuiLink component={Link} to="/signup" fontWeight="bold" color="primary.main" underline="hover">
                Create Citizen Account
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
