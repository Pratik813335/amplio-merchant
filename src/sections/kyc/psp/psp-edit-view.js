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

import FormProvider, { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';

import { useSnackbar } from 'src/components/snackbar';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useEffect, useMemo, useState } from 'react';
import { useGetPsp } from 'src/api/psp-master';
import { useGetConsentDetails } from 'src/api/consent-details';
import { useGetUserConsents } from 'src/api/user-consents';

const PSP_CONSENT_SLUG = 'merchant-psp-details';

function getConsentLabel(content, fallbackLabel) {
  if (!content) {
    return fallbackLabel;
  }

  return (
    <Box
      component="span"
      sx={{ display: 'inline' }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default function PSPIntegrationForm({
  open,
  onClose,
  currentPSP,
  isEditMode,
  onSubmitSuccess,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { psp = [], pspsLoading } = useGetPsp();
  const [consentSubmitting, setConsentSubmitting] = useState(false);
  const identifierId = sessionStorage.getItem('merchant_profile_id');
  const { consentDetails: pspConsentDetails } = useGetConsentDetails(PSP_CONSENT_SLUG);
  const { userConsents, refreshUserConsents } = useGetUserConsents({
    identifierId,
  });
  const existingPspConsent = useMemo(
    () =>
      (userConsents || [])
        .filter((item) => item?.consentTemplateId === pspConsentDetails?.id)
        .sort((a, b) => {
          if (Boolean(a?.isChecked) !== Boolean(b?.isChecked)) {
            return Number(Boolean(b?.isChecked)) - Number(Boolean(a?.isChecked));
          }

          const aTime = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
          const bTime = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
          return bTime - aTime;
        })[0] || null,
    [pspConsentDetails?.id, userConsents]
  );
  const hasSubmittedPsp = Boolean(currentPSP?.id);

  const PSPValidationSchema = Yup.object().shape({
    pspMasterId: Yup.string().required('PSP is required'),
    pspConsent: Yup.boolean().oneOf(
      [true],
      'Please provide consent to use PSP details for payment processing and integration'
    ),
  });

  const defaultValues = {
    pspMasterId: '',
    pspConsent: false,
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

  const handlePspConsentChange = async (_, checked, field) => {
    if (!identifierId || !pspConsentDetails?.id) {
      return;
    }

    setConsentSubmitting(true);

    try {
      const payload = {
        consentTemplateId: pspConsentDetails.id,
        isChecked: checked,
        identifierId,
      };

      if (existingPspConsent?.identifierId || existingPspConsent?.id) {
        await axiosInstance.patch('/user-consents', payload);
      } else {
        await axiosInstance.post('/user-consents', payload);
      }

      await refreshUserConsents();
    } catch (error) {
      console.error('Failed to save PSP consent', error);
      field.onChange(!checked);
      enqueueSnackbar('Failed to save consent. Please try again.', {
        variant: 'error',
      });
    } finally {
      setConsentSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentPSP && psp.length) {
      const resetData = {
        pspMasterId: currentPSP.pspMasterId,
        pspConsent: false,
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
        pspConsent: false,
      });
    }
  }, [currentPSP, psp, reset]);

  useEffect(() => {
    if (open) {
      setValue('pspConsent', Boolean(existingPspConsent?.isChecked));
    }
  }, [existingPspConsent?.isChecked, open, setValue]);

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

            <RHFCheckbox
              name="pspConsent"
              label={getConsentLabel(
                pspConsentDetails?.content,
                'I agree to the use of PSP details for payment processing and integration.'
              )}
              onChange={handlePspConsentChange}
              checkboxProps={{
                disabled: consentSubmitting || hasSubmittedPsp,
              }}
              sx={{
                alignItems: 'flex-start',
                m: 0,
                '& .MuiFormControlLabel-label': {
                  typography: 'body2',
                  color: 'text.secondary',
                  lineHeight: 1.5,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

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
            disabled={isSubmitting || consentSubmitting}
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
