import PropTypes from 'prop-types';
import {
    Card,
    Box,
    Typography,
    Stack,
    Chip,
    Grid,
    IconButton,
    Button,
    Divider,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

export default function PspDetailsCard({ psp, onViewRow }) {
    if (!psp) return null;

    const STATUS = {
        0: { label: 'Processing', color: 'warning', icon: 'mdi:clock-outline' },
        1: { label: 'Approved', color: 'success', icon: 'mdi:check-circle' },
        2: { label: 'Rejected', color: 'error', icon: 'mdi:close-circle' },
    };

    const status = STATUS[psp?.status] || STATUS[0];


    

    return (
        <Card
            sx={(theme) => ({
                p: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: theme.shadows[8],
                },
            })}

            onClick={onViewRow}
        >

            <Stack direction="row" justifyContent="space-between" alignItems="center" p={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={(theme) => ({
                            width: 45,
                            height: 45,
                            borderRadius: 2,
                            background: `linear-gradient(135deg,
                                     ${theme.palette[status.color].light},
                                     ${theme.palette[status.color].main}
                                           )`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.palette[status.color].contrastText,
                            fontWeight: 700,
                        })}
                    >
                        {psp?.pspName?.substring(0, 2)?.toUpperCase()}
                    </Box>

                    <Box>
                        <Typography fontWeight={600}>{psp?.pspName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {psp?.merchantId}
                        </Typography>
                    </Box>
                </Stack>

                <Label
                    color={status.color}
                    sx={{
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <Iconify icon={status.icon} width={16} />
                    {status.label}
                </Label>
            </Stack>

            <Divider />
            <Box

                p={3}>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Submitted on
                        </Typography>
                        <Typography>{psp?.createdAt}</Typography>
                    </Grid>

                    {psp?.status === 2 && (
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Rejected on
                            </Typography>
                            <Typography>{psp?.deletedAt}</Typography>
                        </Grid>
                    )}

                    {psp?.requestedBy && (
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Requested by
                            </Typography>
                            <Typography>{psp?.requestedBy}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Processing message */}
            {/* {psp?.status === 0 && (
                <Typography
                    sx={{
                        mt: 2,
                        color: '#2563eb',
                        fontSize: 14,
                    }}
                >
                    ⏱ Your integration is being reviewed by our team. Expected completion:
                    18-24 hours
                </Typography>
            )} */}

            {/* Rejection reason */}
            {/* {psp?.status === 2 && (
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#ffe6e6',
                    }}
                >
                    <Typography fontWeight={600}>Rejection Reason</Typography>

                    <Typography color="#c62828" variant="body2">
                        {psp?.rejectionReason}
                    </Typography>
                </Box>
            )} */}

            {/* Actions */}
            {/* {psp?.status === 2 && (
                <Stack direction="row" spacing={2} mt={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="inherit"
                        onClick={onViewRow}
                    >
                        Resubmit
                    </Button>

                    <IconButton color="error">
                        <Iconify icon="mdi:delete-outline" />
                    </IconButton>
                </Stack>
            )} */}
        </Card>
    );
}

PspDetailsCard.propTypes = {
    psp: PropTypes.object,
    onViewRow: PropTypes.func,
};