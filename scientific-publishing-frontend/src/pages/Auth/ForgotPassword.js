import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  Box, Link, CircularProgress, Alert
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Введіть правильну електронну адресу')
    .required('Електронна адреса обов\'язкова')
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      await AuthService.forgotPassword(values.email);
      
      setSuccess('Інструкції щодо відновлення паролю відправлені на вашу електронну пошту');
      
      // Перенаправлення на сторінку входу через деякий час
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Не вдалося відправити запит на відновлення паролю. Спробуйте пізніше.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Відновлення паролю
          </Typography>
          
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Введіть вашу електронну адресу, і ми відправимо вам інструкції для відновлення паролю
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
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field 
                  as={TextField}
                  name="email"
                  label="Електронна пошта"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
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
                  {isSubmitting ? <CircularProgress size={24} /> : 'Відновити пароль'}
                </Button>
              </Form>
            )}
          </Formik>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Згадали свій пароль?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Увійти
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;