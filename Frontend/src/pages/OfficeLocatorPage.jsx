import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  FormControlLabel,
  Switch,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import NavigationIcon from '@mui/icons-material/Navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessibleIcon from '@mui/icons-material/Accessible';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useNavigate } from 'react-router-dom';
import { officeService } from '../services/api';

const INDIAN_STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat'];
const DISTRICTS_MAP = {
  Maharashtra: ['Mumbai', 'Thane', 'Pune', 'Nagpur', 'Nashik'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi'],
  Karnataka: ['Bengaluru Urban', 'Mysuru', 'Hubballi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  Telangana: ['Hyderabad', 'Warangal'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Varanasi']
};

const OfficeLocatorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Location state
  const [userCoords, setUserCoords] = useState({ lat: 19.0760, lng: 72.8777 }); // Default Mumbai
  const [geoStatus, setGeoStatus] = useState('Detecting browser location...');
  const [useManualLoc, setUseManualLoc] = useState(false);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Mumbai');

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Detect Geolocation on Load
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    setGeoStatus('Detecting browser GPS location...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setGeoStatus(`GPS Active (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          setUseManualLoc(false);
        },
        (error) => {
          console.warn('Geolocation denied or unavailable:', error.message);
          setGeoStatus('GPS permission denied. Using District fallback.');
          setUseManualLoc(true);
        },
        { timeout: 8000 }
      );
    } else {
      setGeoStatus('Geolocation not supported by browser.');
      setUseManualLoc(true);
    }
  };

  // 2. Fetch Offices matching filters
  useEffect(() => {
    async function loadOffices() {
      try {
        setLoading(true);
        const params = {
          lat: userCoords.lat,
          lng: userCoords.lng,
          category: selectedCategory,
          search: searchQuery,
          openNow: openNowOnly,
          wheelchair: wheelchairOnly
        };
        if (useManualLoc && selectedDistrict) {
          params.district = selectedDistrict;
        }

        const data = await officeService.getNearbyOffices(params);
        setOffices(data?.offices || []);
        if (data?.categories) setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching nearby offices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffices();
  }, [userCoords, selectedCategory, searchQuery, openNowOnly, wheelchairOnly, selectedDistrict, useManualLoc]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setToastMsg(`${label} copied to clipboard!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleShare = (office) => {
    if (navigator.share) {
      navigator.share({
        title: office.name,
        text: `Check out ${office.name} located at ${office.address}`,
        url: office.google_maps_url
      });
    } else {
      copyToClipboard(office.google_maps_url, 'Office Google Maps Link');
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header Banner */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
          Nearby Government Office & e-Seva Locator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Locate nearest Tahsildar Offices, Gram Panchayats, Common Service Centers (CSC), Aadhaar Kendras, and DBT Banks.
        </Typography>
      </Box>

      {toastMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setToastMsg('')}>
          {toastMsg}
        </Alert>
      )}

      {/* Geolocation & Location Control Bar */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'primary.50' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LocationOnIcon color="secondary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                  Current Search Location
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {geoStatus}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<MyLocationIcon />}
              onClick={detectLocation}
              sx={{ fontWeight: 'bold' }}
            >
              Detect My GPS
            </Button>
            <Button
              variant={useManualLoc ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setUseManualLoc(!useManualLoc)}
              sx={{ fontWeight: 'bold' }}
            >
              {useManualLoc ? 'Using Manual District' : 'Select District Manually'}
            </Button>
          </Grid>

          {useManualLoc && (
            <Grid item xs={12} sx={{ pt: 2, display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>State</InputLabel>
                <Select
                  value={selectedState}
                  label="State"
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict(DISTRICTS_MAP[e.target.value]?.[0] || '');
                  }}
                >
                  {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>District</InputLabel>
                <Select
                  value={selectedDistrict}
                  label="District"
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {(DISTRICTS_MAP[selectedState] || []).map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Category Pills Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
        {categories.map((cat) => (
          <Chip
            key={cat.code}
            label={cat.name}
            clickable
            color={selectedCategory === cat.code ? 'secondary' : 'default'}
            variant={selectedCategory === cat.code ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory(cat.code)}
            sx={{ fontWeight: 'bold', py: 2, px: 1.5 }}
          />
        ))}
      </Box>

      {/* Search & Toggle Filters Bar */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search office name, pincode, service, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={<Switch checked={openNowOnly} onChange={(e) => setOpenNowOnly(e.target.checked)} color="secondary" />}
              label={<Typography variant="body2" fontWeight="bold">Currently Open Only</Typography>}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={<Switch checked={wheelchairOnly} onChange={(e) => setWheelchairOnly(e.target.checked)} color="secondary" />}
              label={<Typography variant="body2" fontWeight="bold">Wheelchair Accessible</Typography>}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Office Cards Grid */}
      <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
        Nearest Government Offices & Service Centers ({offices.length})
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : offices.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" color="text.secondary">No offices found matching your search filter.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {offices.map((office) => (
            <Grid item xs={12} md={6} key={office.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Chip label={office.category_name} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                    <Chip label={`${office.distance_km} km away`} color="secondary" size="small" sx={{ fontWeight: 'bold' }} />
                  </Stack>

                  <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    {office.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5, verticalAlign: 'middle' }} />
                    {office.address}, {office.district}, {office.pincode}
                  </Typography>

                  {/* Travel Time & Timings */}
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      <Typography variant="caption" fontWeight="bold">{office.travel_time}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="caption">{office.timings}</Typography>
                    </Box>
                  </Stack>

                  {/* Available Services */}
                  <Typography variant="caption" fontWeight="bold" color="primary.main" display="block" sx={{ mb: 1 }}>
                    Available Services:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {office.services?.map((svc, idx) => (
                      <Chip key={idx} label={svc} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>

                  {/* Contact Info */}
                  <Stack spacing={0.5} sx={{ mb: 2 }}>
                    {office.contact_number && (
                      <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                        <PhoneIcon fontSize="inherit" color="primary" /> {office.contact_number}
                      </Typography>
                    )}
                    {office.officer_name && (
                      <Typography variant="caption" color="text.secondary">
                        Nodal Officer: <strong>{office.officer_name}</strong>
                      </Typography>
                    )}
                  </Stack>

                  {/* Action Buttons */}
                  <Grid container spacing={1} sx={{ mt: 'auto' }}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<NavigationIcon />}
                        href={office.google_maps_url}
                        target="_blank"
                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                      >
                        Open in Google Maps
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ContentCopyIcon />}
                        onClick={() => copyToClipboard(`${office.name}, ${office.address}`, 'Address')}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Copy
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ShareIcon />}
                        onClick={() => handleShare(office)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Share
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
                <Box sx={{ p: 1.5, px: 3, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button size="small" color="primary" onClick={() => navigate(`/offices/${office.id}`)} endIcon={<ArrowForwardIcon />}>
                    View Office Details
                  </Button>
                  {office.wheelchair_accessible && (
                    <Tooltip title="Wheelchair Accessible Entrance">
                      <AccessibleIcon color="success" fontSize="small" />
                    </Tooltip>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OfficeLocatorPage;
