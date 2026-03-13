import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

export default function HighRiskDaysHighlighted({ title, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(7, 1fr)"
        sx={{ p: 3 }}
      >
        {list.map((item) => (
          <Paper
            key={item.date}
            variant="outlined"
            sx={{
              py: 2,
              textAlign: 'center',
              borderColor: item.color,
              bgcolor: `${item.color}10`,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.date}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {item.confidence}%
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              confidence
            </Typography>
          </Paper>
        ))}
      </Box>
    </Card>
  );
}

HighRiskDaysHighlighted.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
};
