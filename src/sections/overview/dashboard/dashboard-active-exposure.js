import PropTypes from 'prop-types';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import { Box, Stack, Typography } from '@mui/material';

// utils
import { fNumber } from 'src/utils/format-number';

// chart
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 290;

const StyledChart = styled(Chart)(() => ({
    height: CHART_HEIGHT,
    '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
        height: `100% !important`,
    },
}));

// ----------------------------------------------------------------------

export default function DashboardActiveExposure({ title, subheader, chart, ...other }) {
    const theme = useTheme();

    const { series, options } = chart;

    const chartSeries = series.map((i) => i.value);

    const chartColors = [
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.info.main,
    ];

    const chartOptions = useChart({
        chart: {
            sparkline: {
                enabled: true,
            },
        },

        colors: chartColors,

        labels: series.map((i) => i.label),

        stroke: { colors: [theme.palette.background.paper] },

        legend: {
            show: false,
        },

        tooltip: {
            fillSeriesColor: false,
            y: {
                formatter: (value) => fNumber(value),
                title: {
                    formatter: (seriesName) => `${seriesName}`,
                },
            },
        },

        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                },
            },
        },

        ...options,
    });

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

            <StyledChart
                dir="ltr"
                type="donut"
                series={chartSeries}
                options={chartOptions}
                height={220}
            />


            <Stack spacing={2} sx={{ px: 4, pb: 2 }}>
                {series.map((item, index) => (
                    <Stack
                        key={item.label}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >

                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: chartColors[index],
                                }}
                            />

                            <Typography variant="body2" >
                                {item.label}
                            </Typography>
                        </Stack>


                        <Typography variant="subtitle2">
                            {item.value}%
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Card>
    );
}

// ----------------------------------------------------------------------

DashboardActiveExposure.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    title: PropTypes.string,
};