import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import { useSettingsContext } from 'src/components/settings';
import { useState } from 'react';

import Iconify from 'src/components/iconify';
import BorrowingListView from '../borrowing-list-table';


export function BorrowingView() {
  const settings = useSettingsContext();

  const categories = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const products = [
    {
      txnId: "TXN001234572",
      time: "2026-03-18 14:20:18",
      transerred: 1500000,
      fromaccount: "XXXXXX2468",
      toaccount: "XXXXXX-001",
      poolid: "POOL-001",
      expectedamount: 1485000,
      expectedreceipt: "2026-03-01 19:00:00",
      status: "Completed",
    },
    {
      txnId: "TXN001234571",
      time: "2026-03-17 13:45:33",
      transerred: 4200000,
      fromaccount: "XXXXXX7890",
      toaccount: "XXXXXX-002",
      poolid: "POOL-002",
      expectedamount: 4158000,
      expectedreceipt: "2026-03-02 18:00:00",
      status: "Failed",
    },
    {
      txnId: "TXN001234570",
      time: "2026-03-16 12:30:56",
      transerred: 950000,
      fromaccount: "XXXXXX3456",
      toaccount: "XXXXXX-001",
      poolid: "POOL-001",
      expectedamount: 940500,
      expectedreceipt: "2026-03-03 17:00:00",
      status: "Completed",
    },
    {
      txnId: "TXN001234569",
      time: "2026-03-18 11:05:12",
      transerred: 3200000,
      fromaccount: "XXXXXX9012",
      toaccount: "XXXXXX-002",
      poolid: "POOL-002",
      expectedamount: 3168000,
      expectedreceipt: "2026-03-04 16:00:00",
      status: "Settled",
    },
    {
      txnId: "TXN001234568",
      time: "2026-03-17 10:22:45",
      transerred: 1800000,
      fromaccount: "XXXXXX5678",
      toaccount: "XXXXXX-001",
      poolid: "POOL-001",
      expectedamount: 1782000,
      expectedreceipt: "2026-03-05 15:30:00",
      status: "Settled",
    },
    {
      txnId: "TXN001234567",
      time: "2026-03-16 09:15:23",
      transerred: 2500000,
      fromaccount: "XXXXXX1234",
      toaccount: "XXXXXX-001",
      poolid: "POOL-001",
      expectedamount: 2475000,
      expectedreceipt: "2026-03-06 14:00:00",
      status: "Completed",
    },
    {
      txnId: "TXN001234566",
      time: "2026-03-16 16:40:10",
      transerred: 1200000,
      fromaccount: "XXXXXX4321",
      toaccount: "XXXXXX-003",
      poolid: "POOL-003",
      expectedamount: 1188000,
      expectedreceipt: "2026-03-07 20:00:00",
      status: "Pending",
    },
    {
      txnId: "TXN001234565",
      time: "2026-03-18 15:10:55",
      transerred: 800000,
      fromaccount: "XXXXXX8765",
      toaccount: "XXXXXX-002",
      poolid: "POOL-002",
      expectedamount: 792000,
      expectedreceipt: "2026-03-08 18:30:00",
      status: "Failed",
    },
    {
      txnId: "TXN001234564",
      time: "2026-03-17 14:05:42",
      transerred: 1000000,
      fromaccount: "XXXXXX6543",
      toaccount: "XXXXXX-001",
      poolid: "POOL-001",
      expectedamount: 1980000,
      expectedreceipt: "2026-03-09 19:30:00",
      status: "Completed",
    },
    {
      txnId: "TXN001234563",
      time: "2026-03-16 12:55:11",
      transerred: 550000,
      fromaccount: "XXXXXX2109",
      toaccount: "XXXXXX-003",
      poolid: "POOL-003",
      expectedamount: 544500,
      expectedreceipt: "2026-03-10 16:00:00",
      status: "Pending",
    },
  ];
  const [tableData, setTableData] = useState(products);

  const totalTransactions = tableData.length;

const totalTransferred = tableData.reduce(
  (sum, item) => sum + item.transerred,
  0
);

const totalExpected = tableData.reduce(
  (sum, item) => sum + item.expectedamount,
  0
);

const pendingReceivables = tableData.filter(
  (item) => item.status === 'Pending'
).length;

const settledTransactions = tableData.filter(
  (item) => item.status === 'Settled' || item.status === 'Completed'
).length;
const getPercent = (value, total) => {
  if (!total) return 0;
  return ((value / total) * 100).toFixed(1);
};
const DASHBOARD_CARDS = [
  {
    title: "Total Transaction",
    total: totalTransactions,
    timing: 'Todays Count',
    icon: 'codicon:pulse',
  },
  {
    title: 'Amount Transferred',
    total: totalTransferred,
    percent: getPercent(totalTransferred, totalExpected),
    timing: 'Total outflow',
    icon: 'mdi:trending-up',
  },
  {
    title: 'Amount Expected',
    total: totalExpected,
    timing: 'Total receivables',
    icon: 'mynaui:dollar',
  },
  {
    title: 'Pending Receivables',
    total: pendingReceivables,
    timing: 'Awaiting settlement',
    icon: 'tabler:clock',
  },
  {
    title: 'Settled Transactions',
    total: settledTransactions,
    percent: getPercent(settledTransactions, totalTransactions),
    timing: 'Successfully completed',
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

        <BorrowingListView
  tableData={tableData}
  setTableData={setTableData}
/>
      </Stack>
    </Container>
  );
}
