import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function ForecastingYearlySales({ title, subheader, chart, ...other }) {
  const { colors, categories, series, options } = chart;

  const [seriesData, setSeriesData] = useState('2019');

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ButtonBase
            sx={{
              pl: 1,
              py: 0.5,
              pr: 1.5,
              borderRadius: 1,
              typography: 'subtitle2',
              bgcolor: 'background.neutral',
              color: 'primary.main',
            }}
          >
            <Iconify icon="mdi:lightbulb-outline" sx={{ ml: 0.5, mr: 0.5, }} />
            Smile AI OS
          </ButtonBase>
        }
      />

      {series.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
          {item.year === seriesData && (
            <Chart dir="ltr" type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}

ForecastingYearlySales.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
