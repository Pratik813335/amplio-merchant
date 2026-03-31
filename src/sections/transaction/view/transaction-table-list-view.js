import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes


// hooks
import { useBoolean } from 'src/hooks/use-boolean';


import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

//
import { useGetTransactions } from 'src/api/transaction';
import TransactionTableRow from '../transaction-table-row';
import TransactionTableToolbar from '../transaction-table-toolbar';
import TransactionTableFiltersResult from '../transaction-table-filter-result';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tnsId', label: 'Txn ID' },
  { id: 'amount', label: 'Amount' },
  { id: 'method', label: 'Rail' },
  { id: 'bank', label: 'Bank' },
  { id: 'pspId', label: 'PSP' },
  { id: 'status', label: 'Status' },
  { id: 'risk', label: 'Created At' },
  // { id: 'location', label: 'Location' },
  // { id: 'time', label: 'Time' },
];

// const transaction=[
//   {
//     "txnId": "TXN100001",
//     "amount": 2500,
//     "rail": "UPI",
//     "bank": "HDFC Bank",
//     "psp": "Razorpay",
//     "merchant": "Amazon",
//     "status": "SUCCESS",
//     "risk": 30,
//     "location": "Mumbai",
//     "time": "2026-03-12 10:15:22"
//   },
//   {
//     "txnId": "TXN100002",
//     "amount": 12000,
//     "rail": "IMPS",
//     "bank": "ICICI Bank",
//     "psp": "Paytm",
//     "merchant": "Flipkart",
//     "status": "SUCCESS",
//     "risk": 50,
//     "location": "Delhi",
//     "time": "2026-03-12 10:20:15"
//   },
//   {
//     "txnId": "TXN100003",
//     "amount": 540,
//     "rail": "UPI",
//     "bank": "SBI",
//     "psp": "PhonePe",
//     "merchant": "Swiggy",
//     "status": "FAILED",
//     "risk": 40,
//     "location": "Pune",
//     "time": "2026-03-12 10:22:41"
//   },
//   {
//     "txnId": "TXN100004",
//     "amount": 9800,
//     "rail": "NEFT",
//     "bank": "Axis Bank",
//     "psp": "Razorpay",
//     "merchant": "Croma",
//     "status": "PENDING",
//     "risk": 60,
//     "location": "Bangalore",
//     "time": "2026-03-12 10:25:12"
//   },
//   {
//     "txnId": "TXN100005",
//     "amount": 3200,
//     "rail": "UPI",
//     "bank": "Kotak Bank",
//     "psp": "Google Pay",
//     "merchant": "Zomato",
//     "status": "SUCCESS",
//     "risk": 30,
//     "location": "Hyderabad",
//     "time": "2026-03-12 10:28:55"
//   },
//   {
//     "txnId": "TXN100006",
//     "amount": 15000,
//     "rail": "IMPS",
//     "bank": "HDFC Bank",
//     "psp": "Paytm",
//     "merchant": "Reliance Digital",
//     "status": "SUCCESS",
//     "risk": 20,
//     "location": "Chennai",
//     "time": "2026-03-12 10:31:20"
//   },
//   {
//     "txnId": "TXN100007",
//     "amount": 760,
//     "rail": "UPI",
//     "bank": "SBI",
//     "psp": "PhonePe",
//     "merchant": "Uber",
//     "status": "FAILED",
//     "risk": 70,
//     "location": "Kolkata",
//     "time": "2026-03-12 10:35:44"
//   },
//   {
//     "txnId": "TXN100008",
//     "amount": 4500,
//     "rail": "NEFT",
//     "bank": "ICICI Bank",
//     "psp": "Razorpay",
//     "merchant": "Myntra",
//     "status": "SUCCESS",
//     "risk": 25,
//     "location": "Ahmedabad",
//     "time": "2026-03-12 10:40:18"
//   },
//   {
//     "txnId": "TXN100009",
//     "amount": 2100,
//     "rail": "UPI",
//     "bank": "Axis Bank",
//     "psp": "Google Pay",
//     "merchant": "BookMyShow",
//     "status": "SUCCESS",
//     "risk": 90,
//     "location": "Jaipur",
//     "time": "2026-03-12 10:45:03"
//   },
//   {
//     "txnId": "TXN100010",
//     "amount": 6700,
//     "rail": "IMPS",
//     "bank": "Kotak Bank",
//     "psp": "Paytm",
//     "merchant": "Tata Cliq",
//     "status": "PENDING",
//     "risk": 10,
//     "location": "Surat",
//     "time": "2026-03-12 10:50:29"
//   }
// ]

const RAIL_OPTIONS = [
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Netbanking' },
  { value: 'card', label: 'Card' },
  { value: 'wallet', label: 'Wallet' },
];

const BANK_OPTIONS = [
  { value: 'BARB_R', label: 'BARB_R' },
  { value: 'PUNB_R', label: 'PUNB_R' },
  { value: 'CNRB', label: 'CNRB' },
];

const STATUS_OPTIONS = [
  { value: 'captured', label: 'Captured' },
  { value: 'failed', label: 'Failed' },
  { value: 'created', label: 'Created' },
];

const defaultFilters = {
  name: '',
  bank: [],
  status: [],
  rail:[]
};

// ----------------------------------------------------------------------

export default function TransactionTable() {

  const table = useTable();
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const {
    transaction = [],
    transactionLoading,
  } = useGetTransactions();

   // const { transaction, transactionLoading, transactionEmpty } = useGettransaction();

  const confirm = useBoolean();

  useEffect(() => {
   
      setTableData(transaction);
    
  }, [transaction]);

  const dataFiltered = applySort({
    inputData: applyFilter({
      inputData: tableData,
      filters,
    }),
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !transactionLoading && !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    
        <Card>
          <TransactionTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            railOptions={RAIL_OPTIONS}
            bankOptions={BANK_OPTIONS}
            statusOptions={STATUS_OPTIONS}
            
          />

          {canReset && (
            <TransactionTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
    
                />

                <TableBody>
                 
                  {(transactionLoading ? [] : dataFiltered)
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <TransactionTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            
                          />
                        ))}
                  

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  {transactionLoading && <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />}

                  <TableNoData notFound={notFound && !transactionLoading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      
    
  );
}

// ----------------------------------------------------------------------

function applySort({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function applyFilter({ inputData, filters }) {
  const { name, bank, status, rail } = filters;

  let filteredData = inputData;

  if (name?.trim()) {
    const searchValue = name.trim().toLowerCase();
    filteredData = filteredData.filter((item) => item.tnsId?.toLowerCase().includes(searchValue));
  }

  if (status.length) {
    filteredData = filteredData.filter((item) =>
      status.includes(item.status?.toLowerCase())
    );
  }

  if (bank.length) {
    filteredData = filteredData.filter((item) => bank.includes(item.bank));
  }

  if (rail.length) {
    filteredData = filteredData.filter((item) => rail.includes(item.method?.toLowerCase()));
  }

  return filteredData;
}
