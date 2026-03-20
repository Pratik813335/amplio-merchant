import PropTypes from 'prop-types';
import { format } from 'date-fns';

// @mui
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import numeral from 'numeral';
import { fCurrencyindia } from 'src/utils/format-number';
import { isNaN } from 'lodash';
// ----------------------------------------------------------------------
export default function BorrowingTableRow({ row, selected,onViewRow }) {
  const { transactionId, listView = {} } = row;

  const {
    dateTime,
    amountTransferred,
    fromAccount,
    toAccount,
    poolId,
    expectedAmount,
    expectedReceipt,
    status,
  } = listView;

  const safeFormat = (date, formatStr) => {
    try {
      if (!date) return '-';
      const parsed = new Date(date);
      if (isNaN(parsed)) return date;
      return format(parsed, formatStr);
    } catch {
      return '-';
    }
  };


  return (
    <TableRow hover selected={selected}>

      <TableCell>{transactionId}</TableCell>

      <TableCell >
        <ListItemText sx={{ width: 92 }}
          primary={safeFormat((dateTime), 'dd MMM yyyy')}
          secondary={safeFormat((dateTime), 'p')}
        />
      </TableCell>

      <TableCell>₹{fCurrencyindia(amountTransferred)}</TableCell>

      <TableCell >{fromAccount}</TableCell>

      <TableCell>{(toAccount)}</TableCell>

      <TableCell sx={{ color: "info.dark" }}  >
        {poolId}
      </TableCell>

      <TableCell sx={{ color: "success.dark" }}>₹{fCurrencyindia(expectedAmount)}</TableCell>

      <TableCell >
        {safeFormat(expectedReceipt, 'dd MMM yyyy, p')}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"

          color={
            (status === 'Completed' && 'fluent-mdl2:completed' && 'success') ||
            (status === 'Settled' && 'success') ||
            (status === 'Failed' && 'error') ||
            (status === 'Pending' && 'warning') ||
            'default'
          }
        >
          <Iconify icon={
            (status === 'Completed' && 'prime:check-circle') ||
            (status === 'Settled' && 'prime:check-circle') ||
            (status === 'Failed' && 'charm:circle-cross') ||
            (status === 'Pending' && 'streamline-pixel:interface-essential-waiting-hourglass-loading')
          } width={18} mr={1} />
          {status}
        </Label>
      </TableCell>

      <TableCell >
        <Tooltip title="View" placement="top" arrow>
            <IconButton onClick={onViewRow}>
              <Iconify icon="mdi:eye" width={20} />
            </IconButton>
          </Tooltip> 
      </TableCell>


    </TableRow>
  );
}

BorrowingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func
};

