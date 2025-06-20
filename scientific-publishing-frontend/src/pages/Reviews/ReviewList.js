import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button, 
  TextField, MenuItem, Divider, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Chip, Card, CardContent
} from '@mui/material';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import ReviewService from '../../services/review.service';

const ReviewList = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    articleId: '',
    reviewerId: ''
  });

  useEffect(() => {
    console.log(reviews);
  }, [])

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Якщо користувач є рецензентом, отримуємо його рецензії
      let queryFilters = {...filters};

      if (currentUser?.roles?.includes('reviewer') &&
          !currentUser?.roles?.includes('editor') &&
          !currentUser?.roles?.includes('admin')) {
        queryFilters.reviewerId = currentUser.id;
      }

      const response = await ReviewService.getReviews(queryFilters);
      setReviews(response[0] || []);
      setError('');
    } catch (err) {
      console.error('Помилка завантаження рецензій:', err);
      setError('Не вдалося завантажити рецензії. Будь ласка, спробуйте пізніше.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchReviews();
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      articleId: '',
      reviewerId: ''
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReview = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  const handleCreateReview = () => {
    navigate('/reviews/create');
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Рецензії
          </Typography>
          
          {(currentUser?.roles?.includes('editor') || currentUser?.roles?.includes('admin')) && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateReview}
            >
              Призначити рецензію
            </Button>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Фільтри */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Фільтри
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={16} md={12}>
                <TextField
                  select
                  name="status"
                  label="Статус"
                  value={filters.status}
                  onChange={handleFilterChange}
                  fullWidth
                >
                  <MenuItem value="">Всі</MenuItem>
                  <MenuItem value="pending">На розгляді</MenuItem>
                  <MenuItem value="completed">Завершені</MenuItem>
                  <MenuItem value="declined">Відхилені</MenuItem>
                  <MenuItem value="cancelled">Скасовані</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  name="articleId"
                  label="ID статті"
                  value={filters.articleId}
                  onChange={handleFilterChange}
                  fullWidth
                />
              </Grid>
              
              {(currentUser?.roles?.includes('editor') || currentUser?.roles?.includes('admin')) && (
                <Grid item xs={12} md={4}>
                  <TextField
                    name="reviewerId"
                    label="ID рецензента"
                    value={filters.reviewerId}
                    onChange={handleFilterChange}
                    fullWidth
                  />
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ mr: 1 }}
              >
                Очистити
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
              >
                Застосувати
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {/* Таблиця рецензій */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : reviews.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Стаття</TableCell>
                    <TableCell>Рецензент</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Термін виконання</TableCell>
                    <TableCell>Дії</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((review) => (
                      <TableRow key={review.id} hover>
                        <TableCell>
                          {review.article?.title || 'Невідома стаття'}
                        </TableCell>
                        <TableCell>
                          {review.anonymous ? 
                            'Анонімний рецензент' : 
                            review.reviewer ? 
                              `${review.reviewer.firstName} ${review.reviewer.lastName}` : 
                              'Невідомий рецензент'
                          }
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              review.status === 'pending' ? 'На розгляді' : 
                              review.status === 'completed' ? 'Завершено' :
                              review.status === 'declined' ? 'Відхилено' : 
                              'Скасовано'
                            }
                            color={getStatusColor(review.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(review.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewReview(review.id)}
                          >
                            Переглянути
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={reviews.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Рядків на сторінці:"
            />
          </>
        ) : (
          <Alert severity="info">
            Рецензії не знайдені. Спробуйте змінити фільтри або створіть нову рецензію.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ReviewList;