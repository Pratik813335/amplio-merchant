import { Container, Grid, Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useGetTransactions } from 'src/api/transaction';

import WidgetSummaryCard from '../../../components/card/widget-summary-card';
import TransactionGraph from '../transaction-graph';
import TransactionTable from './transaction-table-list-view';

export function TransactionView() {
  const settings = useSettingsContext();
  const { transaction = [], transactionLoading } = useGetTransactions();

  const now = new Date();
  const countByHour = {};

  transaction.forEach((t) => {
    const tTime = new Date(t.createdAt);
    if (tTime >= new Date(now.getTime() - 5 * 60 * 60 * 1000)) {
      const hour = tTime.getHours();
      countByHour[hour] = (countByHour[hour] || 0) + 1;
    }
  });

  const categories = [];
  const data = [];
  for (let i = 4; i >= 0; i -= 1) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours();
    categories.push(`${hour}:00`);
    data.push(countByHour[hour] || 0);
  };

  const DASHBOARD_CARDS = [
    {
      transactionPercent: -1.6,
      successPercent: 3.1,
      todayTotalTransaction: 187,
      totalVolume: 2450,
      successRate: 54.2,
      avgTransaction: 1290,
      successRateHistory: 24,
    },
  ];

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          {DASHBOARD_CARDS.map((card, i) => (
            <>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Today's Transactions"
                  percent={card.transactionPercent}
                  total={formatNumber(card.todayTotalTransaction)}
                  timing="Live Count"
                  icon="codicon:pulse"
                />
              </Grid>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Total Volume"
                  percent={card.percent}
                  total={`₹${formatNumber(card.totalVolume)}`}
                  timing="Today"
                  icon="mdi:trending-up"
                />
              </Grid>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Success Rate"
                  percent={card.successPercent}
                  total={`${card.successRate}%`}
                  timing={`Last ${card.successRateHistory} hours`}
                  icon="codicon:pulse"
                />
              </Grid>
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title="Avg Transaction"
                  percent={card.percent}
                  total={`₹${formatNumber(card.avgTransaction)}`}
                  timing="Today"
                  icon="mdi:trending-up"
                />
              </Grid>
            </>
          ))}
        </Grid>
        <TransactionGraph
          title="Transaction Volume Timeline (Last 5 Hours)"
          chart={{
            categories,
            series: [
              {
                data: [
                  {
                    name: 'Transaction Count',
                    data,
                  },
                ],
              },
            ],
          }}
        />
        <TransactionTable />
      </Stack>
    </Container>
  );
}
