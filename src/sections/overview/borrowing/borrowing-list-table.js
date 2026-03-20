import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { useSettingsContext } from 'src/components/settings';
import { Container, Grid } from '@mui/material';


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
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import BorrowingUploadTableToolbar from '../borrowing-upload-table-tool-bar';
import BorrowingTableRow from '../borrowing-table-row';
import BorrowingTableHeader from '../borrowing-table-header';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Transaction ID' },
  { id: 'time', label: 'Date & Time' },
  { id: 'transerred', label: 'Amount Transerred' },
  { id: 'fromaccount', label: 'From Account' },
  { id: 'toaccount', label: 'To Account' },
  { id: 'poolid', label: 'Pool Id' },
  { id: 'expectedamount', label: 'Expected Amount' },
  { id: 'expectedreceipt', label: 'Expected Receipt' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions' },
];

const products = [
  {
    id: 'TXN001234572',
    time: '2026-03-01 14:20:18',
    transerred: 1500000,
    fromaccount: 'XXXXXX2468',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-001',
    expectedamount: 1485000,
    expectedreceipt: '2026-03-01 19:00:00',
    status: 'Completed',
  },
  {
    id: 'TXN001234571',
    time: '2026-03-02 13:45:33',
    transerred: 4200000,
    fromaccount: 'XXXXXX7890',
    toaccount: 'XXXXXX-002',
    poolid: 'POOL-002',
    expectedamount: 4158000,
    expectedreceipt: '2026-03-02 18:00:00',
    status: 'Failed',
  },
  {
    id: 'TXN001234570',
    time: '2026-03-03 12:30:56',
    transerred: 950000,
    fromaccount: 'XXXXXX3456',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-001',
    expectedamount: 940500,
    expectedreceipt: '2026-03-03 17:00:00',
    status: 'Completed',
  },
  {
    id: 'TXN001234569',
    time: '2026-03-04 11:05:12',
    transerred: 3200000,
    fromaccount: 'XXXXXX9012',
    toaccount: 'XXXXXX-002',
    poolid: 'POOL-002',
    expectedamount: 3168000,
    expectedreceipt: '2026-03-04 16:00:00',
    status: 'Settled',
  },
  {
    id: 'TXN001234568',
    time: '2026-03-05 10:22:45',
    transerred: 1800000,
    fromaccount: 'XXXXXX5678',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-001',
    expectedamount: 1782000,
    expectedreceipt: '2026-03-05 15:30:00',
    status: 'Settled',
  },
  {
    id: 'TXN001234567',
    time: '2026-03-06 09:15:23',
    transerred: 2500000,
    fromaccount: 'XXXXXX1234',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-001',
    expectedamount: 2475000,
    expectedreceipt: '2026-03-06 14:00:00',
    status: 'Completed',
  },
  {
    id: 'TXN001234566',
    time: '2026-03-07 16:40:10',
    transerred: 1200000,
    fromaccount: 'XXXXXX4321',
    toaccount: 'XXXXXX-003',
    poolid: 'POOL-003',
    expectedamount: 1188000,
    expectedreceipt: '2026-03-07 20:00:00',
    status: 'Pending',
  },
  {
    id: 'TXN001234565',
    time: '2026-03-08 15:10:55',
    transerred: 800000,
    fromaccount: 'XXXXXX8765',
    toaccount: 'XXXXXX-002',
    poolid: 'POOL-002',
    expectedamount: 792000,
    expectedreceipt: '2026-03-08 18:30:00',
    status: 'Failed',
  },
  {
    id: 'TXN001234564',
    time: '2026-03-09 14:05:42',
    transerred: 2000000,
    fromaccount: 'XXXXXX6543',
    toaccount: 'XXXXXX-001',
    poolid: 'POOL-001',
    expectedamount: 1980000,
    expectedreceipt: '2026-03-09 19:30:00',
    status: 'Completed',
  },
  {
    id: 'TXN001234563',
    time: '2026-03-10 12:55:11',
    transerred: 550000,
    fromaccount: 'XXXXXX2109',
    toaccount: 'XXXXXX-003',
    poolid: 'POOL-003',
    expectedamount: 544500,
    expectedreceipt: '2026-03-10 16:00:00',
    status: 'Pending',
  },
];
const RAIL_OPTIONS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'IMPS', label: 'IMPS' },
  { value: 'NEFT', label: 'NEFT' },
  { value: 'RTGS', label: 'RTGS' },
];

const BANK_OPTIONS = [
  { label: 'Today', value: 'Today' },
  { label: 'Yesterday', value: 'Yesterday' },
  { label: 'Day Before Yesterday', value: 'BeforeYesterday' },
];

const STATUS_OPTIONS = [
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Expected', value: 'expected' },
  { label: 'Failed', value: 'failed' },
  { label: 'Settled', value: 'settled' },
];

const defaultFilters = {
  name: '',
  bank: [],
  status: [],
  rail: [],
};

// ----------------------------------------------------------------------

export default function BorrowingListView() {
      const settings = useSettingsContext();
    
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const router = useRouter();

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

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.borrowing.details(id));
    },
    [router]
  );
  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;
  // || productsEmpty

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
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BorrowingTableHeader />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <BorrowingUploadTableToolbar
              filters={filters}
              onFilters={handleFilters}
              //
              railOptions={RAIL_OPTIONS}
              bankOptions={BANK_OPTIONS}
              statusOptions={STATUS_OPTIONS}
            />

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
                        <BorrowingTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleView(row.id)}
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
        </Grid>
      </Grid>
    </Container>
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
    const search = name.toLowerCase();

    inputData = inputData.filter(
      (item) =>
        (item.id || '').toLowerCase().includes(search) ||
        (item.time || '').toLowerCase().includes(search) ||
        String(item.transerred || '').includes(String(search)) ||
        (item.poolid || '').toLowerCase().includes(search) ||
        String(item.expectedamount || '').includes(String(search)) ||
        (item.expectedreceipt || '').toLowerCase().includes(search)
    );
  }

  if (status.length) {
    inputData = inputData.filter((item) =>
      status.some((s) => {
        if (s === 'completed') return item.status === 'Completed';
        if (s === 'failed') return item.status === 'Failed';
        if (s === 'pending') return item.status === 'Pending';
        if (s === 'expected') return item.status === 'Expected';
        if (s === 'settled') return item.status === 'Settled';
        return false;
      })
    );
  }

  if (bank.length) {
    const today = new Date();

    inputData = inputData.filter((item) => {
      const itemDate = new Date(item.time.replace(' ', 'T'));

      return bank.some((filter) => {
        if (filter === 'Today') {
          return itemDate.toDateString() === Today.toDateString();
        }

        if (filter === 'yesterday') {
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          return itemDate.toDateString() === yesterday.toDateString();
        }

        if (filter === 'beforeyesterday') {
          const beforeYesterday = new Date();
          beforeYesterday.setDate(today.getDate() - 2);
          return itemDate.toDateString() === beforeYesterday.toDateString();
        }

        return false;
      });
    });
  }
  if (rail.length) {
    inputData = inputData.filter((product) => rail.includes(product.rail));
  }

  return inputData;
}
