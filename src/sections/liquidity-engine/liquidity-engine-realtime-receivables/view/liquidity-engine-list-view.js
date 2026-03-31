import isEqual from 'lodash/isEqual';
import { Stack } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
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
import PropTypes from 'prop-types';
import LiquidityEngineTableRow from '../liquidity-engine-row';
import LiquidityEngineHaircutCalculationCard from '../liquidity-engine-haircut-calculation-card';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'receivableId', label: 'Receivable ID' },
  { id: 'amount', label: 'Amount' },
  { id: 'rail', label: 'Rail' },
  { id: 'bank', label: 'Bank' },
  { id: 'settlementDate', label: 'Settlement Date' },
  { id: 'haircut', label: 'Haircut' },
  { id: 'netAmount', label: 'Net Amount' },
  // { id: 'risk', label: 'Risk' },
  { id: 'action', label: 'Action', width: 50 },
];


const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function LiquidityEngineListView({ transaction }) {
  const table = useTable();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);



  const [filters, setFilters] = useState(defaultFilters);
  const [selectedRow, setSelectedRow] = useState(null);
  const [haircutOpen, setHaircutOpen] = useState(false);

  useEffect(() => {

    setTableData(transaction);

  }, [transaction]);

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

  const handleOpenHaircut = useCallback((row) => {
    setSelectedRow(row);
    setHaircutOpen(true);
  }, []);

  const handleCloseHaircut = useCallback(() => {
    setHaircutOpen(false);
    setSelectedRow(null);
  }, []);

  return (
    <>
      <Card>
        <Stack px={3} pt={3} pb={0}>
          <CustomBreadcrumbs
            heading="Real-Time Eligible Receivables"
            links={[{ href: paths.dashboard.list }]}
            action={
              <Button
                component={RouterLink}
                // href={paths.dashboard.liquidityEngine.new}
                variant="contained"
                startIcon={<Iconify icon="lucide:droplets" width={22} />}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Finance All Eligible
              </Button>
            }
            sx={{
              mb: 0.5,
            }}
          />

          <Typography
            variant="body2"
            sx={{
              mt: 0,
              mb: 2,
              color: 'text.secondary',
              fontSize: 14,
            }}
          >
            Click on any receivable to view haircut breakdown
          </Typography>
        </Stack>

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
                      onViewHaircut={() => handleOpenHaircut(row)}
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

      <LiquidityEngineHaircutCalculationCard
        open={haircutOpen}
        onClose={handleCloseHaircut}
        row={selectedRow}
      />
    </>
  );
}

LiquidityEngineListView.propTypes = {
  transaction: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.number,
      netAmount: PropTypes.number,
      haircut: PropTypes.number,
      status: PropTypes.string,
      createdAt: PropTypes.string,
      method: PropTypes.string,
      bank: PropTypes.string,
    })
  ),
};

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
