import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import Iconify from 'src/components/iconify';
import { formatIndianCurrencyCompact } from 'src/utils/format-indian-currency-number';

// ----------------------------------------------------------------------

export default function DashboardEligibleReceivables({ title, subheader, data, ...other }) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
                {data.map((progress) => (
                    <ProgressItem key={progress.label} progress={progress} />
                ))}
            </Stack>
        </Card>
    );
}

DashboardEligibleReceivables.propTypes = {
    data: PropTypes.array,
    subheader: PropTypes.string,
    title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ProgressItem({ progress }) {

    return (
        <Stack
            spacing={2}
            sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">

                <Stack
                    sx={{
                        width: 6,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: `${progress.color || 'primary'}.main`,
                    }}
                />

                <Stack sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">
                        {progress.label}
                    </Typography>

                    {progress.transactions && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {progress.transactions} transactions
                        </Typography>
                    )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon="mdi:currency-inr" width={18} />
                    <Typography variant="h6">
                        {formatIndianCurrencyCompact(progress.totalAmount)}
                    </Typography>
                </Stack>

            </Stack>

            <LinearProgress
                variant="determinate"
                value={progress.value}
                color={progress.color || 'primary'}
                sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: 'action.hover',
                }}
            />
        </Stack>
    );
}

ProgressItem.propTypes = {
    progress: PropTypes.object,
};
