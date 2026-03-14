import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function DashboardTransactionTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    onEditRow,
    onViewRow,
}) {
    const { transactionId, amount, rail, bank, time, status } = row;

    // const confirm = useBoolean();
    // const popover = usePopover();

    return (
        <>
            <TableRow hover selected={selected}>

                <TableCell>{transactionId}</TableCell>

                <TableCell>{fCurrency(amount)}</TableCell>

                <TableCell>{rail}</TableCell>

                <TableCell>{bank}</TableCell>

                <TableCell>{formatDistanceToNow(new Date(time))}</TableCell>


                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (status === 'pending' && 'warning') ||
                            (status === 'failed' && 'error') ||
                            'success'
                        }
                    >
                        {status}
                    </Label>
                </TableCell>


                {/* <TableCell align="right">
                    <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell> */}

            </TableRow>

            {/* <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        onViewRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover> */}

            {/* <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            /> */}

        </>
    );
}

DashboardTransactionTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
