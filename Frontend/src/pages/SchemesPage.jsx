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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchMockSchemes } from '../services/api';

const SchemesPage = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchMockSchemes();
      setSchemes(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Government Scheme Explorer
      </Typography>

      {/* Search & Filters block */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by scheme name or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={stateFilter}
                label="State"
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <MenuItem value="All">All States (Central)</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
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
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Results View */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredSchemes.map((s) => (
            <Grid item xs={12} sm={6} key={s.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      {s.name}
                    </Typography>
                    <Chip label="92% Match" color="success" size="small" />
                  </Stack>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                    {s.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {s.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 2 }}>
                    <Chip label={`Benefit: ${s.benefits}`} size="small" color="secondary" variant="outlined" />
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button variant="contained" fullWidth onClick={() => navigate(`/schemes/${s.id}`)}>
                    View Details & Apply
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
          {filteredSchemes.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No schemes match your active search filter.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SchemesPage;
