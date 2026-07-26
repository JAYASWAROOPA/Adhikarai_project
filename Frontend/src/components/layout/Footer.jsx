import React from 'react';
import { Box, Typography, Container, Grid, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              ADHIKARAI
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Empowering citizens with AI-driven access to government welfare schemes, ensuring no one is left behind.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/schemes" color="inherit" underline="hover">Explore Schemes</MuiLink>
              <MuiLink component={Link} to="/about" color="inherit" underline="hover">About Us</MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover">Contact</MuiLink>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Legal & Privacy
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" color="inherit" underline="hover">Terms of Service</MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">Privacy Policy</MuiLink>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} ADHIKARAI. Built for the Citizens.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
