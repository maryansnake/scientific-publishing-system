import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Button,
  CircularProgress, Alert, Divider, Switch,
  FormControlLabel, TextField
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'uk',
    siteSettings: {}
  });
  
  useEffect(() => {
    // У реальному додатку ми б завантажували налаштування з API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // В реальному додатку зберігаємо налаштування через API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Налаштування успішно збережено');
    } catch (err) {
      setError('Помилка збереження налаштувань');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prevSettings => ({
      ...prevSettings,
      [field]: value
    }));
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Налаштування системи
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Налаштування користувача
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                  color="primary"
                />
              }
              label="Отримувати сповіщення електронною поштою"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleChange('darkMode')}
                  color="primary"
                />
              }
              label="Темна тема"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Мова інтерфейсу"
              value={settings.language}
              onChange={handleChange('language')}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      
      {currentUser?.roles?.includes('admin') && (
        <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Налаштування адміністратора
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Назва сайту"
                value={settings.siteSettings.siteName || 'Наукові публікації'}
                onChange={(e) => setSettings({
                  ...settings,
                  siteSettings: { ...settings.siteSettings, siteName: e.target.value }
                })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Контактна електронна пошта"
                value={settings.siteSettings.contactEmail || 'contact@example.com'}
                onChange={(e) => setSettings({
                  ...settings,
                  siteSettings: { ...settings.siteSettings, contactEmail: e.target.value }
                })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.siteSettings.enableRegistration || true}
                    onChange={(e) => setSettings({
                      ...settings,
                      siteSettings: { ...settings.siteSettings, enableRegistration: e.target.checked }
                    })}
                    color="primary"
                  />
                }
                label="Дозволити реєстрацію нових користувачів"
              />
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : 'Зберегти налаштування'}
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;