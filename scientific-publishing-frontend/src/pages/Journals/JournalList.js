import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, CircularProgress, Alert,
  Grid, Card, CardMedia, CardContent, TextField, InputAdornment,
  IconButton, FormControl, InputLabel, Select, MenuItem, Paper,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import JournalService from '../../services/journal.service';

const JournalList = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Items per page
  
  useEffect(() => {
    const fetchJournals = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          search: searchTerm || undefined,
          status: filter === 'all' ? undefined : filter
        };
        
        const response = await JournalService.getJournals(params);
        console.log(response);
        
        // Перевірка наявності даних і забезпечення, що journals завжди масив
        setJournals(response[0] || []);
        
        // Calculate total pages
        const total = response?.meta?.total || (response[1].length || 0);
        setTotalPages(Math.ceil(total / limit));
      } catch (err) {
        setError('Failed to load journals. Please try again later.');
        console.error(err);
        setJournals([]); // Встановлюємо порожній масив при помилці
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournals();
  }, [page, searchTerm, filter]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page when filtering
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };
  
  const isEditor = currentUser?.roles?.includes('editor') || currentUser?.roles?.includes('admin');
  
  if (loading && page === 1) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Journals</Typography>
        {isEditor && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/journals/create')}
          >
            Create New Journal
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              placeholder="Search journals..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="filter-label">Filter</InputLabel>
              <Select
                labelId="filter-label"
                value={filter}
                onChange={handleFilterChange}
                label="Filter"
              >
                <MenuItem value="all">All Journals</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                {isEditor && <MenuItem value="archived">Archived</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Використовуємо опціональний ланцюжок і оператор ?? для безпечного доступу */}
      {(journals?.length ?? 0) === 0 ? (
        <Alert severity="info">
          {searchTerm 
            ? 'No journals match your search criteria.' 
            : 'No journals available.'}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {/* Перевіряємо journals перед map для запобігання помилок */}
            {journals?.map((journal) => (
              <Grid item xs={12} sm={6} md={4} key={journal?.id || Math.random()}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/journals/${journal?.slug}`)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={journal?.coverImage || '/assets/journal-placeholder.jpg'}
                    alt={journal?.title || 'Journal'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/journal-placeholder.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {journal?.title || 'Untitled Journal'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {journal?.description?.substring(0, 120) || 'No description available'}
                      {(journal?.description?.length || 0) > 120 ? '...' : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        ISSN: {journal?.issn || 'N/A'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: journal?.isOpenAccess ? 'success.main' : 'inherit',
                          fontWeight: journal?.isOpenAccess ? 'bold' : 'normal'
                        }}
                      >
                        {journal?.isOpenAccess ? 'Open Access' : 'Subscription'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default JournalList;