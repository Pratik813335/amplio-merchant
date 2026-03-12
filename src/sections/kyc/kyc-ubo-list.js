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
  const { ubos, refreshUbos, loading } = useGetUBOs();

  const filteredRows = ubos.filter((row) =>
    Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    if (!loading && ubos.length >= 1) {
      percent(100);
    }
  }, [loading, percent, ubos]);

  const notFound = !loading && (ubos.length === 0 || filteredRows.length === 0);

  return (
    <Container sx={{ position: 'relative', py: { xs: 6, sm: 8, md: 10 } }}>
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={0.5} alignItems="flex-start" sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#206CFE',
              textAlign: 'left',
            }}
          >
            Ultimate Beneficial Owners
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              color: '#000000',
              textAlign: 'left',
            }}
          >
            Add all UBO details for merchant KYC verification.
          </Typography>
        </Stack>

        <Box
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h4" color="primary" sx={{ mb: { xs: 1, sm: 0 } }}>
            Add UBO
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <StyledSearch
              placeholder="Search UBOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: '100%', sm: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpen(true)}
              sx={{
                height: 40,
                width: { xs: '100%', sm: 'auto' },
                order: { xs: -1, sm: 1 },
              }}
            >
              Add UBO
            </Button>

            <KYCAddUBOsForm
              open={open}
              onClose={() => setOpen(false)}
              onSuccess={() => {
                refreshUbos();
                setOpen(false);
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <TableContainer component={Paper} sx={{ mb: 5 }}>
            <Table sx={{ minWidth: 650 }} aria-label="ubo table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Ownership %</TableCell>
                  <TableCell align="left">Role</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Phone</TableCell>
                  <TableCell align="left">DOB</TableCell>
                  <TableCell align="left">PAN</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map((row) => {
                  const statusMeta = getStatusMeta(row.status);

                  return (
                    <TableRow key={row.id || row.panCardId || row.email}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.ownershipPercentage ?? '-'}</TableCell>
                      <TableCell>{row.designationValue}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>
                        {row.submittedDateOfBirth
                          ? new Date(row.submittedDateOfBirth).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {row.panCard?.fileUrl ? (
                          <a
                            href={row.panCard.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'underline' }}
                          >
                            View
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Label color={statusMeta.color}>{statusMeta.label}</Label>
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ textAlign: 'right', mt: 'auto', pt: 3 }}>
          <Button
            variant="contained"
            color="primary"
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
      <KYCFooter />
    </Container>
  );
}

KYCUBOs.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
};
