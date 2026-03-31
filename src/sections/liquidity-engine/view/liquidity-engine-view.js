/* eslint-disable import/order */

// @mui
import { Button, Card, Grid, Stack, Typography, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import { RHFTextField } from 'src/components/hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// components
import { useSettingsContext } from 'src/components/settings';

import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import { LiquidityEngineListView } from '../liquidity-engine-realtime-receivables/view';
import LiquidityEngineCard from '../liquidity-engine-card';
import { useGetTransactions } from 'src/api/transaction';



// ----------------------------------------------------------------------

const DISBURSEMENT_HISTORY = [
  {
    id: 1,
    date: '2024-02-27',
    receivablesFinanced: 245,
    amount: '₹48.2L',
    status: 'Completed',
  },
  {
    id: 2,
    date: '2024-02-26',
    receivablesFinanced: 198,
    amount: '₹39.5L',
    status: 'Completed',
  },
  {
    id: 3,
    date: '2024-02-25',
    receivablesFinanced: 267,
    amount: '₹52.4L',
    status: 'Completed',
  },
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
const DASHBOARD_CARDS = [
  {
    todayEligibleTotal: 710000,
    receivables: 5,
    haircutTotal: 69000,
    avgHaircut: 2.75,
    utilizationTotal: 50.1,
    utilizationPercent: 5.0,
    railTotal: 70.0,
    railUPI: 75,
    railCard: 85,
  },
];

const RequestSchema = Yup.object().shape({
  amount: Yup.number().required('Amount is Required'),
});

function formatNumber(num) {
  const number = Number(num);

  if (number >= 10000000) {
    return `${(number / 10000000).toFixed(2)} Cr`;
  }

  if (number >= 100000) {
    return `${(number / 100000).toFixed(2)} L`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(2)} K`;
  }

  return number;
}
// ----------------------------------------------------------------------

export default function LiquidityEngineView() {
  const settings = useSettingsContext();
  const {
    transaction = [],
    transactionLoading,
  } = useGetTransactions();

  const todayTransactions = transaction.filter(
    (item) => item.status === 'captured' && isToday(item.createdAt)
  );

  const todayEligibleTotal = todayTransactions.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const receivablesCount = todayTransactions.length;

  const totalNetAmount = todayTransactions.reduce(
    (sum, item) => sum + (item.netAmount || 0),
    0
  );

  const avgHaircut =
    todayTransactions.length > 0
      ? (
        todayTransactions.reduce((sum, item) => sum + (item.haircut || 0), 0) /
        todayTransactions.length
      ).toFixed(2)
      : 0;
  const theme = useTheme();

  const methods = useForm({
    resolver: yupResolver(RequestSchema),
    defaultValues: { amount: '' },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data) => {
    console.log('Amount Added', data);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
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
              title="Net After Haircut"
              total={`₹${formatNumber(totalNetAmount)}`}
              timing={`Avg haircut: ${avgHaircut}%`}
              icon="ph:currency-inr-duotone"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <WidgetSummaryCard
              title="Utilization Rate"
              total= {0}
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


        <LiquidityEngineListView transaction = {todayTransactions} />
        <LiquidityEngineCard disbursements={DISBURSEMENT_HISTORY} />
      </Stack>
    </Container >
  );
}
