// @mui
import { useTheme } from '@mui/material/styles';

import { Container, Grid, Typography, Button, Stack, IconButton } from '@mui/material';
import { useParams } from 'react-router';

// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
//
import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hook';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import Iconify from 'src/components/iconify';
import BorrowingTransactionsList from '../borrowing-transactions-list';
import BorrowingDummyData from './borrowing-dummy-data';
// ----------------------------------------------------------------------

export default function BorrowingTransactionsView() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();

  const settings = useSettingsContext();

  const selectedData = BorrowingDummyData?.find(
  (item) => item.transactionId === id
);

if (!selectedData) return <div>No Data Found</div>;

const transactions = selectedData.transactions;


const DASHBOARD_CARDS = [
  {
    title: 'Total Transactions',
    total: transactions.summary.totalTransactions,
  },
  {
    title: 'Total Value',
    total: transactions.summary.totalValue,
  },
  {
    title: 'Financed',
    total: transactions.summary.financed,
  },
  {
    title: 'Ineligible',
    total: transactions.summary.ineligible,
  },
];

  const handleBack = () => {
    router.push(-1);
  }

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
              <IconButton onClick={handleBack}>
                <Iconify icon="eva:arrow-back-fill" width={24} />
              </IconButton>

              <Stack>
                <Typography variant="h4">Borrowing Transactions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Borrowing ID : <strong>{id}</strong>
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
                bgcolor: theme.palette.primary.main,
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
          <BorrowingTransactionsList data={transactions.list} />
        </Grid>
      </Grid>
    </Container>
  );
}
