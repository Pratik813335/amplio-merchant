import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AppAreaInstalled({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = chart;

  const [seriesData, setSeriesData] = useState('2019');

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0] },
          { offset: 100, color: colr[1] },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    plotOptions: {
    bar: {
      columnWidth: '70%',
          borderRadius: 5,
    },
  },
    ...options,
  });

  return (
    <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          
        />

        {series.map((item) => (
          <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
            {item.year === seriesData && (
              <Chart dir="ltr" type="bar" series={item.data} options={chartOptions} height={364} />
            )}
          </Box>
        ))}
      </Card>
  );
}

AppAreaInstalled.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
