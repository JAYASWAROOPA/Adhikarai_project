import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { officeService } from '../../services/api';

const SchemeRequiredOfficesWidget = ({ schemeId = 1, schemeName = "PMAY" }) => {
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    async function loadOffices() {
      try {
        setLoading(true);
        const data = await officeService.getOfficesForScheme(schemeId);
        setOffices(data?.recommendedOffices || []);
      } catch (err) {
        console.error('Error loading recommended scheme offices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffices();
  }, [schemeId]);

  if (loading) {
    return <CircularProgress size={24} color="secondary" />;
  }

  if (!offices || offices.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ p: 3, my: 3, borderRadius: 3, border: '1px solid', borderColor: 'secondary.light', bgcolor: 'primary.50' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <AccountBalanceIcon color="secondary" />
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          Offices Required for {schemeName} Application
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This scheme requires document verification or DBT account opening at these nearby offices:
      </Typography>

      <Grid container spacing={2}>
        {offices.map((off) => (
          <Grid item xs={12} sm={4} key={off.id}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Chip label={off.category_name} size="small" color="primary" sx={{ mb: 1, fontWeight: 'bold' }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary.main" noWrap>
                {off.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                <LocationOnIcon fontSize="inherit" /> {off.address} ({off.distance_km} km • {off.travel_time})
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                fullWidth
                startIcon={<NavigationIcon fontSize="small" />}
                href={off.google_maps_url}
                target="_blank"
                sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
              >
                Navigate via Maps
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SchemeRequiredOfficesWidget;
