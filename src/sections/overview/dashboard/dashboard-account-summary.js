import PropTypes from 'prop-types';

// MUI
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

// components
import Iconify from 'src/components/iconify';
import { formatIndianCurrencyCompact } from 'src/utils/format-indian-currency-number';

// utils


// ----------------------------------------------------------------------

const summaryRows = [
    { label: "Yesterday's Amortisation", amount: 4820000 },
    { label: "Fees (This Month)", amount: 12800 },
    { label: "Refund Netting (Today)", amount: -3200 },
];

// ----------------------------------------------------------------------

export default function DashboardAccountSummary({ title, escrowBalance = 2845000, ...other }) {

    const netAvailable = summaryRows.reduce((acc, item) => acc + item.amount, 0);

    return (
        <Card {...other}>
            <CardHeader title={title} />

            <Stack spacing={3} sx={{ p: 3 }}>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'primary.light',
                        bgcolor: 'primary.lighter',
                    }}
                >
                    <Stack direction="row" justifyContent="space-between">

                        <Stack spacing={1}>
                            <Typography variant="subtitle1" color="primary">
                                Escrow Balance
                            </Typography>

                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Iconify icon="mdi:currency-inr" width={22} />
                                <Typography variant="h4">
                                    {formatIndianCurrencyCompact(escrowBalance)}
                                </Typography>
                            </Stack>

                            <Typography variant="caption" color="primary">
                                Last updated: 2 mins ago
                            </Typography>
                        </Stack>

                        <Iconify icon="mdi:currency-inr" width={24} color="primary" />

                    </Stack>
                </Box>


                {summaryRows.map((row) => (
                    <SummaryRow key={row.label} row={row} />
                ))}

                <Divider />


                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1" color="text.secondary">
                        Net Available
                    </Typography>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Iconify icon="mdi:currency-inr" width={20} />

                        <Typography
                            variant="h6"
                            color={netAvailable < 0 ? 'error.main' : 'success.main'}
                        >
                            {formatIndianCurrencyCompact(Math.abs(netAvailable))}
                        </Typography>
                    </Stack>
                </Stack>

            </Stack>
        </Card>
    );
}

// ----------------------------------------------------------------------

function SummaryRow({ row }) {

    const isNegative = row.amount < 0;

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.neutral',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {row.label}
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center">

                {isNegative && (
                    <Typography color="error"> - </Typography>
                )}

                <Iconify icon="mdi:currency-inr" width={16} color={isNegative ? 'error.main' : 'text.primary'} />

                <Typography
                    variant="subtitle1"
                    color={isNegative ? 'error.main' : 'text.primary'}
                >
                    {formatIndianCurrencyCompact(Math.abs(row.amount))}
                </Typography>

            </Stack>
        </Stack>
    );
}

SummaryRow.propTypes = {
    row: PropTypes.object,
};

DashboardAccountSummary.propTypes = {
    title: PropTypes.string,
    escrowBalance: PropTypes.number,
};