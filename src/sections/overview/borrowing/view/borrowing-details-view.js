import { useTheme } from '@mui/material/styles';

import { Container, Grid } from "@mui/material";

// components
import { useSettingsContext } from 'src/components/settings';
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import BorrowingDetailsCard from 'src/sections/overview/borrowing/borrowing-details-card';
import BorrowingDetailsHeader from '../borrowing-details-header';

// dummy cards data
const _Dummy_Cards_Data = [
    {
        "title": "Borrowing Amount",
        "percent": '',
        "amount": 480000,
        "description": "Ready to disburse",
        "icon": "mdi:drop-outline"
    },
    {
        "title": "Net Disbursed",
        "percent": '',
        "amount": 58478,
        "description": "Auto-financed",
        "icon": "mdi:trending-down"
    },
    {
        "title": "Expected Repayment",
        "percent": '',
        "amount": 78787878,
        "description": "Across 3 buckets",
        "icon": "uil:atm-card"
    },
]

// merchantInfo 
const merchantRows = [
    { label: "Merchant Name", value: 'Dhanesh' },
    { label: "Merchant ID", value: 'ABC123' },
    { label: "Source Account", value: 'MERCHANT-ACC-7890' }
];

// AccountDetails
const poolRows = [
    { label: "Pool ID", value: 'POOL-002' },
    { label: "Destination Account", value: "POOL-SPV-002" },
    { label: "Reference ID", value: 'REF-2026-001238' }
];

// deduction breakDown
const deductionRows = [
    { label: "Platform Fee (0.5%)", value: '-21,000', type: "amount" },
    { label: "Processing Fee (0.3%)", value: '-12600', type: "amount" },
    { label: "GST (18% on fees)", value: '-6048', type: "amount" },
    { label: "Interest Charge", value: '-2352', type: "amount" },
    { label: "Total Deductions", value: '-42000', type: "amount" }
];

// timeline rows 

const timelineRows = [
    { label: "Borrowing Initiated", value: 'Initiated by: System Auto' },
    { label: "Amount Disbursed", value: '41,58,000 credited', type: "amount", color: "success.main" },
    { label: "Expected Settlement", value: "Repayment of ₹42,42,000 expected" },
    { label: "Status", value: 'In progress...' }
];

// 
const repaymentRows = [
    { label: "Principal Repaid", value: 0, type: "amount" },
    { label: "Interest Repaid", value: 0, type: "amount" },
    { label: "Total Repaid", value: 0, type: "amount" },
    { label: "Outstanding Amount", value: 0, type: "amount", color: "error.main" }
];

// 
const approvalRows = [
    {
        label: "Initiated By",
        value: "Settlement Service"
    },
    {
        label: "Approved By",
        value: "Risk Assessment Engine"
    },
    {
        label: "Approval Status",
        value: "Approved",
        // type: "status",
        color: "success.main"
    }
];


export default function BorrowingDetailsView() {
    const settings = useSettingsContext();
    const theme = useTheme();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>

            <Grid container spacing={3}>

                {/* Card Header */}
                <Grid item xs={12} md={12}>
                    <BorrowingDetailsHeader />
                </Grid>

                {/* Cards */}
                {_Dummy_Cards_Data.map((card) => (
                    <Grid item xs={12} md={4}>
                        <WidgetSummaryCard
                            key={card.title}
                            title={card.title}
                            percent={card.percent}
                            total={card.amount}
                            icon={card.icon}
                            timing={card.description}
                            chart={{
                                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                            }}
                        />
                    </Grid>
                ))}

                <Grid item xs={12} md={6}>
                    <BorrowingDetailsCard
                        title="Merchant Information"
                        icon="mdi:store-outline"
                        rows={merchantRows}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BorrowingDetailsCard
                        title="Pool & Account Details"
                        icon="mdi:bank-outline"
                        rows={poolRows}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BorrowingDetailsCard
                        title="Deductions Breakdown"
                        icon="mdi:receipt-outline"
                        rows={deductionRows}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BorrowingDetailsCard
                        title="Settlement Timeline"
                        icon="mdi:calendar-outline"
                        rows={timelineRows}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BorrowingDetailsCard
                        title="Repayment Details"
                        icon="mdi:cash-sync"
                        rows={repaymentRows}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BorrowingDetailsCard
                        title="Approval Details"
                        icon="mdi:shield-check-outline"
                        rows={approvalRows}
                    />
                </Grid>


            </Grid>

        </Container>
    )
}