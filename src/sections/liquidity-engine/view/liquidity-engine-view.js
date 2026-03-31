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
// import FormProvider, { RHFTextField } from 'src/components/hook-form';

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
  amount: Yup.string().required('Amount is Required'),
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
          {DASHBOARD_CARDS.map((card, i) => (
            <>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Total Eligible Today"
                  total={`₹${formatNumber(card.todayEligibleTotal)}`}
                  timing={`${card.receivables} receivables`}
                  icon="lucide:droplets"
                />
              </Grid>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Net After Haircut"
                  total={`₹${formatNumber(card.haircutTotal)}`}
                  timing={`Avg haircut:${card.avgHaircut}`}
                  icon="ph:currency-inr-duotone"
                />
              </Grid>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Utilization Rate"
                  total={`${card.utilizationTotal}%`}
                  percent={card.utilizationPercent}
                  timing="Of available limit"
                  icon="ph:trend-up-duotone"
                />
              </Grid>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Rail Limit Usage"
                  total={`${card.railTotal}%`}
                  timing={`UPI: ${card.railUPI}% | Card: ${card.railCard}%`}
                  icon="ph:warning-circle-duotone"
                />
              </Grid>
            </>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Request Receivables Amount
            </Typography>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <RHFTextField
                        name="amount"
                        label="Enter Amount (₹)"
                        type="number"
                        fullWidth
                        placeholder="e.g. 50000"
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          '&:hover': {
                            bgcolor: theme.palette.primary.dark,
                          },
                          borderRadius: 2,
                          mt: 2,
                        }}
                      >
                        Submit Request
                      </Button>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined">₹ 100000</Button>
                    <Button variant="outlined">₹ 200000</Button>
                    <Button variant="outlined">₹ 500000</Button>
                  </Stack>
                </Stack>
              </form>
            </FormProvider>
          </Card>
        </Grid>

              <LiquidityEngineListView />
              <LiquidityEngineCard disbursements={DISBURSEMENT_HISTORY} />
       </Stack>
    </Container >
  );
}
