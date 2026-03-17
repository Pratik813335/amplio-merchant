import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api
import { useGetProducts } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
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
import { CardHeader } from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
//

// import ProductTableFiltersResult from '../product-table-filters-result';
import DashboardTransactionTableRow from './dashboard-table-row';
import DashboardTransactionTableToolbar from './dashboard-table-toolbar';
import DashboardTransactionTableFilterResult from './dashboard-table-filter-result';

// ----------------------------------------------------------------------

// Dummy Transaction Data

export const _dummy_transaction_data = [
    {
        "id": 1,
        "transactionId": "TXN-3232",
        "amount": 2500,
        "rail": "UPI",
        "bank": "HDFC Bank",
        "time": "2026-03-12T10:10:00Z",
        "status": "success"
    },
    {
        "id": 2,
        "transactionId": "TXN-3233",
        "amount": 1200,
        "rail": "Card",
        "bank": "ICICI Bank",
        "time": "2026-03-12T10:07:30Z",
        "status": "pending"
    },
    {
        "id": 3,
        "transactionId": "TXN-3234",
        "amount": 540,
        "rail": "QR",
        "bank": "State Bank of India",
        "time": "2026-03-12T09:58:20Z",
        "status": "success"
    },
    {
        "id": 4,
        "transactionId": "TXN-3235",
        "amount": 3000,
        "rail": "UPI",
        "bank": "Axis Bank",
        "time": "2026-03-12T09:45:00Z",
        "status": "failed"
    },
    {
        "id": 5,
        "transactionId": "TXN-3236",
        "amount": 850,
        "rail": "Card",
        "bank": "Kotak Mahindra Bank",
        "time": "2026-03-12T09:30:15Z",
        "status": "success"
    },
    {
        "id": 6,
        "transactionId": "TXN-3237",
        "amount": 1999,
        "rail": "QR",
        "bank": "Punjab National Bank",
        "time": "2026-03-12T09:10:40Z",
        "status": "pending"
    },
    {
        "id": 7,
        "transactionId": "TXN-3238",
        "amount": 420,
        "rail": "UPI",
        "bank": "Yes Bank",
        "time": "2026-03-12T08:55:10Z",
        "status": "success"
    },
    {
        "id": 8,
        "transactionId": "TXN-3239",
        "amount": 760,
        "rail": "Card",
        "bank": "Bank of Baroda",
        "time": "2026-03-12T08:20:00Z",
        "status": "failed"
    }
]

const TABLE_HEAD = [
    { id: 'transactionId', label: 'Transaction ID', width: 180 },
    { id: 'amount', label: 'Amount', width: 160 },
    { id: 'rail', label: 'Rail', width: 140 },
    { id: 'bank', label: 'Bank', width: 180 },
    { id: 'time', label: 'Time', width: 160 },
    { id: 'status', label: 'Status', width: 160 },
    // { id: '' },
];

const PUBLISH_OPTIONS = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
];

const defaultFilters = {
    name: '',
    publish: [],
    stock: [],
};

// ----------------------------------------------------------------------

export default function DashboardTransactionTable() {
    const router = useRouter();

    const table = useTable();

    const settings = useSettingsContext();

    const [tableData, setTableData] = useState(_dummy_transaction_data);

    const [filters, setFilters] = useState(defaultFilters);

    const { products, productsLoading, productsEmpty } = useGetProducts();

    const confirm = useBoolean();

    useEffect(() => {
        if (products.length) {
            setTableData(products);
        }
    }, [products]);

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

    const notFound = (!dataFiltered.length && canReset)
    //  || productsEmpty;

    // const handleFilters = useCallback(
    //     (name, value) => {
    //         table.onResetPage();
    //         setFilters((prevState) => ({
    //             ...prevState,
    //             [name]: value,
    //         }));
    //     },
    //     [table]
    // );

    // const handleDeleteRow = useCallback(
    //     (id) => {
    //         const deleteRow = tableData.filter((row) => row.id !== id);
    //         setTableData(deleteRow);

    //         table.onUpdatePageDeleteRow(dataInPage.length);
    //     },
    //     [dataInPage.length, table, tableData]
    // );

    // const handleDeleteRows = useCallback(() => {
    //     const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    //     setTableData(deleteRows);

    //     table.onUpdatePageDeleteRows({
    //         totalRows: tableData.length,
    //         totalRowsInPage: dataInPage.length,
    //         totalRowsFiltered: dataFiltered.length,
    //     });
    // }, [dataFiltered.length, dataInPage.length, table, tableData]);

    // const handleEditRow = useCallback(
    //     (id) => {
    //         router.push(paths.dashboard.product.edit(id));
    //     },
    //     [router]
    // );

    // const handleViewRow = useCallback(
    //     (id) => {
    //         router.push(paths.dashboard.product.details(id));
    //     },
    //     [router]
    // );

    // const handleResetFilters = useCallback(() => {
    //     setFilters(defaultFilters);
    // }, []);

    return (
        <>
            <Card>

                <CardHeader title='Live Transactions Feed' sx={{ mb: 3 }} />

                {/* <DashboardTransactionTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        stockOptions={PRODUCT_STOCK_OPTIONS}
                        publishOptions={PUBLISH_OPTIONS}
                    /> */}
                {/* 
                {canReset && (
                    <DashboardTransactionTableFilterResult
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        onResetFilters={handleResetFilters}
                        //
                        results={dataFiltered.length}
                        sx={{ p: 2.5, pt: 0 }}
                    />
                )} */}

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    {/* <TableSelectedAction
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
                    /> */}

                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={tableData.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        tableData.map((row) => row.id)
                                    )
                                }
                            />

                            <TableBody>
                                {productsLoading ? (
                                    [...Array(table.rowsPerPage)].map((i, index) => (
                                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                                    ))
                                ) : (
                                    <>
                                        {dataFiltered
                                            .slice(
                                                table.page * table.rowsPerPage,
                                                table.page * table.rowsPerPage + table.rowsPerPage
                                            )
                                            .map((row) => (
                                                <DashboardTransactionTableRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={table.selected.includes(row.id)}
                                                // onSelectRow={() => table.onSelectRow(row.id)}
                                                // onDeleteRow={() => handleDeleteRow(row.id)}
                                                // onEditRow={() => handleEditRow(row.id)}
                                                // onViewRow={() => handleViewRow(row.id)}
                                                />
                                            ))}
                                    </>
                                )}

                                <TableEmptyRows
                                    height={denseHeight}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage,)}
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
                            // handleDeleteRows();
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
    const { name, stock, publish } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (product) => product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (stock.length) {
        inputData = inputData.filter((product) => stock.includes(product.inventoryType));
    }

    if (publish.length) {
        inputData = inputData.filter((product) => publish.includes(product.publish));
    }

    return inputData;
}
