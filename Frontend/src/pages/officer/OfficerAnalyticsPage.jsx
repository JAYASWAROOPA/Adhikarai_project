import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import { officerService } from '../../services/api';

const OfficerAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const result = await officerService.getAnalytics();
        setData(result);
      } catch (err) {
        console.error('Error fetching officer analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const perf = data?.performance;
  const wl = data?.workload;

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          My Officer Performance & Workload Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track verification turnaround time, monthly targets, approval/rejection distribution, and citizen feedback
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Verified', val: perf?.totalVerified || 342, color: 'primary.main' },
          { label: 'Approval Rate', val: `${perf?.approvalRate || 82.5}%`, color: 'success.main' },
          { label: 'Avg Verification Speed', val: perf?.averageTime || '3.2 days', color: 'secondary.main' },
          { label: 'Citizen Rating', val: `⭐ ${data?.citizenFeedback?.rating || 4.8} / 5`, color: 'warning.main' }
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">{item.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: item.color, mt: 1 }}>{item.val}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Target Progress */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Monthly Verification Target</Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">{perf?.achieved || 42} / {perf?.monthlyTarget || 50} Cases</Typography>
        </Box>
        <LinearProgress variant="determinate" value={((perf?.achieved || 42) / (perf?.monthlyTarget || 50)) * 100} color="secondary" sx={{ height: 10, borderRadius: 5 }} />
      </Paper>

      {/* Workload Scheme Distribution */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Scheme Verification Distribution
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'primary.50' }}>
              <TableRow>
                <TableCell fontWeight="bold">Scheme Name</TableCell>
                <TableCell fontWeight="bold">Verifications Processed</TableCell>
                <TableCell fontWeight="bold">Average Turnaround</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.schemeDistribution?.map((sd, idx) => (
                <TableRow key={idx}>
                  <TableCell fontWeight="bold">{sd.scheme}</TableCell>
                  <TableCell>{sd.count}</TableCell>
                  <TableCell><Chip label={sd.avgTime} color="primary" size="small" variant="outlined" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OfficerAnalyticsPage;
