import { Container, Grid, Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useGetTransactions } from 'src/api/transaction';

import WidgetSummaryCard from '../../../components/card/widget-summary-card';
import TransactionGraph from '../transaction-graph';
import TransactionTable from './transaction-table-list-view';


// function to calculate transactions data
const calculateTransactionData = (data) => {

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0)
    // console.log("start of today", startOfToday);

    // yesterday 
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(startOfToday);


    // Today's Transaction 
    const todayTransactions = data.filter((transaction) => {
        const createdAt = new Date(transaction?.createdAt);
        return createdAt >= startOfToday && createdAt <= now;
    })

    // total today's transaction 
    const totalTransactionToday = todayTransactions.length;

    // yesterday's transaction
    const yesterdayTransactions = data.filter((transaction) => {
        const createdAt = new Date(transaction?.createdAt);
        return createdAt >= startOfYesterday && createdAt < endOfYesterday
    })

    const totalTransactionsYesterday = yesterdayTransactions.length;
    // Percent data
    let transactionPercent = 0;

    if (totalTransactionsYesterday === 0) {
        transactionPercent = totalTransactionToday > 0 ? 100 : 0;
    } else {
        transactionPercent = ((totalTransactionToday - totalTransactionsYesterday) / totalTransactionsYesterday) * 100;
    }

    // total amount 
    const totalVolumetoday = todayTransactions.reduce(
        (sum, transaction) => sum + (transaction?.totalRecieved || 0), 0);

    // average transaxtion
    const averageTransactonToday = totalTransactionToday ? totalVolumetoday / totalTransactionToday : 0;

    // last 24 hours transactions
    const last24HoursTransactions = data.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= last24Hours && createdAt <= now
    })
    const totalLast24Hours = last24HoursTransactions.length;

    // success rate from last 24 hours transactions

    const successLast24 = last24HoursTransactions.filter(
        (transaction) => transaction.status === "captured").length;


    const successRate = totalLast24Hours ? (successLast24 / totalLast24Hours) * 100 : 0

    return {
        totalTransactionToday,
        transactionPercent,
        totalVolumetoday,
        successRate,
        averageTransactonToday,
    }

}



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

            "transactionPercent": calculatedTransactions.transactionPercent.toFixed(2),
            "successPercent": calculatedTransactions.successRate.toFixed(2),
            "todayTotalTransaction": calculatedTransactions.totalTransactionToday,
            "totalVolume": calculatedTransactions.totalVolumetoday,
            "successRate": calculatedTransactions.successRate.toFixed(2),
            "avgTransaction": calculatedTransactions.averageTransactonToday.toFixed(2),
            "successRateHistory": 24,

        },


    ]

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
