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
import { Button, Typography } from '@mui/material';
import numeral from 'numeral';
import { fCurrencyindia } from 'src/utils/format-number';
// ----------------------------------------------------------------------
export default function BorrowingTableRow({ row, selected }) {
  const {
    txnId,
    time,
    transerred,
    fromaccount,
    toaccount,
    poolid,
    expectedamount,
    expectedreceipt,
    status,
  } = row;
  const safeFormat = (date, formatStr) => {
    try {
      return format(new Date(date.replace(' ', 'T')), formatStr);
    } catch {
      return '-';
    }
  };


  return (
    <TableRow hover selected={selected}>

      <TableCell   >{txnId}</TableCell>

      <TableCell >
        <ListItemText sx={{ width: 92 }}
          primary={format(new Date(time), 'dd MMM yyyy')}
          secondary={format(new Date(time), 'p')}
        />
      </TableCell>

      <TableCell>₹{fCurrencyindia(transerred)}</TableCell>

      <TableCell >{fromaccount}</TableCell>

      <TableCell>{(toaccount)}</TableCell>

      <TableCell sx={{ color: "info.dark" }}  >
        {poolid}
      </TableCell>

      <TableCell sx={{ color: "success.dark" }}>₹{fCurrencyindia(expectedamount)}</TableCell>

      <TableCell >
        {safeFormat(expectedreceipt, 'dd MMM yyyy, p')}
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
        <Button  >
          <Iconify icon="solar:eye-bold" />
        </Button>
      </TableCell>


    </TableRow>
  );
}

BorrowingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};

