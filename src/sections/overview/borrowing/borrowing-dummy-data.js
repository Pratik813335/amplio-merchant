const BorrowingDummyData = [
  {
    transactionId: 'TXN001234570',
    id: 'TXN001234570',
    time: '2026-03-03 12:30:00',
    transerred: 950000,
    fromaccount: 'XXXXXX3456',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-001',
    expectedamount: 940500,
    expectedreceipt: '2026-03-03 17:00:00',
    status: 'Completed',

    merchant: {
      name: 'Demo Merchant 1',
      id: 'M001',
      account: 'MERCHANT-ACC-7890'
    },

    deductions: {
      platformFee: 21000,
      processingFee: 12600,
      gst: 6048,
      interest: 2352
    },

    listView: {
      dateTime: '03 Mar 2026, 12:30 PM',
      amountTransferred: 950000,
      fromAccount: 'XXXXXX3456',
      toAccount: 'XXXXXX-001',
      poolId: 'POOL-001',
      expectedAmount: 940500,
      expectedReceipt: '03 Mar 2026, 5:00 PM',
      status: 'Completed',
    },

    details: {
      status: 'Success',
      borrowingDate: '2026-03-03 12:30:56',
      tenor: '7 days',
      interestRate: '1% per week',
    },

    transactions: {
      summary: {
        totalTransactions: 5,
        totalValue: 811000,
        financed: 3,
        ineligible: 2,
      },
      list: [
        {
          id: 'TXN001',
          transactionId: 'TXN001',
          amount: 12000,
          rail: 'UPI',
          bank: 'HDFC',
          settlementTiming: 'T+1',
          expectedSettlement: '2026-03-18',
          status: 'financed',
          fraudScore: 12,
          amlStatus: 'clear',
        },
        {
          id: 'TXN002',
          transactionId: 'TXN002',
          amount: 8000,
          rail: 'IMPS',
          bank: 'ICICI',
          settlementTiming: 'Instant',
          expectedSettlement: '2026-03-17',
          status: 'eligible',
          fraudScore: 5,
          amlStatus: 'clear',
        },
        {
          id: 'TXN003',
          transactionId: 'TXN003',
          amount: 15000,
          rail: 'NEFT',
          bank: 'SBI',
          settlementTiming: 'T+2',
          expectedSettlement: '2026-03-19',
          status: 'ineligible',
          fraudScore: 45,
          amlStatus: 'review',
        },
        {
          id: 'TXN004',
          transactionId: 'TXN004',
          amount: 5000,
          rail: 'RTGS',
          bank: 'Axis',
          settlementTiming: 'Same Day',
          expectedSettlement: '2026-03-17',
          status: 'delayed',
          fraudScore: 22,
          amlStatus: 'pending',
        },
        {
          id: 'TXN005',
          transactionId: 'TXN005',
          amount: 22000,
          rail: 'UPI',
          bank: 'Kotak',
          settlementTiming: 'T+1',
          expectedSettlement: '2026-03-18',
          status: 'financed',
          fraudScore: 9,
          amlStatus: 'clear',
        }
      ],
    },
  },

  {
    transactionId: 'TXN001234571',
    id: 'TXN001234571',
    time: '2026-03-02 13:45:00',
    transerred: 4200000,
    fromaccount: 'XXXXXX7890',
    toaccount: 'XXXXXX-002',
    poolid: 'POOL-002',
    expectedamount: 4158000,
    expectedreceipt: '2026-03-02 18:00:00',
    status: 'Failed',

    merchant: {
      name: 'Demo Merchant 2',
      id: 'M002',
      account: 'MERCHANT-ACC-4567'
    },

    deductions: {
      platformFee: 15000,
      processingFee: 9000,
      gst: 4320,
      interest: 1800
    },

    listView: {
      dateTime: '02 Mar 2026, 1:45 PM',
      amountTransferred: 4200000,
      fromAccount: 'XXXXXX7890',
      toAccount: 'XXXXXX-002',
      poolId: 'POOL-002',
      expectedAmount: 4158000,
      expectedReceipt: '02 Mar 2026, 6:00 PM',
      status: 'Failed',
    },

    details: {
      status: 'Failed',
      borrowingDate: '2026-03-02 13:45:10',
      tenor: '10 days',
      interestRate: '1.2% per week',
    },

    transactions: {
      summary: {
        totalTransactions: 2,
        totalValue: 15000,
        financed: 0,
        ineligible: 2,
      },
      list: [
        {
          id: 'TXN006',
          transactionId: 'TXN006',
          amount: 3000,
          rail: 'IMPS',
          bank: 'Yes Bank',
          settlementTiming: 'Instant',
          expectedSettlement: '2026-03-17',
          status: 'eligible',
          fraudScore: 3,
          amlStatus: 'clear',
        },
        {
          id: 'TXN007',
          transactionId: 'TXN007',
          amount: 12000,
          rail: 'NEFT',
          bank: 'PNB',
          settlementTiming: 'T+2',
          expectedSettlement: '2026-03-20',
          status: 'ineligible',
          fraudScore: 55,
          amlStatus: 'review',
        }
      ],
    },
  },

  {
    transactionId: 'TXN001234572',
    id: 'TXN001234572',
    time: '2026-03-01 14:20:00',
    transerred: 1500000,
    fromaccount: 'XXXXXX2468',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-003',
    expectedamount: 1485000,
    expectedreceipt: '2026-03-01 19:00:00',
    status: 'Completed',

    merchant: {
      name: 'Demo Merchant 3',
      id: 'M003',
      account: 'MERCHANT-ACC-9999'
    },

    deductions: {
      platformFee: 12000,
      processingFee: 7000,
      gst: 3420,
      interest: 1400
    },

    listView: {
      dateTime: '01 Mar 2026, 2:20 PM',
      amountTransferred: 1500000,
      fromAccount: 'XXXXXX2468',
      toAccount: 'XXXXXX-001',
      poolId: 'POOL-003',
      expectedAmount: 1485000,
      expectedReceipt: '01 Mar 2026, 7:00 PM',
      status: 'Completed',
    },

    details: {
      status: 'Success',
      borrowingDate: '2026-03-01 14:20:00',
      tenor: '5 days',
      interestRate: '0.8% per week',
    },

    transactions: {
      summary: {
        totalTransactions: 2,
        totalValue: 20000,
        financed: 2,
        ineligible: 0,
      },
      list: [
        {
          id: 'TXN008',
          transactionId: 'TXN008',
          amount: 9500,
          rail: 'RTGS',
          bank: 'Axis',
          settlementTiming: 'Same Day',
          expectedSettlement: '2026-03-17',
          status: 'delayed',
          fraudScore: 28,
          amlStatus: 'pending',
        },
        {
          id: 'TXN009',
          transactionId: 'TXN009',
          amount: 10500,
          rail: 'UPI',
          bank: 'HDFC',
          settlementTiming: 'T+1',
          expectedSettlement: '2026-03-18',
          status: 'financed',
          fraudScore: 10,
          amlStatus: 'clear',
        }
      ],
    },
  },
  {
    transactionId: 'TXN001234573',
    id: 'TXN001234573',
    time: '2026-02-28 11:10:00',
    transerred: 2100000,
    fromaccount: 'XXXXXX1122',
    toaccount: 'XXXXXX-002',
    poolid: 'POOL-004',
    expectedamount: 2079000,
    expectedreceipt: '2026-02-28 16:00:00',
    status: 'Completed',
  
    merchant: {
      name: 'Demo Merchant 4',
      id: 'M004',
      account: 'MERCHANT-ACC-2222'
    },
  
    deductions: {
      platformFee: 14000,
      processingFee: 8000,
      gst: 3960,
      interest: 2100
    },
  
    listView: {
      dateTime: '28 Feb 2026, 11:10 AM',
      amountTransferred: 2100000,
      fromAccount: 'XXXXXX1122',
      toAccount: 'XXXXXX-002',
      poolId: 'POOL-004',
      expectedAmount: 2079000,
      expectedReceipt: '28 Feb 2026, 4:00 PM',
      status: 'Completed',
    },
  
    details: {
      status: 'Success',
      borrowingDate: '2026-02-28 11:10:00',
      tenor: '6 days',
      interestRate: '1% per week',
    },
  
    transactions: {
      summary: {
        totalTransactions: 2,
        totalValue: 18000,
        financed: 1,
        ineligible: 1,
      },
      list: [
        {
          id: 'TXN020',
          transactionId: 'TXN020',
          amount: 8000,
          rail: 'UPI',
          bank: 'HDFC',
          settlementTiming: 'T+1',
          expectedSettlement: '2026-03-01',
          status: 'financed',
          fraudScore: 10,
          amlStatus: 'clear',
        },
        {
          id: 'TXN021',
          transactionId: 'TXN021',
          amount: 10000,
          rail: 'NEFT',
          bank: 'SBI',
          settlementTiming: 'T+2',
          expectedSettlement: '2026-03-02',
          status: 'ineligible',
          fraudScore: 40,
          amlStatus: 'review',
        }
      ],
    },
  },
  
  {
    transactionId: 'TXN001234574',
    id: 'TXN001234574',
    time: '2026-02-27 09:30:00',
    transerred: 1250000,
    fromaccount: 'XXXXXX3344',
    toaccount: 'XXXXXX-003',
    poolid: 'POOL-005',
    expectedamount: 1230000,
    expectedreceipt: '2026-02-27 14:00:00',
    status: 'Pending',
  
    merchant: {
      name: 'Demo Merchant 5',
      id: 'M005',
      account: 'MERCHANT-ACC-5555'
    },
  
    deductions: {
      platformFee: 10000,
      processingFee: 6000,
      gst: 2880,
      interest: 2000
    },
  
    listView: {
      dateTime: '27 Feb 2026, 9:30 AM',
      amountTransferred: 1250000,
      fromAccount: 'XXXXXX3344',
      toAccount: 'XXXXXX-003',
      poolId: 'POOL-005',
      expectedAmount: 1230000,
      expectedReceipt: '27 Feb 2026, 2:00 PM',
      status: 'Pending',
    },
  
    details: {
      status: 'Processing',
      borrowingDate: '2026-02-27 09:30:00',
      tenor: '9 days',
      interestRate: '1.1% per week',
    },
  
    transactions: {
      summary: {
        totalTransactions: 3,
        totalValue: 25000,
        financed: 1,
        ineligible: 1,
      },
      list: [
        {
          id: 'TXN022',
          transactionId: 'TXN022',
          amount: 10000,
          rail: 'IMPS',
          bank: 'ICICI',
          settlementTiming: 'Instant',
          expectedSettlement: '2026-02-27',
          status: 'eligible',
          fraudScore: 6,
          amlStatus: 'clear',
        },
        {
          id: 'TXN023',
          transactionId: 'TXN023',
          amount: 7000,
          rail: 'RTGS',
          bank: 'Axis',
          settlementTiming: 'Same Day',
          expectedSettlement: '2026-02-27',
          status: 'delayed',
          fraudScore: 25,
          amlStatus: 'pending',
        },
        {
          id: 'TXN024',
          transactionId: 'TXN024',
          amount: 8000,
          rail: 'NEFT',
          bank: 'PNB',
          settlementTiming: 'T+2',
          expectedSettlement: '2026-03-01',
          status: 'ineligible',
          fraudScore: 50,
          amlStatus: 'review',
        }
      ],
    },
  },
  
  {
    transactionId: 'TXN001234575',
    id: 'TXN001234575',
    time: '2026-02-26 15:00:00',
    transerred: 3000000,
    fromaccount: 'XXXXXX5566',
    toaccount: 'XXXXXX-004',
    poolid: 'POOL-006',
    expectedamount: 2950000,
    expectedreceipt: '2026-02-26 20:00:00',
    status: 'Completed',
  
    merchant: {
      name: 'Demo Merchant 6',
      id: 'M006',
      account: 'MERCHANT-ACC-6666'
    },
  
    deductions: {
      platformFee: 22000,
      processingFee: 13000,
      gst: 6300,
      interest: 5000
    },
  
    listView: {
      dateTime: '26 Feb 2026, 3:00 PM',
      amountTransferred: 3000000,
      fromAccount: 'XXXXXX5566',
      toAccount: 'XXXXXX-004',
      poolId: 'POOL-006',
      expectedAmount: 2950000,
      expectedReceipt: '26 Feb 2026, 8:00 PM',
      status: 'Completed',
    },
  
    details: {
      status: 'Success',
      borrowingDate: '2026-02-26 15:00:00',
      tenor: '12 days',
      interestRate: '1.3% per week',
    },
  
    transactions: {
      summary: {
        totalTransactions: 2,
        totalValue: 30000,
        financed: 2,
        ineligible: 0,
      },
      list: [
        {
          id: 'TXN025',
          transactionId: 'TXN025',
          amount: 15000,
          rail: 'UPI',
          bank: 'Kotak',
          settlementTiming: 'T+1',
          expectedSettlement: '2026-02-27',
          status: 'financed',
          fraudScore: 8,
          amlStatus: 'clear',
        },
        {
          id: 'TXN026',
          transactionId: 'TXN026',
          amount: 15000,
          rail: 'IMPS',
          bank: 'Yes Bank',
          settlementTiming: 'Instant',
          expectedSettlement: '2026-02-26',
          status: 'financed',
          fraudScore: 7,
          amlStatus: 'clear',
        }
      ],
    },
  },
];

export default BorrowingDummyData;