import PropTypes from 'prop-types';

// MUI
import { useTheme, alpha } from '@mui/material/styles';
import {
    Box,
    Stack,
    Typography,
    Button,
    Chip,
    Divider,
    IconButton,
    Paper,
    Card
} from '@mui/material';

// icon
import Iconify from 'src/components/iconify';
import StatusChip from 'src/components/status-chip/status-chip';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

export default function BorrowingDetailsHeader({
    transactionId,
    status = 'success',
    borrowingDate,
    tenor = '7 days',
    interestRate = '1% per week',
}) {
    const theme = useTheme();
    const router = useRouter()
    const handleTransactionsView = useCallback(() => {
        router.push(paths.dashboard.borrowing.view(id));
      }, [router, id]);

    const handleGenerateInvoice = () => {
        console.log('Clicked on generate invoice');

    }

    const handleDownloadReport = () => {
        console.log('clicked on download report');

    }
    const handleNavigateBack = () => {
        router.push(-1);
    }
    return (
        <Stack spacing={3}>

            {/* Top Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
            >

                {/* Title Section */}
                <Stack direction="row" spacing={1.5} alignItems="center">

                    <IconButton onClick={handleNavigateBack}>
                        <Iconify icon="mdi:arrow-left" width={22} />
                    </IconButton>

                    <Box>
                        <Typography variant="h4">Borrowing Details</Typography>

                        <Typography variant="body2" color="text.secondary">
                            {transactionId}
                        </Typography>
                    </Box>

                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={1.5} flexWrap="wrap">

                    <Button
                        variant="outlined"
                        color='primary'
                        startIcon={<Iconify icon="streamline-ultimate:receipt-dollar-bold" />}
                        onClick={handleTransactionsView}
                    >
                        View Transactions
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="mdi:file-document-outline" />}
                        onClick={handleGenerateInvoice}
                    >
                        Generate Invoice
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="mdi:download-outline" />}
                        onClick={handleDownloadReport}
                    >
                        Download Report
                    </Button>

                </Stack>

            </Stack>

            <Card>
                <Stack
                    sx={{ p: 4 }}
                    direction="row"
                    alignItems="center"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={{ xs: 2, md: 3, }}
                    flexWrap="wrap"
                >

                    {/* Status */}
                    <StatusChip status={status} />

                    {/* Borrowing Date */}
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Borrowing Date
                        </Typography>

                        <Typography variant="subtitle2">
                            {borrowingDate}
                        </Typography>
                    </Box>

                    {/* Tenor */}
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Tenor
                        </Typography>

                        <Typography variant="subtitle2">
                            {tenor}
                        </Typography>
                    </Box>

                    {/* Interest */}
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Interest Rate
                        </Typography>

                        <Typography variant="subtitle2">
                            {interestRate}
                        </Typography>
                    </Box>

                </Stack>

                {/* </Paper> */}

            </Card>
        </Stack >
    );
}

// ----------------------------------------------------------------------

BorrowingDetailsHeader.propTypes = {
    id: PropTypes.string,
    transactionId: PropTypes.string,
    status: PropTypes.string,
    borrowingDate: PropTypes.string,
    tenor: PropTypes.string,
    interestRate: PropTypes.string,
};