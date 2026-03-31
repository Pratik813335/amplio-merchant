import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// utils
import { fData } from 'src/utils/format-number';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';

import { useGetDealershipTypes } from 'src/api/dealershipTypes';
import { indianStates } from 'src/_mock/_state';
import axiosInstance from 'src/utils/axios';
import { Container } from '@mui/material';

// ----------------------------------------------------------------------

const mapUploadedFile = (file) => {
  if (!file?.fileUrl) {
    return null;
  }

  return {
    ...file,
    preview: file.fileUrl,
    fileOriginalName: file.fileOriginalName || file.fileName,
  };
};

const mapMerchantToFormValues = (profile) => {
  const panDocument = profile?.merchantPanCard?.panCardDocument || profile?.merchantPanCard?.media;

  return {
    companyName: profile?.companyName || '',
    cin: profile?.CIN || '',
    gstin: profile?.GSTIN || '',
    dateOfIncorporation: profile?.dateOfIncorporation
      ? new Date(profile.dateOfIncorporation)
      : null,
    msmeUdyamRegistrationNo: profile?.udyamRegistrationNumber || '',
    city: profile?.cityOfIncorporation || '',
    state: profile?.stateOfIncorporation || '',
    country: profile?.countryOfIncorporation || 'India',
    merchantDealershipTypeId: profile?.merchantDealershipTypeId || '',
    panFile: mapUploadedFile(panDocument),
    panNumber:
      profile?.merchantPanCard?.submittedPanNumber ||
      profile?.merchantPanCard?.extractedPanNumber ||
      '',
    panHoldersName:
      profile?.merchantPanCard?.submittedMerchantName ||
      profile?.merchantPanCard?.extractedMerchantName ||
      '',
    email: profile?.users?.email || '',
    phoneNumber: profile?.users?.phone || '',
    merchantLogo: mapUploadedFile(profile?.media),
    about: profile?.merchantAbout || '',
  };
};

export default function BusinessProfile() {
  const { enqueueSnackbar } = useSnackbar();
  const { dealershipTypes = [] } = useGetDealershipTypes();

  const UpdateUserSchema = Yup.object().shape({
    cin: Yup.string().required('CIN is required'),
    companyName: Yup.string().required('Legal Entity Name is required'),
    merchantDealershipTypeId: Yup.string().required('Dealership Type is required'),
    dateOfIncorporation: Yup.date().nullable().required('Date of Incorporation is required'),
    gstin: Yup.string().required('GSTIN is required'),
    city: Yup.string().required('City of Incorporation is required'),
    state: Yup.string().required('State of Incorporation is required'),
    country: Yup.string().required('Country is required'),
    msmeUdyamRegistrationNo: Yup.string().nullable(),
    panFile: Yup.mixed().nullable().required('PAN file is required'),
    panNumber: Yup.string().required('PAN Number is required'),
    panHoldersName: Yup.string().required('PAN Holder Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    merchantLogo: Yup.mixed().nullable(),
    about: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: '',
      cin: '',
      gstin: '',
      dateOfIncorporation: null,
      msmeUdyamRegistrationNo: '',
      city: '',
      state: '',
      country: 'India',
      merchantDealershipTypeId: '',
      panFile: null,
      panNumber: '',
      panHoldersName: '',
      email: '',
      phoneNumber: '',
      merchantLogo: null,
      about: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const res = await axiosInstance.get('/merchant-profiles/me');
        const data = res?.data?.profile;

        if (data) {
          reset(mapMerchantToFormValues(data));
        }
      } catch (error) {
        console.error('fetchMerchant error', error);
        enqueueSnackbar('Failed to load merchant profile', {
          variant: 'error',
        });
      }
    };

    fetchMerchant();
  }, [reset, enqueueSnackbar]);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axiosInstance.post('/files', formData);

        const uploaded = data?.files?.[0];

        if (uploaded) {
          setValue('merchantLogo', mapUploadedFile(uploaded), { shouldValidate: true });
          enqueueSnackbar('Logo uploaded!', { variant: 'success' });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Upload failed', { variant: 'error' });
      }
    },
    [setValue, enqueueSnackbar]
  );

  const handleFetchCinDetails = useCallback(async () => {
    const cin = getValues('cin');

    if (!cin) {
      enqueueSnackbar('Enter CIN first.', { variant: 'warning' });
      return;
    }

    try {
      const res = await axiosInstance.post('/extraction/company-info', {
        CIN: cin,
      });

      const data = res?.data?.data;

      if (res?.data?.success && data) {
        setValue('companyName', data.companyName || '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('gstin', data.gstin || '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(
          'dateOfIncorporation',
          data.dateOfIncorporation ? new Date(data.dateOfIncorporation) : null,
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        );
        setValue('city', data.cityOfIncorporation || '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('state', data.stateOfIncorporation || '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('country', data.countryOfIncorporation || 'India', {
          shouldValidate: true,
          shouldDirty: true,
        });

        enqueueSnackbar('CIN details fetched!', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Unable to fetch CIN details', { variant: 'error' });
    }
  }, [enqueueSnackbar, getValues, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const merchantLogoId = data.merchantLogo?.id ? String(data.merchantLogo.id) : null;
      const panCardDocumentId = data.panFile?.id ? String(data.panFile.id) : null;

      const payload = {
        merchantLogo: merchantLogoId,
        merchantAbout: data.about || '',
        companyName: data.companyName,
        CIN: data.cin,
        GSTIN: data.gstin,
        dateOfIncorporation: data.dateOfIncorporation
          ? new Date(data.dateOfIncorporation).toISOString().split('T')[0]
          : null,
        udyamRegistrationNumber: data.msmeUdyamRegistrationNo || '',
        cityOfIncorporation: data.city,
        stateOfIncorporation: data.state,
        countryOfIncorporation: data.country,
        merchantDealershipTypeId: data.merchantDealershipTypeId,
        panCardDocumentId,
        submittedPanDetails: {
          submittedMerchantName: data.panHoldersName,
          submittedPanNumber: data.panNumber,
        },
        email: data.email,
        phone: data.phoneNumber,
      };

      const res = await axiosInstance.patch('/merchant-profiles/update-general-info', payload);

      if (res?.data?.success) {
        const updatedProfile = res?.data?.updatedProfile;

        if (updatedProfile) {
          reset(mapMerchantToFormValues(updatedProfile));
        }

        enqueueSnackbar('Merchant profile updated successfully!', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to update merchant profile',
        {
          variant: 'error',
        }
      );
    }
  });

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
                <RHFUploadAvatar
                  name="merchantLogo"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>
            </Grid>

            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <RHFTextField
                      name="cin"
                      label="CIN *"
                      placeholder="Enter CIN"
                      InputProps={{
                        endAdornment: (
                          <Button
                            size="small"
                            variant="contained"
                            color='primary'
                            sx={{
                              textTransform: 'none',
                              ml: 1,

                            }}
                            onClick={handleFetchCinDetails}
                          >
                            Fetch
                          </Button>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField
                      name="companyName"
                      label="Legal Entity Name *"
                      placeholder="Company Name"
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFSelect name="merchantDealershipTypeId" label="Dealership Type *">
                      <MenuItem value="">Select Dealership Type</MenuItem>
                      {dealershipTypes.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField name="gstin" label="GSTIN *" placeholder="Enter GSTIN" />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Controller
                      name="dateOfIncorporation"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label="Date of Incorporation *"
                          format="dd/MM/yyyy"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />

                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField
                      name="msmeUdyamRegistrationNo"
                      label="MSME / Udyam No."
                      placeholder="Enter MSME Number"
                    />
                  </Grid>
                  
                  <Grid xs={12} md={6}>
                    <RHFTextField name="email" label="Email Address *" placeholder="Email Address" />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField name="phoneNumber" label="Phone Number *" placeholder="Phone Number" />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <RHFTextField name="city" label="City of Incorporation *" placeholder="City" />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <RHFSelect name="state" label="State of Incorporation *">
                      <MenuItem value="" disabled>
                        Select State
                      </MenuItem>

                      {indianStates.map((state) => (
                        <MenuItem key={state.id} value={state.value}>
                          {state.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <RHFTextField name="country" label="Country" placeholder="Country" />
                  </Grid>



                </Grid>
              </Stack>
            </Grid>
          </Grid>

          <Typography variant="h6" color='primary' sx={{ fontWeight: 700 }}>
            PAN Details
          </Typography>

          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <RHFCustomFileUploadBox
                name="panFile"
                label="Upload PAN Card *"
                icon="mdi:file-document-outline"
                accept={{
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'application/pdf': ['.pdf'],
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <RHFTextField
                name="panNumber"
                label="PAN Number *"
                placeholder="Enter PAN Number"
              />
            </Grid>

            <Grid xs={12} md={6}>
              <RHFTextField
                name="panHoldersName"
                label="PAN Holder Name *"
                placeholder="Enter Name"
              />
            </Grid>

            <Grid xs={12} md={12}>
              <RHFTextField name="about" multiline rows={4} label="About Business" />
            </Grid>
          </Grid>

          {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Box> */}



        </Card>
      </FormProvider>
    </Container>
  );
}
