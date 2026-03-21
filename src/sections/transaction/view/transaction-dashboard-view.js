import { Container, Grid, Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import WidgetSummaryCard from '../../../components/card/widget-summary-card';
import TransactionGraph from '../transaction-graph';
import TransactionTable from '../transaction-table';

export function TransactionView() {
  const settings = useSettingsContext();

  const categories = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const DASHBOARD_CARDS = [
    {
      title: "Today's Transaction",
      percent: 2.6,
      total: 187,
      timing: 'Live Count',
      icon: 'codicon:pulse',
    },
    {
      title: 'Total Volume',
      percent: 3.1,
      total: 2450,
      timing: 'Today',
      icon: 'mdi:trending-up',
    },
    {
      title: 'Success Rate',
      total: '54.20%',
      timing: 'Last 24 hours',
      icon: 'codicon:pulse',
    },
    {
      title: 'Avg Transaction',
      percent: 4.5,
      total: 1290,
      timing: 'Today',
      icon: 'mdi:trending-up',
    },
  ];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          {DASHBOARD_CARDS.filter((card) => card.total !== undefined && card.total !== null).map(
            (card, i) => (
              <Grid key={i} item xs={12} md={3}>
                <WidgetSummaryCard
                  title={card.title}
                  percent={card.percent}
                  total={card.total}
                  timing={card.timing}
                  icon={card.icon}
                />
              </Grid>
            )
          )}
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
                    data: [10, 41, 35, 51, 49, 100],
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