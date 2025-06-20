import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button,
  Divider, CircularProgress, Alert, Chip, Rating,
  Card, CardContent, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import ReviewService from '../../services/review.service';
import FileService from '../../services/file.service';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    fetchReviewData();
  }, [id]);

  const fetchReviewData = async () => {
    setLoading(true);
    try {
      const reviewData = await ReviewService.getReviewById(id);
      setReview(reviewData);
      setError('');
    } catch (err) {
      console.error('Помилка завантаження рецензії:', err);
      setError('Не вдалося завантажити рецензію. Будь ласка, спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = () => {
    navigate(`/reviews/${id}/complete`);
  };

  const handleDeclineReview = async () => {
    try {
      await ReviewService.updateReview(id, {
        status: 'declined',
        commentsToEditor: declineReason
      });
      toast.success('Рецензію відхилено');
      setReview({ ...review, status: 'declined' });
      setDeclineDialog(false);
    } catch (err) {
      toast.error('Не вдалося відхилити рецензію');
      console.error(err);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await ReviewService.deleteReview(id);
      toast.success('Рецензію видалено');
      navigate('/reviews');
    } catch (err) {
      toast.error('Не вдалося видалити рецензію');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'declined': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch(recommendation) {
      case 'accept': return 'success';
      case 'minor_revisions': return 'info';
      case 'major_revisions': return 'warning';
      case 'reject': return 'error';
      default: return 'default';
    }
  };

  const getRecommendationText = (recommendation) => {
    switch(recommendation) {
      case 'accept': return 'Прийняти без змін';
      case 'minor_revisions': return 'Прийняти з незначними виправленнями';
      case 'major_revisions': return 'Потрібні суттєві виправлення';
      case 'reject': return 'Відхилити';
      default: return 'Невідомо';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'На розгляді';
      case 'completed': return 'Завершено';
      case 'declined': return 'Відхилено';
      case 'cancelled': return 'Скасовано';
      default: return 'Невідомо';
    }
  };

  // Перевірка прав для дій з рецензією
  const canCompleteReview = () => {
    if (!review || !currentUser) return false;
    return review.reviewerId === currentUser.id && review.status === 'pending';
  };

  const canDeclineReview = () => {
    if (!review || !currentUser) return false;
    return review.reviewerId === currentUser.id && review.status === 'pending';
  };

  const canDeleteReview = () => {
    if (!review || !currentUser) return false;
    return currentUser.roles.includes('admin') || 
           (currentUser.roles.includes('editor') && review.status !== 'completed');
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

  if (error || !review) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Рецензію не знайдено'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Рецензія #{id.substring(0, 8)}
            </Typography>
            <Chip 
              label={getStatusText(review.status)}
              color={getStatusColor(review.status)} 
              sx={{ mr: 1 }}
            />
          </Box>
          
          <Box>
            {canCompleteReview() && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartReview}
                sx={{ mr: 1 }}
              >
                Заповнити рецензію
              </Button>
            )}
            
            {canDeclineReview() && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeclineDialog(true)}
                sx={{ mr: 1 }}
              >
                Відхилити
              </Button>
            )}
            
            {canDeleteReview() && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmDeleteDialog(true)}
              >
                Видалити
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Інформація про статтю
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {review.article?.title || 'Назва статті не вказана'}
                </Typography>
                
                {review.article?.abstract && (
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {review.article.abstract.substring(0, 300)}
                    {review.article.abstract.length > 300 ? '...' : ''}
                  </Typography>
                )}
                
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/articles/${review.articleId}`)}
                  sx={{ mt: 1 }}
                >
                  Перейти до статті
                </Button>
              </CardContent>
            </Card>
            
            {review.status === 'completed' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Рецензія
                </Typography>
                
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Рекомендація:
                      </Typography>
                      <Chip 
                        label={getRecommendationText(review.recommendation)}
                        color={getRecommendationColor(review.recommendation)}
                      />
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" align="center">
                          Якість
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Rating 
                            value={review.qualityScore / 2} 
                            precision={0.5} 
                            readOnly 
                          />
                        </Box>
                        <Typography variant="body2" align="center">
                          {review.qualityScore}/10
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" align="center">
                          Оригінальність
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Rating 
                            value={review.originalityScore / 2} 
                            precision={0.5} 
                            readOnly 
                          />
                        </Box>
                        <Typography variant="body2" align="center">
                          {review.originalityScore}/10
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" align="center">
                          Актуальність
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Rating 
                            value={review.relevanceScore / 2} 
                            precision={0.5} 
                            readOnly 
                          />
                        </Box>
                        <Typography variant="body2" align="center">
                          {review.relevanceScore}/10
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" align="center">
                          Ясність
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Rating 
                            value={review.clarityScore / 2} 
                            precision={0.5} 
                            readOnly 
                          />
                        </Box>
                        <Typography variant="body2" align="center">
                          {review.clarityScore}/10
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Коментарі для автора:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {review.commentsToAuthor || 'Коментарі відсутні'}
                      </Typography>
                    </Paper>
                    
                    {(currentUser?.roles?.includes('editor') || currentUser?.roles?.includes('admin')) && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Конфіденційні коментарі для редактора:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {review.commentsToEditor || 'Коментарі відсутні'}
                          </Typography>
                        </Paper>
                      </>
                    )}
                    
                    {review.fileUrl && (
                      <Button
                        variant="contained"
                        onClick={() => window.open(review.fileUrl)}
                      >
                        Завантажити файл рецензії
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            
            {review.status === 'declined' && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Причина відхилення:
                  </Typography>
                  <Typography variant="body1">
                    {review.commentsToEditor || 'Причина не вказана'}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Деталі призначення
            </Typography>
            
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Рецензент:
                  </Typography>
                  <Typography variant="body1">
                    {review.anonymous ? 
                      'Анонімний рецензент' : 
                      review.reviewer ? 
                        `${review.reviewer.firstName} ${review.reviewer.lastName}` : 
                        'Невідомий рецензент'
                    }
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Призначено:
                  </Typography>
                  <Typography variant="body1">
                    {review.assignedBy ? 
                      `${review.assignedBy.firstName} ${review.assignedBy.lastName}` : 
                      'Невідомо'
                    }
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Дата призначення:
                  </Typography>
                  <Typography variant="body1">
                    {review.createdAt ? 
                      new Date(review.createdAt).toLocaleDateString() : 
                      'Невідомо'
                    }
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Термін виконання:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(review.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {review.status === 'completed' && review.completionDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Дата завершення:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(review.completionDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Анонімність:
                  </Typography>
                  <Typography variant="body1">
                    {review.anonymous ? 'Так' : 'Ні'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/reviews')}
              sx={{ mt: 2 }}
            >
              Повернутися до списку
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Діалог підтвердження видалення */}
      <Dialog
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      >
        <DialogTitle>Видалити рецензію</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цю рецензію? Цю дію не можна буде скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>
            Скасувати
          </Button>
          <Button onClick={handleDeleteReview} color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Діалог відхилення рецензії */}
      <Dialog
        open={declineDialog}
        onClose={() => setDeclineDialog(false)}
      >
        <DialogTitle>Відхилити рецензію</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Будь ласка, вкажіть причину відхилення рецензії:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Причина"
            fullWidth
            multiline
            rows={4}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialog(false)}>
            Скасувати
          </Button>
          <Button 
            onClick={handleDeclineReview}
            color="error"
            disabled={!declineReason.trim()}
          >
            Відхилити
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewDetail;