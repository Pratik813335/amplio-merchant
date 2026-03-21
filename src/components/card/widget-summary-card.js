
import PropTypes from 'prop-types';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

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

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
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
  total: PropTypes.number,
};
