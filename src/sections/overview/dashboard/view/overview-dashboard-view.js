// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock

// components
import { useSettingsContext } from 'src/components/settings';

// assests
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import DashboardPredictionTimeline from '../dashboard-prediction-timeline';
import DashboardActiveExposure from '../dashboard-active-exposure';
import DashboardEligibleReceivables from '../dashboard-eligible-receivables';
import DashboardAccountSummary from '../dashboard-account-summary';
// import DashboardTransactionsFeed from '../dashboard-transactions-feed';
import DashboardTransactionTable from '../dashboard-transaction-table';

//  Dummy Eligible receivables 
const _eligibleReceivables = [
    {
        label: 'D+0 (Today)',
        transactions: 1247,
        totalAmount: 25800,
        value: 80,
        color: 'success'
    },
    {
        label: 'D+1 (Tomorrow)',
        transactions: 1589,
        totalAmount: 324009,
        value: 90,
        color: 'primary'
    },
    {
        label: 'D+2 (Day After)',
        transactions: 892,
        totalAmount: 18600000,
        value: 95,
        color: 'warning'
    }
];

// Dummy data for widget summary 
const DASHBOARD_CARDS = [
    {
        "liquiditPercent": 12,
        "liquidityTotal": 480000,
        "receivablestiming": 5280000,
        "receivablesTotal": 6500000,
        "outstandingPercent": -1.8,
        "outstandingTotal": 78787878,
        "outstandingTiming":3,
        "settlementPercent": 4.5,
        "settlementTotal": 98.5,
        "settlementTiming": 90,
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
// ----------------------------------------------------------------------

export default function OverviewDashboardView() {
    const settings = useSettingsContext();
    const theme = useTheme();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            {/* <Typography
                variant="h4"
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            >
                Hi, Welcome back 👋
            </Typography> */}

            <Grid container spacing={3}>
                {DASHBOARD_CARDS.map((card) => {
                    const {
                        liquiditPercent,
                        liquidityTotal,
                        receivablestiming,
                        receivablesTotal,
                        outstandingPercent,
                        outstandingTotal,
                        outstandingTiming,
                        settlementPercent,
                        settlementTotal,
                        settlementTiming
                    } = card;
                    // {`₹${formatNumber(card.pendingTotal)}`}
                    return (
                        <>
                            <Grid item xs={12} md={3}>
                                <WidgetSummaryCard
                                    title="Instant Liquidity Available"
                                    percent={liquiditPercent}
                                    total={`₹${formatNumber(liquidityTotal)}`}
                                    timing="Ready to disburse"
                                    icon="mdi:drop-outline"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <WidgetSummaryCard
                                    title="Eligible Receivables (Today)"
                                    total={`₹${formatNumber(receivablesTotal)}`}
                                    timing={`Auto-financed: ₹${formatNumber(receivablestiming)}`}
                                    icon="mdi:trending-up"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <WidgetSummaryCard
                                    title="Outstanding Financed"
                                    percent={outstandingPercent}
                                    total={`₹${formatNumber(outstandingTotal)}`}
                                    timing={`Acroos ${formatNumber(outstandingTiming)} buckets`}
                                    icon="mdi:clock-outline"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <WidgetSummaryCard
                                    title="Bank Settlement Score"
                                    percent={settlementPercent}
                                    total={`${formatNumber(settlementTotal)}%`}
                                    timing={`Based on ${formatNumber(settlementTiming)}-day history`}
                                    icon="mdi:check-circle-outline"
                                />
                            </Grid>
                        </>
                    );
                })}

                {/* Settlement Prediction Timeline  */}
                <Grid xs={12} md={6} lg={8}>
                    <DashboardPredictionTimeline
                        title="Settlement Prediction Timeline"
                        subheader="Next 7 days forecast vs actual"
                        chart={{
                            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            series: [
                                {
                                    name: 'Predicted',
                                    data: [980000, 1450000, 3140000, 1250000, 6030000, 450000, 651000],
                                },
                                {
                                    name: 'Actual',
                                    data: [420000, 5406000, 3140000, 5003000, 7640000, 0, 2020000],
                                },
                            ],
                        }}
                    />
                </Grid>

                {/* Active Rail Exposure */}
                <Grid xs={12} md={6} lg={4}>
                    <DashboardActiveExposure
                        title="Active Rail Exposure"
                        chart={{
                            series: [
                                { label: 'UPI', value: 45 },
                                { label: 'QR', value: 30 },
                                { label: 'Card', value: 25 },
                                // { label: 'Android', value: 78343 },
                            ],
                        }}
                    />
                </Grid>

                {/* Eligible Receivables  */}
                <Grid xs={12} md={6} lg={6}>
                    <DashboardEligibleReceivables title="Eligible Receivables by Settlement Date" data={_eligibleReceivables} />
                </Grid>

                {/* Account Summary */}
                <Grid xs={12} md={6} lg={6}>
                    <DashboardAccountSummary
                        title="Account Summary"
                        currentBalance={187650}
                        sentAmount={25500}
                    />
                </Grid>

                {/* Live Transactions Feed  */}
                <Grid xs={12} md={12} >
                    <DashboardTransactionTable />
                </Grid>

            </Grid>
        </Container>

    );
}
