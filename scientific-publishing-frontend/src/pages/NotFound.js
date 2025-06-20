import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Сторінку не знайдено
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
          >
            Повернутися на головну
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;