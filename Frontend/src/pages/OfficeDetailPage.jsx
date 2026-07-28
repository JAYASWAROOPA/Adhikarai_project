import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigationIcon from '@mui/icons-material/Navigation';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import { officeService } from '../services/api';

const OfficeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffice() {
      try {
        setLoading(true);
        const data = await officeService.getOfficeById(id || 101);
        setOffice(data?.office);
      } catch (err) {
        console.error('Error fetching office details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffice();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/offices')} sx={{ mb: 3 }}>
        Back to Office Locator
      </Button>

      {/* Title & Badges */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Chip label={office?.category_name} color="primary" sx={{ fontWeight: 'bold' }} />
          <Chip label={office?.is_open ? "OPEN NOW" : "CLOSED"} color={office?.is_open ? "success" : "error"} sx={{ fontWeight: 'bold' }} />
        </Stack>
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
          {office?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
          <LocationOnIcon fontSize="small" /> {office?.address}, {office?.district}, {office?.state} - {office?.pincode}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Office Services & Specs */}
        <Grid item xs={12} md={8}>
          {/* Services Checklist */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              Available Government Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Official applications and certifications processed at this office location:
            </Typography>
            <Grid container spacing={2}>
              {office?.services?.map((svc, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2" fontWeight="bold" color="primary.main">{svc}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Transport & Amenities */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              Public Access & Transport Info
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalParkingIcon color="secondary" sx={{ fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Parking Facilities</Typography>
                  <Typography variant="body2" color="text.secondary">{office?.parking || "Public parking available nearby."}</Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DirectionsBusIcon color="secondary" sx={{ fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Nearest Public Transit</Typography>
                  <Typography variant="body2" color="text.secondary">{office?.public_transport || "5 mins walk from nearest bus stop / railway station."}</Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Sidebar: Contact & Map Action */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '2px solid', borderColor: 'secondary.main', bgcolor: 'background.paper' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Direct Office Contacts
            </Typography>
            <Stack spacing={2} sx={{ my: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Nodal Officer</Typography>
                <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                  <PersonIcon color="primary" fontSize="small" /> {office?.officer_name || "District Officer"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Helpline Phone</Typography>
                <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                  <PhoneIcon color="primary" fontSize="small" /> {office?.contact_number}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Official Email</Typography>
                <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                  <EmailIcon color="primary" fontSize="small" /> {office?.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Working Timings</Typography>
                <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                  <AccessTimeIcon color="primary" fontSize="small" /> {office?.timings}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              startIcon={<NavigationIcon />}
              href={office?.google_maps_url}
              target="_blank"
              sx={{ fontWeight: 'bold', py: 1.5 }}
            >
              Start Google Maps Navigation
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfficeDetailPage;
