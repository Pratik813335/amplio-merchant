import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
import { useGetPsp } from 'src/api/psp-master';

export default function PspAccount({
  onclose,
  pspDetails,
  isEdit,
  refreshBankDetail,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { psp = [], pspLoading } = useGetPsp();

  const selectedPspMasterId = pspDetails?.pspMasterId || pspDetails?.pspMaster?.id || '';

  const selectedPsp = useMemo(
    () => psp.find((item) => item.id === selectedPspMasterId),
    [psp, selectedPspMasterId]
  );

  const fields = selectedPsp?.pspMasterFields || [];
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const validationShape = useMemo(() => {
    const shape = {
      pspMasterId: Yup.string().required('PSP is required'),
    };

    sortedFields.forEach((field) => {
      let validator = Yup.string();

      if (field.isRequired) {
        validator = validator.required(`${field.label} is required`);
      }

      if (field.type === 'url') {
        validator = validator.url(`Enter a valid ${field.label}`);
      }

      shape[field.fieldName] = validator;
    });

    return Yup.object().shape(shape);
  }, [sortedFields]);

  const defaultValues = useMemo(() => {
    const values = {
      pspMasterId: selectedPspMasterId,
    };

    sortedFields.forEach((field) => {
      values[field.fieldName] = pspDetails?.[field.fieldName] || '';
    });

    return values;
  }, [pspDetails, selectedPspMasterId, sortedFields]);

  const methods = useForm({
    resolver: yupResolver(validationShape),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchedPspMasterId = watch('pspMasterId');

  const activePsp = useMemo(
    () => psp.find((item) => item.id === watchedPspMasterId),
    [psp, watchedPspMasterId]
  );

  const activeFields = [...(activePsp?.pspMasterFields || [])].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!psp.length) return;

    if (pspDetails) {
      const resetData = {
        pspMasterId: selectedPspMasterId,
      };

      const currentPspMaster = psp.find((item) => item.id === selectedPspMasterId);

      currentPspMaster?.pspMasterFields?.forEach((field) => {
        resetData[field.fieldName] = pspDetails?.[field.fieldName] || '';
      });

      reset(resetData);
      return;
    }

    reset({ pspMasterId: '' });
  }, [psp, pspDetails, reset, selectedPspMasterId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const pspPayload = {
        pspMasterId: data.pspMasterId,
      };

      activeFields.forEach((field) => {
        pspPayload[field.fieldName] = data[field.fieldName];
      });

      let res;

      if (!pspDetails?.id) {
        res = await axiosInstance.post('/merchant-profiles/PSP-details', {
          psp: pspPayload,
        });
      } else {
        res = await axiosInstance.patch(`/merchant-profiles/PSP-details/${pspDetails.id}`, {
          psp: pspPayload,
        });
      }

      if (res?.data?.success) {
        enqueueSnackbar(pspDetails?.id ? 'PSP updated successfully!' : 'PSP added successfully!', {
          variant: 'success',
        });
        refreshBankDetail?.();
        onclose?.();
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.error?.message || 'Failed to submit PSP details', {
        variant: 'error',
      });
    }
  });

  if (pspLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Stack pt={2} pb={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {pspDetails?.id ? 'Update PSP Integration' : 'Add New PSP Integration'}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 300 }}
            >
              Configure your payment service provider integration. Your request will be reviewed
              and approved by our team.
            </Typography>
          </Stack>

          <Box display="grid" rowGap={3}>
            <RHFSelect name="pspMasterId" label="Select PSP" disabled={!isEdit}>
              <MenuItem value="" disabled>
                Choose a payment service provider
              </MenuItem>

              {psp.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </RHFSelect>

            {activeFields.map((field) => (
              <RHFTextField
                key={field.id}
                name={field.fieldName}
                label={`${field.label}${field.isRequired ? ' *' : ''}`}
                type={field.type === 'password' ? 'password' : 'text'}
                disabled={!isEdit}
                placeholder={field.label}
              />
            ))}

            {!pspDetails?.id && (
              <Alert severity="warning">
                <strong>Review Process</strong>
                <br />
                Your integration request will be reviewed by our operations team within 24 hours.
                You will be notified once approved.
              </Alert>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button color="primary" variant="outlined" onClick={onclose}>
              Cancel
            </Button>

            {(pspDetails?.status === 0 || pspDetails?.status === 1 || !pspDetails?.status) && (
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loading={isSubmitting}
                sx={{ ml: 2 }}
              >
                {pspDetails?.id ? 'Update' : 'Save For Review'}
              </LoadingButton>
            )}
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
  refreshBankDetail: PropTypes.func,
};
