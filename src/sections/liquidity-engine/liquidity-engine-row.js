import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
// import LiquidityEngineQuickEditForm from './liquidity-engine-quick-edit-form';

// ----------------------------------------------------------------------

export default function LiquidityEngineTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { receivableId, amount, rail, bank, settlementDate, haircut, netAmount, risk } = row;
  const getRiskColor = () => {
    if (risk === 'Low') return 'success';
    if (risk === 'Medium') return 'warning';
    if (risk === 'High') return 'error';
    return 'default';
  };
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{receivableId}</TableCell>

        <TableCell sx={{ fontWeight: 600 }}>{amount}</TableCell>

        <TableCell>
          <Label variant="soft" color={getRiskColor()}>
            {rail}
          </Label>
        </TableCell>

        <TableCell>{bank}</TableCell>

        <TableCell>{settlementDate}</TableCell>

        <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>{haircut}</TableCell>

        <TableCell sx={{ color: 'success.main', fontWeight: 700 }}>{netAmount}</TableCell>

        <TableCell>
          <Label variant="soft" color={getRiskColor()}>
            {risk}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Tooltip title="View Details">
            <IconButton>
              <Iconify icon="mdi:information-outline" />
            </IconButton>
          </Tooltip>
        </TableCell>

        {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <LiquidityEngineQuickEditForm currentLiquidityEngine={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

LiquidityEngineTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
