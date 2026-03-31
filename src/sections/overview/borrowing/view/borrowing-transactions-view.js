// @mui
import { useTheme } from '@mui/material/styles';

import { Container, Grid, Typography, Button, Stack, IconButton } from '@mui/material';
import { fNumber } from 'src/utils/format-number';

// components
import { useSettingsContext } from 'src/components/settings';
import { useRouter, useParams } from 'src/routes/hook';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import Iconify from 'src/components/iconify';
import BorrowingTransactionsList from '../borrowing-transactions-list';
import borrowingDummyData from '../borrowing-dummy-data';
// ----------------------------------------------------------------------

export default function BorrowingTransactionsView() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();

  const settings = useSettingsContext();

  const selectedBorrowing = borrowingDummyData.find((item) => item.transactionId === id);
  const transactions = selectedBorrowing?.transactions;

  if (!transactions) return <div>No Data Found</div>;

  const DASHBOARD_CARDS = [
    {
      transactionsTotal: transactions.summary.totalTransactions,
    
  
      valueTotal: transactions.summary.totalValue,
    
  
      financedTotal: transactions.summary.financed,
    
  
      ineligibleTotal: transactions.summary.ineligible,
    },
  ];

  const handleBack = () => {
    router.push(-1);
  };

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
          <>
          <Grid item xs={12} sm={6} md={3}>
            <WidgetSummaryCard
              // key={card.title}
              title='Total Transactions'
              // percent={card.percent}
              total={card.transactionsTotal}
              // timing={card.timing}
              // icon={card.icon}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <WidgetSummaryCard
              // key={card.title}
              title='Total Value'
              // percent={card.percent}
              total={` ₹${fNumber(card.valueTotal)}`}
              // timing={card.timing}
              // icon={card.icon}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <WidgetSummaryCard
              // key={card.title}
              title='Financed'
              // percent={card.percent}
              total={card.financedTotal}
              // timing={card.timing}
              // icon={card.icon}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <WidgetSummaryCard
              // key={card.title}
              title='Ineligible'
              // percent={card.percent}
              total={card.ineligibleTotal}
              // timing={card.timing}
              // icon={card.icon}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>
          </>
        ))}

        <Grid item xs={12}>
          <BorrowingTransactionsList data={transactions.list} />
        </Grid>
      </Grid>
    </Container>
  );
}
