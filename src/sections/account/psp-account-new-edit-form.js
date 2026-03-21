import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

// components
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { alpha } from '@mui/system';
import Iconify from 'src/components/iconify';

import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import axiosInstance from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';


export default function PspAccount({ onclose, pspDetails, isEdit,refreshBankDetail }) {
  const PSP_OPTIONS = [
    { value: 'razorpay', label: 'Razorpay' },
    { value: 'paytm', label: 'Paytm' },
    { value: 'phonepe', label: 'PhonePe' },
    { value: 'cashfree', label: 'Cashfree' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'ccavenue', label: 'CCAvenue' },
    { value: 'payu', label: 'PayU' },
  ];

  const UpdateUserSchema = Yup.object().shape({
    pspName: Yup.string().required('PSP is required'),
    merchantId: Yup.string().required('Merchant ID is required'),
    settlementAccount: Yup.string().required('Settlement account is required'),
    apiKey: Yup.string().required('API key is required'),
    apiSecret: Yup.string().required('API secret is required'),
    WebhookUrl: Yup.string().url('Enter valid URL').required('Webhook URL required'),
  });

  const defaultValues = useMemo(()=>({
    pspName: pspDetails?.pspName || '',
    merchantId: pspDetails?.merchantId || '',
    settlementAccount: pspDetails?.settlementAccount || '',
    apiKey: pspDetails?.apiKey || '',
    apiSecret: pspDetails?.apiSecret || '',
    WebhookUrl: pspDetails?.WebhookUrl || '',
  }),[pspDetails]);

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = methods;






 const onSubmit = handleSubmit(async (data) => {
    try {
      
      const accountId = pspDetails?.id

      let finalPayload;

      if (!accountId) {
        finalPayload = { pspDetails: data };
      } else {
        finalPayload = data;
      }

      let res;

      if (!pspDetails?.id) {
        res = await axiosInstance.post('/business-profiles/psp-details', finalPayload);
      } else {
        res = await axiosInstance.patch(`/business-profiles/psp-details/${accountId}`, finalPayload);
      }

      if (res?.data?.success) {
        enqueueSnackbar('Psp details saved successfully!', { variant: 'success' });
        refreshBankDetail();
        onclose();
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit Psp details', { variant: 'error' });
    }
  });
const close=()=>{
    onclose();
}

  useEffect(()=>{
    if(pspDetails){
        reset(defaultValues);
    }
  },[pspDetails,reset,defaultValues])

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack pt={2} pb={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Add New PSP Integration
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 200 }}
            >
              Configure your payment service provider integration. Your request will be reviewed
              and approved by our team.
            </Typography>
          </Stack>

          <Box>
            <Box sx={{ width: 200, mb: 3 }}>
              <RHFSelect name="pspName" label="Select PSP" disabled={!isEdit}>
                {PSP_OPTIONS.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="merchantId"
                label="Merchant ID"
                disabled={!isEdit}
                placeholder="Enter Merchant ID"
              />

              <RHFTextField
                name="settlementAccount"
                label="Settlement Account"
                disabled={!isEdit}
                placeholder="Enter Bank Account Number"
              />
            </Box>

            <Box mt={3}>
              <RHFTextField
                name="apiKey"
                label="API Key"
                disabled={!isEdit}
                placeholder="Enter API Key"
              />
            </Box>

            <Box mt={3}>
              <RHFTextField
                name="apiSecret"
                label="API Secret"
                disabled={!isEdit}
                placeholder="Enter API Secret"
              />
            </Box>

            <Box mt={3}>
              <RHFTextField
                name="WebhookUrl"
                label="Webhook URL"
                disabled={!isEdit}
                placeholder="Enter webhook URL"
              />
            </Box>

            <Typography variant="caption">
              This URL will be automatically configured. Please whitelist this in your PSP
              dashboard.
            </Typography>
          </Box>
     {! pspDetails?.id &&
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              alignContent: 'center',
              gap: 2,
              p: 1,
              borderRadius: 1,
              border: (theme) => `solid 2px ${alpha(theme.palette.warning.main, 0.4)}`,
              backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.1),
              color: (theme) => alpha(theme.palette.warning.dark, 1),
              mb: 1,
            }}
          >
            <Box display="flex">
              <Stack p={2} pt={0.5}>
                <Iconify
                  icon="si:info-duotone"
                  width={20}
                  sx={{ color: (theme) => alpha(theme.palette.warning.main, 1), mt: 0 }}
                />
              </Stack>
      
              <Box>
                <Box display="flex" justifyContent="flex-start">
                  <Typography
                    variant="h7"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: (theme) => alpha(theme.palette.warning.darker, 1),
                      fontWeight:700
                    }}
                  >
                    Review Process
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="flex-start">
                  <Typography variant="body2">
                    Your integration request will be reviewed by our operations team within 24
                    hours. You will be notified once approved.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button color="primary" variant="outlined" onClick={close}>
              Cancel
            </Button>
         {(pspDetails?.status === 0 || pspDetails?.status === 1 || !pspDetails?.status )&&
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              loading={isSubmitting}
              sx={{ ml: 2 }}
            >{pspDetails?.id? "Update":"Save For Review"}
            </LoadingButton>}
          </Box>
        </Stack>
      </FormProvider>
    </Container>
  );
}

PspAccount.propTypes = {
  onclose: PropTypes.func,
  pspDetails: PropTypes.object,
  isEdit: PropTypes.bool,
  refreshBankDetail: PropTypes.func
};