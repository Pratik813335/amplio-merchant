import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

// MUI
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Box, Stack, Typography } from '@mui/material';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';

import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { _roles } from 'src/_mock';

 // import { useGetUBOs } from 'src/api/merchantKyc';

import KYCAddUBOsForm from '../kyc-add-benificial-owner-form';
import UboTableFiltersResult from '../ubo-table-filters-result';
import UboTableRow from '../ubo-table-row';
import UboTableToolbar from '../ubo-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullName', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'ownershipPercentage', label: 'Ownership %' },
  { id: 'designationValue', label: 'Role' },
  { id: 'status', label: 'Status' },
 { id: '', label: 'Action', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

const dummyUBOData = [
  // {
  //   "success": true,
  //   "message": "UBO Details",
  //   "uboDetails": [
        {
            "id": "b44c2979-f168-49f4-9c3e-758bbf5583cf",
            "fullName": "PRATIKSING GIRASE",
            "email": "girasepratiksing@gmail.com",
            "phone": "5456567678",
            "ownershipPercentage": 40.6,
            "designationType": "dropdown",
            "designationValue": "proprietor",
            "submittedPanNumber": "EHTPB2623D",
            "submittedPanFullName": "PRATIKSING GIRASE",
            "submittedDateOfBirth": "2026-03-16",
            "extractedPanNumber": "",
            "extractedPanFullName": "",
            "extractedDateOfBirth": "",
            "panCardId": "acfa8cde-4c19-4fea-9d89-0e92c7a8af92",
            "usersId": "5b73dc18-4692-4f1b-b03a-0ca76e7de277",
            "roleValue": "merchant",
            "identifierId": "5d93f41f-aed3-46da-9952-a1e5f8120af0",
            "status": 1,
            "mode": 1,
            "reason": null,
            "verifiedAt": "2026-03-16T05:47:55.715Z",
            "isActive": true,
            "isDeleted": false,
            "createdAt": "2026-03-16T05:46:52.077Z",
            "updatedAt": "2026-03-16T05:47:55.715Z",
            "deletedAt": null,
            "panCard": {
                "id": "acfa8cde-4c19-4fea-9d89-0e92c7a8af92",
                "fileOriginalName": "android-chrome-512x512.png",
                "fileUrl": "data:image/jpeg;base64,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"
            }
        }
    ]


// ----------------------------------------------------------------------

export default function UbosListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const [open, setOpen] = useState(false);
  const [selectedUBO, setSelectedUBO] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

   // const { ubos = [], refreshUbos } = useGetUBOs();
   const refreshUbos=()=>{};

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(dummyUBOData);
  }, []);

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

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length;

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

  const handleAdd = () => {
    setSelectedUBO(null);
    setViewMode(false);
    setEditMode(false);
    setOpen(true);
  };

  const handleView = (row) => {
    setSelectedUBO(row);
    setViewMode(true);
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedUBO(row);
    setEditMode(true);
    setViewMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUBO(null);
    setViewMode(false);
    setEditMode(false);
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            Ultimate Beneficial Owners
          </Typography>

          {/* <Typography variant="h7" sx={{ fontWeight: 500 }}>
            Add all UBO details for merchant KYC verification.
          </Typography> */}
        </Stack>

        {/* <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" color="primary">
            Add UBO
          </Typography>

          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Ubo
          </Button>
        </Stack> */}

        <Card>
          <UboTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={_roles}
          />

          {canReset && (
            <UboTableFiltersResult
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <UboTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEdit(row)}
                      handleView={handleView}
                    />
                  ))}

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
      </Container>

      <KYCAddUBOsForm
        open={open}
        currentUser={selectedUBO}
        isViewMode={viewMode}
        isEditMode={editMode}
        onClose={handleClose}
        onSuccess={() => {
          refreshUbos();
          handleClose();
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong>{table.selected.length}</strong> items?
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
    inputData = inputData.filter((user) =>
      user.fullName?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.designationValue));
  }

  return inputData;
}