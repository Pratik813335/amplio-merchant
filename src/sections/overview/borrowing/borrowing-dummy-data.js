export const BorrowingDummyData = {
  dashboardSummary: {
    totalTransactions: 6,
    amountTransferred: 14150000,
    amountExpected: 14008500,
    pendingReceivables: 0,
    settledTransactions: 5
  },

  borrowings: [
    {
      transactionId: "TXN001234572",
      dateTime: "2026-03-01T14:20:18",
      amountTransferred: 1500000,
      fromAccount: "XXXXXX2468",
      toAccount: "XXXXXX001",
      poolId: "POOL-001",
      amountExpected: 1485000,
      expectedReceipt: "2026-03-01T19:00:00",
      status: "Completed"
    },
    {
      transactionId: "TXN001234571",
      dateTime: "2026-03-02T13:45:33",
      amountTransferred: 4200000,
      fromAccount: "XXXXXX7890",
      toAccount: "XXXXXX002",
      poolId: "POOL-002",
      amountExpected: 4158000,
      expectedReceipt: "2026-03-02T18:00:00",
      status: "Failed"
    },
    {
      transactionId: "TXN001234570",
      dateTime: "2026-03-03T12:30:56",
      amountTransferred: 950000,
      fromAccount: "XXXXXX3456",
      toAccount: "XXXXXX001",
      poolId: "POOL-001",
      amountExpected: 940500,
      expectedReceipt: "2026-03-03T17:00:00",
      status: "Completed"
    },
    {
      transactionId: "TXN001234569",
      dateTime: "2026-03-04T11:05:12",
      amountTransferred: 3200000,
      fromAccount: "XXXXXX9012",
      toAccount: "XXXXXX002",
      poolId: "POOL-002",
      amountExpected: 3168000,
      expectedReceipt: "2026-03-04T16:00:00",
      status: "Settled"
    }
  ],

  borrowingDetails: {
    borrowingId: "TXN001234572",
    status: "Completed",
    borrowingDate: "2026-03-01T14:20:18",
    tenor: "7 days",
    interestRate: "1% per week",

    amounts: {
      borrowingAmount: 1500000,
      netDisbursed: 1485000,
      expectedRepayment: 1515000
    },

    merchantInformation: {
      merchantName: "Sports Equipment Co",
      merchantId: "MERCH-2468",
      sourceAccount: "MERCHANT-ACC-2468"
    },

    poolAccountDetails: {
      poolId: "POOL-001",
      destinationAccount: "POOL-SPV-001",
      referenceId: "REF-2026-001239"
    },

    deductionsBreakdown: {
      platformFee: 7500,
      processingFee: 4500,
      gst: 2160,
      interestCharge: 840,
      totalDeductions: 15000
    },

    repaymentDetails: {
      principalRepaid: 1500000,
      interestRepaid: 15000,
      totalRepaid: 1515000,
      outstandingAmount: 0
    },

    approvalDetails: {
      initiatedBy: "Trustee",
      approvedBy: "Manual Review",
      approvalStatus: "Approved"
    },

    settlementTimeline: [
      {
        stage: "Borrowing Initiated",
        date: "2026-03-01T14:20:18",
        initiatedBy: "Trustee"
      },
      {
        stage: "Amount Disbursed",
        date: "2026-03-01T14:20:18",
        amount: 1485000
      },
      {
        stage: "Expected Settlement",
        date: "2026-03-08",
        amountExpected: 1515000
      },
      {
        stage: "Settlement Completed",
        date: "2026-03-08",
        amountReceived: 1515000
      }
    ]
  },

  borrowingTransactions: {
    borrowingId: "TXN001234572",

    summary: {
      totalTransactions: 6,
      totalValue: 1322000,
      financed: 4,
      ineligible: 2
    },

    transactions: [
      {
        transactionId: "RCV-2026-041",
        amount: 189000,
        rail: "UPI",
        bank: "HDFC",
        settlementTiming: "T+0",
        expectedSettlement: "2026-03-01",
        status: "Ineligible",
        fraudScore: 9,
        amlStatus: "Clear"
      },
      {
        transactionId: "RCV-2026-042",
        amount: 234000,
        rail: "Card",
        bank: "ICICI",
        settlementTiming: "T+1",
        expectedSettlement: "2026-03-02",
        status: "Financed",
        fraudScore: 10,
        amlStatus: "Clear"
      },
      {
        transactionId: "RCV-2026-043",
        amount: 278000,
        rail: "QR",
        bank: "Axis",
        settlementTiming: "T+2",
        expectedSettlement: "2026-03-03",
        status: "Financed",
        fraudScore: 11,
        amlStatus: "Clear"
      },
      {
        transactionId: "RCV-2026-044",
        amount: 198000,
        rail: "UPI",
        bank: "SBI",
        settlementTiming: "T+1",
        expectedSettlement: "2026-03-02",
        status: "Financed",
        fraudScore: 8,
        amlStatus: "Clear"
      },
      {
        transactionId: "RCV-2026-045",
        amount: 267000,
        rail: "Card",
        bank: "HDFC",
        settlementTiming: "T+1",
        expectedSettlement: "2026-03-02",
        status: "Ineligible",
        fraudScore: 12,
        amlStatus: "Clear"
      },
      {
        transactionId: "RCV-2026-046",
        amount: 156000,
        rail: "UPI",
        bank: "ICICI",
        settlementTiming: "T+3",
        expectedSettlement: "2026-03-04",
        status: "Financed",
        fraudScore: 7,
        amlStatus: "Clear"
      }
    ]
  }
};