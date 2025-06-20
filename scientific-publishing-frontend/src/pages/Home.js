import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, Button,
  Container, Paper, Divider, CircularProgress, Tabs, Tab, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import JournalService from '../services/journal.service';
import ArticleService from '../services/article.service';
import placeholder from '../images/placeholderpng.png';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch featured journals
        const journalResponse = await JournalService.getJournals({ limit: 4 });
        setJournals(journalResponse.data || []);
        
        // Fetch recent articles
        const articleResponse = await ArticleService.getArticles({ 
          limit: 5,
          status: 'published'
        });
        setRecentArticles(articleResponse.data || []);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError("Не вдалося завантажити дані. Перевірте зʼєднання з Інтернетом або спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          mb: 4, 
          backgroundImage: 'linear-gradient(to right, #3a8dff, #86b9ff)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              Наукові публікації
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Комплексна платформа для публікації та управління науковими журналами і статтями
            </Typography>
            
            {!currentUser ? (
              <Box sx={{ '& > :not(style)': { mr: 2 } }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Розпочати
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => navigate('/journal')}
                >
                  Перегляд журналів
                </Button>
              </Box>
            ) : (
              <Box sx={{ '& > :not(style)': { mr: 2 } }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/articles/create')}
                >
                  Подати статтю
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => navigate('/journals')}
                >
                  Перегляд журналів
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <img 
              src={placeholder}
              alt="Наукові публікації" 
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabs Section */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Популярні журнали" />
          <Tab label="Останні публікації" />
          {currentUser?.roles?.includes('editor') && (
            <Tab label="Панель редактора" />
          )}
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Популярні журнали
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {journals && journals.length > 0 ? (
                  journals.map((journal) => (
                    <Grid item key={journal.id} xs={12} sm={6} md={3}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: '0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 6
                          }
                        }}
                        onClick={() => navigate(`/journals/${journal.slug}`)}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={journal.coverImage || placeholder}
                          alt={journal.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div">
                            {journal.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {journal.description?.substring(0, 100)}
                            {journal.description?.length > 100 ? '...' : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            ISSN: {journal.issn || 'Н/Д'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography>Журнали поки недоступні.</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/journals')}
              >
                Всі журнали
              </Button>
            </Box>
          </>
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              Останні публікації
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {recentArticles && recentArticles.length > 0 ? (
                  recentArticles.map((article) => (
                    <Grid item key={article.id} xs={12}>
                      <Card 
                        sx={{ 
                          transition: '0.3s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: 3
                          }
                        }}
                        onClick={() => navigate(`/articles/${article.id}`)}
                      >
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {article.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {article.abstract?.substring(0, 200)}
                            {article.abstract?.length > 200 ? '...' : ''}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Опубліковано: {new Date(article.submissionDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {article.journal?.title || 'Журнал'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography>Опубліковані статті поки недоступні.</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 2}>
        {tabValue === 2 && currentUser?.roles?.includes('editor') && (
          <>
            <Typography variant="h5" gutterBottom>
              Панель редактора
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: '#e8f5e9',
                    height: '100%'
                  }}
                >
                  <Typography variant="h4">
                    {/* Count would come from API */}
                    5
                  </Typography>
                  <Typography variant="body2">
                    Огляди на розгляді
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/reviews?status=pending')}
                  >
                    Переглянути
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: '#e3f2fd',
                    height: '100%'
                  }}
                >
                  <Typography variant="h4">
                    3
                  </Typography>
                  <Typography variant="body2">
                    Нові подання
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/articles?status=submitted')}
                  >
                    Переглянути
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: '#fff8e1',
                    height: '100%'
                  }}
                >
                  <Typography variant="h4">
                    2
                  </Typography>
                  <Typography variant="body2">
                    Потрібні виправлення
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/articles?status=revisions_needed')}
                  >
                    Переглянути
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: '#f3e5f5',
                    height: '100%'
                  }}
                >
                  <Typography variant="h4">
                    8
                  </Typography>
                  <Typography variant="body2">
                    Опубліковані статті
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/articles?status=published')}
                  >
                    Переглянути
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
      
      {/* Feature Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Основні функції
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Наша платформа надає комплексні інструменти для наукових публікацій
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <img 
                src={placeholder} 
                alt="Подання" 
                style={{ height: 80, marginBottom: 16 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholder;
                }}
              />
              <Typography variant="h6" gutterBottom>
                Зручне подання
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Подавайте свої статті за допомогою інтуїтивно зрозумілого інтерфейсу та відстежуйте статус в реальному часі.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <img 
                src={placeholder} 
                alt="Рецензування" 
                style={{ height: 80, marginBottom: 16 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholder;
                }}
              />
              <Typography variant="h6" gutterBottom>
                Управління рецензуванням
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Оптимізований процес рецензування з комплексними інструментами для рецензентів та редакторів.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <img 
                src={placeholder}
                alt="Публікація" 
                style={{ height: 80, marginBottom: 16 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholder;
                }}
              />
              <Typography variant="h6" gutterBottom>
                Цифрове видавництво
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Публікуйте та поширюйте свої статті у різних форматах з автоматичною індексацією.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;