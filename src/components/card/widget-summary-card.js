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
import { fPercent } from 'src/utils/format-number';

export default function WidgetSummaryCard({
  icon,
  timing,
  title,
  percent,
  total,
  sx,
  ...other
}) {
  const theme = useTheme();

  const percentValue =
    percent !== undefined && percent !== null ? Number(percent) : null;
  const colors = [theme.palette.primary.light, theme.palette.primary.main]
  // const {
  //   colors = [theme.palette.primary.light, theme.palette.primary.main],
  //   series,
  //   options,
  // } = chart;
  // data
  // const chartOptions = {
  //   colors: colors.map((color) => color[1]),
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       colorStops: [
  //         { offset: 0, color: colors[0] },
  //         { offset: 100, color: colors[1] },
  //       ],
  //     },
  //   },
  //   chart: {
  //     sparkline: {
  //       enabled: true,
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       columnWidth: '68%',
  //       borderRadius: 2,
  //     },
  //   },
  //   tooltip: {
  //     x: { show: false },
  //     y: {
  //       formatter: (value) => fNumber(value),
  //       title: {
  //         formatter: () => '',
  //       },
  //     },
  //     marker: { show: false },
  //   },
  //   ...options,
  // };

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
    <Card
  sx={{
    width: '100%',
    height: '100%',
    p: 3,
    minHeight: 120,
    ...sx,
  }}
  {...other}
>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tooltip title={title || ''} arrow>
            <Typography
              variant="subtitle2"
              sx={{
                maxWidth: '75%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {title}
            </Typography>
          </Tooltip>

          {icon && (
            <Iconify
              icon={icon}
              width={30}
              height={30}
              sx={{
                borderRadius: 1,
                p: 0.5,
                backgroundColor: alpha(theme.palette.info.dark, 0.08),
                color: alpha(theme.palette.info.dark, 1),
              }}
            />
          )}
        </Box>

        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="h5" noWrap>
            {total}
          </Typography>

          {percentValue !== null && percentValue !== 0 && (
            <Iconify
              width={20}
              icon={
                percentValue < 0
                  ? 'icons8:arrows-long-down'
                  : 'icons8:arrows-long-up'
              }
              sx={{
                ml: 1,
                color: percentValue < 0 ? 'error.main' : 'success.main',
              }}
            />
          )}

          {percentValue !== null && (
            <Typography component="div" variant="subtitle2" sx={{ ml: 0.5 }}>
              {percentValue > 0 && '+'}
              {fPercent(percentValue)}
            </Typography>
          )}
        </Stack>

        {timing && (
          <Tooltip title={timing || ''} arrow>
            <Typography
              variant="caption"
              sx={{
                color: 'grey',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {timing}
            </Typography>
          </Tooltip>
        )}

      </Box>
    </Card>
  );
}

WidgetSummaryCard.propTypes = {
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  timing: PropTypes.string,
  icon: PropTypes.string,
  total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconColor: PropTypes.string,
  hideArrow: PropTypes.bool,
  arrowColor: PropTypes.string,
  arrowSize: PropTypes.string,
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
        width: '100%',
        minWidth: 0, // allows shrinking
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Tooltip
          title={isTruncated ? text : ''}
          arrow
          disableHoverListener={!isTruncated}
        >
          <Typography
            variant="subtitle2"
            noWrap
          >
            {truncatedText}
          </Typography>
        </Tooltip>
      </Box>

      {icon && (
        <Box
          sx={{
            flexShrink: 0,
            ml: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: theme.spacing(3.5),
            height: theme.spacing(3.5),
            borderRadius: 1,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            color: theme.palette.primary.main,
          }}
        >
          <Iconify icon={icon} width={20} height={20} />
        </Box>
      )}
    </Box>
  );
}
TruncatedTypography.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
};