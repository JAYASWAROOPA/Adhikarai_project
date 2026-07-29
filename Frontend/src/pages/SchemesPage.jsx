import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchMockSchemes } from '../services/api';

const SchemesPage = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match', 'name', 'benefit'
  const [viewMode, setViewMode] = useState('list'); // 'list' (Table) or 'grid' (Cards)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchMockSchemes();
      setSchemes(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredSchemes = schemes
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(search.toLowerCase())) ||
        (s.department && s.department.toLowerCase().includes(search.toLowerCase()));

      const matchesState = stateFilter === 'All' || !s.state || s.state === stateFilter || s.state === 'All India';
      const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;

      return matchesSearch && matchesState && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'match') return (b.matchPercentage || 92) - (a.matchPercentage || 92);
      return 0;
    });

  return (
    <Box sx={{ py: 3 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
            Government Welfare Scheme Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore 500+ verified Central & State Government programs with real-time AI match scores.
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, val) => val && setViewMode(val)}
          color="secondary"
          size="small"
        >
          <ToggleButton value="list" sx={{ fontWeight: 'bold' }}>
            <ViewListIcon sx={{ mr: 0.5 }} /> List / Table View
          </ToggleButton>
          <ToggleButton value="grid" sx={{ fontWeight: 'bold' }}>
            <ViewModuleIcon sx={{ mr: 0.5 }} /> Grid View
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search, Filter & Sort Controls Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search scheme name, department, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>State</InputLabel>
              <Select
                value={stateFilter}
                label="State"
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <MenuItem value="All">All States (Central)</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Karnataka">Karnataka</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Housing">Housing</MenuItem>
                <MenuItem value="Agriculture">Agriculture</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Welfare">Social Welfare</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="match">Highest AI Match Score</MenuItem>
                <MenuItem value="name">Scheme Name (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results View */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : filteredSchemes.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" color="text.secondary">
            No schemes found matching your active filter criteria.
          </Typography>
        </Paper>
      ) : viewMode === 'list' ? (
        /* Professional Table / List View */
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Scheme Name & Ministry</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Key Financial Benefit</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>AI Match Score</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchemes.map((s) => (
                <TableRow key={s.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      {s.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.department || "Ministry of Welfare"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={s.category || "General"} size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="secondary.main">
                      {s.benefits}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${s.matchPercentage || 92}% Match`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/schemes/${s.id}`)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Apply / Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* Grid View */
        <Grid container spacing={3}>
          {filteredSchemes.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Chip label={s.category || "General"} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                    <Chip label={`${s.matchPercentage || 92}% Match`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                  </Stack>

                  <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                    {s.name}
                  </Typography>

                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1.5 }}>
                    {s.department}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 48, lineHeight: 1.6 }}>
                    {s.description}
                  </Typography>

                  <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                    Benefit: {s.benefits}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2.5, pt: 0 }}>
                  <Button variant="contained" color="secondary" fullWidth onClick={() => navigate(`/schemes/${s.id}`)} sx={{ fontWeight: 'bold' }}>
                    View Details & Apply
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SchemesPage;
