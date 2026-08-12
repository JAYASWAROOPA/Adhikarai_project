import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Paper,
  Rating,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import UserPlusIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import InfoIcon from '@mui/icons-material/Info';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { contentService } from '../services/api';

const ANNOUNCEMENTS = [
  "📢 Pradhan Mantri Awas Yojana 2.0 applications are now active with enhanced ₹2.67L credit subsidy!",
  "🌾 PM-KISAN 17th Installment ₹2,000 direct bank transfer scheduled for verified landholding farmers.",
  "🏥 Ayushman Bharat PM-JAY expands cashless hospital coverage up to ₹5 Lakhs per family.",
  "💳 Direct Benefit Transfer (DBT) bank account Aadhaar seeding is mandatory for scheme disbursements."
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [howItWorks, setHowItWorks] = useState(null);
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [stories, setStories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLandingData() {
      try {
        setLoading(true);
        const [landingData, worksData, schemesData, storiesData, deptData] = await Promise.all([
          contentService.getLandingContent(),
          contentService.getHowItWorks(),
          contentService.getFeaturedSchemes(),
          contentService.getSuccessStories(),
          contentService.getDepartments()
        ]);

        setContent(landingData);
        setHowItWorks(worksData);
        setFeaturedSchemes(schemesData || []);
        setStories(storiesData || []);
        setDepartments(deptData || []);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLandingData();
  }, []);

  const hero = content?.hero;

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'UserPlus': return <UserPlusIcon fontSize="large" color="secondary" />;
      case 'Search': return <SearchIcon fontSize="large" color="secondary" />;
      case 'CheckCircle': return <CheckCircleIcon fontSize="large" color="secondary" />;
      default: return <SmartToyIcon fontSize="large" color="secondary" />;
    }
  };

  return (
    <Box>
      {/* Latest Updates & Announcements Banner Marquee */}
      <Box sx={{ bgcolor: 'secondary.main', color: '#fff', py: 1, px: 2, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip icon={<CampaignIcon style={{ color: '#fff' }} />} label="LATEST UPDATES" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.2)', color: '#fff', fontWeight: 'bold' }} />
            <Typography variant="body2" fontWeight="500" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ANNOUNCEMENTS[0]}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section with Deep Government Blue Gradient & Glassmorphism */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a365d 0%, #10243d 60%, #0b1a2e 100%)',
          color: '#ffffff',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(237,137,54,0.22) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<VerifiedUserIcon style={{ color: '#ed8936' }} />}
                label={hero?.trustIndicators?.[0] || "Govt of India Initiative • AI-Powered Discovery Engine"}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  backdropFilter: 'blur(10px)',
                  mb: 3,
                  px: 1,
                  fontWeight: 'bold'
                }}
              />

              <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                {hero?.title?.hindi || "सशक्त नागरिक, सशक्त भारत"}
              </Typography>

              <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3.4rem' }, fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                {hero?.title?.english || "Empowering Citizens, Building India"}
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 400, maxWidth: 580, lineHeight: 1.6 }}>
                ADHIKARAI is a database-driven AI Navigator bridging Indian citizens to 500+ Central and State Government welfare schemes with 1-click auto form filling.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/login')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.5, px: 4, fontSize: '1.05rem', fontWeight: 800, borderRadius: 3 }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/schemes')}
                  sx={{
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.08)' }
                  }}
                >
                  Explore All Schemes
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                {['256-bit AES Security', 'Aadhaar & Digilocker Ready', '500+ Verified Programs'].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="secondary" fontSize="small" />
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Glassmorphism Feature Card */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 4,
                  color: '#ffffff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 52, height: 52 }}>
                    <SmartToyIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">AI Scheme Navigator</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>LangChain Database Reasoning Engine</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" paragraph sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  "I evaluate 15+ citizen datapoints (income, caste, occupation, location) against active Government scheme rules to determine your exact eligibility."
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.15)' }} />

                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="secondary.main">500+</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Schemes</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="secondary.main">50k+</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Citizens</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="secondary.main">98%</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Success Rate</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Short Platform Introduction */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                What is ADHIKARAI?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                ADHIKARAI is India’s first database-first, multi-role welfare scheme navigation platform. It eliminates bureaucratic delays by allowing citizens to fill their profile once, automatically matching eligibility, auto-populating applications, and finding nearby government offices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => navigate('/about')} endIcon={<InfoIcon />}>
                Learn More About ADHIKARAI
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Trending / Recent Schemes (Horizontally Scrolling Cards) */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="subtitle1" color="secondary.main" fontWeight="bold">
                TRENDING WELFARE SCHEMES
              </Typography>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                Popular Welfare Programs
              </Typography>
            </Box>
            <Button variant="text" color="secondary" onClick={() => navigate('/schemes')} endIcon={<ArrowForwardIcon />}>
              View All Schemes
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            /* Horizontally Scrolling Container */
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                pb: 2,
                pt: 1,
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': { height: 8 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.200', borderRadius: 4 }
              }}
            >
              {featuredSchemes.map((s) => (
                <Card
                  key={s.id}
                  sx={{
                    minWidth: 320,
                    maxWidth: 340,
                    flexShrink: 0,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-6px)' }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Chip label={s.category || "Welfare"} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                      <Chip label={`${s.matchPercentage || 92}% Match`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                    </Stack>
                    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                      {s.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 48, lineHeight: 1.5 }}>
                      {s.description}
                    </Typography>
                    <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                      Benefit: {s.benefits}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => navigate(`/schemes/${s.id}`)}>
                      Apply / View Details
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="subtitle1" color="secondary.main" fontWeight="bold">
            SIMPLE 3-STEP PROCESS
          </Typography>
          <Typography variant="h2" color="primary.main" gutterBottom>
            How ADHIKARAI Works
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {howItWorks?.steps?.map((step) => (
            <Grid item xs={12} md={4} key={step.step}>
              <Card sx={{ height: '100%', p: 3, borderRadius: 4, position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 20,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'primary.50',
                    color: 'primary.500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}
                >
                  0{step.step}
                </Box>
                <Box sx={{ mb: 2 }}>{getStepIcon(step.icon)}</Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {step.features?.map((ft, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                      <Typography variant="caption" fontWeight="600">{ft}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Attractive About Preview Section with Animations */}
      <Box sx={{ bgcolor: 'primary.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="secondary.main" fontWeight="bold">
                REVOLUTIONIZING CITIZEN WELFARE
              </Typography>
              <Typography variant="h2" color="primary.main" gutterBottom>
                Built for National Scale
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                ADHIKARAI replaces traditional fragmented government portals with an end-to-end multi-role system connecting Citizens, Nodal Verification Officers, and System Administrators.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <AutoFixHighIcon color="secondary" />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1 }}>AI Auto-Fill Engine</Typography>
                    <Typography variant="caption" color="text.secondary">Zero redundant form filling</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <FolderZipIcon color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1 }}>Smart Vault</Typography>
                    <Typography variant="caption" color="text.secondary">Automatic document reuse</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '2px solid', borderColor: 'primary.main', bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                  Platform Key Metrics
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Supported Ministries</Typography>
                    <Typography variant="body2" fontWeight="bold">28 Departments</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Active Citizen Profiles</Typography>
                    <Typography variant="body2" fontWeight="bold">54,200+</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Applications Processed</Typography>
                    <Typography variant="body2" fontWeight="bold">12,850+</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" color="primary.main" gutterBottom>
            Citizen Success Stories
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Verified stories from citizens who accessed government benefits through ADHIKARAI.
          </Typography>

          <Grid container spacing={4}>
            {stories.map((story) => (
              <Grid item xs={12} md={6} key={story.id}>
                <Card sx={{ p: 2, borderRadius: 4 }}>
                  <CardContent>
                    <Rating value={story.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" paragraph fontStyle="italic">
                      "{story.story}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={story.photo} alt={story.citizenName} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">{story.citizenName}</Typography>
                        <Typography variant="caption" color="text.secondary">{story.location} • {story.schemeName}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
