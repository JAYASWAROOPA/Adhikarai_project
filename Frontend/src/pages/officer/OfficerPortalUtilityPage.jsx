import React from 'react';
import { Alert, Box, Button, Stack } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { OfficerPageHeader, OfficerPanel } from '../../components/officer/OfficerUI';

const OfficerPortalUtilityPage = ({ type = 'notifications' }) => {
  const navigate = useNavigate();
  const isNotifications = type === 'notifications';
  return <Box>
    <OfficerPageHeader title={isNotifications ? 'Notifications' : 'Settings'} subtitle={isNotifications ? 'Officer alerts and application updates.' : 'Officer account and workspace preferences.'} />
    {isNotifications ? <OfficerPanel title="Notifications"><Alert severity="info" icon={<NotificationsOutlinedIcon />}>There are no notification records available. The current officer API does not include a notifications endpoint.</Alert></OfficerPanel> : <OfficerPanel title="Account settings"><Stack spacing={2}><Alert severity="info" icon={<SettingsOutlinedIcon />}>Account preference management is not available from the current API.</Alert><Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={() => navigate('/officer/profile')}>Open officer profile</Button></Stack></OfficerPanel>}
  </Box>;
};

export const OfficerRouteFallback = () => {
  const navigate = useNavigate();
  return <Box><OfficerPageHeader title="Officer page not found" subtitle="This officer portal page is not available." /><Button variant="contained" onClick={() => navigate('/officer/dashboard')}>Go to Dashboard</Button></Box>;
};

export default OfficerPortalUtilityPage;
