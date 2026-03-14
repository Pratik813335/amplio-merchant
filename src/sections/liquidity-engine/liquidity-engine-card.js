import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

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
        // bgcolor: theme.palette.background.paper,
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Left: Icon + Date + Count */}
      <Stack direction="row" alignItems="center" spacing={3}>
        {/* Green Icon Box */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.success.main, 0.16),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Iconify
            icon="lucide:droplets"
            width={24}
            sx={{ color: theme.palette.success.dark }}
          />
        </Box>

        {/* Date + subtitle */}
        <Stack spacing={0.4}>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
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

        <Label color="success">{status}</Label>
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
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: 'none',
        // bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Section Title inside card */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Liquidity Disbursement History
      </Typography>

      {/* List of disbursement cards */}
      <Stack spacing={3}>
        {disbursements.map((item) => (
          <LiquidityEngineCardItem key={item.id} disbursement={item} />
        ))}
      </Stack>
    </Card>
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