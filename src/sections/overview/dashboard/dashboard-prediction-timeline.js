import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';

// chart
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function DashboardPredictionTimeline({ title, subheader, chart, ...other }) {
    const { colors, categories, series, options } = chart;

    const chartOptions = useChart({
        colors,
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            offsetY: 10,
        },
        xaxis: {
            categories,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        ...options,
    });

    return (
        <Card {...other}>
            <CardHeader
                title={title}
                subheader={subheader}
                action={
                    <Chip
                        label="AI Powered"
                        color="primary"
                        size="small"
                        variant="soft"
                    />
                }
            />

            <Box sx={{ mt: 3, mx: 3 }}>
                <Chart
                    dir="ltr"
                    type="area"
                    series={series}
                    options={chartOptions}
                    height={364}
                />
            </Box>
        </Card>
    );
}

DashboardPredictionTimeline.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    title: PropTypes.string,
};