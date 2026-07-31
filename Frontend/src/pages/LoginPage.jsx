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
  Checkbox,
  Tabs,
  Tab
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuthStore } from '../store/useAuthStore';
import { DEFAULT_USERS, ROLES } from '../constants/roles';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const switchRole = useAuthStore((state) => state.switchRole);

  const [selectedRoleTab, setSelectedRoleTab] = useState('citizen');
  const [identifier, setIdentifier] = useState('citizen@adhikarai.gov.in');
  const [password, setPassword] = useState('Citizen@2026#Apply');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleTabChange = (event, newRole) => {
    if (!newRole) return;
    setSelectedRoleTab(newRole);
    const preset = DEFAULT_USERS[newRole];
    if (preset) {
      setIdentifier(preset.email);
      setPassword(preset.password);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email/Mobile and Password.');
      return;
    }

    const val = identifier.toLowerCase();

    // Prevent selecting Officer/Admin without valid authorized credentials
    if (selectedRoleTab === 'officer' && !val.includes('officer')) {
      setErrorMsg('Unauthorized Officer Credentials. Nodal Officer accounts are created exclusively by System Administrator.');
      return;
    }
    if (selectedRoleTab === 'admin' && !val.includes('admin')) {
      setErrorMsg('Unauthorized Administrator Credentials. Predefined secure system admin account required.');
      return;
    }

    login(identifier, password);
    switchRole(selectedRoleTab);

    if (selectedRoleTab === 'admin') navigate('/admin');
    else if (selectedRoleTab === 'officer') navigate('/officer');
    else navigate('/dashboard');
  };

  return (
    <Box sx={{ py: 8, display: 'flex', alignItems: 'center', minHeight: '85vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: '#ffffff' }}>
          <Box sx={{ textCenter: 'center', mb: 3, textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
              <LockOutlinedIcon fontSize="large" />
            </Box>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              ADHIKARAI Portal Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role-Based Direct Access for Citizens, Nodal Officers & System Administrators
            </Typography>
          </Box>

          {/* STEP 2 & 3: Explicit Role Selection Tab Bar */}
          <Paper elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 3, mb: 3, p: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <Tabs
              value={selectedRoleTab}
              onChange={handleRoleTabChange}
              variant="fullWidth"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab icon={<PersonIcon />} label="Citizen" value="citizen" sx={{ fontWeight: 'bold' }} />
              <Tab icon={<BadgeIcon />} label="Nodal Officer" value="officer" sx={{ fontWeight: 'bold' }} />
              <Tab icon={<AdminPanelSettingsIcon />} label="System Admin" value="admin" sx={{ fontWeight: 'bold' }} />
            </Tabs>
          </Paper>

          {/* Quick Demo Preset Chips */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'primary.50', borderRadius: 3, border: '1px solid', borderColor: 'primary.100' }}>
            <Typography variant="caption" fontWeight="bold" color="primary.main" display="block" sx={{ mb: 1, textAlign: 'center' }}>
              ⚡ DEMO PRESET CREDS FOR SELECTED ROLE ({selectedRoleTab.toUpperCase()}):
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {selectedRoleTab === 'citizen' && (
                <Chip label="Login as Citizen (Rajesh)" color="primary" onClick={() => handleRoleTabChange(null, 'citizen')} clickable sx={{ fontWeight: 'bold' }} />
              )}
              {selectedRoleTab === 'officer' && (
                <Chip label="Login as Nodal Officer (Suresh)" color="secondary" onClick={() => handleRoleTabChange(null, 'officer')} clickable sx={{ fontWeight: 'bold' }} />
              )}
              {selectedRoleTab === 'admin' && (
                <Chip label="Login as System Admin (Dr. Anita)" color="error" onClick={() => handleRoleTabChange(null, 'admin')} clickable sx={{ fontWeight: 'bold' }} />
              )}
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
              label="Registered Email or Mobile Number"
              variant="outlined"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              sx={{ mb: 2.5 }}
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
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="secondary" />}
                label={<Typography variant="body2">Remember Me</Typography>}
              />
              <MuiLink component={Link} to="#" color="secondary" variant="body2" fontWeight="bold">
                Forgot Password?
              </MuiLink>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 'bold', mb: 3 }}
            >
              Sign In as {selectedRoleTab === 'citizen' ? 'Citizen' : selectedRoleTab === 'officer' ? 'Nodal Officer' : 'System Admin'}
            </Button>

            {/* Signup Guard for Officers and Admins */}
            <Box sx={{ textAlign: 'center' }}>
              {selectedRoleTab === 'citizen' ? (
                <Typography variant="body2" color="text.secondary">
                  Don't have a Citizen Account?{' '}
                  <MuiLink component={Link} to="/signup" color="secondary" fontWeight="bold">
                    Register New Citizen Account
                  </MuiLink>
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  🔒 {selectedRoleTab === 'officer' ? 'Nodal Officer' : 'System Admin'} registration is restricted. Accounts are created exclusively by System Administrator.
                </Typography>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
