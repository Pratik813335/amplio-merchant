import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function WidgetSummaryCard({
  icon,
  timing,
  title,
  percent,
  total,
  chart,
  sx,
  iconColor,
  hideArrow,
  arrowColor,
  arrowSize,
  ...other
}) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
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

  const resolveThemeColor = (colorPath) => {
    const [group, shade] = colorPath.split('.');
    return theme.palette[group][shade];
  };

  const resolvedIconColor = iconColor
    ? resolveThemeColor(iconColor)
    : theme.palette.info.dark;

  let resolvedArrowColor;
  if (arrowColor) {
    resolvedArrowColor = resolveThemeColor(arrowColor);
  } else if (percent < 0) {
    resolvedArrowColor = theme.palette.error.main;
  } else {
    resolvedArrowColor = theme.palette.success.main;
  }

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle2">{title}</Typography>
          <Box
            sx={{
              borderRadius: 1,
              p: 0.5,
              backgroundColor: alpha(resolvedIconColor, 0.08),
              color: resolvedIconColor,
            }}
          >
            <Iconify icon={icon} width={30} height={5} />
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          {String(total).includes('%') ? (
            <Typography variant="h5">{total}</Typography>
          ) : (
            <Typography variant="h5">{formatNumber(total)}</Typography>
          )}

          {!hideArrow && (
            <>
              <Iconify
                width={arrowSize === 'small' ? 16 : 24}
                icon={percent < 0 ? 'icons8:arrows-long-down' : 'icons8:arrows-long-up'}
                sx={{
                  ml: 1,
                  color: resolvedArrowColor,
                }}
              />

              <Typography component="div" variant="subtitle2" sx={{ color: resolvedArrowColor }}>
                {percent > 0 && '+'}
                {fPercent(percent)}
              </Typography>
            </>
          )}
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
  iconColor: PropTypes.string,
  hideArrow: PropTypes.bool,
  arrowColor: PropTypes.string,
  arrowSize: PropTypes.string,
};