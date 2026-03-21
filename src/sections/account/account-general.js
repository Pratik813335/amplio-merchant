import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import { fData } from 'src/utils/format-number';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function BusinessProfile() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useMockedUser();

  const UpdateUserSchema = Yup.object().shape({
    businessName: Yup.string().required('Name is required'),
    entityType: Yup.string().required('Entity Type is required'),
    panNo: Yup.string().required('Pan No is required'),
    gstNo: Yup.string().required('GST No is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable().required('Avatar is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    // uboName: Yup.string().required('UBO Name is required'),
    // uboPan: Yup.string().required('UBO Pan is required'),
    // ownership: Yup.string().required('Ownership % is required'),
    // contactNumber: Yup.string().required('Contact is required'),
    about: Yup.string().required('About is required'),
    // not required
    isPublic: Yup.boolean(),
  });

  const defaultValues = {
    businessName: user?.displayName || '',
    entityType: user?.entityType || '',
    panNo: user?.panNo || '',
    gstNo: user?.gstNo || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
    phoneNumber: user?.phoneNumber || '',
    // uboName: user?.uboName || '',
    address: user?.address || '',
    // uboPan: user?.uboPan || '',
    // ownership: user?.ownership || '',
    // contactNumber: user?.contactNumber || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {

      const userId = user?.id
      let finalPayload;

      if (!userId) {
        finalPayload = { userDetails: data };
      } else {
        finalPayload = data;
      }

      let res;

      if (!user?.id) {
        res = await axiosInstance.post('/user-profiles/user-details', finalPayload);
      } else {
        res = await axiosInstance.patch(`/user-profiles/user-details/${userId}`, finalPayload);
      }

      if (res?.data?.success) {
        enqueueSnackbar('User details saved successfully!', { variant: 'success' });
        
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit User details', { variant: 'error' });
    }
  });



  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {/* <Stack pb={3}>
        <Typography variant='h4'>Business Profile Details</Typography>
      </Stack> */}
      <Grid container spacing={3}>

        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="businessName" label="Business Name" />
                <RHFTextField name="entityType" label="Legal Entity Type" />
                <RHFTextField name="panNo" label="Pan No" />
                <RHFTextField name="gstNo" label="GST No" />
                <RHFTextField name="email" label="Email Address" />
                <RHFTextField name="phoneNumber" label="Phone Number" />
                <RHFTextField name="address" label="Address" />
              </Box>

              {/* <Typography variant='h5'>Ultimate Beneficial Owner(UBO)</Typography>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >


                <RHFTextField name="uboName" label="UBO Name" />
                <RHFTextField name="uboPan" label="UBO pan" />
                <RHFTextField name="ownership" label="Ownership%" />
                <RHFTextField name="contactNumber" label="Contact Number" />
              </Box> */}
            </Stack>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
