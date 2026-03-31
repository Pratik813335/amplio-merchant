import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';
import { fCurrencyindia } from 'src/utils/format-number';
import { ro } from 'date-fns/locale';

// ----------------------------------------------------------------------


function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

// ----------------------------------------------------------------------

export default function LiquidityEngineHaircutCalculationCard({ open, onClose, row }) {
  const theme = useTheme();

  if (!row) return null;


  const riskRows = [
    { label: `Rail Risk (${row.settlementMethod})`, value: row.delayRisk },
    // { label: `Bank Risk (${row.bank})`, value: breakdown.bankRisk },
    { label: 'Settlement Delay Risk', value: row.riskScore },
    { label: 'Refund Reserve', value: row.chargebackRisk },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 480,
          borderRadius: 2,
          p: 3,
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Haircut Calculation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Breakdown for {row.tnsId}
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
        >
          <Iconify icon="mingcute:close-line" width={18} />
        </IconButton>
      </Stack>

      {/* Gross Amount */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.primary">
          Gross Amount
        </Typography>
        <Typography variant="body1" fontWeight={600} color="text.primary">
          ₹{fCurrencyindia(Math.round(Number(row.totalRecieved)|| 0 ))}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Risk Breakdown */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {riskRows.map((item) => (
          <Stack key={item.label} direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
              -{(item.value)}%
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Total Haircut */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Total Haircut
        </Typography>
        <Typography variant="body1" fontWeight={700} sx={{ color: theme.palette.error.main }}>
          -{row.haircut}%
        </Typography>
      </Stack>

      {/* Net Disbursement */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.success.main, 0.08),
          borderRadius: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1" fontWeight={700} sx={{ color: theme.palette.success.dark }}>
            Net Disbursement
          </Typography>
          <Typography variant="body1" fontWeight={700} sx={{ color: theme.palette.success.dark }}>
            {formatCurrency(Math.round(Number(row.netAmount)|| 0 ))}
          </Typography>
        </Stack>
      </Box>
    </Dialog>
  );
}

LiquidityEngineHaircutCalculationCard.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.shape({
    tnsId: PropTypes.string,
    amount: PropTypes.string,
    settlementMethod: PropTypes.string,
    bank: PropTypes.string,
    haircut: PropTypes.string,
    netAmount: PropTypes.string,
    totalRecieved: PropTypes.string,
    delayRisk: PropTypes.number,
    riskScore: PropTypes.number,
    chargebackRisk: PropTypes.number,
  }),
};