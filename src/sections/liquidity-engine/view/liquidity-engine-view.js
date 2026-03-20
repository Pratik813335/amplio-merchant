/* eslint-disable import/order */
// @mui
import { Stack } from '@mui/material';
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';

import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import { LiquidityEngineListView } from '../liquidity-engine-realtime-receivables/view';
import LiquidityEngineCard from '../liquidity-engine-card';

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

// ----------------------------------------------------------------------

export default function LiquidityEngineView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack spacing={3}>
        {/* Summary Cards Row */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <WidgetSummaryCard
            title="Total Eligible Today"
            total={710000}
            percent={0}
            timing="5 receivables"
            icon="lucide:droplets"
            iconColor="primary.main"
            hideArrow
            chart={{ series: [] }}
            sx={{ flex: 1 }}
          />

          <WidgetSummaryCard
            title="Net After Haircut"
            total={690000}
            percent={0}
            timing="Avg haircut: 2.75%"
            icon="ph:currency-dollar-duotone"
            iconColor="primary.main"
            hideArrow
            chart={{
              series: [],
            }}
            sx={{ flex: 1 }}
          />

          <WidgetSummaryCard
            title="Utilization Rate"
            total="87.5%"
            percent={5}
            timing="Of available limit"
            icon="ph:trend-up-duotone"
            iconColor="primary.main"
            arrowColor="success.main"
            arrowSize="small"
            chart={{
              series: [],
            }}
            sx={{ flex: 1 }}
          />

          <WidgetSummaryCard
            title="Rail Limit Usage"
            total="72.3%"
            percent={0}
            timing="UPI: 85% | Card: 68%"
            icon="ph:warning-circle-duotone"
            iconColor="primary.main"
            hideArrow
            chart={{
              series: [],
            }}
            sx={{ flex: 1 }}
          />
        </Stack>

        <LiquidityEngineListView />
        <LiquidityEngineCard disbursements={DISBURSEMENT_HISTORY} />
      </Stack>
    </Container>
  );
}