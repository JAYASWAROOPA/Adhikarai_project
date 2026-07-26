import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';

const AboutPage = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom align="center" color="primary.main">
          What is ADHIKARAI?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Empowering citizens through Agentic AI
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" color="secondary.main" gutterBottom>
                  The Problem
                </Typography>
                <Typography variant="body1">
                  Millions of Indian citizens are unaware of the welfare schemes they are eligible for. Information is heavily fragmented, the language creates a barrier, and determining eligibility involves navigating overly complex rules.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" color="primary.main" gutterBottom>
                  Our Solution
                </Typography>
                <Typography variant="body1">
                  ADHIKARAI acts as an intelligent AI Agent. By conversing with the citizen in natural language, it understands their specific profile and cross-references thousands of parameters to confidently recommend targeted welfare schemes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>Technology Stack</Typography>
          <Typography variant="body2" color="text.secondary">
            Built using React.js, Node.js, and FastAPI integrated with LangChain and vector databases for high-speed semantic retrieval.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
