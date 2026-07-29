import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
  Stack,
  Slider,
  Chip
} from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import { contentService } from '../services/api';
import { profileFields } from '../config/profileFields';

const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  aadharNumber: z.string().min(10, 'Aadhaar / ID number is required')
});

const step2Schema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone must be at least 10 digits'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters')
});

const step3Schema = z.object({
  annualIncome: z.coerce.number().min(0, 'Income must be non-negative'),
  employmentType: z.string().min(1, 'Employment type is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  familyMembers: z.coerce.number().min(1, 'Must have at least 1 family member'),
  bplCardStatus: z.boolean(),
  casteCategory: z.string().min(1, 'Caste category is required'),
  educationLevel: z.string().min(1, 'Education level is required')
});

const steps = ['Personal Info', 'Contact & Location', 'Economic Status', 'Review & Submit'];

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [activeStep, setActiveStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(null);

  const getStepSchema = (step) => {
    switch (step) {
      case 0: return step1Schema;
      case 1: return step2Schema;
      case 2: return step3Schema;
      default: return z.object({});
    }
  };

  const methods = useForm({
    resolver: zodResolver(getStepSchema(activeStep)),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Indian',
      aadharNumber: '',
      email: user?.email || '',
      phoneNumber: '',
      state: 'Maharashtra',
      district: 'Mumbai',
      pincode: '400001',
      address: '',
      annualIncome: 450000,
      employmentType: 'Salaried',
      occupation: 'Technician',
      familyMembers: 4,
      bplCardStatus: false,
      casteCategory: 'General',
      educationLevel: 'Graduate'
    }
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const formData = watch();

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await contentService.getProfile();
        if (profile) {
          Object.keys(profile).forEach(key => {
            if (profile[key] !== undefined) {
              setValue(key, profile[key]);
            }
          });
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    }
    loadProfile();
  }, [setValue]);

  const dob = watch('dateOfBirth');
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      const calculated = Math.abs(ageDate.getUTCFullYear() - 1970);
      setCalculatedAge(calculated);
    }
  }, [dob]);

  const handleNext = async (data) => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      try {
        await contentService.updateProfile(data);
        useAuthStore.getState().setProfileCompletion(100);
        setSubmitSuccess(true);
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
        Citizen Profile Questionnaire
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Database-driven 15+ datapoints system used for AI scheme matching and auto-filling official application forms.
      </Typography>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSubmitSuccess(false)}>
          Profile submitted and synced to database! AI scheme match score is updated.
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleNext)}>
                  {/* Step 1: Personal Info */}
                  {activeStep === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">Personal Details</Typography>
                      {profileFields.personal.map((field) => {
                        if (field.type === 'text' || field.type === 'date') {
                          return (
                            <TextField
                              key={field.name}
                              fullWidth
                              type={field.type}
                              label={field.label}
                              InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                              {...methods.register(field.name)}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message || (field.name === 'dateOfBirth' && calculatedAge !== null ? `Calculated Age: ${calculatedAge} yrs` : '')}
                            />
                          );
                        }
                        if (field.type === 'radio') {
                          return (
                            <FormControl key={field.name} error={!!errors[field.name]}>
                              <FormLabel>{field.label}</FormLabel>
                              <RadioGroup row {...methods.register(field.name)}>
                                {field.options.map(opt => (
                                  <FormControlLabel key={opt} value={opt} control={<Radio color="secondary" />} label={opt} />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          );
                        }
                        if (field.type === 'select') {
                          return (
                            <FormControl key={field.name} fullWidth error={!!errors[field.name]}>
                              <InputLabel>{field.label}</InputLabel>
                              <Select label={field.label} {...methods.register(field.name)} defaultValue={watch(field.name) || ""}>
                                {field.options.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        }
                        return null;
                      })}
                    </Box>
                  )}

                  {/* Step 2: Contact Details */}
                  {activeStep === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">Contact & Location Information</Typography>
                      {profileFields.contact.map((field) => {
                        if (field.type === 'email' || field.type === 'tel' || field.type === 'text') {
                          return (
                            <TextField
                              key={field.name}
                              fullWidth
                              disabled={field.disabled}
                              label={field.label}
                              {...methods.register(field.name)}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message}
                            />
                          );
                        }
                        if (field.type === 'textarea') {
                          return (
                            <TextField
                              key={field.name}
                              fullWidth
                              multiline
                              rows={3}
                              label={field.label}
                              {...methods.register(field.name)}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message}
                            />
                          );
                        }
                        if (field.type === 'select') {
                          const opts = Array.isArray(field.options) ? field.options : ["Maharashtra", "Tamil Nadu", "Delhi", "Gujarat", "Karnataka", "Other"];
                          return (
                            <FormControl key={field.name} fullWidth error={!!errors[field.name]}>
                              <InputLabel>{field.label}</InputLabel>
                              <Select label={field.label} {...methods.register(field.name)} defaultValue={watch(field.name) || ""}>
                                {opts.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        }
                        return null;
                      })}
                    </Box>
                  )}

                  {/* Step 3: Economic Status */}
                  {activeStep === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">Economic & Socio Demographic Details</Typography>
                      {profileFields.economic.map((field) => {
                        if (field.type === 'range') {
                          return (
                            <Box key={field.name}>
                              <Typography variant="subtitle2" gutterBottom>
                                {field.label}: <strong>₹{Number(watch(field.name) || 0).toLocaleString()}</strong>
                              </Typography>
                              <Slider
                                value={Number(watch(field.name) || 0)}
                                onChange={(_, val) => setValue(field.name, val)}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                valueLabelDisplay="auto"
                                color="secondary"
                              />
                            </Box>
                          );
                        }
                        if (field.type === 'number' || field.type === 'text') {
                          return (
                            <TextField
                              key={field.name}
                              fullWidth
                              type={field.type}
                              label={field.label}
                              {...methods.register(field.name)}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message}
                            />
                          );
                        }
                        if (field.type === 'boolean') {
                          return (
                            <Box key={field.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                              <Typography fontWeight="500">{field.label}</Typography>
                              <Switch
                                checked={!!watch(field.name)}
                                onChange={(e) => setValue(field.name, e.target.checked)}
                                color="secondary"
                              />
                            </Box>
                          );
                        }
                        if (field.type === 'select') {
                          return (
                            <FormControl key={field.name} fullWidth error={!!errors[field.name]}>
                              <InputLabel>{field.label}</InputLabel>
                              <Select label={field.label} {...methods.register(field.name)} defaultValue={watch(field.name) || ""}>
                                {field.options.map(opt => (
                                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        }
                        return null;
                      })}
                    </Box>
                  )}

                  {/* Step 4: Review */}
                  {activeStep === 3 && (
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
                        Review Your Submitted Information
                      </Typography>
                      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell fontWeight="bold">Full Name</TableCell>
                              <TableCell>{formData.fullName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Date of Birth</TableCell>
                              <TableCell>{formData.dateOfBirth} ({calculatedAge || 0} years)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Gender / Marital</TableCell>
                              <TableCell>{formData.gender} / {formData.maritalStatus}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Aadhaar / Contact</TableCell>
                              <TableCell>{formData.aadharNumber} • {formData.phoneNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">State & District</TableCell>
                              <TableCell>{formData.district}, {formData.state}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Annual Income</TableCell>
                              <TableCell>₹{Number(formData.annualIncome).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Employment & Caste</TableCell>
                              <TableCell>{formData.employmentType} ({formData.casteCategory})</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">BPL Card Status</TableCell>
                              <TableCell>{formData.bplCardStatus ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                      Back
                    </Button>
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="secondary" type="submit">
                        {activeStep === steps.length - 1 ? 'Save & Sync Profile' : 'Next Step'}
                      </Button>
                    </Stack>
                  </Box>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 90, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                Profile Live Snapshot
              </Typography>
              <Chip label="15+ Datapoints Connected" color="success" size="small" sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{formData.fullName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Age / Gender</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {calculatedAge !== null ? `${calculatedAge} yrs` : 'N/A'} • {formData.gender}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Annual Income</Typography>
                  <Typography variant="body1" fontWeight="bold" color="secondary.main">
                    ₹{Number(formData.annualIncome || 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formData.district}, {formData.state}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Caste Category</Typography>
                  <Typography variant="body1" fontWeight="bold">{formData.casteCategory}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
