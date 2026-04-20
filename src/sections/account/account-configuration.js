import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FormProvider, { RHFSlider } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useGetBankDetails } from 'src/api/merchantProfile';
import { upsertMerchantPayoutConfig, useGetMerchantPayoutConfig } from 'src/api/merchantPayoutConfig';

const DEFAULT_FREQUENCY = 5;
const MAX_FREQUENCY = 10;
// TODO: Temporary testing fallback. Remove this once AI max cap API is available and use backend/platform-generated limit instead.
const TEMPORARY_TEST_MAX_DAILY_CAP = 1000000;

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

const getErrorMessage = (error, fallbackMessage) => {
  if (typeof error === 'string') {
    return error;
  }

  return error?.message || error?.error?.message || fallbackMessage;
};

// TODO: Temporary testing fallback. Remove this once AI max cap API is available and use backend/platform-generated limit instead.
const resolveActiveMaxAllowedDailyCap = (maxAllowedDailyCap) =>
  Number(maxAllowedDailyCap) || TEMPORARY_TEST_MAX_DAILY_CAP;

const getAmountSliderMin = (maxAllowedDailyCap) => {
  const maxValue = Number(maxAllowedDailyCap) || 0;

  return maxValue >= 100000 ? 100000 : 1;
};

const getAmountSliderStep = (maxAllowedDailyCap) => {
  const maxValue = Number(maxAllowedDailyCap) || 0;

  if (maxValue >= 100000) return 10000;
  if (maxValue >= 10000) return 1000;
  if (maxValue >= 1000) return 100;

  return 1;
};

const formatAmountMark = (value) => {
  const numericValue = Number(value) || 0;

  if (numericValue >= 100000) {
    const lakhs = numericValue / 100000;

    if (Number.isInteger(lakhs)) {
      return `${lakhs}L`;
    }

    return `${lakhs.toFixed(1).replace(/\.0$/, '')}L`;
  }

  return `${numericValue}`;
};

const buildAmountMarks = (maxAllowedDailyCap) => {
  const maxValue = Number(maxAllowedDailyCap) || 0;

  if (maxValue <= 0) {
    return [];
  }

  if (maxValue >= 100000) {
    const marks = [];
    const lakhStep = 100000;
    const fullLakhs = Math.floor(maxValue / lakhStep);

    for (let lakhIndex = 1; lakhIndex <= fullLakhs; lakhIndex += 1) {
      const value = lakhIndex * lakhStep;

      marks.push({
        value,
        label: `${lakhIndex}L`,
      });
    }

    if (!marks.length || marks[marks.length - 1]?.value !== maxValue) {
      marks.push({
        value: maxValue,
        label: formatAmountMark(maxValue),
      });
    }

    return marks;
  }

  return [
    {
      value: maxValue,
      label: formatAmountMark(maxValue),
    },
  ];
};

const clampNumber = (value, min, max) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return min;
  }

  return Math.min(Math.max(numericValue, min), max);
};

const mapConfigToFormValues = (config, activeMaxAllowedDailyCap) => {
  const amountSliderMin = getAmountSliderMin(activeMaxAllowedDailyCap);
  const selectedDailyCap = Number(config?.selectedDailyCap) || activeMaxAllowedDailyCap;

  return {
    selectedDailyCap: clampNumber(selectedDailyCap, amountSliderMin, activeMaxAllowedDailyCap),
    frequencyHours: clampNumber(config?.frequencyHours || DEFAULT_FREQUENCY, 1, MAX_FREQUENCY),
  };
};

export default function AccountConfiguration() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    merchantPayoutConfig,
    merchantPayoutConfigResponse,
    merchantPayoutConfigLoading,
    merchantPayoutConfigError,
    refreshMerchantPayoutConfig,
  } = useGetMerchantPayoutConfig();

  const { BankDetails = [], BankDetailsLoading } = useGetBankDetails();

  const backendMaxAllowedDailyCap = Number(merchantPayoutConfig?.maxAllowedDailyCap) || 0;
  const activeMaxAllowedDailyCap = resolveActiveMaxAllowedDailyCap(
    merchantPayoutConfig?.maxAllowedDailyCap
  );
  const amountSliderMin = useMemo(
    () => getAmountSliderMin(activeMaxAllowedDailyCap),
    [activeMaxAllowedDailyCap]
  );
  const amountSliderStep = useMemo(
    () => getAmountSliderStep(activeMaxAllowedDailyCap),
    [activeMaxAllowedDailyCap]
  );
  const amountMarks = useMemo(
    () => buildAmountMarks(activeMaxAllowedDailyCap),
    [activeMaxAllowedDailyCap]
  );
  const isUsingTemporaryTestingCapFallback = !backendMaxAllowedDailyCap;

  const hasPrimaryBankAccountFromConfig =
    typeof merchantPayoutConfig?.hasPrimaryBankAccount === 'boolean'
      ? merchantPayoutConfig.hasPrimaryBankAccount
      : null;
  const inferredHasPrimaryBankAccount = useMemo(
    () => BankDetails.some((bank) => bank?.isPrimary),
    [BankDetails]
  );
  const hasPrimaryBankAccount =
    hasPrimaryBankAccountFromConfig ?? inferredHasPrimaryBankAccount;
  const isPrimaryBankAccountResolved =
    hasPrimaryBankAccountFromConfig !== null || !BankDetailsLoading;
  const isInitialLoading = merchantPayoutConfigLoading && !merchantPayoutConfigResponse;

  const ConfigurationSchema = useMemo(
    () =>
      Yup.object().shape({
        selectedDailyCap: Yup.number()
          .typeError('Daily payout cap is required')
          .required('Daily payout cap is required')
          .test(
            'positive-daily-cap',
            'Daily payout cap must be greater than zero',
            (value) => Number(value) > 0
          )
          .test(
            'within-active-max-cap',
            `Daily payout cap cannot exceed ${formatCurrency(activeMaxAllowedDailyCap)}`,
            (value) => Number(value) <= Number(activeMaxAllowedDailyCap)
          ),
        frequencyHours: Yup.number()
          .typeError('Frequency is required')
          .integer('Frequency must be a whole number')
          .min(1, 'Frequency must be at least 1 hour')
          .max(MAX_FREQUENCY, `Frequency cannot exceed ${MAX_FREQUENCY} hours`)
          .required('Frequency is required'),
      }),
    [activeMaxAllowedDailyCap]
  );

  const defaultValues = useMemo(
    () => ({
      selectedDailyCap: activeMaxAllowedDailyCap,
      frequencyHours: DEFAULT_FREQUENCY,
    }),
    [activeMaxAllowedDailyCap]
  );

  const methods = useForm({
    resolver: yupResolver(ConfigurationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;
  const configSelectedDailyCap = merchantPayoutConfig?.selectedDailyCap;
  const configFrequencyHours = merchantPayoutConfig?.frequencyHours;

  const formValuesFromConfig = useMemo(
    () =>
      mapConfigToFormValues(
        {
          selectedDailyCap: configSelectedDailyCap,
          frequencyHours: configFrequencyHours,
        },
        activeMaxAllowedDailyCap
      ),
    [activeMaxAllowedDailyCap, configSelectedDailyCap, configFrequencyHours]
  );

  useEffect(() => {
    reset(formValuesFromConfig);
  }, [formValuesFromConfig, reset]);

  useEffect(() => {
    if (!merchantPayoutConfigError) {
      return;
    }

    enqueueSnackbar(getErrorMessage(merchantPayoutConfigError, 'Unable to fetch configuration'), {
      variant: 'error',
    });
  }, [enqueueSnackbar, merchantPayoutConfigError]);

  const selectedDailyCap = clampNumber(
    watch('selectedDailyCap') || activeMaxAllowedDailyCap,
    amountSliderMin,
    activeMaxAllowedDailyCap
  );
  const frequencyHours = clampNumber(watch('frequencyHours') || DEFAULT_FREQUENCY, 1, MAX_FREQUENCY);

  const amountHelperText = isUsingTemporaryTestingCapFallback
    ? `Choose any value up to ${formatCurrency(
        activeMaxAllowedDailyCap
      )} for the merchant. Using temporary platform max limit for testing until AI limit API is available.`
    : `Choose any value up to ${formatCurrency(activeMaxAllowedDailyCap)} for the merchant.`;
  const isSaveDisabled =
    isInitialLoading ||
    isSubmitting ||
    (isPrimaryBankAccountResolved && !hasPrimaryBankAccount) ||
    selectedDailyCap <= 0 ||
    selectedDailyCap > activeMaxAllowedDailyCap ||
    frequencyHours < 1 ||
    frequencyHours > MAX_FREQUENCY;

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const response = await upsertMerchantPayoutConfig({
        maxAllowedDailyCap: activeMaxAllowedDailyCap,
        selectedDailyCap: Number(formValues.selectedDailyCap),
        scheduleMode: 'bucketed',
        frequencyHours: Number(formValues.frequencyHours),
      });

      if (response?.success === false) {
        enqueueSnackbar(response?.message || 'Unable to save configuration', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar(response?.message || 'Configuration saved successfully', {
        variant: 'success',
      });

      await refreshMerchantPayoutConfig();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'Failed to save configuration'), {
        variant: 'error',
      });
    }
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
            {isInitialLoading && (
              <Typography variant="body2" color="text.secondary">
                Loading saved configuration...
              </Typography>
            )}
          </Stack>

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">
                Transaction amount limit
              </Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700 }}>
                {formatCurrency(selectedDailyCap)}
              </Typography>
            </Stack>

            <RHFSlider
              name="selectedDailyCap"
              min={amountSliderMin}
              max={activeMaxAllowedDailyCap}
              step={amountSliderStep}
              marks={amountMarks}
              disabled={isInitialLoading}
            />

            <Typography variant="body2" color="text.secondary">
              {amountHelperText}
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">
                Frequency in hours
              </Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700 }}>
                Every {frequencyHours} hour{frequencyHours > 1 ? 's' : ''}
              </Typography>
            </Stack>

            <RHFSlider
              name="frequencyHours"
              min={1}
              max={MAX_FREQUENCY}
              step={1}
              marks={frequencyMarks}
              disabled={isInitialLoading}
            />

            <Typography variant="body2" color="text.secondary">
              Select how often the configured amount should be released, up to every 10 hours.
            </Typography>
          </Stack>

          <Divider />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="error.main">
              {isPrimaryBankAccountResolved && !hasPrimaryBankAccount
                ? 'Add a primary bank account to save payout configuration.'
                : ' '}
            </Typography>

            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              loading={isSubmitting || isInitialLoading}
              disabled={isSaveDisabled}
            >
              Save
            </LoadingButton>
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
