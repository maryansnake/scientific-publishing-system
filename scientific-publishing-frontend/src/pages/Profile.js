import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button, TextField,
  Avatar, Divider, CircularProgress, Alert, Tabs, Tab,
  List, ListItem, ListItemText, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Chip,
  ListItemButton, FormControlLabel, Switch, Card, CardContent
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import ArticleService from '../services/article.service';
import ReviewService from '../services/review.service';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userArticles, setUserArticles] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userData = await AuthService.getProfile();
        setProfileData(userData);
        
        // Load user articles
        if (userData?.roles?.includes('author')) {
          const articlesData = await ArticleService.getArticles({
            submitterId: userData.id
          });
          setUserArticles(articlesData?.data || []);
        }
        
        // Load user reviews
        if (userData?.roles?.includes('reviewer')) {
          const reviewsData = await ReviewService.getReviews({
            reviewerId: userData.id
          });
          setUserReviews(reviewsData?.data || []);
        }
      } catch (err) {
        setError('Failed to load profile information. Please try again later.');
        console.error(err);
        setUserArticles([]);
        setUserReviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('You have been logged out');
  };
  
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    institution: Yup.string(),
    orcidId: Yup.string(),
    academicDegree: Yup.string(),
    bio: Yup.string()
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Remove confirmPassword field before sending to API
      const { confirmPassword, ...updateData } = values;
      
      // Don't send password if it's empty
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await AuthService.updateProfile(updateData);
      setProfileData({ ...profileData, ...updateData });
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setConfirmDialogOpen(false);
    try {
      await AuthService.deleteAccount();
      logout();
      navigate('/');
      toast.success('Your account has been deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account. Please try again.');
    }
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
  
  if (error || !profileData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Profile not found'}</Alert>
      </Container>
    );
  }
  
  // Get display name with fallbacks to prevent "undefined undefined" issue
  const firstName = profileData.firstName || '';
  const lastName = profileData.lastName || '';
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'User';
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={displayName}
              src={profileData.avatar}
              sx={{ width: 80, height: 80, mr: 3 }}
            >
              {firstName ? firstName[0] : 'U'}
            </Avatar>
            
            <Box>
              <Typography variant="h4" gutterBottom>
                {displayName}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.roles && profileData.roles.map((role) => (
                  <Typography
                    key={role}
                    variant="caption"
                    sx={{ 
                      px: 1, 
                      py: 0.5, 
                      backgroundColor: 'primary.main', 
                      color: 'white',
                      borderRadius: 1
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          
          {!editMode && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={toggleEditMode}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
      
      {/* Profile Tabs */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" />
            {profileData?.roles?.includes('author') && <Tab label="My Articles" />}
            {profileData?.roles?.includes('reviewer') && <Tab label="My Reviews" />}
            <Tab label="Settings" />
          </Tabs>
        </Box>
        
        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          {editMode ? (
            <Formik
              initialValues={{
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                password: '',
                confirmPassword: '',
                institution: profileData.institution || '',
                orcidId: profileData.orcidId || '',
                academicDegree: profileData.academicDegree || '',
                bio: profileData.bio || ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  {/* Basic Information Section */}
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                        Basic Information
                      </Typography>
                      
                      <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="firstName"
                            label="First Name"
                            fullWidth
                            variant="outlined"
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="lastName"
                            label="Last Name"
                            fullWidth
                            variant="outlined"
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  
                  {/* Password Section */}
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                        Change Password
                      </Typography>
                      
                      <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="password"
                            label="New Password (leave blank to keep current)"
                            type="password"
                            fullWidth
                            variant="outlined"
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  
                  {/* Academic Information Section */}
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                        Academic Information
                      </Typography>
                      
                      <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="institution"
                            label="Institution"
                            fullWidth
                            variant="outlined"
                            error={touched.institution && Boolean(errors.institution)}
                            helperText={touched.institution && errors.institution}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="orcidId"
                            label="ORCID ID"
                            fullWidth
                            variant="outlined"
                            error={touched.orcidId && Boolean(errors.orcidId)}
                            helperText={touched.orcidId && errors.orcidId}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            name="academicDegree"
                            label="Academic Degree"
                            fullWidth
                            variant="outlined"
                            error={touched.academicDegree && Boolean(errors.academicDegree)}
                            helperText={touched.academicDegree && errors.academicDegree}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            name="bio"
                            label="Biography"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            error={touched.bio && Boolean(errors.bio)}
                            helperText={touched.bio && errors.bio}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  
                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={toggleEditMode}
                      size="large"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      size="large"
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  First Name
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.firstName || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Name
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.lastName || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.email || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Academic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Institution
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.institution || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  ORCID ID
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.orcidId || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Academic Degree
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.academicDegree || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Biography
                </Typography>
                <Typography variant="body1" paragraph>
                  {profileData.bio || 'No biography available'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        
        {/* My Articles Tab */}
        {profileData?.roles?.includes('author') && (
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                My Articles
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/articles/create')}
              >
                Create New Article
              </Button>
            </Box>
            
            {(userArticles?.length ?? 0) > 0 ? (
              <List>
                {userArticles.map((article) => (
                  <Paper key={article?.id || Math.random().toString()} sx={{ mb: 2 }}>
                    <ListItemButton onClick={() => navigate(`/articles/${article?.id}`)}>
                      <ListItemText
                        primary={article?.title || 'Untitled Article'}
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span" color="textSecondary">
                              Submitted: {article?.submissionDate ? new Date(article.submissionDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <br />
                            <Chip 
                              label={(article?.status || 'draft').replace('_', ' ')}
                              size="small"
                              color={
                                article?.status === 'published' ? 'success' :
                                article?.status === 'rejected' ? 'error' :
                                article?.status === 'revisions_needed' ? 'warning' : 'default'
                              }
                              sx={{ mt: 1 }}
                            />
                            {article?.journal && (
                              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Journal: {article.journal.title}
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                You haven't submitted any articles yet.
              </Alert>
            )}
          </TabPanel>
        )}
        
        {/* My Reviews Tab */}
        {profileData?.roles?.includes('reviewer') && (
          <TabPanel value={tabValue} index={profileData?.roles?.includes('author') ? 2 : 1}>
            <Typography variant="h6" gutterBottom>
              My Reviews
            </Typography>
            
            {(userReviews?.length ?? 0) > 0 ? (
              <List>
                {userReviews.map((review) => (
                  <Paper key={review?.id || Math.random().toString()} sx={{ mb: 2 }}>
                    <ListItemButton onClick={() => navigate(`/reviews/${review?.id}`)}>
                      <ListItemText
                        primary={review?.article?.title || 'Article Title'}
                        secondary={
                          <React.Fragment>
                            <Chip 
                              label={review?.status || 'pending'}
                              size="small"
                              color={
                                review?.status === 'completed' ? 'success' :
                                review?.status === 'declined' ? 'error' :
                                review?.status === 'pending' ? 'warning' : 'default'
                              }
                              sx={{ my: 1 }}
                            />
                            <Typography variant="body2" component="div">
                              Due: {review?.dueDate ? new Date(review.dueDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            {review?.status === 'completed' && review?.completionDate && (
                              <Typography variant="body2" component="div">
                                Completed: {new Date(review.completionDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                You don't have any reviews assigned yet.
              </Alert>
            )}
          </TabPanel>
        )}
        
        {/* Settings Tab */}
        <TabPanel value={tabValue} index={
          (profileData?.roles?.includes('author') && profileData?.roles?.includes('reviewer')) ? 3 :
          (profileData?.roles?.includes('author') || profileData?.roles?.includes('reviewer')) ? 2 : 1
        }>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Email Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={profileData?.emailNotifications || false}
                  onChange={async (e) => {
                    try {
                      await AuthService.updateProfile({
                        ...profileData,
                        emailNotifications: e.target.checked
                      });
                      setProfileData({
                        ...profileData,
                        emailNotifications: e.target.checked
                      });
                      toast.success('Notification settings updated');
                    } catch (err) {
                      toast.error('Failed to update notification settings');
                    }
                  }}
                />
              }
              label="Receive email notifications"
            />
          </Paper>
          
          <Paper sx={{ p: 3, bgcolor: '#fff8e1' }}>
            <Typography variant="subtitle1" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Typography variant="body2" paragraph>
              Permanently delete your account and all associated data.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Paper>
          
          {/* Confirm Dialog */}
          <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
          >
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteAccount} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
      </Box>
    </Container>
  );
};

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default Profile;