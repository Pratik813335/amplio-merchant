import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
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

// utils
import { fData } from 'src/utils/format-number';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';

import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

const mapMerchantLogo = (media) => {
  if (!media?.fileUrl) {
    return null;
  }

  return {
    ...media,
    preview: media.fileUrl,
  };
};

export default function BusinessProfile() {
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    companyName: Yup.string().required('Name is required'),
    dealershipType: Yup.string().required('Entity Type is required'),
    panNo: Yup.string().required('Pan No is required'),
    gstNo: Yup.string().required('GST No is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    merchantLogo: Yup.mixed().nullable(),
    phoneNumber: Yup.string().required('Phone number is required'),
    about: Yup.string().required('About is required'),
    isPublic: Yup.boolean(),
  });

  const defaultValues = {
    companyName: '',
    dealershipType: '',
    panNo: '',
    cin: '',
    gstNo: '',
    email: '',
    merchantLogo: null,
    phoneNumber: '',
    about: '',
    isPublic: false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const res = await axiosInstance.get('/merchant-profiles/me');
        const data = res?.data?.profile;

        if (data) {
          reset({
            companyName: data.companyName || '',
            dealershipType: data?.merchantDealershipType?.label || '',
            panNo: data?.merchantPanCard?.submittedPanNumber || '',
            gstNo: data.GSTIN || '',
            email: data.users?.email || '',
            cin: data?.CIN,
            merchantLogo: mapMerchantLogo(data.media),
            about: data.merchantAbout || '',
            phoneNumber: data.users?.phone || '',
            isPublic: data.isPublic || false,
          });
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
          setValue('merchantLogo', mapMerchantLogo(uploaded), { shouldValidate: true });

          console.log('Saved merchantLogoId:', uploaded.id);

          enqueueSnackbar('Logo uploaded!', { variant: 'success' });
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Upload failed', { variant: 'error' });
      }
    },
    [setValue, enqueueSnackbar]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const merchantLogoId =
        typeof data.merchantLogo === 'string' ? null : data.merchantLogo?.id || null;

      const payload = {
        merchantLogo: merchantLogoId ? String(merchantLogoId) : null,
        merchantAbout: data.about,
      };

      const res = await axiosInstance.patch(
        '/merchant-profiles/update-general-info',
        payload
      );

      if (res?.data?.success) {
        const updatedProfile = res?.data?.updatedProfile;

        if (updatedProfile) {
          reset({
            companyName: updatedProfile.companyName || '',
            dealershipType: updatedProfile?.merchantDealershipType?.label || '',
            panNo: updatedProfile?.merchantPanCard?.submittedPanNumber || '',
            gstNo: updatedProfile.GSTIN || '',
            email: updatedProfile.users?.email || '',
            cin: updatedProfile?.CIN || '',
            merchantLogo: mapMerchantLogo(updatedProfile.media),
            about: updatedProfile.merchantAbout || '',
            phoneNumber: updatedProfile.users?.phone || '',
            isPublic: updatedProfile.isPublic || false,
          });
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
      enqueueSnackbar('Failed to update merchant profile', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* LEFT */}
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

        {/* RIGHT */}
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
                <RHFTextField name="companyName" label="Business Name" disabled />
                <RHFTextField name="gstNo" label="GST No" disabled />
                <RHFTextField name="cin" label="CIN No" disabled />
                <RHFTextField name="dealershipType" label="Dealership Type" disabled />
                <RHFTextField name="panNo" label="Pan No" disabled />

                <RHFTextField name="email" label="Email Address" disabled />
                <RHFTextField name="phoneNumber" label="Phone Number" disabled />

              </Box>
            </Stack>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
