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
  CircularProgress
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
import { contentService } from '../services/api';

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
      {/* Hero Section with Deep Government Blue Gradient */}
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
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(237,137,54,0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<VerifiedUserIcon style={{ color: '#ed8936' }} />}
                label={hero?.trustIndicators?.[0] || "Govt of India Initiative • AI-Powered Discovery"}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  backdropFilter: 'blur(10px)',
                  mb: 3,
                  px: 1
                }}
              />

              <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700, mb: 1 }}>
                {hero?.title?.hindi || "सशक्त नागरिक, सशक्त भारत"}
              </Typography>

              <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' }, fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                {hero?.title?.english || "Empowering Citizens, Building India"}
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 400, maxWidth: 580 }}>
                {hero?.subtitle || "AI-Powered Platform for Government Scheme Discovery & Application"}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate(hero?.ctas?.[1]?.url || '/signup')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.5, px: 3, fontSize: '1.05rem', fontWeight: 700 }}
                >
                  {hero?.ctas?.[1]?.text || "Get Started Free"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(hero?.ctas?.[0]?.url || '/schemes')}
                  sx={{
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    py: 1.5,
                    px: 3,
                    fontSize: '1.05rem',
                    '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.08)' }
                  }}
                >
                  {hero?.ctas?.[0]?.text || "Explore All Schemes"}
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Stack direction="row" spacing={3} alignItems="center">
                {hero?.trustIndicators?.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="secondary" fontSize="small" />
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 500 }}>
                      {item}
                    </Typography>
                  </Box>
                )) || (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="secondary" fontSize="small" />
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>Secure & Verified</Typography>
                  </Box>
                )}
              </Stack>
            </Grid>

            {/* Glassmorphism Feature Highlight Card */}
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
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 50, height: 50 }}>
                    <SmartToyIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">AI Agent Assistant</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Database-Driven Matching Engine</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" paragraph sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  "I evaluate 15+ citizen datapoints (income, caste, occupation, location) against active Government scheme rules to determine your exact eligibility."
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.15)' }} />

                <Grid container spacing={2}>
                  {hero?.stats?.map((st, i) => (
                    <Grid item xs={4} key={i} sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight="bold" color="secondary.main">{st.value}{typeof st.value === 'number' ? '+' : ''}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.85 }}>{st.label}</Typography>
                    </Grid>
                  )) || (
                    <>
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
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
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
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Empowering every citizen with effortless scheme discovery and automated application workflows.
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

      {/* Featured Schemes Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="subtitle1" color="secondary.main" fontWeight="bold">
              FEATURED SCHEMES
            </Typography>
            <Typography variant="h2" color="primary.main" gutterBottom>
              Top Welfare Programs for You
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Direct database query feeds of active central & state housing, agriculture, and healthcare welfare.
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {featuredSchemes.map((s) => (
                <Grid item xs={12} md={4} key={s.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Chip label={s.category || "General"} color="primary" size="small" />
                        <Chip label={`${s.matchPercentage || 90}% Match`} color="success" size="small" />
                      </Stack>
                      <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                        {s.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 48 }}>
                        {s.description}
                      </Typography>
                      <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                        Benefit: {s.benefits}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button variant="outlined" color="primary" fullWidth onClick={() => navigate(`/schemes/${s.id}`)}>
                        View Details & Eligibility
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Departments Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="subtitle1" color="secondary.main" fontWeight="bold">
            GOVERNMENT PARTNERS
          </Typography>
          <Typography variant="h2" color="primary.main" gutterBottom>
            Integrated Departments
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Direct integration with official ministries to process application verification and benefit transfers.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {departments.map((dept) => (
            <Grid item xs={12} sm={6} md={3} key={dept.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.500', mx: 'auto', mb: 2, width: 56, height: 56, fontSize: '1.8rem' }}>
                  {dept.logo || <BusinessIcon />}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                  {dept.abbreviation || dept.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  {dept.name}
                </Typography>
                <Chip label={`${dept.schemeCount || 10}+ Active Schemes`} size="small" color="secondary" variant="outlined" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

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
