import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button,
  TextField, MenuItem, Divider, CircularProgress, Alert,
  FormControl, InputLabel, Select, FormHelperText,
  Card, CardContent, Rating, FormControlLabel, Checkbox
} from '@mui/material';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { AuthContext } from '../../context/AuthContext';
import ReviewService from '../../services/review.service';
import FileService from '../../services/file.service';

const CompleteReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    fetchReviewData();
  }, [id]);
  
  const fetchReviewData = async () => {
    setLoading(true);
    try {
      const reviewData = await ReviewService.getReviewById(id);
      
      // Перевірка, чи рецензія вже заповнена
      if (reviewData.status === 'completed') {
        toast.info('Ця рецензія вже завершена');
        navigate(`/reviews/${id}`);
        return;
      }
      
      // Перевірка прав доступу
      if (reviewData.reviewerId !== currentUser.id) {
        toast.error('У вас немає прав для заповнення цієї рецензії');
        navigate('/reviews');
        return;
      }
      
      setReview(reviewData);
      setError('');
    } catch (err) {
      console.error('Помилка завантаження рецензії:', err);
      setError('Не вдалося завантажити рецензію. Будь ласка, спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const validationSchema = Yup.object({
    recommendation: Yup.string().required('Рекомендація обов\'язкова'),
    qualityScore: Yup.number().min(1).max(10).required('Оцінка якості обов\'язкова'),
    originalityScore: Yup.number().min(1).max(10).required('Оцінка оригінальності обов\'язкова'),
    relevanceScore: Yup.number().min(1).max(10).required('Оцінка актуальності обов\'язкова'),
    clarityScore: Yup.number().min(1).max(10).required('Оцінка ясності обов\'язкова'),
    commentsToAuthor: Yup.string().required('Коментарі для автора обов\'язкові'),
    commentsToEditor: Yup.string().required('Коментарі для редактора обов\'язкові'),
    anonymous: Yup.boolean()
  });
  
  const formik = useFormik({
    initialValues: {
      recommendation: '',
      qualityScore: 5,
      originalityScore: 5,
      relevanceScore: 5,
      clarityScore: 5,
      commentsToAuthor: '',
      commentsToEditor: '',
      anonymous: review?.anonymous || false
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let fileUrl = review?.fileUrl || '';
        
        // Завантажити файл, якщо вибрано
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await FileService.uploadFile(formData);
          fileUrl = uploadResponse.url;
        }
        
        // Оновити рецензію
        await ReviewService.updateReview(id, {
          ...values,
          status: 'completed',
          completionDate: new Date().toISOString(),
          fileUrl
        });
        
        toast.success('Рецензію успішно завершено');
        navigate(`/reviews/${id}`);
      } catch (err) {
        console.error('Помилка завершення рецензії:', err);
        toast.error('Не вдалося завершити рецензію');
      }
    }
  });
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error || !review) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Рецензію не знайдено'}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Заповнення рецензії
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Typography variant="h6" gutterBottom>
                Інформація про статтю
              </Typography>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {review.article?.title || 'Назва статті не вказана'}
                  </Typography>
                  
                  {review.article?.abstract && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {review.article.abstract.substring(0, 200)}
                      {review.article.abstract.length > 200 ? '...' : ''}
                    </Typography>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/articles/${review.articleId}`)}
                  >
                    Переглянути статтю
                  </Button>
                </CardContent>
              </Card>
              
              <Typography variant="h6" gutterBottom>
                Налаштування
              </Typography>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.anonymous}
                        onChange={(e) => formik.setFieldValue('anonymous', e.target.checked)}
                        name="anonymous"
                      />
                    }
                    label="Зробити рецензію анонімною"
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Завантажити файл (необов'язково)
                    </Typography>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                      >
                        Вибрати файл
                      </Button>
                    </label>
                    {file && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Вибрано: {file.name}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Typography variant="h6" gutterBottom>
                Оцінка статті
              </Typography>
              
              <FormControl 
                fullWidth 
                error={formik.touched.recommendation && Boolean(formik.errors.recommendation)}
                sx={{ mb: 3 }}
              >
                <InputLabel id="recommendation-label">Рекомендація</InputLabel>
                <Select
                  labelId="recommendation-label"
                  id="recommendation"
                  name="recommendation"
                  value={formik.values.recommendation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Рекомендація"
                >
                  <MenuItem value="accept">Прийняти без змін</MenuItem>
                  <MenuItem value="minor_revisions">Прийняти з незначними виправленнями</MenuItem>
                  <MenuItem value="major_revisions">Потрібні суттєві виправлення</MenuItem>
                  <MenuItem value="reject">Відхилити</MenuItem>
                </Select>
                {formik.touched.recommendation && formik.errors.recommendation && (
                  <FormHelperText>{formik.errors.recommendation}</FormHelperText>
                )}
              </FormControl>
              
              <Typography variant="subtitle1" gutterBottom>
                Оцінки (від 1 до 10)
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography variant="body2">Якість</Typography>
                  <Rating
                    name="quality-rating"
                    value={formik.values.qualityScore / 2}
                    precision={0.5}
                    onChange={(_, value) => formik.setFieldValue('qualityScore', value * 2)}
                  />
                  <TextField
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    value={formik.values.qualityScore}
                    onChange={(e) => {
                      const value = Math.min(10, Math.max(1, Number(e.target.value)));
                      formik.setFieldValue('qualityScore', value);
                    }}
                    sx={{ width: 70, mt: 1 }}
                  />
                </Grid>
                
                <Grid item xs={3}>
                  <Typography variant="body2">Оригінальність</Typography>
                  <Rating
                    name="originality-rating"
                    value={formik.values.originalityScore / 2}
                    precision={0.5}
                    onChange={(_, value) => formik.setFieldValue('originalityScore', value * 2)}
                  />
                  <TextField
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    value={formik.values.originalityScore}
                    onChange={(e) => {
                      const value = Math.min(10, Math.max(1, Number(e.target.value)));
                      formik.setFieldValue('originalityScore', value);
                    }}
                    sx={{ width: 70, mt: 1 }}
                  />
                </Grid>
                
                <Grid item xs={3}>
                  <Typography variant="body2">Актуальність</Typography>
                  <Rating
                    name="relevance-rating"
                    value={formik.values.relevanceScore / 2}
                    precision={0.5}
                    onChange={(_, value) => formik.setFieldValue('relevanceScore', value * 2)}
                  />
                  <TextField
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    value={formik.values.relevanceScore}
                    onChange={(e) => {
                      const value = Math.min(10, Math.max(1, Number(e.target.value)));
                      formik.setFieldValue('relevanceScore', value);
                    }}
                    sx={{ width: 70, mt: 1 }}
                  />
                </Grid>
                
                <Grid item xs={3}>
                  <Typography variant="body2">Ясність</Typography>
                  <Rating
                    name="clarity-rating"
                    value={formik.values.clarityScore / 2}
                    precision={0.5}
                    onChange={(_, value) => formik.setFieldValue('clarityScore', value * 2)}
                  />
                  <TextField
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    value={formik.values.clarityScore}
                    onChange={(e) => {
                      const value = Math.min(10, Math.max(1, Number(e.target.value)));
                      formik.setFieldValue('clarityScore', value);
                    }}
                    sx={{ width: 70, mt: 1 }}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" gutterBottom>
                Коментарі для автора
              </Typography>
              <ReactQuill
                value={formik.values.commentsToAuthor}
                onChange={(content) => formik.setFieldValue('commentsToAuthor', content)}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['clean']
                  ]
                }}
                style={{ height: '200px', marginBottom: '60px' }}
              />
              {formik.touched.commentsToAuthor && formik.errors.commentsToAuthor && (
                <Typography color="error" variant="caption">
                  {formik.errors.commentsToAuthor}
                </Typography>
              )}
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 6 }}>
                Конфіденційні коментарі для редактора
              </Typography>
              <ReactQuill
                value={formik.values.commentsToEditor}
                onChange={(content) => formik.setFieldValue('commentsToEditor', content)}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['clean']
                  ]
                }}
                style={{ height: '150px', marginBottom: '60px' }}
              />
              {formik.touched.commentsToEditor && formik.errors.commentsToEditor && (
                <Typography color="error" variant="caption">
                  {formik.errors.commentsToEditor}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate(`/reviews/${id}`)}
                >
                  Скасувати
                </Button>
                
                <Button 
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {formik.isSubmitting ? <CircularProgress size={24} /> : 'Відправити рецензію'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CompleteReview;