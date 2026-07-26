import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DescriptionIcon from '@mui/icons-material/Description';
import { officerService } from '../../services/api';

const OfficerCitizenDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCitizen() {
      try {
        setLoading(true);
        const result = await officerService.getCitizenDetail(id || 303);
        setData(result);
      } catch (err) {
        console.error('Error fetching citizen details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCitizen();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const citizen = data?.citizen;

  return (
    <Box sx={{ py: 2 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/officer/verifications')} sx={{ mb: 3 }}>
        Back to Verification Queue
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
          Citizen Inspection Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Official verification view of citizen 15+ datapoints, documents, and historical application claims
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Demographic & Socio-Economic Datapoints
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell fontWeight="bold">Full Name</TableCell><TableCell>{citizen?.name}</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">Aadhaar Number</TableCell><TableCell>{citizen?.aadhar}</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">Age / Gender</TableCell><TableCell>{citizen?.age} yrs • {citizen?.gender}</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">Contact</TableCell><TableCell>{citizen?.phone} • {citizen?.email}</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">Location</TableCell><TableCell>{citizen?.district}, {citizen?.state}</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">Annual Family Income</TableCell><TableCell color="secondary.main">₹{Number(citizen?.income).toLocaleString()}</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">Employment & Caste</TableCell><TableCell>{citizen?.employment} ({citizen?.caste})</TableCell></TableRow>
                  <TableRow><TableCell fontWeight="bold">BPL Card Status</TableCell><TableCell>{citizen?.bplCard ? 'Yes (Verified BPL)' : 'No'}</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Verification Audit History */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Officer Verification Audit Trail
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {data?.verificationHistory?.map((vh, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">{vh.action}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">By Officer {vh.officer} on {vh.timestamp}</Typography>
                  <Typography variant="caption" color="primary.main">{vh.notes}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Sidebar: Documents & Active Applications */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Submitted Documents Vault
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {data?.documents?.map((doc, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="primary" />
                    <Typography variant="body2" fontWeight="bold">{doc.name}</Typography>
                  </Box>
                  <Chip label={doc.status} color={doc.status === 'verified' ? 'success' : 'warning'} size="small" />
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              Active Applications
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {data?.applications?.map((app, idx) => (
                <Box key={idx} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight="bold">{app.scheme}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Applied: {app.appliedDate}</Typography>
                  <Chip label={app.status} size="small" color={app.status === 'approved' ? 'success' : 'warning'} sx={{ mt: 1 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfficerCitizenDetailPage;
