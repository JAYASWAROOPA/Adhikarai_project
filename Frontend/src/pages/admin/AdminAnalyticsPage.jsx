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
  CircularProgress
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { adminService } from '../../services/api';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
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

  const metrics = analytics?.applicationMetrics;

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          System Advanced Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time application trends, departmental scheme metrics, demographic distribution, and officer throughput
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Applications', val: metrics?.total?.toLocaleString() || '8,472', color: 'primary.main' },
          { label: 'Approved Claims', val: metrics?.approved?.toLocaleString() || '5,432', color: 'success.main' },
          { label: 'Rejections', val: metrics?.rejected?.toLocaleString() || '1,543', color: 'error.main' },
          { label: 'Overall Approval Rate', val: `${metrics?.approvalRate || 64.1}%`, color: 'secondary.main' }
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

      {/* Scheme Performance Table */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Scheme Performance Breakdown
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'primary.50' }}>
              <TableRow>
                <TableCell fontWeight="bold">Scheme Name</TableCell>
                <TableCell fontWeight="bold">Applications Received</TableCell>
                <TableCell fontWeight="bold">Approval Rate</TableCell>
                <TableCell fontWeight="bold">Avg Processing Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics?.schemePerformance?.map((sp, idx) => (
                <TableRow key={idx}>
                  <TableCell fontWeight="bold">{sp.schemeName}</TableCell>
                  <TableCell>{sp.applications.toLocaleString()}</TableCell>
                  <TableCell><Chip label={`${sp.approvalRate}%`} color="success" size="small" /></TableCell>
                  <TableCell>{sp.avgTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Officer Performance Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Nodal Officer Performance & Turnaround Time
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'primary.50' }}>
              <TableRow>
                <TableCell fontWeight="bold">Officer Name</TableCell>
                <TableCell fontWeight="bold">Total Verifications</TableCell>
                <TableCell fontWeight="bold">Average Verification Speed</TableCell>
                <TableCell fontWeight="bold">Approval Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics?.officerPerformance?.map((op, idx) => (
                <TableRow key={idx}>
                  <TableCell fontWeight="bold">{op.officerName}</TableCell>
                  <TableCell>{op.verifications}</TableCell>
                  <TableCell>{op.averageTime}</TableCell>
                  <TableCell><Chip label={`${op.approvalRate}%`} color="secondary" size="small" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminAnalyticsPage;
