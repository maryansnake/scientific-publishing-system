import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button,
  TextField, MenuItem, Divider, CircularProgress, Alert,
  FormControl, InputLabel, Select, FormHelperText,
  Card, CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { AuthContext } from '../../context/AuthContext';
import ReviewService from '../../services/review.service';
import ArticleService from '../../services/article.service';
import UserService from '../../services/user.service';

const NewReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  useEffect(() => {
    // Якщо передано articleId через location.state, завантажити статтю
    if (location.state?.articleId) {
      fetchArticleById(location.state.articleId);
    }
    
    fetchReviewers();
  }, [location.state]);

  const fetchArticleById = async (id) => {
    try {
      const article = await ArticleService.getArticleById(id);
      setSelectedArticle(article);
      formik.setFieldValue('articleId', article.id);
    } catch (err) {
      console.error('Помилка завантаження статті:', err);
      toast.error('Не вдалося завантажити статтю');
    }
  };
  
  const fetchReviewers = async () => {
    setLoading(true);
    try {
      // Отримати всіх користувачів з роллю "reviewer"
      const response = await UserService.getUsers({ roles: 'reviewer' });
      setReviewers(response || []);
    } catch (err) {
      console.error('Помилка завантаження рецензентів:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const searchArticles = async () => {
    if (!searchTerm || searchTerm.length < 3) return;
    
    setSearchLoading(true);
    try {
      // Пошук статей зі статусом "under_review"
      const response = await ArticleService.getArticles({ 
        search: searchTerm, 
        status: 'under_review'
      });
      setArticles(response[0] || []);
    } catch (err) {
      console.error('Помилка пошуку статей:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const validationSchema = Yup.object({
    articleId: Yup.string().required('Стаття обов\'язкова'),
    reviewerId: Yup.string().required('Рецензент обов\'язковий'),
    dueDate: Yup.date()
      .required('Термін виконання обов\'язковий')
      .min(new Date(), 'Термін виконання не може бути в минулому'),
    anonymous: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      articleId: location.state?.articleId || '',
      reviewerId: '',
      assignedById: currentUser.id,
      dueDate: addDays(new Date(), 14), // За замовчуванням 2 тижні
      anonymous: false,
      status: 'pending'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await ReviewService.createReview(values);
        toast.success('Рецензію успішно призначено');
        navigate('/reviews');
      } catch (err) {
        console.error('Помилка створення рецензії:', err);
        toast.error('Не вдалося створити рецензію');
      }
    },
  });

  const handleArticleSelect = async (articleId) => {
    try {
      const article = await ArticleService.getArticleById(articleId);
      setSelectedArticle(article);
      formik.setFieldValue('articleId', articleId);
    } catch (err) {
      console.error('Помилка завантаження статті:', err);
      toast.error('Не вдалося завантажити статтю');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Призначити рецензента
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Вибір статті
              </Typography>
              
              {selectedArticle ? (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6">
                      {selectedArticle.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {selectedArticle.abstract?.substring(0, 200)}
                      {selectedArticle.abstract?.length > 200 ? '...' : ''}
                    </Typography>
                    
                    {/*<Button*/}
                    {/*  variant="outlined"*/}
                    {/*  size="small"*/}
                    {/*  onClick={() => {*/}
                    {/*    setSelectedArticle(null);*/}
                    {/*    formik.setFieldValue('articleId', '');*/}
                    {/*  }}*/}
                    {/*  sx={{ mt: 2 }}*/}
                    {/*>*/}
                    {/*  Змінити статтю*/}
                    {/*</Button>*/}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Пошук статті"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={searchArticles}
                    disabled={searchTerm.length < 3 || searchLoading}
                    sx={{ mb: 2 }}
                  >
                    {searchLoading ? <CircularProgress size={24} /> : 'Знайти'}
                  </Button>
                  
                  {articles.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {articles.map((article) => (
                        <Card 
                          key={article.id} 
                          sx={{ 
                            mb: 2, 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' } 
                          }}
                          onClick={() => handleArticleSelect(article.id)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1">
                              {article.title}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Статус: {article.status}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    searchTerm.length > 0 && !searchLoading && (
                      <Alert severity="info">
                        Статті не знайдено. Спробуйте інший пошуковий запит.
                      </Alert>
                    )
                  )}
                  
                  {formik.touched.articleId && formik.errors.articleId && (
                    <FormHelperText error>{formik.errors.articleId}</FormHelperText>
                  )}
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Рецензент та деталі
              </Typography>
              
              <FormControl 
                fullWidth 
                error={formik.touched.reviewerId && Boolean(formik.errors.reviewerId)}
                sx={{ mb: 3 }}
              >
                <InputLabel id="reviewer-label">Рецензент</InputLabel>
                <Select
                  labelId="reviewer-label"
                  id="reviewerId"
                  name="reviewerId"
                  value={formik.values.reviewerId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Рецензент"
                >
                  {reviewers.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.id}>
                      {`${reviewer.firstName} ${reviewer.lastName}`}
                      {reviewer.institution && ` - ${reviewer.institution}`}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.reviewerId && formik.errors.reviewerId && (
                  <FormHelperText>{formik.errors.reviewerId}</FormHelperText>
                )}
              </FormControl>
              
              {/*<LocalizationProvider dateAdapter={AdapterDateFns}> TODO FIX THIS*/}
              {/*  <DatePicker*/}
              {/*    label="Термін виконання"*/}
              {/*    value={formik.values.dueDate}*/}
              {/*    onChange={(value) => formik.setFieldValue('dueDate', value)}*/}
              {/*    renderInput={(params) => (*/}
              {/*      <TextField*/}
              {/*        {...params}*/}
              {/*        fullWidth*/}
              {/*        error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}*/}
              {/*        helperText={formik.touched.dueDate && formik.errors.dueDate}*/}
              {/*        sx={{ mb: 3 }}*/}
              {/*      />*/}
              {/*    )}*/}
              {/*    minDate={new Date()} // Не можна вибрати дату в минулому*/}
              {/*  />*/}
              {/*</LocalizationProvider>*/}
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="anonymous-label">Анонімне рецензування</InputLabel>
                <Select
                  labelId="anonymous-label"
                  id="anonymous"
                  name="anonymous"
                  value={formik.values.anonymous}
                  onChange={formik.handleChange}
                  label="Анонімне рецензування"
                >
                  <MenuItem value={false}>Ні - Рецензент буде відомий</MenuItem>
                  <MenuItem value={true}>Так - Рецензент буде анонімний</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/reviews')}
                >
                  Скасувати
                </Button>
                
                <Button 
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {formik.isSubmitting ? <CircularProgress size={24} /> : 'Призначити рецензію'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default NewReview;