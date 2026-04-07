import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import { useGetPsp } from 'src/api/psp-master';
import { LoadingButton } from '@mui/lab';
import { applyAutofillValues } from 'src/utils/autofill/form';
import { getPspAutofillDefaults } from 'src/utils/autofill/generators';

export default function PSPIntegrationForm({
  open,
  onClose,
  currentPSP,
  isEditMode,
  onSubmitSuccess,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { psp = [], pspsLoading } = useGetPsp();
  const [isAutofilling, setIsAutofilling] = useState(false);

  const PSPValidationSchema = Yup.object().shape({
    pspMasterId: Yup.string().required('PSP is required'),
  });

  const defaultValues = {
    pspMasterId: '',
  };

  const methods = useForm({
    resolver: yupResolver(PSPValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const selectedPspId = watch('pspMasterId') || currentPSP?.pspMasterId;

  const selectedPsp = psp?.find((p) => p.id === selectedPspId);

  const fields = selectedPsp?.pspMasterFields || [];
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (currentPSP && psp.length) {
      const resetData = {
        pspMasterId: currentPSP.pspMasterId,
      };

      const pspMaster = psp.find((p) => p.id === currentPSP.pspMasterId);

      if (pspMaster?.pspMasterFields) {
        pspMaster.pspMasterFields.forEach((field) => {
          resetData[field.fieldName] = currentPSP[field.fieldName] || '';
        });
      }

      reset(resetData);
    }
    if (!currentPSP) {
      reset({
        pspMasterId: '',
      });
    }
  }, [currentPSP, psp, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('merchant_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Restart KYC.', { variant: 'error' });
        return;
      }

      const pspDetail = {
        pspMasterId: data.pspMasterId,
      };

      sortedFields.forEach((field) => {
        pspDetail[field.fieldName] = data[field.fieldName];
      });

      let res;

      if (!isEditMode) {
        res = await axiosInstance.post('/merchant-profiles/kyc-psp', {
          usersId,
          psp: pspDetail,
        });
      } else {
        res = await axiosInstance.patch('/merchant-profiles/kyc-psp', {
          usersId,
          pspId: currentPSP.id,
          psp: pspDetail,
        });
      }

      if (res?.data?.success) {
        enqueueSnackbar(isEditMode ? 'PSP updated successfully' : 'PSP added successfully', {
          variant: 'success',
        });
        onClose();
        reset();
        if (onSubmitSuccess) {
          onSubmitSuccess(); // refresh parent list instantly
        }
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(error?.error?.message, { variant: 'error' });
    }
  });

  const handleAutoFill = async () => {
    if (!psp.length) {
      enqueueSnackbar('No PSP options available for autofill', { variant: 'warning' });
      return;
    }

    setIsAutofilling(true);

    try {
      const razorpayPsp =
        psp.find((item) => String(item?.name || '').toLowerCase().includes('razorpay')) || psp[0];

      const pspMasterId = razorpayPsp?.id || '';

      applyAutofillValues(setValue, { pspMasterId });

      (razorpayPsp?.pspMasterFields || []).forEach((field) => {
        applyAutofillValues(setValue, {
          [field.fieldName]: getPspAutofillDefaults(field, 'razorpay'),
        });
      });

      enqueueSnackbar('PSP autofill completed', { variant: 'success' });
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add New PSP Integration</DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Configure your payment service provider integration. Your request will be reviewed and
            approved by our team.
          </Typography>

          <Box display="grid" rowGap={3}>
            <RHFSelect name="pspMasterId" label="Select PSP *">
              <MenuItem value="" disabled>
                Choose a payment service provider
              </MenuItem>

              {psp?.map((psps) => (
                <MenuItem key={psps.id} value={psps.id}>
                  {psps.name}
                </MenuItem>
              ))}
            </RHFSelect>

            {/* <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}> */}
            {sortedFields.map((field) => (
              <RHFTextField
                key={field.id}
                name={field.fieldName}
                label={`${field.label}${field.isRequired ? ' *' : ''}`}
                type={field.type === 'password' ? 'password' : 'text'}
              />
            ))}
            {/* </Box> */}

            <Alert severity="warning">
              <strong>Review Process</strong>
              <br />
              Your integration request will be reviewed by our operations team within 24 hours.
              You&#39;ll be notified once approved.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="button"
            variant="contained"
            color="primary"
            loading={isAutofilling}
            onClick={handleAutoFill}
          >
            Autofill
          </LoadingButton>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
            disabled={isSubmitting}
          >
            Submit for Review
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

PSPIntegrationForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  currentPSP: PropTypes.object,
  isEditMode: PropTypes.bool,
  onSubmitSuccess: PropTypes.func,
};
