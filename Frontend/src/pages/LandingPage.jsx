import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom>
                Discover Government Schemes You Deserve
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                ADHIKARAI is your smart AI Agent to navigate eligibility, benefits, and documents easily.
              </Typography>
              <Button variant="contained" color="secondary" size="large" sx={{ mr: 2 }}>
                Ask AI Assistant
              </Button>
              <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} size="large">
                Explore Schemes
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          How It Works
        </Typography>
        {/* Placeholder for feature steps */}
        <Typography align="center" color="text.secondary">
          1. Complete Profile → 2. AI Verifies Eligibility → 3. Apply with Confidence
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage;
