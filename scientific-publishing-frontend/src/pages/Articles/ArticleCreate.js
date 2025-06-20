import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Grid, Divider, CircularProgress, Alert, MenuItem, 
  Stepper, Step, StepLabel, Chip, IconButton,
  FormControlLabel, Checkbox, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import JournalService from '../../services/journal.service';
import ArticleService from '../../services/article.service';
import FileService from '../../services/file.service';
import UserService from '../../services/user.service';

const ArticleCreate = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Load journals when component mounts
  useEffect(() => {
    const fetchJournals = async () => {
      setLoading(true);
      try {
        const response = await JournalService.getJournals();
        
        setJournals(response[0]);
      } catch (err) {
        setError('Не вдалося завантажити журнали. Будь ласка, спробуйте пізніше.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournals();
  }, []);
  
  const steps = ['Вибір журналу', 'Деталі статті', 'Автори', 'Завантаження файлів', 'Перегляд і подання'];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const searchAuthors = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await UserService.searchUsers({ search: searchTerm });
      setSearchResults(response.data.filter(user => user.id !== currentUser.id));
    } catch (err) {
      console.error('Помилка пошуку авторів:', err);
    } finally {
      setSearchLoading(false);
    }
  };
  
  const handleFileUpload = async (e, setFieldValue) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    
    try {
      const response = await FileService.uploadFile(formData);
      console.log(response);
      const newFile = {
        filename: response.filename,
        fileUrl: response.url,
        fileSize: response.size,
        mimeType: response.mimetype,
        fileType: 'manuscript', // Default type
        description: '',
      };
      
      setUploadedFiles([...uploadedFiles, newFile]);
      toast.success('Файл успішно завантажено');
    } catch (err) {
      toast.error('Не вдалося завантажити файл');
      console.error(err);
    } finally {
      setUploading(false);
      // Clear file input
      e.target.value = null;
    }
  };
  
  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };
  
  const initialValues = {
    title: '',
    abstract: '',
    keywords: [],
    type: 'research',
    journalId: '',
    authors: [
      {
        userId: currentUser.id,
        order: 1,
        isCorresponding: true
      }
    ]
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Назва статті обов\'язкова'),
    abstract: Yup.string().required('Анотація обов\'язкова'),
    keywords: Yup.array().min(3, 'Вкажіть принаймні 3 ключові слова'),
    type: Yup.string().required('Тип статті обов\'язковий'),
    journalId: Yup.string().required('Журнал обов\'язковий'),
    authors: Yup.array()
      .min(1, 'Вкажіть принаймні одного автора')
      .of(
        Yup.object().shape({
          userId: Yup.string().required('Автор обов\'язковий'),
          order: Yup.number().required('Порядок обов\'язковий'),
          isCorresponding: Yup.boolean()
        })
      )
  });
  
  const handleSubmit = async (values) => {
    console.log(values)
    setSubmitting(true);
    setError('');
    
    try {
      // Add submitter ID and date
      const submissionData = {
        ...values,
        submitterId: currentUser.id,
        submissionDate: new Date().toISOString()
      };
      
      // Create the article
      
      const articleResponse = await ArticleService.createArticle(submissionData);
      const articleId = articleResponse.id;
      
      // Upload files with article ID
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          await ArticleService.createArticleFile({
            ...file,
            articleId
          });
        }
      }
      
      toast.success('Статтю успішно подано!');
      navigate(`/articles/${articleId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Не вдалося подати статтю. Будь ласка, спробуйте знову.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Подати нову статтю
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, isValid }) => (
              <Form>
                {/* Step 1: Select Journal */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Вибір журналу
                    </Typography>
                    
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
                      onChange={(e) => {
                        setFieldValue('journalId', e.target.value);
                        const selectedJournal = journals.find(j => j.id === e.target.value);
                        setSelectedJournal(selectedJournal);
                      }}
                    >
                      {journals.map((journal) => (
                        <MenuItem key={journal.id} value={journal.id}>
                          {journal.title}
                        </MenuItem>
                      ))}
                    </Field>
                    
                    {selectedJournal && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="subtitle1">
                          {selectedJournal.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {selectedJournal.description}
                        </Typography>
                        
                        {selectedJournal.submissionGuidelines && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">
                              Правила подання:
                            </Typography>
                            <Typography variant="body2">
                              {selectedJournal.submissionGuidelines}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
                
                {/* Step 2: Article Details */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Деталі статті
                    </Typography>
                    
                    <Field
                      as={TextField}
                      name="title"
                      label="Назва"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                    />
                    
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
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
                      <Typography color="error" variant="caption">
                        {errors.abstract}
                      </Typography>
                    )}
                    
                    <Box sx={{ mt: 6 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Ключові слова (через кому)
                      </Typography>
                      <Field
                        as={TextField}
                        name="keywords"
                        fullWidth
                        variant="outlined"
                        placeholder="наприклад, машинне навчання, штучний інтелект, нейронні мережі"
                        onChange={(e) => {
                          const keywords = e.target.value
                            .split(',')
                            .map(keyword => keyword.trim())
                            .filter(Boolean);
                          setFieldValue('keywords', keywords);
                        }}
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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
                  </Box>
                )}
                
                {/* Step 3: Authors */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Автори
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Додайте всіх авторів, які зробили внесок у цю статтю. Ви автоматично додані як перший автор.
                    </Typography>
                    
                    <FieldArray name="authors">
                      {({ remove, push }) => (
                        <Box>
                          {values.authors.map((author, index) => (
                            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle1">
                                  Автор #{index + 1}
                                </Typography>
                                {index !== 0 && (
                                  <IconButton 
                                    size="small" 
                                    color="error" 
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>
                              
                              {index === 0 ? (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2">
                                    {`${currentUser.firstName} ${currentUser.lastName}`} (Ви)
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {currentUser.email}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box sx={{ mb: 2 }}>
                                  <TextField
                                    label="Пошук автора за іменем або електронною поштою"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => searchAuthors(e.target.value)}
                                  />
                                  
                                  {searchLoading && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                      <CircularProgress size={20} />
                                    </Box>
                                  )}
                                  
                                  {searchResults.length > 0 && (
                                    <Box sx={{ mt: 1, maxHeight: '150px', overflow: 'auto' }}>
                                      {searchResults.map((user) => (
                                        <Box
                                          key={user.id}
                                          sx={{ 
                                            p: 1, 
                                            cursor: 'pointer', 
                                            '&:hover': { bgcolor: 'action.hover' } 
                                          }}
                                          onClick={() => {
                                            setFieldValue(`authors.${index}.userId`, user.id);
                                            setSearchResults([]);
                                          }}
                                        >
                                          <Typography variant="body2">
                                            {`${user.firstName} ${user.lastName}`}
                                          </Typography>
                                          <Typography variant="caption" color="textSecondary">
                                            {user.email}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              )}
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Field
                                  as={TextField}
                                  name={`authors.${index}.order`}
                                  label="Порядок"
                                  type="number"
                                  InputProps={{ inputProps: { min: 1 } }}
                                  sx={{ width: '100px', mr: 2 }}
                                />
                                
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.authors[index].isCorresponding}
                                      onChange={() => {
                                        // Uncheck all other authors first
                                        values.authors.forEach((_, i) => {
                                          if (i !== index) {
                                            setFieldValue(`authors.${i}.isCorresponding`, false);
                                          }
                                        });
                                        // Toggle current author
                                        setFieldValue(
                                          `authors.${index}.isCorresponding`, 
                                          !values.authors[index].isCorresponding
                                        );
                                      }}
                                    />
                                  }
                                  label="Автор для листування"
                                />
                              </Box>
                            </Box>
                          ))}
                          
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => push({
                              userId: '',
                              order: values.authors.length + 1,
                              isCorresponding: false
                            })}
                          >
                            Додати співавтора
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                  </Box>
                )}
                
                {/* Step 4: Upload Files */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Завантаження файлів
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                      Завантажте ваш рукопис та допоміжні файли (рисунки, таблиці, додаткові матеріали).
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <input
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        id="manuscript-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, setFieldValue)}
                        disabled={uploading}
                      />
                      <label htmlFor="manuscript-upload">
                        <Button
                          variant="contained"
                          component="span"
                          disabled={uploading}
                        >
                          {uploading ? <CircularProgress size={24} /> : 'Завантажити файл'}
                        </Button>
                      </label>
                    </Box>
                    
                    {uploadedFiles.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Завантажені файли:
                        </Typography>
                        <List>
                          {uploadedFiles.map((file, index) => (
                            <ListItem
                              key={index}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <ListItemIcon>
                                <DescriptionIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={file.filename}
                                secondary={`Розмір: ${(file.fileSize / 1024 / 1024).toFixed(2)} МБ`}
                              />
                              <TextField
                                select
                                size="small"
                                label="Тип файлу"
                                value={file.fileType}
                                onChange={(e) => {
                                  const updatedFiles = [...uploadedFiles];
                                  updatedFiles[index].fileType = e.target.value;
                                  setUploadedFiles(updatedFiles);
                                }}
                                sx={{ width: '200px', mx: 2 }}
                              >
                                <MenuItem value="manuscript">Рукопис</MenuItem>
                                <MenuItem value="supplementary">Додатковий матеріал</MenuItem>
                                <MenuItem value="figure">Рисунок</MenuItem>
                                <MenuItem value="table">Таблиця</MenuItem>
                                <MenuItem value="dataset">Набір даних</MenuItem>
                                <MenuItem value="other">Інше</MenuItem>
                              </TextField>
                              <TextField
                                size="small"
                                label="Опис"
                                value={file.description}
                                onChange={(e) => {
                                  const updatedFiles = [...uploadedFiles];
                                  updatedFiles[index].description = e.target.value;
                                  setUploadedFiles(updatedFiles);
                                }}
                                sx={{ width: '200px' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                    
                    {uploadedFiles.length === 0 && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Будь ласка, завантажте принаймні один файл з вашим рукописом.
                      </Alert>
                    )}
                  </Box>
                )}
                
                {/* Step 5: Review & Submit */}
                {activeStep === 4 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Перегляд і подання
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1">Деталі статті</Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography variant="body2" color="textSecondary">Журнал:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="body2">
                            {journals.find(j => j.id === values.journalId)?.title || 'Невідомий журнал'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={3}>
                          <Typography variant="body2" color="textSecondary">Назва:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="body2">{values.title}</Typography>
                        </Grid>
                        
                        <Grid item xs={3}>
                          <Typography variant="body2" color="textSecondary">Тип:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="body2">
                            {values.type.replace('_', ' ').charAt(0).toUpperCase() + values.type.replace('_', ' ').slice(1)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={3}>
                          <Typography variant="body2" color="textSecondary">Ключові слова:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {values.keywords.map((keyword, index) => (
                              <Chip key={index} label={keyword} size="small" />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1">Автори</Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {values.authors.map((author, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            {index === 0 ? `${currentUser.firstName} ${currentUser.lastName}` : 'Співавтор'}
                            {author.isCorresponding ? ' (Автор для листування)' : ''}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Порядок: {author.order}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1">Файли</Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {uploadedFiles.map((file, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {file.filename} ({file.fileType})
                          </Typography>
                          {file.description && (
                            <Typography variant="caption" color="textSecondary">
                              {file.description}
                            </Typography>
                          )}
                        </Box>
                      ))}
                      
                      {uploadedFiles.length === 0 && (
                        <Typography variant="body2" color="error">
                          Файли не завантажені.
                        </Typography>
                      )}
                    </Box>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Подаючи цю статтю, ви підтверджуєте, що вся інформація є коректною та всі автори схвалили подання.
                    </Alert>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Назад
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting || uploadedFiles.length === 0}
                    >
                      {submitting ? <CircularProgress size={24} /> : 'Подати статтю'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={
                        (activeStep === 0 && !values.journalId) ||
                        (activeStep === 1 && (!values.title || !values.abstract || values.keywords.length < 3)) ||
                        (activeStep === 3 && uploadedFiles.length === 0)
                      }
                    >
                      Далі
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
  );
};

export default ArticleCreate;