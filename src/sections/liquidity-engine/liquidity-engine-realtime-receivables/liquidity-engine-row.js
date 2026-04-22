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
import { ListItemText } from '@mui/material';
import { format } from 'date-fns';
import { fCurrencyindia } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function getReceivableFundingStatus(row) {
  const normalizedPlatformStatus = row?.platformStatus?.toLowerCase();
  const isFunded =
    normalizedPlatformStatus === 'fundeed' ||
    normalizedPlatformStatus === 'funded' ||
    Number(row?.releasedAmount ?? 0) > 0;

  return isFunded
    ? { value: 'fundeed', label: 'Funded', color: 'success' }
    : { value: 'notfunded', label: 'Pending', color: 'warning' };
}

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
  const { tnsId, totalRecieved, method, bank, settlementDate, haircut, netAmount } =
    row;
  const fundingStatus = getReceivableFundingStatus(row);

  // const getRiskColor = () => {
  //   if (risk === 'Low') return 'success';
  //   if (risk === 'Medium') return 'warning';
  //   if (risk === 'High') return 'error';
  //   return 'default';
  // };

  return (
    <TableRow hover selected={selected}>
      <TableCell>{tnsId}</TableCell>

      <TableCell sx={{ fontWeight: 600 }}>₹{fCurrencyindia(Math.round(Number(totalRecieved) || 0))}</TableCell>

      <TableCell>
        <Label variant="soft" color="info">
          {method}
        </Label>
      </TableCell>

      <TableCell>{bank}</TableCell>

      <TableCell>
        <Label variant="soft" color={fundingStatus.color}>
          {fundingStatus.label}
        </Label>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(settlementDate), 'dd MMM yyyy')}
          secondary={format(new Date(settlementDate), 'p')}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell sx={{ color: theme.palette.error.main, fontWeight: 600 }}>{haircut}%</TableCell>

      <TableCell sx={{ color: theme.palette.success.main, fontWeight: 700 }}>₹{fCurrencyindia(Math.round(Number(netAmount) || 0))}</TableCell>

      {/* <TableCell>
        <Label variant="soft" color={getRiskColor()}>
          {risk}
        </Label>
      </TableCell> */}

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
