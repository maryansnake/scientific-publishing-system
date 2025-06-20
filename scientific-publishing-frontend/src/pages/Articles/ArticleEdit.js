import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Grid, Divider, CircularProgress, Alert, MenuItem, 
  Chip, IconButton, List, ListItem, ListItemText,
  ListItemIcon, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import ArticleService from '../../services/article.service';
import JournalService from '../../services/journal.service';
import FileService from '../../services/file.service';

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [journals, setJournals] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        // Fetch article data
        const articleData = await ArticleService.getArticleById(id);
        setArticle(articleData);
        
        // Fetch journals
        const journalResponse = await JournalService.getJournals();
        setJournals(journalResponse.data);
        
        // Fetch article files
        const filesResponse = await ArticleService.getArticleFiles(id);
        setFiles(filesResponse.data);
        
      } catch (err) {
        setError('Не вдалося завантажити статтю. Будь ласка, спробуйте пізніше.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticleData();
  }, [id]);
  
  const canEdit = () => {
    if (!currentUser || !article) return false;
    
    // Submitter can edit if article is in draft or revisions_needed status
    if (article.submitterId === currentUser.id && 
        (article.status === 'draft' || article.status === 'revisions_needed')) {
      return true;
    }
    
    // Editors and admins can always edit
    return currentUser.roles?.includes('editor') || currentUser.roles?.includes('admin');
  };
  
  const handleFileUpload = async (e) => {
    const fileToUpload = e.target.files[0];
    if (!fileToUpload) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('articleId', id);
    formData.append('fileType', 'manuscript'); // Default file type
    
    try {
      await ArticleService.uploadFile(formData);
      
      // Refresh file list
      const filesResponse = await ArticleService.getArticleFiles(id);
      setFiles(filesResponse.data);
      
      toast.success('Файл успішно завантажено');
    } catch (err) {
      toast.error('Не вдалося завантажити файл');
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = null; // Clear file input
    }
  };
  
  const handleDeleteFile = async (fileId) => {
    try {
      await ArticleService.deleteFile(fileId);
      
      // Update files list
      setFiles(files.filter(file => file.id !== fileId));
      
      toast.success('Файл видалено');
    } catch (err) {
      toast.error('Не вдалося видалити файл');
      console.error(err);
    }
  };
  
  const handleUpdateFileType = async (fileId, newType) => {
    try {
      await ArticleService.updateFile(fileId, { fileType: newType });
      
      // Update file type in local state
      setFiles(files.map(file => 
        file.id === fileId ? { ...file, fileType: newType } : file
      ));
      
      toast.success('Тип файлу оновлено');
    } catch (err) {
      toast.error('Не вдалося оновити тип файлу');
      console.error(err);
    }
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Назва статті обов\'язкова'),
    abstract: Yup.string().required('Анотація обов\'язкова'),
    keywords: Yup.array().min(3, 'Вкажіть принаймні 3 ключові слова'),
    type: Yup.string().required('Тип статті обов\'язковий'),
    journalId: Yup.string().required('Журнал обов\'язковий'),
  });
  
  const handleSubmit = async (values) => {
    if (!canEdit()) {
      toast.error('У вас немає прав на редагування цієї статті');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await ArticleService.updateArticle(id, values);
      toast.success('Статтю успішно оновлено');
      navigate(`/articles/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Не вдалося оновити статтю. Спробуйте пізніше.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
  
  if (!article) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Статтю не знайдено'}
        </Alert>
      </Container>
    );
  }
  
  if (!canEdit()) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          У вас немає прав на редагування цієї статті.
        </Alert>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/articles/${id}`)}
            startIcon={<ArrowBackIcon />}
          >
            Повернутися до статті
          </Button>
        </Box>
      </Container>
    );
  }
  
  const initialValues = {
    title: article.title,
    abstract: article.abstract,
    keywords: article.keywords || [],
    type: article.type || 'research',
    journalId: article.journalId,
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          edge="start" 
          sx={{ mr: 1 }}
          onClick={() => navigate(`/articles/${id}`)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Редагування статті
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                  <Typography variant="h6" gutterBottom>
                    Основна інформація
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Field
                    as={TextField}
                    name="title"
                    label="Назва статті"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  
                  <Field
                    as={TextField}
                    name="journalId"
                    select
                    label="Журнал"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.journalId && Boolean(errors.journalId)}
                    helperText={touched.journalId && errors.journalId}
                  >
                    {journals.map((journal) => (
                      <MenuItem key={journal.id} value={journal.id}>
                        {journal.title}
                      </MenuItem>
                    ))}
                  </Field>
                  
                  <Field
                    as={TextField}
                    name="type"
                    select
                    label="Тип статті"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.type && Boolean(errors.type)}
                    helperText={touched.type && errors.type}
                  >
                    <MenuItem value="research">Дослідницька стаття</MenuItem>
                    <MenuItem value="review">Оглядова стаття</MenuItem>
                    <MenuItem value="case_study">Дослідження випадку</MenuItem>
                    <MenuItem value="opinion">Думка</MenuItem>
                    <MenuItem value="short_communication">Коротке повідомлення</MenuItem>
                    <MenuItem value="technical_note">Технічна примітка</MenuItem>
                    <MenuItem value="other">Інше</MenuItem>
                  </Field>
                  
                  <Box sx={{ mt: 3, mb: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Ключові слова (мінімум 3)
                    </Typography>
                    <Field
                      as={TextField}
                      name="keywords_text"
                      fullWidth
                      variant="outlined"
                      placeholder="Введіть ключові слова через кому"
                      defaultValue={values.keywords.join(', ')}
                      onChange={(e) => {
                        const keywords = e.target.value
                          .split(',')
                          .map(keyword => keyword.trim())
                          .filter(Boolean);
                        setFieldValue('keywords', keywords);
                      }}
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {values.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" />
                      ))}
                    </Box>
                    {touched.keywords && errors.keywords && (
                      <Typography color="error" variant="caption">
                        {errors.keywords}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Анотація
                    </Typography>
                    <ReactQuill
                      theme="snow"
                      value={values.abstract}
                      onChange={(content) => setFieldValue('abstract', content)}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{'list': 'ordered'}, {'list': 'bullet'}],
                          ['clean']
                        ]
                      }}
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                    {touched.abstract && errors.abstract && (
                      <Typography color="error" variant="caption" sx={{ mt: 6, display: 'block' }}>
                        {errors.abstract}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/articles/${id}`)}
                    >
                      Скасувати
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      Зберегти зміни
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Файли
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph>
                Завантажте додаткові файли або оновлені версії вашої статті.
              </Typography>
              
              <Box>
                <input
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={20} /> : <AddIcon />}
                  >
                    Завантажити файл
                  </Button>
                </label>
              </Box>
            </Box>
            
            {files.length > 0 ? (
              <List>
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      mb: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={file.filename} 
                        secondary={`${(file.fileSize / 1024 / 1024).toFixed(2)} МБ`} 
                      />
                      <IconButton edge="end" onClick={() => handleDeleteFile(file.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ width: '100%', mt: 1, pl: 7 }}>
                      <TextField
                        select
                        size="small"
                        label="Тип файлу"
                        value={file.fileType}
                        fullWidth
                        onChange={(e) => handleUpdateFileType(file.id, e.target.value)}
                      >
                        <MenuItem value="manuscript">Рукопис</MenuItem>
                        <MenuItem value="supplementary">Додатковий матеріал</MenuItem>
                        <MenuItem value="figure">Рисунок</MenuItem>
                        <MenuItem value="table">Таблиця</MenuItem>
                        <MenuItem value="dataset">Набір даних</MenuItem>
                        <MenuItem value="revised_version">Переглянута версія</MenuItem>
                        <MenuItem value="other">Інше</MenuItem>
                      </TextField>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                Немає завантажених файлів
              </Alert>
            )}
          </Paper>
          
          <Paper sx={{ p: 3, bgcolor: '#fff8e1' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Увага
            </Typography>
            <Typography variant="body2" paragraph>
              Редагування опублікованих статей може вимагати додаткового перегляду.
            </Typography>
            <Typography variant="body2">
              Після внесення змін стаття може потребувати повторного розгляду редакцією.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Відхилити зміни?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете відхилити всі внесені зміни? Цю дію неможливо скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Ні
          </Button>
          <Button onClick={() => navigate(`/articles/${id}`)} color="error">
            Так, відхилити
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ArticleEdit;