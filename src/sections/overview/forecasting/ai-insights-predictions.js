import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

export default function AiInsightsPredictions({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {list.map((item) => (
            <Grid xs={12} md={6} key={item.id}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: `${item.color}.main`,
                  bgcolor: `${item.color}.lighter`,
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.title}
                  </Typography>

                  <Chip
                    label={`${item.percentage}%`}
                    color={item.color}
                    size="small"
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: 'text.secondary' }}
                >
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}

AiInsightsPredictions.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};