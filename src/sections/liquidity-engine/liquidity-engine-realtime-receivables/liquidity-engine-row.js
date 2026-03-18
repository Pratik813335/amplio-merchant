import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LiquidityEngineTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewHaircut,
}) {
  const theme = useTheme();
  const { receivableId, amount, rail, bank, settlementDate, haircut, netAmount, risk } = row;

  const getRiskColor = () => {
    if (risk === 'Low') return 'success';
    if (risk === 'Medium') return 'warning';
    if (risk === 'High') return 'error';
    return 'default';
  };

  return (
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

      <TableCell sx={{ color: theme.palette.error.main, fontWeight: 600 }}>{haircut}</TableCell>

      <TableCell sx={{ color: theme.palette.success.main, fontWeight: 700 }}>{netAmount}</TableCell>

      <TableCell>
        <Label variant="soft" color={getRiskColor()}>
          {risk}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Tooltip title="View Details">
          <IconButton
            onClick={onViewHaircut}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              width: 45,
              height: 37,
              p: 0,
              color: theme.palette.text.secondary,
              '&:hover': {
                bgcolor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
          >
            <Iconify icon="mdi:information-outline" width={20} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

LiquidityEngineTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewHaircut: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};