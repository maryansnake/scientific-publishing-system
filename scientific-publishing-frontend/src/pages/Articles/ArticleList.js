import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Grid, Paper, Chip, Divider, TextField, InputAdornment,
  IconButton, FormControl, InputLabel, Select, MenuItem,
  Pagination, Card, CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

import { AuthContext } from '../../context/AuthContext';
import ArticleService from '../../services/article.service';
import JournalService from '../../services/journal.service';

const ArticleList = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [journalFilter, setJournalFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Items per page
  
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        // Fetch journals for filter
        const journalResponse = await JournalService.getJournals();
        setJournals(journalResponse.data);
        
        // Fetch articles with filters
        const params = {
          page,
          limit,
          search: searchTerm || undefined,
          journalId: journalFilter || undefined,
          status: 'published' // Only show published articles in the public list
        };
        
        const articleResponse = await ArticleService.getArticles(params);
        setArticles(articleResponse.data);
        
        // Calculate total pages
        const total = articleResponse.meta?.total || articleResponse.data.length;
        setTotalPages(Math.ceil(total / limit));
      } catch (err) {
        setError('Не вдалося завантажити статті. Будь ласка, спробуйте пізніше.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [page, searchTerm, journalFilter]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };
  
  const handleJournalFilterChange = (e) => {
    setJournalFilter(e.target.value);
    setPage(1); // Reset to first page when filtering
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setJournalFilter('');
    setPage(1);
  };
  
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
      <Typography variant="h4" gutterBottom>
        Статті
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Пошук у назвах та анотаціях..."
              variant="outlined"
              size="medium"
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
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="journal-filter-label">Фільтр за журналом</InputLabel>
              <Select
                labelId="journal-filter-label"
                value={journalFilter}
                onChange={handleJournalFilterChange}
                label="Фільтр за журналом"
              >
                <MenuItem value="">Усі журнали</MenuItem>
                {journals.map((journal) => (
                  <MenuItem key={journal.id} value={journal.id}>
                    {journal.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {(searchTerm || journalFilter) && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {searchTerm && (
                  <Chip label={`Пошук: ${searchTerm}`} onDelete={() => setSearchTerm('')} />
                )}
                {journalFilter && (
                  <Chip 
                    label={`Журнал: ${journals.find(j => j.id === journalFilter)?.title || ''}`} 
                    onDelete={() => setJournalFilter('')} 
                  />
                )}
                {(searchTerm || journalFilter) && (
                  <Chip 
                    label="Очистити всі фільтри" 
                    onDelete={clearFilters}
                    color="secondary"
                  />
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {articles.length === 0 ? (
        <Alert severity="info">
          {searchTerm || journalFilter 
            ? 'Жодна стаття не відповідає вибраним критеріям пошуку.' 
            : 'Немає опублікованих статей.'}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} key={article.id}>
                <Card 
                  sx={{ 
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {article.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {article.type && (
                        <Chip 
                          label={article.type.replace('_', ' ')} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                      {article.keywords && article.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Автори: {article.authors?.map(author => 
                        `${author.firstName} ${author.lastName}`
                      ).join(', ')}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body1" paragraph>
                      {article.abstract 
                        ? article.abstract.substring(0, 300) + (article.abstract.length > 300 ? '...' : '')
                        : 'Анотація відсутня'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box>
                        {article.journal && (
                          <Typography variant="body2" color="primary">
                            {article.journal.title}
                          </Typography>
                        )}
                        {article.issue && (
                          <Typography variant="caption" color="textSecondary">
                            Том {article.issue.volume}, Випуск {article.issue.number}
                          </Typography>
                        )}
                      </Box>
                      
                      <Typography variant="caption" color="textSecondary">
                        Опубліковано: {new Date(article.submissionDate).toLocaleDateString('uk-UA')}
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
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ArticleList;