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
  Alert
} from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import { fetchMockProfile } from '../services/api';

// Zod validation schemas for each step
const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits')
});

const step2Schema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters')
});

const step3Schema = z.object({
  annualIncome: z.coerce.number().min(0, 'Income must be non-negative'),
  employmentType: z.string().min(1, 'Employment type is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  familyMembers: z.coerce.number().min(1, 'Must have at least 1 family member'),
  bplCardStatus: z.boolean(),
  casteCategory: z.string().min(1, 'Caste category is required'),
  religion: z.string().optional(),
  educationLevel: z.string().min(1, 'Education level is required')
});

const step4Schema = z.object({
  isDisabled: z.boolean(),
  disabilityType: z.string().optional(),
  hasBankAccount: z.boolean(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional()
}).refine(data => !data.isDisabled || (data.isDisabled && data.disabilityType), {
  message: 'Disability type is required if disabled',
  path: ['disabilityType']
}).refine(data => !data.hasBankAccount || (data.hasBankAccount && data.bankName && data.accountNumber && data.ifscCode), {
  message: 'Bank details are required if you have an account',
  path: ['bankName']
});

const steps = ['Personal Info', 'Contact & Location', 'Economic Status', 'Additional Info', 'Review & Submit'];

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [activeStep, setActiveStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(null);

  // Zod schema based on current active step
  const getStepSchema = (step) => {
    switch (step) {
      case 0: return step1Schema;
      case 1: return step2Schema;
      case 2: return step3Schema;
      case 3: return step4Schema;
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
      maritalStatus: '',
      nationality: 'Indian',
      aadhaarNumber: '',
      email: user?.email || '',
      phone: '',
      state: '',
      district: '',
      pincode: '',
      address: '',
      annualIncome: 0,
      employmentType: '',
      occupation: '',
      familyMembers: 1,
      bplCardStatus: false,
      casteCategory: '',
      religion: '',
      educationLevel: '',
      isDisabled: false,
      disabilityType: '',
      hasBankAccount: false,
      bankName: '',
      accountNumber: '',
      ifscCode: ''
    }
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const formData = watch();

  // Load existing profile if available
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchMockProfile();
        if (profile) {
          setValue('fullName', profile.fullName);
          setValue('dateOfBirth', profile.dateOfBirth);
          setValue('gender', profile.gender);
          setValue('email', profile.email);
          setValue('phone', profile.phone);
          setValue('state', profile.state);
          setValue('district', profile.district);
          setValue('annualIncome', profile.annualIncome);
          setValue('employmentType', profile.employmentType);
          setValue('casteCategory', profile.casteCategory);
          setValue('educationLevel', profile.educationLevel);
          setValue('bplCardStatus', profile.bplCardStatus);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, [setValue]);

  // Handle auto-calculating age
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
      // Step 5: Final Submission
      console.log('Submitting Data:', data);
      setSubmitSuccess(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        My Profile
      </Typography>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSubmitSuccess(false)}>
          Profile submitted successfully! Eligibility checks are updating.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column: Form & Stepper */}
        <Grid item xs={12} md={8}>
          <Card>
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
                  {activeStep === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold">Personal Details</Typography>
                      <TextField
                        fullWidth
                        label="Full Name"
                        {...methods.register('fullName')}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="date"
                            label="Date of Birth"
                            InputLabelProps={{ shrink: true }}
                            {...methods.register('dateOfBirth')}
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Calculated Age: {calculatedAge !== null ? calculatedAge : 'N/A'} years old
                          </Typography>
                        </Grid>
                      </Grid>
                      <FormControl error={!!errors.gender}>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup row {...methods.register('gender')}>
                          <FormControlLabel value="Male" control={<Radio />} label="Male" />
                          <FormControlLabel value="Female" control={<Radio />} label="Female" />
                          <FormControlLabel value="Other" control={<Radio />} label="Other" />
                        </RadioGroup>
                      </FormControl>
                      <FormControl fullWidth error={!!errors.maritalStatus}>
                        <InputLabel>Marital Status</InputLabel>
                        <Select label="Marital Status" {...methods.register('maritalStatus')} defaultValue="">
                          <MenuItem value="Single">Single</MenuItem>
                          <MenuItem value="Married">Married</MenuItem>
                          <MenuItem value="Widowed">Widowed</MenuItem>
                          <MenuItem value="Divorced">Divorced</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Nationality"
                        {...methods.register('nationality')}
                        error={!!errors.nationality}
                        helperText={errors.nationality?.message}
                      />
                      <TextField
                        fullWidth
                        label="Aadhaar Number (12 digits)"
                        {...methods.register('aadhaarNumber')}
                        error={!!errors.aadhaarNumber}
                        helperText={errors.aadhaarNumber?.message}
                      />
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold">Contact & Location</Typography>
                      <TextField
                        fullWidth
                        label="Email Address"
                        {...methods.register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number (10 digits)"
                        {...methods.register('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!errors.state}>
                            <InputLabel>State</InputLabel>
                            <Select label="State" {...methods.register('state')} defaultValue="">
                              <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                              <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                              <MenuItem value="Delhi">Delhi</MenuItem>
                              <MenuItem value="Karnataka">Karnataka</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!errors.district}>
                            <InputLabel>District</InputLabel>
                            <Select label="District" {...methods.register('district')} defaultValue="">
                              <MenuItem value="Mumbai">Mumbai</MenuItem>
                              <MenuItem value="Pune">Pune</MenuItem>
                              <MenuItem value="Chennai">Chennai</MenuItem>
                              <MenuItem value="Bengaluru">Bengaluru</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        label="Pincode (6 digits)"
                        {...methods.register('pincode')}
                        error={!!errors.pincode}
                        helperText={errors.pincode?.message}
                      />
                      <TextField
                        fullWidth
                        label="Residential Address"
                        multiline
                        rows={3}
                        {...methods.register('address')}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    </Box>
                  )}

                  {activeStep === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold">Economic Status</Typography>
                      <TextField
                        fullWidth
                        type="number"
                        label="Annual Family Income (₹)"
                        {...methods.register('annualIncome')}
                        error={!!errors.annualIncome}
                        helperText={errors.annualIncome?.message}
                      />
                      <FormControl fullWidth error={!!errors.employmentType}>
                        <InputLabel>Employment Type</InputLabel>
                        <Select label="Employment Type" {...methods.register('employmentType')} defaultValue="">
                          <MenuItem value="Salaried">Salaried</MenuItem>
                          <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                          <MenuItem value="Unemployed">Unemployed</MenuItem>
                          <MenuItem value="Student">Student</MenuItem>
                          <MenuItem value="Retired">Retired</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Occupation"
                        {...methods.register('occupation')}
                        error={!!errors.occupation}
                        helperText={errors.occupation?.message}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Family Members Count"
                        {...methods.register('familyMembers')}
                        error={!!errors.familyMembers}
                        helperText={errors.familyMembers?.message}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography>BPL Card Holder?</Typography>
                        <Switch
                          checked={watch('bplCardStatus')}
                          onChange={(e) => setValue('bplCardStatus', e.target.checked)}
                        />
                      </Box>
                      <FormControl fullWidth error={!!errors.casteCategory}>
                        <InputLabel>Caste Category</InputLabel>
                        <Select label="Caste Category" {...methods.register('casteCategory')} defaultValue="">
                          <MenuItem value="General">General</MenuItem>
                          <MenuItem value="OBC">OBC</MenuItem>
                          <MenuItem value="SC">SC</MenuItem>
                          <MenuItem value="ST">ST</MenuItem>
                          <MenuItem value="EWS">EWS</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Religion (Optional)"
                        {...methods.register('religion')}
                      />
                      <FormControl fullWidth error={!!errors.educationLevel}>
                        <InputLabel>Education Level</InputLabel>
                        <Select label="Education Level" {...methods.register('educationLevel')} defaultValue="">
                          <MenuItem value="Illiterate">Illiterate</MenuItem>
                          <MenuItem value="Primary">Primary (Up to Class 5)</MenuItem>
                          <MenuItem value="Secondary">Secondary (Class 10)</MenuItem>
                          <MenuItem value="Senior Secondary">Senior Secondary (Class 12)</MenuItem>
                          <MenuItem value="Graduate">Graduate</MenuItem>
                          <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {activeStep === 3 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Typography variant="h6" fontWeight="bold">Additional Information</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography>Person with Disability?</Typography>
                        <Switch
                          checked={watch('isDisabled')}
                          onChange={(e) => setValue('isDisabled', e.target.checked)}
                        />
                      </Box>
                      {watch('isDisabled') && (
                        <TextField
                          fullWidth
                          label="Type of Disability"
                          {...methods.register('disabilityType')}
                          error={!!errors.disabilityType}
                          helperText={errors.disabilityType?.message}
                        />
                      )}

                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography>Do you have a Bank Account?</Typography>
                        <Switch
                          checked={watch('hasBankAccount')}
                          onChange={(e) => setValue('hasBankAccount', e.target.checked)}
                        />
                      </Box>

                      {watch('hasBankAccount') && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <TextField
                            fullWidth
                            label="Bank Name"
                            {...methods.register('bankName')}
                            error={!!errors.bankName}
                            helperText={errors.bankName?.message}
                          />
                          <TextField
                            fullWidth
                            label="Account Number"
                            {...methods.register('accountNumber')}
                            error={!!errors.accountNumber}
                            helperText={errors.accountNumber?.message}
                          />
                          <TextField
                            fullWidth
                            label="IFSC Code"
                            {...methods.register('ifscCode')}
                            error={!!errors.ifscCode}
                            helperText={errors.ifscCode?.message}
                          />
                        </Box>
                      )}
                    </Box>
                  )}

                  {activeStep === 4 && (
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Review your Information</Typography>
                      <TableContainer component={Paper} elevation={0} variant="outlined">
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell fontWeight="bold">Full Name</TableCell>
                              <TableCell>{formData.fullName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Date of Birth</TableCell>
                              <TableCell>{formData.dateOfBirth} ({calculatedAge} years old)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Gender</TableCell>
                              <TableCell>{formData.gender}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Aadhaar Number</TableCell>
                              <TableCell>{formData.aadhaarNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Location</TableCell>
                              <TableCell>{formData.district}, {formData.state}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Annual Income</TableCell>
                              <TableCell>₹{formData.annualIncome}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell fontWeight="bold">Caste Category</TableCell>
                              <TableCell>{formData.casteCategory}</TableCell>
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
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Back
                    </Button>
                    <Stack direction="row" spacing={2}>
                      <Button variant="outlined" color="inherit">
                        Save Draft
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        {activeStep === steps.length - 1 ? 'Submit Profile' : 'Next'}
                      </Button>
                    </Stack>
                  </Box>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Real-time Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Profile Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{formData.fullName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Age / Gender</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {calculatedAge !== null ? `${calculatedAge} yrs` : 'N/A'} / {formData.gender}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Income</Typography>
                  <Typography variant="body1" fontWeight="bold" color="secondary.main">
                    ₹{Number(formData.annualIncome).toLocaleString()} / year
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formData.district || 'District'}, {formData.state || 'State'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Caste Category</Typography>
                  <Typography variant="body1" fontWeight="bold">{formData.casteCategory || 'N/A'}</Typography>
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
