// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography, Button, Stack, IconButton } from '@mui/material';

// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
//
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import Iconify from 'src/components/iconify';
import BorrowingTransactionsListView from './borrowing-transactions-list-view';
// ----------------------------------------------------------------------

export default function BorrowingTransactions() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const DASHBOARD_CARDS = [
    {
      title: 'Total Transactions',
      total: 5,
    },
    {
      title: 'Total Value',
      total: 811000,
    },
    {
      title: 'Financed',
      total: 3,
    },
    {
      title: 'Ineligible',
      total: 2,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton>
                <Iconify icon="eva:arrow-back-fill" width={24} />
              </IconButton>

              <Stack>
                <Typography variant="h4">Borrowing Transactions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Borrowing ID : <strong>TXN001234572</strong>
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:export-variant" />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Export Transactions
            </Button>
          </Stack>
        </Grid>

        {DASHBOARD_CARDS.map((card) => (
          <Grid item xs={12} sm={6} md={3}>
            <WidgetSummaryCard
              key={card.title}
              title={card.title}
              percent={card.percent}
              total={card.total}
              timing={card.timing}
              icon={card.icon}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <BorrowingTransactionsListView />
        </Grid>
      </Grid>
    </Container>
  );
}
