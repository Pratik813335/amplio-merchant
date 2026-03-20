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
import TransactionTableRow from './transaction-table-row';
import TransactionTableToolbar from './transaction-table-toolbar';
import TransactionTableFiltersResult from './transaction-table-filter-result';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'txnId', label: 'Txn ID' },
  { id: 'amount', label: 'Amount' },
  { id: 'rail', label: 'Rail' },
  { id: 'bank', label: 'Bank' },
  { id: 'psp', label: 'PSP' },
  { id: 'merchant', label: 'Merchant' },
  { id: 'status', label: 'Status' },
  { id: 'risk', label: 'Risk' },
  { id: 'location', label: 'Location' },
  { id: 'time', label: 'Time' },
 
];

const products=[
  {
    "txnId": "TXN100001",
    "amount": 2500,
    "rail": "UPI",
    "bank": "HDFC Bank",
    "psp": "Razorpay",
    "merchant": "Amazon",
    "status": "SUCCESS",
    "risk": 30,
    "location": "Mumbai",
    "time": "2026-03-12 10:15:22"
  },
  {
    "txnId": "TXN100002",
    "amount": 12000,
    "rail": "IMPS",
    "bank": "ICICI Bank",
    "psp": "Paytm",
    "merchant": "Flipkart",
    "status": "SUCCESS",
    "risk": 50,
    "location": "Delhi",
    "time": "2026-03-12 10:20:15"
  },
  {
    "txnId": "TXN100003",
    "amount": 540,
    "rail": "UPI",
    "bank": "SBI",
    "psp": "PhonePe",
    "merchant": "Swiggy",
    "status": "FAILED",
    "risk": 40,
    "location": "Pune",
    "time": "2026-03-12 10:22:41"
  },
  {
    "txnId": "TXN100004",
    "amount": 9800,
    "rail": "NEFT",
    "bank": "Axis Bank",
    "psp": "Razorpay",
    "merchant": "Croma",
    "status": "PENDING",
    "risk": 60,
    "location": "Bangalore",
    "time": "2026-03-12 10:25:12"
  },
  {
    "txnId": "TXN100005",
    "amount": 3200,
    "rail": "UPI",
    "bank": "Kotak Bank",
    "psp": "Google Pay",
    "merchant": "Zomato",
    "status": "SUCCESS",
    "risk": 30,
    "location": "Hyderabad",
    "time": "2026-03-12 10:28:55"
  },
  {
    "txnId": "TXN100006",
    "amount": 15000,
    "rail": "IMPS",
    "bank": "HDFC Bank",
    "psp": "Paytm",
    "merchant": "Reliance Digital",
    "status": "SUCCESS",
    "risk": 20,
    "location": "Chennai",
    "time": "2026-03-12 10:31:20"
  },
  {
    "txnId": "TXN100007",
    "amount": 760,
    "rail": "UPI",
    "bank": "SBI",
    "psp": "PhonePe",
    "merchant": "Uber",
    "status": "FAILED",
    "risk": 70,
    "location": "Kolkata",
    "time": "2026-03-12 10:35:44"
  },
  {
    "txnId": "TXN100008",
    "amount": 4500,
    "rail": "NEFT",
    "bank": "ICICI Bank",
    "psp": "Razorpay",
    "merchant": "Myntra",
    "status": "SUCCESS",
    "risk": 25,
    "location": "Ahmedabad",
    "time": "2026-03-12 10:40:18"
  },
  {
    "txnId": "TXN100009",
    "amount": 2100,
    "rail": "UPI",
    "bank": "Axis Bank",
    "psp": "Google Pay",
    "merchant": "BookMyShow",
    "status": "SUCCESS",
    "risk": 90,
    "location": "Jaipur",
    "time": "2026-03-12 10:45:03"
  },
  {
    "txnId": "TXN100010",
    "amount": 6700,
    "rail": "IMPS",
    "bank": "Kotak Bank",
    "psp": "Paytm",
    "merchant": "Tata Cliq",
    "status": "PENDING",
    "risk": 10,
    "location": "Surat",
    "time": "2026-03-12 10:50:29"
  }
]

const RAIL_OPTIONS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'IMPS', label: 'IMPS' },
  { value: 'NEFT', label: 'NEFT' },
  { value: 'RTGS', label: 'RTGS' },
];

const BANK_OPTIONS = [
  { value: 'HDFC Bank', label: 'HDFC Bank' },
  { value: 'ICICI Bank', label: 'ICICI Bank' },
  { value: 'SBI', label: 'SBI' },
  { value: 'Axis Bank', label: 'Axis Bank' },
  { value: 'Kotak Bank', label: 'Kotak Bank' },
];

const STATUS_OPTIONS = [
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'PENDING', label: 'Pending' },
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

   // const { products, productsLoading, productsEmpty } = useGetProducts();

  const confirm = useBoolean();

  useEffect(() => {
   
      setTableData(products);
    
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset
   // || productsEmpty
  );

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
                 
                      {dataFiltered
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

                  <TableNoData notFound={notFound} />
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

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, bank, rail } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (product) => product.txnId.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status.length) {
    inputData = inputData.filter((product) => status.includes(product.status));
  }

  if (bank.length) {
    inputData = inputData.filter((product) => bank.includes(product.bank));
  }
  if (rail.length) {
    inputData = inputData.filter((product) => rail.includes(product.rail));
  }

  return inputData;
}
