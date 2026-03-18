import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';

export default function BorrowingTableHeader() {
  const settings = useSettingsContext();

  const categories = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const DASHBOARD_CARDS = [
    {
      title: "Total Transaction",
      total: 6,
      timing: 'Todays Count',
      icon: 'codicon:pulse',
    },
    {
      title: 'Amount Transferred',
      total: 14250000,
      percent: 12,
      timing: 'Total outflow',
      icon: 'mdi:trending-up',
    },
    {
      title: 'Amount Expected',
      total: '14008500',
      timing: 'Total receivables',
      icon: 'mynaui:dollar',
    },
    {
      title: 'Pending Receivables',
      total: 0,
      timing: 'Awaiting settlement',
      icon: 'tabler:clock',
    },
    {
      title: 'Settled Transactions',
      percent: 95,
      total: 5,
      timing: 'Successfully cpmpleted',
      icon: 'prime:check-circle',
    },
  ];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box display="flex" justifyContent="space-between" pb={3}>
        <Box>
          <Typography variant="h4" >
            Borrowing List
          </Typography>
          <Typography variant='subtitle2'>One borrowing per day - Complete borrowing history with deductions and repayments. </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignContent="center" >
          <Button variant="outlined" startIcon={<Iconify icon="fa7-solid:rotate" />}>
            Refresh
          </Button>
          <Button variant='contained' sx={{ ml: 2 }} color='primary' startIcon={<Iconify icon="tabler:download-filled" />}>Export</Button>
        </Box>
      </Box>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          {DASHBOARD_CARDS.filter((card) => card.total !== undefined && card.total !== null).map(
            (card, i) => (
              <Grid key={i} item xs={12} md={4}>
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

        {/* <BorrowingListView /> */}
      </Stack>
    </Container>
  );
}
