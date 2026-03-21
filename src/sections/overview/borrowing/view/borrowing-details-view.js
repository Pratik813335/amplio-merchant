import { useParams } from 'src/routes/hook';

import { Container, Grid } from '@mui/material';

// components
import { useSettingsContext } from 'src/components/settings';

import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import BorrowingDetailsCard from 'src/sections/overview/borrowing/borrowing-details-card';
import BorrowingDetailsHeader from '../borrowing-details-header';
import borrowingDummyData from '../borrowing-dummy-data';

export default function BorrowingDetailsView() {
  const { id } = useParams();
  const settings = useSettingsContext();

  const selectedBorrowing = borrowingDummyData.find((item) => item.transactionId === id);
  const details = selectedBorrowing?.details;

  if (!details) {
    return <div>No Data Found</div>;
  }

  const cardsData = [
    {
      title: 'Borrowing Amount',
      amount: details.summary.borrowingAmount,
      description: 'Borrowed',
      icon: 'mdi:drop-outline',
    },
    {
      title: 'Net Disbursed',
      amount: details.summary.netDisbursed,
      description: 'Disbursed',
      icon: 'mdi:trending-down',
    },
    {
      title: 'Expected Repayment',
      amount: details.summary.expectedRepayment,
      description: 'To be paid',
      icon: 'uil:atm-card',
    },
  ];

  const merchantRows = [
    { label: 'Merchant Name', value: details.merchantInfo.name },
    { label: 'Merchant ID', value: details.merchantInfo.merchantId },
    { label: 'Source Account', value: details.merchantInfo.sourceAccount },
  ];

  const poolRows = [
    { label: 'Pool ID', value: details.poolAccount.poolId },
    { label: 'Destination Account', value: details.poolAccount.destinationAccount },
    { label: 'Reference ID', value: details.poolAccount.referenceId },
  ];

  const deductionRows = [
    { label: 'Platform Fee', value: details.deductions.platformFee, type: 'amount' },
    { label: 'Processing Fee', value: details.deductions.processingFee, type: 'amount' },
    { label: 'GST', value: details.deductions.gst, type: 'amount' },
    { label: 'Interest Charge', value: details.deductions.interestCharge, type: 'amount' },
    { label: 'Total', value: details.deductions.total, type: 'amount' },
  ];

  const timelineRows = [
    { label: 'Initiated By', value: details.settlementTimeline.initiatedBy },
    {
      label: 'Amount Disbursed',
      value: details.settlementTimeline.amountDisbursed,
      type: 'amount',
    },
    { label: 'Expected Repayment', value: details.settlementTimeline.expectedRepayment },
    { label: 'Status', value: details.settlementTimeline.status },
  ];

  const repaymentRows = [
    { label: 'Principal Repaid', value: details.repayment.principalRepaid, type: 'amount' },
    { label: 'Interest Repaid', value: details.repayment.interestRepaid, type: 'amount' },
    { label: 'Total Repaid', value: details.repayment.totalRepaid, type: 'amount' },
    { label: 'Outstanding', value: details.repayment.outstanding, type: 'amount' },
  ];

  const approvalRows = [
    { label: 'Initiated By', value: details.approval.initiatedBy },
    { label: 'Approved By', value: details.approval.approvedBy },
    { label: 'Status', value: details.approval.status },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* Card Header */}
        <Grid item xs={12} md={12}>  
          <BorrowingDetailsHeader
            transactionId={id}
            status={details.status}
            borrowingDate={details.borrowingDate}
            tenor={details.tenor}
            interestRate={details.interestRate}
          />
        </Grid>

        {/* Cards */}
        {cardsData.map((card) => (
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
  );
}
