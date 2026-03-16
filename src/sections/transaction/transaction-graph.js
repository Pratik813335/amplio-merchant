import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Chart, { useChart } from 'src/components/chart';
// ----------------------------------------------------------------------

export default function TransactionGraph({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
     
    ],
    categories,
    series,
    options,
  } = chart;

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
    ...options,
  });

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          
          
        />

        {series.map((item,i) => (
          <Box key={i} sx={{ mt: 3, mx: 3 }}>
              <Chart dir="ltr" type="line" series={item.data} options={chartOptions} height={364} />
          </Box>
        ))}
      </Card>
    </>
  );
}

TransactionGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
