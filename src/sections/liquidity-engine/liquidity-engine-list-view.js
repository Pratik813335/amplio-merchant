import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import LiquidityEngineTableRow from './liquidity-engine-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'receivableId', label: 'Receivable ID' },
  { id: 'amount', label: 'Amount' },
  { id: 'rail', label: 'Rail' },
  { id: 'bank', label: 'Bank' },
  { id: 'settlementDate', label: 'Settlement Date' },
  { id: 'haircut', label: 'Haircut' },
  { id: 'netAmount', label: 'Net Amount' },
  { id: 'risk', label: 'Risk' },
  { id: 'action', label: 'Action', width: 80 },
];

const DUMMY_RECEIVABLES = [
  {
    id: 1,
    receivableId: 'RCV-2024-001',
    amount: '₹125,000',
    rail: 'UPI',
    bank: 'HDFC',
    settlementDate: '2024-02-28',
    haircut: '2.5%',
    netAmount: '₹121,875',
    risk: 'Low',
  },
  {
    id: 2,
    receivableId: 'RCV-2024-002',
    amount: '₹89,000',
    rail: 'QR',
    bank: 'ICICI',
    settlementDate: '2024-02-28',
    haircut: '2%',
    netAmount: '₹87,220',
    risk: 'Low',
  },
  {
    id: 3,
    receivableId: 'RCV-2024-003',
    amount: '₹245,000',
    rail: 'Card',
    bank: 'Axis',
    settlementDate: '2024-02-29',
    haircut: '3%',
    netAmount: '₹237,650',
    risk: 'Medium',
  },
  {
    id: 4,
    receivableId: 'RCV-2024-004',
    amount: '₹156,000',
    rail: 'UPI',
    bank: 'SBI',
    settlementDate: '2024-02-29',
    haircut: '2.5%',
    netAmount: '₹152,100',
    risk: 'Low',
  },
  {
    id: 5,
    receivableId: 'RCV-2024-005',
    amount: '₹98,000',
    rail: 'UPI',
    bank: 'HDFC',
    settlementDate: '2024-03-01',
    haircut: '3.5%',
    netAmount: '₹94,570',
    risk: 'Medium',
  },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function LiquidityEngineListView() {
  const table = useTable();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState(DUMMY_RECEIVABLES);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.liquidityEngine.edit(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      
        <CustomBreadcrumbs
          heading="Real-Time Eligible Receivables"
          links={[{ href: paths.dashboard.list }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.liquidityEngine.new}
              variant="contained"
              startIcon={
                <Iconify icon="material-symbols-light:water-drops-outline-rounded" width={22} />
              }
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Finance All Eligible
            </Button>
          }
          sx={{
            mb: { xs: 1, md: 1 },
          }}
        />

        <Typography sx={{ mb: 1, color: 'text.secondary', fontSize: 18 }}>
          Click on any receivable to view haircut breakdown
        </Typography>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={0}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <LiquidityEngineTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) => item.receivableId.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((item) => item.risk === status);
  }

  if (role.length) {
    inputData = inputData.filter((item) => role.includes(item.rail));
  }

  return inputData;
}
