import isEqual from 'lodash/isEqual';
import { useCallback, useState } from 'react';
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
import borrowingDummyData from '../borrowing-dummy-data';
import BorrowingUploadTableToolbar from '../borrowing-upload-table-tool-bar';
import BorrowingTableRow from '../borrowing-table-row';
import BorrowingDummyData from '../borrowing-dummy-data';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'listView.dateTime', label: 'Date & Time' },
  { id: 'listView.amountTransferred', label: 'Amount Transferred' },
  { id: 'listView.fromAccount', label: 'From Account' },
  { id: 'toaccount', label: 'To Account' },
  { id: 'listView.poolId', label: 'Pool Id' },
  { id: 'listView.expectedAmount', label: 'Expected Amount' },
  { id: 'listView.expectedReceipt', label: 'Expected Receipt' },
  { id: 'listView.status', label: 'Status' },
  { id: 'actions', label: 'Actions' },
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
  const router = useRouter();
  const tableData = borrowingDummyData.map(({ transactionId, listView }) => ({
    transactionId,
    listView,
  }));

  const [filters, setFilters] = useState(defaultFilters);

  // const { products, productsLoading, productsEmpty } = useGetProducts();

  const confirm = useBoolean();

  useEffect(() => {
    setTableData(BorrowingDummyData);
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

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
                    tableData.map((row) => row.transactionId)
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
                          key={row.transactionId}
                          row={row}
                          selected={table.selected.includes(row.transactionId)}
                          onSelectRow={() => table.onSelectRow(row.transactionId)}
                          onViewRow={() => handleView(row.transactionId)}
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
  const { name, status, bank } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
  const search = name.toLowerCase();

  inputData = inputData.filter((item) => {
    const lv = item.listView || {};

    return (
      (item.transactionId || '').toLowerCase().includes(search) ||
      (lv.dateTime || '').toLowerCase().includes(search) ||
      String(lv.amountTransferred || '').includes(search) ||
      (lv.fromAccount || '').toLowerCase().includes(search) ||
      (lv.poolId || '').toLowerCase().includes(search) ||
      String(lv.expectedAmount || '').includes(search) ||
      (lv.expectedReceipt || '').toLowerCase().includes(search)
    );
  });
}

  if (status.length) {
  inputData = inputData.filter((item) =>
    status.some((s) => {
      const st = item.listView?.status;

      if (s === 'completed') return st === 'Completed';
      if (s === 'failed') return st === 'Failed';
      if (s === 'pending') return st === 'Pending';
      if (s === 'expected') return st === 'Expected';
      if (s === 'settled') return st === 'Settled';
      return false;
    })
  );
}

  if (bank.length) {
  const today = new Date();

  inputData = inputData.filter((item) => {
    const dateStr = item.listView?.dateTime;
    if (!dateStr) return false;

    const itemDate = new Date(dateStr.replace(' ', 'T'));

    return bank.some((filter) => {
      if (filter === 'today') {
        return itemDate.toDateString() === today.toDateString();
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


  return inputData;
}
