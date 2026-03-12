import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import axiosInstance from 'src/utils/axios';

const UBO_ROLES = [
  { value: 'proprietor', label: 'Proprietor (Sole Owner)' },
  { value: 'partner', label: 'Partner' },
  { value: 'designated_partner', label: 'Designated Partner (LLP)' },
  { value: 'director', label: 'Director' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'authorized_signatory', label: 'Authorized Signatory' },
  { value: 'trustee', label: 'Trustee' },
  { value: 'beneficiary', label: 'Beneficiary Owner' },
  { value: 'other', label: 'Other' },
];

export default function KYCAddUBOsForm({
  open,
  onClose,
  onSuccess,
  currentUser,
  isViewMode,
  isEditMode,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [extractedPan, setExtractedPan] = useState(null);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .transform((value) => value?.toUpperCase())
      .required('Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    email: Yup.string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Please enter a valid email address'
      ),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
    role: Yup.string().required('Role is required'),
    ownershipPercentage: Yup.number()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : Number(originalValue)
      )
      .typeError('Ownership percentage must be a number')
      .required('Ownership percentage is required')
      .min(1, 'Ownership percentage must be at least 1')
      .max(100, 'Ownership percentage cannot exceed 100'),
    customDesignation: Yup.string().when('role', (role, schema) =>
      role === 'other' ? schema.required('Please enter designation') : schema.notRequired()
    ),
    submittedPanFullName: Yup.string()
      .transform((value) => value?.toUpperCase())
      .required('PAN Holder Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    submittedPanNumber: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN Number is required'),
    submittedDateOfBirth: Yup.string().required('DOB is required'),
    panCard: Yup.mixed().test('fileRequired', 'PAN card is required', (value) => {
      if (isEditMode) return true;
      return !!value;
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phone || '',
      role: currentUser?.designationValue || '',
      ownershipPercentage: currentUser?.ownershipPercentage || '',
      panCard: '',
      customDesignation: '',
      submittedPanFullName: currentUser?.submittedPanFullName || '',
      submittedPanNumber: currentUser?.submittedPanNumber || '',
      submittedDateOfBirth: currentUser?.submittedDateOfBirth || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const panFile = useWatch({
    control: methods.control,
    name: 'panCard',
  });
  const isPanUploaded = Boolean(panFile?.id || panFile?.files?.[0]?.id);

  const watchRole = methods.watch('role');

  const getFileId = (fileValue) => {
    if (!fileValue) return null;

    // Existing file (edit mode)
    if (fileValue.id) return fileValue.id;

    // Newly uploaded file
    if (fileValue.files?.length > 0) {
      return fileValue.files[0]?.id || null;
    }

    return null;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('merchant_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Restart KYC.', { variant: 'error' });
        return;
      }

      const panCardId = getFileId(data.panCard);

      if (!panCardId && !isEditMode) {
        enqueueSnackbar('PAN card is required', { variant: 'error' });
        return;
      }
      const designationValue = data.role === 'other' ? data.customDesignation : data.role;

      const payload = {
        usersId,
        uboDetails: [
          {
            fullName: data.name,
            email: data.email,
            phone: data.phoneNumber,
            ownershipPercentage: Number(data.ownershipPercentage),

            // Extracted PAN details (from OCR)
            extractedPanFullName: extractedPan?.extractedPanFullName || '',
            extractedPanNumber: extractedPan?.extractedPanNumber || '',
            extractedDateOfBirth: extractedPan?.extractedDateOfBirth || '',

            // Submitted PAN details (after human check / edit)
            submittedPanFullName: data.submittedPanFullName,
            submittedPanNumber: data.submittedPanNumber,
            submittedDateOfBirth: data.submittedDateOfBirth,

            panCardId,
            designationType: data.role === 'other' ? 'custom' : 'dropdown',
            designationValue,
            roleValue: designationValue,
          },
        ],
      };

      const res = await axiosInstance.post('/merchant-profiles/kyc-ubo-details', payload);

      if (res?.data?.success) {
        enqueueSnackbar('UBO added successfully', { variant: 'success' });
        onSuccess?.(payload.uboDetails[0]);
        onClose();
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong', {
          variant: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to add UBO', { variant: 'error' });
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        name: currentUser?.fullName || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phone || '',
        role: currentUser?.designationValue || '',
        ownershipPercentage: currentUser?.ownershipPercentage || '',
        panCard: '',
        customDesignation: '',
        submittedPanFullName: currentUser?.submittedPanFullName || '',
        submittedPanNumber: currentUser?.submittedPanNumber || '',
        submittedDateOfBirth: currentUser?.submittedDateOfBirth || '',
      });
      setExtractedPan(null);
    }
  }, [open, currentUser, reset]);

  useEffect(() => {
    if (!panFile?.id) return;

    const extractPanDetails = async () => {
      try {
        const response = await axiosInstance.post('/extract/pan-info', {
          fileId: panFile.id,
        });

        const data = response?.data?.data || {};

        const panNumber = data?.extractedPanNumber;
        const panName = data?.extractedPanHolderName;
        const panDob = data?.extractedDateOfBirth;

        if (!panNumber && !panName && !panDob) {
          enqueueSnackbar("Couldn't extract PAN details. Please fill manually.", {
            variant: 'error',
          });
          return;
        }

        if (panName) {
          setValue('submittedPanFullName', panName, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        if (panNumber) {
          setValue('submittedPanNumber', panNumber, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        if (panDob) {
          const formattedDob =
            panDob instanceof Date ? format(panDob, 'yyyy-MM-dd') : String(panDob);
          setValue('submittedDateOfBirth', formattedDob, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        setExtractedPan({
          extractedPanFullName: panName || '',
          extractedPanNumber: panNumber || '',
          extractedDateOfBirth: panDob || '',
        });
        enqueueSnackbar('PAN details extracted successfully', {
          variant: 'success',
        });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Unable to extract PAN details. Please fill manually.', {
          variant: 'error',
        });
      }
    };

    extractPanDetails();
  }, [panFile?.id, enqueueSnackbar, setValue]);

  // const handleAutoFill = async () => {
  //   setIsAutofilling(true);
  //   const autoData = NewKycSignatoryDetails();

  //   const applyValue = (name, value) =>
  //     setValue(name, value, {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //       shouldTouch: true,
  //     });

  //   // First map everything except role
  //   Object.entries(autoData).forEach(([key, value]) => {
  //     if (key !== 'role') {
  //       applyValue(key, value);
  //     }
  //   });

  //   const matchedRole = ROLES.find(
  //     (r) => r.label.toLowerCase() === autoData.role?.toLowerCase()
  //   );

  //   applyValue('role', matchedRole ? matchedRole.value : '');

  //   try {
  //     const uploadTargets = [
  //       { field: 'panCard', fileName: 'financial_statement_year_1.pdf' },
  //       { field: 'boardResolution', fileName: 'income_tax_return_year_1.pdf' },
  //     ];

  //     const uploadResults = await Promise.all(
  //       uploadTargets.map(async ({ field, fileName }) => {
  //         try {
  //           const response = await fetch(`/pdfs/kyb/${fileName}`);
  //           if (!response.ok) return { field, file: null };

  //           const blob = await response.blob();
  //           const file = new File([blob], fileName, { type: 'application/pdf' });
  //           const formData = new FormData();
  //           formData.append('file', file);

  //           const uploadRes = await axiosInstance.post('/files', formData);
  //           return { field, file: uploadRes?.data?.files?.[0] || null };
  //         } catch (error) {
  //           return { field, file: null };
  //         }
  //       })
  //     );

  //     setSkipPanExtractionOnce(true);
  //     uploadResults.forEach(({ field, file }) => {
  //       if (!file?.id) return;
  //       applyValue(field, file);
  //     });

  //     const uploadedCount = uploadResults.filter((entry) => !!entry.file?.id).length;
  //     if (uploadedCount > 0) {
  //       enqueueSnackbar(`Autofill uploaded ${uploadedCount} signatory document(s)`, {
  //         variant: 'success',
  //       });
  //     } else {
  //       enqueueSnackbar('Signatory data autofilled, document upload failed', { variant: 'warning' });
  //     }
  //   } finally {
  //     setIsAutofilling(false);
  //   }
  // };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle color="primary">
          {/* eslint-disable-next-line no-nested-ternary */}
          {isViewMode ? 'View UBO' : isEditMode ? 'Edit UBO' : 'Add New UBO'}
        </DialogTitle>

        <DialogContent
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pr: 2,
          }}
        >
          <Box rowGap={3} display="grid" mt={2}>
            <RHFTextField
              name="name"
              label="Name*"
              disabled={isViewMode}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />

            <RHFTextField name="email" label="Email*" type="email" disabled={isViewMode} />

            <RHFTextField
              name="phoneNumber"
              label="Phone Number*"
              type="tel"
              disabled={isViewMode}
              inputProps={{ maxLength: 10 }}
            />
            <RHFTextField
              name="ownershipPercentage"
              label="Ownership Percentage*"
              type="number"
              disabled={isViewMode}
              inputProps={{ min: 1, max: 100 }}
            />
            <RHFSelect name="role" label="Designation*" disabled={isViewMode}>
              <MenuItem value="" disabled>
                Select Designation
              </MenuItem>
              {UBO_ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {watchRole === 'other' && !isViewMode && (
              <RHFTextField
                name="customDesignation"
                label="Enter Custom Designation*"
                placeholder="Enter custom designation"
              />
            )}

            <Typography variant="subtitle2" color="primary">
              PAN Section
            </Typography>

            {isViewMode ? (
              <RHFTextField name="submittedPanNumber" label="PAN Number*" disabled />
            ) : (
              <>
                <RHFCustomFileUploadBox
                  name="panCard"
                  label="Upload PAN*"
                  fileType="pan"
                  required={!isEditMode}
                  error={!!errors.panCard}
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                />
                <RHFTextField
                  name="submittedPanFullName"
                  label="PAN Holder Full Name*"
                  disabled={!isPanUploaded}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />

                <RHFTextField
                  name="submittedPanNumber"
                  label="PAN Number*"
                  disabled={!isPanUploaded}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />

                <Controller
                  name="submittedDateOfBirth"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="PAN Date of Birth*"
                      disabled={!isPanUploaded}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(newValue) =>
                        field.onChange(newValue ? format(newValue, 'yyyy-MM-dd') : '')
                      }
                      format="dd/MM/yyyy"
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

              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>

            {/* {!isViewMode && (
              <Button
                type="button"
                variant="contained"
                color='primary'
                onClick={handleAutoFill}
                disabled={isAutofilling}
              >
                {isAutofilling ? 'Autofilling...' : 'Autofill'}
              </Button>
            )} */}

            {!isViewMode && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isEditMode ? 'Update' : 'Add'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

KYCAddUBOsForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  isViewMode: PropTypes.bool,
  isEditMode: PropTypes.bool,
};
