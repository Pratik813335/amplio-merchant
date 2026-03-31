import PropTypes from 'prop-types';
import { format } from 'date-fns';

// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fCurrencyindia } from 'src/utils/format-number';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------


export default function TransactionTableRow({ row, selected }) {
  const { tnsId, totalRecieved, method, bank, psp, status, createdAt } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{tnsId}</TableCell>

      <TableCell>₹{fCurrencyindia(Math.round(Number(totalRecieved) || 0))}</TableCell>

      <TableCell>
        <Label variant="soft" color="info">
          {method}
        </Label>
      </TableCell>

      <TableCell>{bank}</TableCell>

      <TableCell>{psp?.pspMaster?.name}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'captured' || status === 'settled') && 'success' ||
            (status === 'failed' && 'error') ||
            (status === 'created' && 'warning') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'dd MMM yyyy')}
          secondary={format(new Date(createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
    </TableRow>
  );
}

TransactionTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
