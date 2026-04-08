import { useMemo } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import FormProvider, { RHFSlider, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useLocalStorage } from 'src/hooks/use-local-storage';

const MAX_AMOUNT = 1000000;
const MAX_FREQUENCY = 10;

const amountMarks = [
  { value: 100000, label: '1L' },
  { value: 200000, label: '2L' },
  { value: 300000, label: '3L' },
  { value: 400000, label: '4L' },
  { value: 500000, label: '5L' },
  { value: 600000, label: '6L' },
  { value: 700000, label: '7L' },
  { value: 800000, label: '8L' },
  { value: 900000, label: '9L' },
  { value: 1000000, label: '10L' },
];

const frequencyMarks = Array.from({ length: MAX_FREQUENCY }, (_, index) => ({
  value: index + 1,
  label: `${index + 1}`,
}));

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR',
  }).format(Number(value) || 0);

export default function AccountConfiguration() {
  const { enqueueSnackbar } = useSnackbar();
  const [savedConfiguration, setSavedConfiguration] = useLocalStorage('merchantConfiguration', {
    settlementDays: 7,
    transactionAmount: 500000,
    frequencyHours: 5,
  });

  const ConfigurationSchema = Yup.object().shape({
    settlementDays: Yup.number()
      .typeError('Days must be a number')
      .integer('Days must be a whole number')
      .min(1, 'Days must be at least 1')
      .required('Days are required'),
    transactionAmount: Yup.number()
      .min(100000, 'Amount must be at least 1 lakh')
      .max(MAX_AMOUNT, 'Amount cannot exceed 10 lakh')
      .required('Amount is required'),
    frequencyHours: Yup.number()
      .integer('Hours must be a whole number')
      .min(1, 'Frequency must be at least 1 hour')
      .max(MAX_FREQUENCY, 'Frequency cannot exceed 10 hours')
      .required('Frequency is required'),
  });

  const defaultValues = useMemo(
    () => ({
      settlementDays: savedConfiguration?.settlementDays || 7,
      transactionAmount: savedConfiguration?.transactionAmount || 500000,
      frequencyHours: savedConfiguration?.frequencyHours || 5,
    }),
    [savedConfiguration]
  );

  const methods = useForm({
    resolver: yupResolver(ConfigurationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const settlementDays = Number(watch('settlementDays')) || 0;
  const transactionAmount = Number(watch('transactionAmount')) || 0;
  const frequencyHours = Number(watch('frequencyHours')) || 1;
  const amountPercentage = Math.min((transactionAmount / MAX_AMOUNT) * 100, 100);
  const frequencyPercentage = Math.min((frequencyHours / MAX_FREQUENCY) * 100, 100);
  const amountPerInterval = Math.round(transactionAmount / frequencyHours);

  const onSubmit = handleSubmit(async (form) => {
    setSavedConfiguration({
      settlementDays: Number(form.settlementDays),
      transactionAmount: Number(form.transactionAmount),
      frequencyHours: Number(form.frequencyHours),
    });

    enqueueSnackbar('Configuration saved successfully', {
      variant: 'success',
    });
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              Configuration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This configuration is set for 24 hours.
            </Typography>
          </Stack>

          {/* <RHFTextField
            name="settlementDays"
            label="Transaction cycle in days"
            type="number"
            inputProps={{ min: 1 }}
            helperText="Example: if the merchant cycle is 7 days, enter 7."
          /> */}

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color='primary'>Transaction amount limit</Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700 }}>
                {formatCurrency(transactionAmount)}
              </Typography>
            </Stack>

            <RHFSlider
              name="transactionAmount"
              min={100000}
              max={MAX_AMOUNT}
              step={10000}
              marks={amountMarks}
            />

            {/* <LinearProgress
              variant="determinate"
              value={amountPercentage}
              sx={{ height: 10, borderRadius: 999 }}
            /> */}

            <Typography variant="body2" color="text.secondary">
              Choose any value up to 10 lakh for the merchant.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color='primary'>Frequency in hours</Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700 }}>
                Every {frequencyHours} hour{frequencyHours > 1 ? 's' : ''}
              </Typography>
            </Stack>

            <RHFSlider name="frequencyHours" min={1} max={MAX_FREQUENCY} step={1} marks={frequencyMarks} />

            {/* <LinearProgress
              color="secondary"
              variant="determinate"
              value={frequencyPercentage}
              sx={{ height: 10, borderRadius: 999 }}
            /> */}

            <Typography variant="body2" color="text.secondary">
              Select how often the configured amount should be released, up to every 10 hours.
            </Typography>
          </Stack>

          <Divider />

          {/* <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.grey[100],
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h6">Configuration summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Merchant cycle: {settlementDays} day{settlementDays > 1 ? 's' : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum amount: {formatCurrency(transactionAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Release frequency: every {frequencyHours} hour{frequencyHours > 1 ? 's' : ''}
              </Typography>
              <Typography variant="subtitle2" color="primary.main">
                Approximate amount per selected interval: {formatCurrency(amountPerInterval)}
              </Typography>
            </Stack>
          </Box> */}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" color='primary' variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
