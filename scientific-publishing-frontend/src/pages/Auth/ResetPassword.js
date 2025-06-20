import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  Box, Link, CircularProgress, Alert
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Пароль повинен містити щонайменше 8 символів')
    .required('Пароль обов\'язковий'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Паролі повинні співпадати')
    .required('Підтвердження пароля обов\'язкове')
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState(false);
  
  useEffect(() => {
    // Отримуємо токен з URL-параметрів
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    
    if (!tokenParam) {
      setTokenError(true);
      setError('Токен відновлення паролю не знайдений. Спробуйте запросити відновлення паролю ще раз.');
    } else {
      setToken(tokenParam);
    }
  }, [location]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      await AuthService.resetPassword(token, values.password);
      
      setSuccess('Ваш пароль успішно змінено');
      
      // Перенаправлення на сторінку входу через деякий час
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Не вдалося змінити пароль. Можливо, термін дії токена закінчився.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  if (tokenError) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper sx={{ p: 4 }} elevation={3}>
            <Typography variant="h4" align="center" gutterBottom>
              Помилка відновлення паролю
            </Typography>
            
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                component={RouterLink}
                to="/forgot-password"
                variant="contained"
                color="primary"
              >
                Запросити новий лист
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Встановлення нового паролю
          </Typography>
          
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Введіть новий пароль для вашого облікового запису
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field 
                  as={TextField}
                  name="password"
                  label="Новий пароль"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                
                <Field 
                  as={TextField}
                  name="confirmPassword"
                  label="Підтвердіть новий пароль"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Змінити пароль'}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;