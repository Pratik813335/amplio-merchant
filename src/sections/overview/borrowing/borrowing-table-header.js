import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';

export default function BorrowingTableHeader() {
  const settings = useSettingsContext();

  const categories = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const DASHBOARD_CARDS = [
    {
      transactionTotal: 6,
      title: 'Amount Transferred',
      transferredTotal: 14250000,
      transferredPercent: 12,
      expectedTotal: '14008500',
      pendingTotal: 79854368,
      settledPercent: 95,
      settledTotal: 5,
 
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
    <>

      <Box display="flex" justifyContent="space-between" pb={3}>
        <Box>
          <Typography variant="h4" >
            Borrowing List
          </Typography>
          <Typography variant='subtitle2'>One borrowing per day - Complete borrowing history with deductions and repayments. </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}   
        >
          <Button
            variant="outlined"
            startIcon={<Iconify icon="fa7-solid:rotate" />}
            sx={{ width: 140, height: 40 }}   
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="tabler:download-filled" />}
            sx={{ width: 140, height: 40 }}  
          >
            Export
          </Button>
        </Box>
      </Box>

      <Stack spacing={3}>
      <Grid container spacing={3} mb={3}>
  {DASHBOARD_CARDS.map((card, i) => (
    <Grid container spacing={3} key={i}>
      
      <Grid item xs={12} md={4}>
        <WidgetSummaryCard
          title="Total Transaction"
          total={formatNumber(card.transactionTotal)}
          timing="Today's Count"
          icon="codicon:pulse"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <WidgetSummaryCard
          title="Amount Transferred"
          percent={card.transferredPercent}
          total={`₹${formatNumber(card.transferredTotal)}`}
          timing="Total outflow"
          icon="mdi:trending-up"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <WidgetSummaryCard
          title="Amount Expected"
          total={`₹${formatNumber(card.expectedTotal)}`}
          timing="Total receivables"
          icon="mynaui:dollar"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <WidgetSummaryCard
          title="Pending Receivables"
          total= {`₹${formatNumber(card.pendingTotal)}`}
          timing="Awaiting settlement"
          icon="tabler:clock"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <WidgetSummaryCard
          title="Settled Transactions"
          percent={card.settledPercent}
          total={formatNumber(card.settledTotal)}
          timing="Successfully completed"
          icon="prime:check-circle"
        />
      </Grid>

    </Grid>
  ))}
</Grid>

        {/* <BorrowingListView /> */}
      </Stack>
    </>
  );
}
