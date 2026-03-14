import PropTypes from 'prop-types';
import { format } from 'date-fns';

// @mui
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
// ----------------------------------------------------------------------

export default function TransactionTableRow({
    row,
    selected,
}) {
    const {
        txnId,
        amount,
        rail,
        bank,
        psp,
        merchant,
        status,
        risk,
        location,
        time,
    } = row;

    return (
        <>
            <TableRow hover selected={selected}>

                <TableCell>
                    {txnId}
                </TableCell>

                <TableCell>{fCurrency(amount)}</TableCell>
                <TableCell>
                    <Label variant="soft" color="info">
                        {rail}
                    </Label>
                </TableCell>

                <TableCell>{bank}</TableCell>

                <TableCell>{psp}</TableCell>

                <TableCell>{merchant}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (status === 'SUCCESS' && 'success') ||
                            (status === 'FAILED' && 'error') ||
                            (status === 'PENDING' && 'warning') ||
                            'default'
                        }
                    >
                        {status}
                    </Label>
                </TableCell>

                <TableCell sx={{ minWidth: 120 }}>
                    <Box sx={{ typography: 'caption', color: 'text.secondary', mt: 0.5 }}>
                        {risk}%
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={risk}
                        color={
                            (risk <= 30 && 'success') ||
                            (risk <= 50 && 'warning') ||
                            (risk >= 51 && 'error') ||
                            'success'
                        }
                        sx={{ height: 6, borderRadius: 5 }}
                    />


                </TableCell>

                <TableCell>{location}</TableCell>

                <TableCell>
                    <ListItemText
                        primary={format(new Date(time), 'dd MMM yyyy')}
                        secondary={format(new Date(time), 'p')}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </TableCell>
            </TableRow>


        </>
    );
}

TransactionTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
};