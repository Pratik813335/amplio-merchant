import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function LiquidityEngineCardItem({ disbursement }) {
  const theme = useTheme();
  const { date, receivablesFinanced, amount, status } = disbursement;

  return (
    <Card
      sx={{
        px: 3,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: 'none',
        bgcolor: theme.palette.background.paper,
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Left: Icon + Date + Count */}
      <Stack direction="row" alignItems="center" spacing={2.5}>
        {/* Green Icon Box */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            bgcolor: theme.palette.success.lighter,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Iconify
            icon="material-symbols-light:water-drops-outline-rounded"
            width={24}
            sx={{ color: theme.palette.success.dark }}
          />
        </Box>

        {/* Date + subtitle */}
        <Stack spacing={0.4}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receivablesFinanced} receivables financed
          </Typography>
        </Stack>
      </Stack>

      {/* Right: Amount + Chip */}
      <Stack alignItems="flex-end" spacing={0.8}>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {amount}
        </Typography>

        <Chip
          label={status}
          size="small"
          sx={{
            bgcolor: theme.palette.success.lighter,
            color: theme.palette.success.dark,
            fontWeight: 600,
            fontSize: 12,
            height: 24,
            borderRadius: 1.5,
            border: `1px solid ${theme.palette.success.light}`,
            '& .MuiChip-label': {
              px: 1.5,
            },
          }}
        />
      </Stack>
    </Card>
  );
}

LiquidityEngineCardItem.propTypes = {
  disbursement: PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string,
    receivablesFinanced: PropTypes.number,
    amount: PropTypes.string,
    status: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------

export default function LiquidityEngineCard({ disbursements }) {
  return (
    <Box sx={{ mt: 5 }}>
      {/* Section Title */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Liquidity Disbursement History
      </Typography>

      {/* List of disbursement cards */}
      <Stack spacing={2}>
        {disbursements.map((item) => (
          <LiquidityEngineCardItem key={item.id} disbursement={item} />
        ))}
      </Stack>
    </Box>
  );
}

LiquidityEngineCard.propTypes = {
  disbursements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      date: PropTypes.string,
      receivablesFinanced: PropTypes.number,
      amount: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};