import PropTypes from 'prop-types';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';

// component
import Iconify from 'src/components/iconify';

// utils
import { fNumber, fPercent } from 'src/utils/format-number';


// ----------------------------------------------------------------------

export default function WidgetSummaryCard({ icon, timing, title, percent, total, chart, sx, ...other }) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;
// data
  const chartOptions = {
    colors: colors.map((color) => color[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 100, color: colors[1] },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
    ...options,
  };

  function formatNumber(num) {
    const number = Number(num);

    if (number >= 10000000) {
      return `${(number / 10000000).toFixed(2)} Cr`;
    }

    if (number >= 100000) {
      return `${(number / 100000).toFixed(2)} L`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(2)} K`;
    }

    return number;
  }

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>

        {/* Title + Icon */}
        <TruncatedTypography text={title} icon={icon} />

        {/* Amount + Percent */}
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>

          {String(total).includes('%') ? (
            <Typography variant="h5">{total}</Typography>
          ) : (
            <Typography variant="h5">{formatNumber(total)}</Typography>
          )}

          <Iconify
            width={20}
            icon={percent < 0 ? 'icons8:arrows-long-down' : 'icons8:arrows-long-up'}
            sx={{
              ml: 1,
              color: percent < 0 ? 'error.main' : 'success.main',
            }}
          />

          <Typography component="div" variant="subtitle2">
            {percent > 0 && '+'}
            {fPercent(percent)}
          </Typography>

        </Stack>

        {/* Timing */}
        <Typography variant="caption" color="text.secondary">
          {timing}
        </Typography>

      </Box>
    </Card>
  );
}

WidgetSummaryCard.propTypes = {
  chart: PropTypes.object,
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  timing: PropTypes.string,
  icon: PropTypes.string,
  total: PropTypes.number,
};


// ----------------------------------------------------------------------

export function TruncatedTypography({ text, icon }) {
  const theme = useTheme();

  const words = text?.split(' ') || [];
  const isTruncated = words.length > 3;
  const truncatedText = isTruncated ? `${words.slice(0, 3).join(' ')}...` : text;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Tooltip title={isTruncated ? text : ''} arrow disableHoverListener={!isTruncated}>
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {truncatedText}
        </Typography>
      </Tooltip>

      {icon && (
        <Box
          sx={{
            flexShrink: 0,
            width: theme.spacing(3.5),
            height: theme.spacing(3.5),
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.info.main, 0.08),
            color: theme.palette.info.main,
          }}
        >
          <Iconify icon={icon} width={18} height={18} />
        </Box>
      )}
    </Box>
  );
}

TruncatedTypography.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
};