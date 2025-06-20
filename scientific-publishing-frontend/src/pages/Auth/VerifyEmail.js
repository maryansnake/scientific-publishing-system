import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button,
  CircularProgress, Alert
} from '@mui/material';
import AuthService from '../../services/auth.service';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const verifyEmailToken = async () => {
      // Отримуємо токен з URL-параметрів
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      if (!token) {
        setVerifying(false);
        setError('Токен підтвердження не знайдений.');
        return;
      }
      
      try {
        await AuthService.verifyEmail(token);
        setSuccess(true);
        
        // Перенаправлення на сторінку входу через деякий час
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError(
          err.response?.data?.message || 
          'Не вдалося підтвердити електронну пошту. Можливо, термін дії токена закінчився.'
        );
      } finally {
        setVerifying(false);
      }
    };
    
    verifyEmailToken();
  }, [location, navigate]);
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Підтвердження електронної пошти
          </Typography>
          
          {verifying && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {!verifying && success && (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Вашу електронну пошту підтверджено успішно!
              </Alert>
              <Typography align="center">
                Зараз вас буде перенаправлено на сторінку входу...
              </Typography>
            </>
          )}
          
          {!verifying && !success && (
            <>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                >
                  Перейти на сторінку входу
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;