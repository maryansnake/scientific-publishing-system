import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Доступ заборонено
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          У вас немає доступу до цієї сторінки. Будь ласка, переконайтеся, що ви увійшли в систему та маєте відповідні права доступу.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Повернутися на головну
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
          >
            Увійти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;