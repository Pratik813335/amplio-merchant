import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  Stack,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFCustomFileUploadBox,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
import { useGetAddressDetails } from 'src/api/merchantProfile';

export default function AccountAddressDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registeredAddress, correspondenceAddress, refreshAddressDetails } =
    useGetAddressDetails();

  const AddressSchema = Yup.object().shape({
    documentType: Yup.string().required('Please select document type'),
    registeredAddressLine1: Yup.string().required('Required'),
    registeredAddressLine2: Yup.string(),
    registeredCountry: Yup.string().required('Required'),
    registeredCity: Yup.string().required('Required'),
    registeredState: Yup.string().required('Required'),
    registeredPincode: Yup.string().required('Required').matches(/^[0-9]{6}$/, 'Invalid'),
    sameAsRegistered: Yup.boolean(),
    correspondenceAddressLine1: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (schema) => schema.required('Required'),
    }),
    correspondenceAddressLine2: Yup.string(),
    correspondenceCountry: Yup.string().required('Required'),
    correspondenceCity: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (schema) => schema.required('Required'),
    }),
    correspondenceState: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (schema) => schema.required('Required'),
    }),
    correspondencePincode: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (schema) => schema.required('Required').matches(/^[0-9]{6}$/, 'Invalid'),
    }),
    addressProof: Yup.mixed().required('Required'),
  });

  const defaultValues = useMemo(
    () => ({
      documentType: registeredAddress?.documentType || 'electricity_bill',
      registeredAddressLine1: registeredAddress?.addressLineOne || '',
      registeredAddressLine2: registeredAddress?.addressLineTwo || '',
      registeredCountry: registeredAddress?.country || 'India',
      registeredCity: registeredAddress?.city || '',
      registeredState: registeredAddress?.state || '',
      registeredPincode: registeredAddress?.pincode || '',
      sameAsRegistered:
        !!registeredAddress &&
        !!correspondenceAddress &&
        registeredAddress.addressLineOne === correspondenceAddress.addressLineOne &&
        registeredAddress.city === correspondenceAddress.city &&
        registeredAddress.state === correspondenceAddress.state &&
        registeredAddress.pincode === correspondenceAddress.pincode,
      correspondenceAddressLine1: correspondenceAddress?.addressLineOne || '',
      correspondenceAddressLine2: correspondenceAddress?.addressLineTwo || '',
      correspondenceCountry: correspondenceAddress?.country || 'India',
      correspondenceCity: correspondenceAddress?.city || '',
      correspondenceState: correspondenceAddress?.state || '',
      correspondencePincode: correspondenceAddress?.pincode || '',
      addressProof: registeredAddress?.addressProof
        ? {
          id: registeredAddress.addressProof.id,
          fileUrl: registeredAddress.addressProof.fileUrl,
          fileOriginalName: registeredAddress.addressProof.fileName,
        }
        : null,
    }),
    [registeredAddress, correspondenceAddress]
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(AddressSchema),
  });

  const { reset, handleSubmit, setValue, watch, control } = methods;
  const sameAsRegistered = watch('sameAsRegistered');
  const documentType = useWatch({ control, name: 'documentType' });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (sameAsRegistered) {
      setValue('correspondenceAddressLine1', watch('registeredAddressLine1'));
      setValue('correspondenceAddressLine2', watch('registeredAddressLine2'));
      setValue('correspondenceCountry', watch('registeredCountry'));
      setValue('correspondenceCity', watch('registeredCity'));
      setValue('correspondenceState', watch('registeredState'));
      setValue('correspondencePincode', watch('registeredPincode'));
    }
  }, [sameAsRegistered, setValue, watch]);

  const onSubmit = handleSubmit(async (form) => {
    try {
      setIsSubmitting(true);

      const registeredAddressPayload = {
        addressType: 'registered',
        addressLineOne: form.registeredAddressLine1,
        addressLineTwo: form.registeredAddressLine2 || '',
        country: form.registeredCountry,
        city: form.registeredCity,
        state: form.registeredState,
        pincode: form.registeredPincode,
        documentType: form.documentType,
        addressProofId: form.addressProof?.id,
      };

      const correspondenceAddressPayload = {
        addressType: 'correspondence',
        addressLineOne: form.sameAsRegistered
          ? form.registeredAddressLine1
          : form.correspondenceAddressLine1,
        addressLineTwo: form.sameAsRegistered
          ? form.registeredAddressLine2 || ''
          : form.correspondenceAddressLine2 || '',
        country: form.sameAsRegistered ? form.registeredCountry : form.correspondenceCountry,
        city: form.sameAsRegistered ? form.registeredCity : form.correspondenceCity,
        state: form.sameAsRegistered ? form.registeredState : form.correspondenceState,
        pincode: form.sameAsRegistered ? form.registeredPincode : form.correspondencePincode,
        documentType: form.documentType,
        addressProofId: form.addressProof?.id,
      };

      await axiosInstance.patch('/merchant-profiles/kyc-address-details', {
        registeredAddress: registeredAddressPayload,
        correspondenceAddress: correspondenceAddressPayload,
      });

      await refreshAddressDetails();
      enqueueSnackbar('Address details updated successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.response?.data?.message || error?.message || 'Failed to update address details',
        {
          variant: 'error',
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 3,
        width: '100%',
        boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 600,
      }}
    >
      <Stack spacing={0.5} alignItems="flex-start" sx={{ mb: 4 }}>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 700, textAlign: 'left' }}>
          Address Details
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 500, color: '#000000', textAlign: 'left' }}>
          Add your registered and correspondence address details.
        </Typography>
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="h6">Upload Address Proof</Typography>

            <Box sx={{ width: 260 }}>
              <RHFSelect name="documentType" label="Document Type">
                <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
                <MenuItem value="lease_agreement">Lease Agreement</MenuItem>
              </RHFSelect>
            </Box>

            <RHFCustomFileUploadBox
              name="addressProof"
              label={`Upload ${(documentType === 'electricity_bill' && 'Electricity Bill') ||
                (documentType === 'lease_agreement' && 'Lease Agreement') ||
                'Address Proof'
                }`}
              icon="mdi:file-document-outline"
            />
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Registered Address
              </Typography>

              <Stack spacing={2}>
                <RHFTextField name="registeredAddressLine1" label="Address Line 1" />
                <RHFTextField name="registeredAddressLine2" label="Address Line 2" />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField name="registeredCountry" label="Country" />
                  <RHFTextField name="registeredCity" label="City" />
                  <RHFTextField name="registeredState" label="State" />
                </Box>
                <RHFTextField name="registeredPincode" label="Pincode" />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
              >
                <Typography variant="h5">
                  Correspondence Address
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={sameAsRegistered}
                    onChange={(e) => setValue('sameAsRegistered', e.target.checked)}
                    sx={{ p: 0.5 }}
                  />
                  <Typography variant="body1">
                    Same as Registered
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ opacity: sameAsRegistered ? 0.5 : 1 }}>
                <RHFTextField
                  name="correspondenceAddressLine1"
                  label="Address Line 1"
                  disabled={sameAsRegistered}
                />
                <RHFTextField
                  name="correspondenceAddressLine2"
                  label="Address Line 2"
                  disabled={sameAsRegistered}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField
                    name="correspondenceCountry"
                    label="Country"
                    disabled={sameAsRegistered}
                  />
                  <RHFTextField
                    name="correspondenceCity"
                    label="City"
                    disabled={sameAsRegistered}
                  />
                  <RHFTextField
                    name="correspondenceState"
                    label="State"
                    disabled={sameAsRegistered}
                  />
                </Box>
                <RHFTextField
                  name="correspondencePincode"
                  label="Pincode"
                  disabled={sameAsRegistered}
                />
              </Stack>
            </Grid>
          </Grid>

          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Box> */}
        </Stack>
      </FormProvider>
    </Card>
  );
}
