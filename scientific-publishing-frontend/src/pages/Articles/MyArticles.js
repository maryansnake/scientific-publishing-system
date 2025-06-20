import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, CircularProgress, Alert,
  Paper, Chip, Tabs, Tab, Grid, Card, CardContent, CardActions,
  Divider, TextField, InputAdornment, IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import ArticleService from '../../services/article.service';

const MyArticles = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchArticles = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        const response = await ArticleService.getArticles({ submitterId: currentUser.id });
        
        setArticles(response[0]);
      
      } catch (err) {
        setError('Failed to load articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [currentUser, navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'under_review': return 'warning';
      case 'revisions_needed': return 'warning';
      case 'accepted': return 'success';
      case 'published': return 'success';
      case 'rejected': return 'error';
      case 'withdrawn': return 'error';
      default: return 'default';
    }
  };
  
  const getFilteredArticles = () => {
    let filteredArticles = [...articles];
    // Filter by status based on selected tab
    if (tabValue === 1) {
      filteredArticles = filteredArticles.filter(article => 
        ['draft', 'submitted'].includes(article.status)
      );
    } else if (tabValue === 2) {
      filteredArticles = filteredArticles.filter(article => 
        ['under_review', 'revisions_needed'].includes(article.status)
      );
    } else if (tabValue === 3) {
      filteredArticles = filteredArticles.filter(article => 
        ['accepted', 'published'].includes(article.status)
      );
    } else if (tabValue === 4) {
      filteredArticles = filteredArticles.filter(article => 
        ['rejected', 'withdrawn'].includes(article.status)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(term) || 
        (article.abstract && article.abstract.toLowerCase().includes(term))
      );
    }
    
    return filteredArticles;
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  const filteredArticles = getFilteredArticles();
  console.log(filteredArticles);
  
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Articles</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/articles/create')}
        >
          Create New Article
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search articles..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="article status tabs">
            <Tab label="All" />
            <Tab label="In Progress" />
            <Tab label="Under Review" />
            <Tab label="Accepted/Published" />
            <Tab label="Rejected" />
          </Tabs>
        </Box>
      </Paper>
      
      {filteredArticles.length === 0 ? (
        <Alert severity="info">
          {searchTerm 
            ? 'No articles match your search criteria.' 
            : 'No articles found in this category.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} key={article.id}>
              <Card sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                },
                cursor: 'pointer'
              }}>
                <CardContent onClick={() => navigate(`/articles/${article.id}`)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>
                      <Chip 
                        label={article.status.replace('_', ' ')}
                        size="small"
                        color={getStatusColor(article.status)}
                        sx={{ mr: 1 }}
                      />
                      {article.type && (
                        <Chip 
                          label={article.type.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Submitted: {new Date(article.submissionDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    {article.abstract 
                      ? article.abstract.substring(0, 200) + (article.abstract.length > 200 ? '...' : '')
                      : 'No abstract available'}
                  </Typography>
                  
                  {article.journal && (
                    <Typography variant="caption" color="primary">
                      Journal: {article.journal.title}
                    </Typography>
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/articles/${article.id}`);
                    }}
                  >
                    View Details
                  </Button>
                  {['draft', 'revisions_needed'].includes(article.status) && (
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/articles/${article.id}/edit`);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {article.status === 'published' && article.doi && (
                    <Button 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://doi.org/${article.doi}`, '_blank');
                      }}
                    >
                      View DOI
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyArticles;