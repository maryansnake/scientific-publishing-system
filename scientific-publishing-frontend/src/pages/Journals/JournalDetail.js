import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button, Tabs, Tab,
  Divider, CircularProgress, Chip, Card, CardContent, Alert,
  List, ListItem, ListItemText, Link, ListItemIcon
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  OpenInNew as OpenInNewIcon,
  Article as ArticleIcon,
  CollectionsBookmark as IssueIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import JournalService from '../../services/journal.service';
import ArticleService from '../../services/article.service';

const JournalDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [journal, setJournal] = useState(null);
  const [issues, setIssues] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchJournal = async () => {
      setLoading(true);
      try {
        const journalData = await JournalService.getJournalBySlug(slug);
        console.log(journalData)
        setJournal(journalData);
        
        // Fetch issues for this journal
        if (journalData.id) {
          const issuesData = await JournalService.getIssuesByJournal(journalData.id);
          console.log(issuesData)
          setIssues(issuesData[0]);
          
          // Fetch published articles for this journal
          const articlesData = await ArticleService.getArticles({ 
            journalId: journalData.id,
            status: 'published'
          });
          console.log(articlesData);
          
          setArticles(articlesData[0]);
        }
      } catch (err) {
        setError('Не вдалося завантажити інформацію про журнал. Будь ласка, спробуйте пізніше.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournal();
  }, [slug]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const canSubmitArticle = () => {
    if (!currentUser) return false;
    if (!journal) return false;
    return journal.status === 'active' && currentUser.roles.includes('author');
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
  
  if (error || !journal) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Журнал не знайдено'}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Journal Header */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box
              component="img"
              src={journal.coverImage || '/assets/journal-placeholder.jpg'}
              alt={journal.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 1
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Typography variant="h4" gutterBottom>
                {journal.title}
              </Typography>
              
              {canSubmitArticle() && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/articles/create', { state: { journalId: journal.id } })}
                >
                  Подати статтю
                </Button>
              )}
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={journal.isOpenAccess ? 'Відкритий доступ' : 'За підпискою'} 
                color={journal.isOpenAccess ? 'success' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
              
              <Chip 
                label={journal.status === 'active' ? 'Активний' : 'Неактивний'} 
                color={journal.status === 'active' ? 'primary' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
              
              {journal.languages && journal.languages.map((language) => (
                <Chip 
                  key={language}
                  label={language === 'uk' ? 'Українська' : 
                         language === 'en' ? 'English' : language}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              ))}
            </Box>
            
            <Typography variant="body1" paragraph>
              {journal.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  ISSN: {journal.issn || 'Н/Д'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  eISSN: {journal.eissn || 'Н/Д'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Видавник: {journal.publisher}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Періодичність: {journal.publicationFrequency || 'Н/Д'}
                </Typography>
              </Grid>
            </Grid>
            
            {journal.apcFee > 0 && (
              <Alert severity="info" icon={false} sx={{ mt: 1 }}>
                Оплата за обробку статті (APC): ${journal.apcFee}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Journal Tabs */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="journal tabs">
            <Tab label="Про журнал" />
            <Tab label="Випуски" />
            <Tab label="Статті" />
            <Tab label="Правила подання" />
            <Tab label="Контакт" />
          </Tabs>
        </Box>
        
        {/* About Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Цілі та область дослідження
              </Typography>
              <Typography paragraph>
                {journal.aimsAndScope || 'Інформація про цілі та область дослідження відсутня.'}
              </Typography>
              
              {journal.keywords && journal.keywords.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Тематичні напрямки
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {journal.keywords.map((keyword) => (
                      <Chip key={keyword} label={keyword} />
                    ))}
                  </Box>
                </Box>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Процес рецензування
                </Typography>
                <Typography paragraph>
                  {journal.peerReviewProcess || 'Інформація про процес рецензування відсутня.'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }} elevation={2}>
                <Typography variant="h6" gutterBottom>
                  Інформація про журнал
                </Typography>
                
                <List dense>
                  {journal.publisher && (
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ArticleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Видавник" 
                        secondary={journal.publisher} 
                      />
                    </ListItem>
                  )}
                  
                  {journal.issn && (
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ArticleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="ISSN" 
                        secondary={journal.issn} 
                      />
                    </ListItem>
                  )}
                  
                  {journal.eissn && (
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ArticleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="eISSN" 
                        secondary={journal.eissn} 
                      />
                    </ListItem>
                  )}
                  
                  {journal.publicationFrequency && (
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <IssueIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Періодичність" 
                        secondary={journal.publicationFrequency} 
                      />
                    </ListItem>
                  )}
                </List>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => setTabValue(3)}
                  >
                    Правила подання
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Issues Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Випуски журналу
          </Typography>
          
          {issues.length > 0 ? (
            <Grid container spacing={3}>
              {issues.filter(issue => issue.status === 'published').map((issue) => (
                <Grid item xs={12} sm={6} md={4} key={issue.id}>
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
                  >
                    <Box sx={{ height: 140, overflow: 'hidden' }}>
                      <img
                        src={issue.coverImage || '/assets/issue-placeholder.jpg'}
                        alt={issue.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="subtitle1">
                        {issue.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Том {issue.volume}, Випуск {issue.number}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Опубліковано: {new Date(issue.publicationDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              Випуски для цього журналу відсутні.
            </Alert>
          )}
        </TabPanel>
        
        {/* Articles Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Опубліковані статті
          </Typography>
          
          {articles.length > 0 ? (
            <List>
              {articles.map((article) => (
                <Paper key={article.id} sx={{ mb: 2, p: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    component={RouterLink} 
                    to={`/articles/${article.id}`}
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {article.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', mt: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                      {article.authors?.map(author => 
                        `${author.firstName} ${author.lastName}`
                      ).join(', ')}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary">
                      Опубліковано: {new Date(article.submissionDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {article.abstract 
                      ? article.abstract.substring(0, 200) + (article.abstract.length > 200 ? '...' : '')
                      : 'Анотація відсутня'}
                  </Typography>
                  
                  {article.keywords && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {article.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      size="small" 
                      endIcon={<OpenInNewIcon />}
                      component={RouterLink}
                      to={`/articles/${article.id}`}
                    >
                      Читати статтю
                    </Button>
                  </Box>
                </Paper>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              Немає опублікованих статей для цього журналу.
            </Alert>
          )}
        </TabPanel>
        
        {/* Submission Guidelines Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Правила подання
          </Typography>
          
          {journal.submissionGuidelines ? (
            <Box dangerouslySetInnerHTML={{ __html: journal.submissionGuidelines }} />
          ) : (
            <Alert severity="info">
              Правила подання для цього журналу відсутні.
            </Alert>
          )}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            {canSubmitArticle() ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/articles/create', { state: { journalId: journal.id } })}
              >
                Подати статтю
              </Button>
            ) : (
              currentUser ? null : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Для подання статті необхідно увійти в систему.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                  >
                    Увійти
                  </Button>
                </Box>
              )
            )}
          </Box>
        </TabPanel>
        
        {/* Contact Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Контактна інформація
          </Typography>
          
          {journal.contactInformation ? (
            <Box sx={{ mb: 4 }}>
              {journal.contactInformation.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: 'action.active' }} />
                  <Typography variant="body1">
                    <Link href={`mailto:${journal.contactInformation.email}`}>
                      {journal.contactInformation.email}
                    </Link>
                  </Typography>
                </Box>
              )}
              
              {journal.contactInformation.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'action.active' }} />
                  <Typography variant="body1">
                    {journal.contactInformation.phone}
                  </Typography>
                </Box>
              )}
              
              {journal.contactInformation.address && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 2, color: 'action.active' }} />
                  <Typography variant="body1">
                    {journal.contactInformation.address}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info">
              Контактна інформація для цього журналу відсутня.
            </Alert>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`journal-tabpanel-${index}`}
      aria-labelledby={`journal-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default JournalDetail;