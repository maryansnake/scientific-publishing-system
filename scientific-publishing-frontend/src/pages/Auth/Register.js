import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Paper, Typography, TextField, Button, 
  Box, Link, Divider, CircularProgress, Alert,
  FormControlLabel, Checkbox, FormHelperText, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  roles: Yup.array()
    .min(1, 'Please select at least one role')
    .required('Role is required'),
  institution: Yup.string()
    .optional(),
  orcidId: Yup.string()
    .optional(),
  academicDegree: Yup.string()
    .optional(),
  bio: Yup.string()
    .optional(),
  termsAccepted: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');
      
      // Remove confirmPassword and termsAccepted from the data sent to API
      const { confirmPassword, termsAccepted, ...registerData } = values;
      
      await AuthService.register(registerData);
      
      setSuccess('Registration successful! Please check your email to verify your account.');
      resetForm();
      
      // Navigate to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Create your Scientific Publishing System account
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
            initialValues={{ 
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              roles: ['author'], // Default role
              institution: '',
              orcidId: '',
              academicDegree: '',
              bio: '',
              termsAccepted: false
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Field 
                    as={TextField}
                    name="firstName"
                    label="First Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  
                  <Field 
                    as={TextField}
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Box>
                
                <Field 
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Field 
                    as={TextField}
                    name="password"
                    label="Password"
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
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                </Box>
                
                <FormControl 
                  fullWidth 
                  margin="normal" 
                  error={touched.roles && Boolean(errors.roles)}
                >
                  <InputLabel id="roles-label">Roles</InputLabel>
                  <Select
                    labelId="roles-label"
                    multiple
                    value={values.roles}
                    onChange={(e) => setFieldValue('roles', e.target.value)}
                    label="Roles"
                  >
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="reviewer">Reviewer</MenuItem>
                    <MenuItem value="reader">Reader</MenuItem>
                  </Select>
                  {touched.roles && errors.roles && (
                    <FormHelperText>{errors.roles}</FormHelperText>
                  )}
                </FormControl>
                
                <Field 
                  as={TextField}
                  name="institution"
                  label="Institution (Optional)"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.institution && Boolean(errors.institution)}
                  helperText={touched.institution && errors.institution}
                />
                
                <Field 
                  as={TextField}
                  name="orcidId"
                  label="ORCID ID (Optional)"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.orcidId && Boolean(errors.orcidId)}
                  helperText={touched.orcidId && errors.orcidId}
                />
                
                <Field 
                  as={TextField}
                  name="academicDegree"
                  label="Academic Degree (Optional)"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.academicDegree && Boolean(errors.academicDegree)}
                  helperText={touched.academicDegree && errors.academicDegree}
                />
                
                <Field 
                  as={TextField}
                  name="bio"
                  label="Biography (Optional)"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={touched.bio && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.termsAccepted}
                      onChange={(e) => setFieldValue('termsAccepted', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I agree to the terms and conditions"
                />
                {touched.termsAccepted && errors.termsAccepted && (
                  <FormHelperText error>{errors.termsAccepted}</FormHelperText>
                )}
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              </Form>
            )}
          </Formik>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;