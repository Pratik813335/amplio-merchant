/* eslint-disable import/order */

import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettingsContext } from 'src/components/settings';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import { LiquidityEngineListView } from '../liquidity-engine-realtime-receivables/view';
import LiquidityEngineCard from '../liquidity-engine-card';
import { useGetTransactions } from 'src/api/transaction';
import { useMemo } from 'react';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';


// ----------------------------------------------------------------------

const DISBURSEMENT_HISTORY = [
  { id: 1, date: '2024-02-27', receivablesFinanced: 245, amount: '₹48.2L', status: 'Completed' },
  { id: 2, date: '2024-02-26', receivablesFinanced: 198, amount: '₹39.5L', status: 'Completed' },
  { id: 3, date: '2024-02-25', receivablesFinanced: 267, amount: '₹52.4L', status: 'Completed' },
];

const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

function formatNumber(num) {
  const number = Number(num);

  if (number >= 10000000) return `${(number / 10000000).toFixed(2)} Cr`;
  if (number >= 100000) return `${(number / 100000).toFixed(2)} L`;
  if (number >= 1000) return `${(number / 1000).toFixed(2)} K`;

  return number;
}

// ----------------------------------------------------------------------

export default function LiquidityEngineView() {
  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const RequestSchema = Yup.object().shape({
    requestReceivableAmount: Yup.number().min(100000).required('Amount is Required'),
  });

  const { transaction = [], refreshTrasnsactions } = useGetTransactions();

  const todayTransactions = transaction.filter(
    (item) => item.status === 'captured' && isToday(item.createdAt)
  );

  const todayEligibleTotal = todayTransactions.reduce(
    (sum, item) => sum + (item.totalRecieved || 0),
    0
  );

  const receivablesCount = todayTransactions.length;

  const totalNetAmount = todayTransactions.reduce(
    (sum, item) => sum + (item.netAmount || 0),
    0
  );

  const totalRequested = todayTransactions.reduce(
    (sum, item) => sum + (item.requestReceivableAmount || 0),
    0
  );

  const availableBalance = totalNetAmount - totalRequested;

  const avgHaircut =
    todayTransactions.length > 0
      ? (
        todayTransactions.reduce((sum, item) => sum + (item.haircut || 0), 0) /
        todayTransactions.length
      ).toFixed(2)
      : 0;

  const defaultValues = useMemo(
    () => ({
      requestReceivableAmount: null,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(RequestSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, reset } = methods;


  const onSubmit = handleSubmit(async (form) => {
    try {
      await axiosInstance.patch('/transactions/request-receivable', {
        requestReceivableAmount: Number(form.requestReceivableAmount),
      });

      enqueueSnackbar('Request submitted successfully', {
        variant: 'success'
      });
      refreshTrasnsactions();
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.error?.message || error?.message || 'Failed to update address details',
        {
          variant: 'error',
        }
      );
    }
  });

  const handleQuickAmount = (amount) => {
    setValue('requestReceivableAmount', amount);
  };

  // ----------------------------------------------------------------------

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          {/* SUMMARY */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <WidgetSummaryCard
                title="Total Eligible Today"
                total={`₹${formatNumber(todayEligibleTotal)}`}
                timing={`${receivablesCount} receivables`}
                icon="lucide:droplets"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <WidgetSummaryCard
                title="Available Balance"
                total={`₹${formatNumber(availableBalance)}`} 
                timing={`Avg haircut: ${avgHaircut}%`}
                icon="ph:currency-inr-duotone"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <WidgetSummaryCard
                title="Utilization Rate"
                total={0}
                timing="Of available limit"
                icon="ph:trend-up-duotone"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <WidgetSummaryCard
                title="Rail Limit Usage"
                total={0}
                timing="UPI | Card"
                icon="ph:warning-circle-duotone"
              />
            </Grid>
          </Grid>

          {/* FORM */}
          {/* <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Request Receivable Amount
              </Typography>

              <Stack spacing={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={10} md={4}>
                    <RHFTextField
                      name="requestReceivableAmount"
                      label="Enter Amount (₹)"
                      type="number"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <Button type="submit" color="primary" variant="contained">
                      Submit
                    </Button>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" color="primary"  onClick={() => handleQuickAmount(100000)}>
                    ₹ 1L
                  </Button>

                  <Button variant="outlined" color="primary" onClick={() => handleQuickAmount(200000)}>
                    ₹ 2L
                  </Button>

                  <Button variant="outlined" color="primary" onClick={() => handleQuickAmount(500000)}>
                    ₹ 5L
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid> */}

          {/* LIST + HISTORY */}
          <LiquidityEngineListView transaction={todayTransactions} />
          <LiquidityEngineCard disbursements={DISBURSEMENT_HISTORY} />
        </Stack>
      </FormProvider>
    </Container>
  );
}