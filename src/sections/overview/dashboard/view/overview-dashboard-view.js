// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
    _ecommerceSalesOverview,
} from 'src/_mock';
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
        "title": "Instant Liquidity Available",
        "percent": 12,
        "total": 480000,
        "timing": "Ready to disburse",
        "icon": "mdi:drop-outline"
    },
    {
        "title": "Eligible Receivables (Today) Receivables (Today) Receivables (Today) Receivables (Today)  ",
        "percent": 3.1,
        "total": 24550,
        "timing": "Auto-financed",
        "icon": "mdi:trending-up"
    },
    {
        "title": "Outstanding Financed",
        "percent": -1.8,
        "total": 78787878,
        "timing": "Across 3 buckets",
        "icon": "mdi:clock-outline"
    },
    {
        "title": "Bank Settlement Score",
        "percent": 4.5,
        "total": "98.5%",
        "timing": "Based on 90-day history",
        "icon": "mdi:check-circle-outline"
    },


]

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

                {DASHBOARD_CARDS.map((card) => (
                    <Grid item xs={12} md={3}>
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
                {/* <Grid xs={12} md={12} >
                    <DashboardTransactionsFeed
                        title="Live Transactions Feed"
                        tableData={_transactions_feed}
                        tableLabels={[
                            { id: 'id', label: 'Transaction ID' },
                            { id: 'amount', label: 'Amount' },
                            { id: 'rail', label: 'Rail' },
                            { id: 'bank', label: 'Bank' },
                            { id: 'time', label: 'Time' },
                            { id: 'status', label: 'Status' },
                            { id: '' },
                        ]}
                    />
                </Grid> */}

                <Grid xs={12} md={12} >
                    <DashboardTransactionTable />
                </Grid>

            </Grid>
        </Container>

    );
}
