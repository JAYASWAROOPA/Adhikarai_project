import React from 'react';
import { Box, Typography, Container, TextField, Button, Grid, Paper } from '@mui/material';

const ContactPage = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom color="primary">
          Get in Touch
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Have a question about ADHIKARAI or need help with a scheme?
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" variant="outlined" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" type="email" variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Message" multiline rows={4} variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" size="large" fullWidth type="submit">
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactPage;
