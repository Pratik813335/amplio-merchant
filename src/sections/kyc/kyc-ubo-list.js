import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card } from '@mui/material';
import { TableNoData } from 'src/components/table';
import Label from 'src/components/label';
import PropTypes from 'prop-types';
import { useGetUBOs } from 'src/api/merchantKyc';
import KYCAddUBOsForm from './kyc-add-benificial-owner-form';
import KYCFooter from './kyc-footer';

const StyledSearch = styled(TextField)(({ theme }) => ({
  width: 300,
  '& .MuiOutlinedInput-root': {
    height: 40,
    '& fieldset': {
      borderColor: theme.palette.grey[500],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const getStatusMeta = (status) => {
  if (status === 1) return { color: 'success', label: 'Verified' };
  if (status === 2) return { color: 'error', label: 'Rejected' };
  return { color: 'warning', label: 'Pending' };
};

export default function KYCUBOs({ percent, setActiveStepId }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUBO, setSelectedUBO] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { ubos, refreshUbos, loading } = useGetUBOs();

  const filteredRows = ubos.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    if (!loading && ubos.length >= 1) {
      percent(100);
    }
  }, [loading, percent, ubos]);

  const notFound = !loading && (ubos.length === 0 || filteredRows.length === 0);

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

  return (
    <Container sx={{ position: 'relative', py: { xs: 6, sm: 8, md: 10 } }}>
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#206CFE' }}>
            Ultimate Beneficial Owners
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Add all UBO details for merchant KYC verification.
          </Typography>
        </Stack>

        <Box
          sx={{
            mb: 5,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h4" color="primary">
            Add UBO
          </Typography>

          <Stack direction="row" spacing={2}>
            <StyledSearch
              placeholder="Search UBOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              color='primary'
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAdd}
            >
              Add UBO
            </Button>
          </Stack>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Ownership %</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row) => {
                const statusMeta = getStatusMeta(row.status);

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.ownershipPercentage}</TableCell>
                    <TableCell>{row.designationValue}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>

                    <TableCell>
                      {row.submittedDateOfBirth
                        ? new Date(
                            row.submittedDateOfBirth
                          ).toLocaleDateString()
                        : '-'}
                    </TableCell>

                    <TableCell>
                      {row.panCard?.fileUrl ? (
                        <a
                          href={row.panCard.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>

                    <TableCell>
                      <Label color={statusMeta.color}>
                        {statusMeta.label}
                      </Label>
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={() => handleView(row)}
                        >
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>

                        {row.status !== 1 && (
                          <IconButton
                            onClick={() => handleEdit(row)}
                          >
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ textAlign: 'right', mt: 'auto' }}>
          <Button
            variant="contained"
            color='primary'
            disabled={ubos.length < 1}
            onClick={() => {
              percent(100);
              setActiveStepId();
            }}
          >
            Next
          </Button>
        </Box>
      </Card>

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

      <KYCFooter />
    </Container>
  );
}

KYCUBOs.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
};