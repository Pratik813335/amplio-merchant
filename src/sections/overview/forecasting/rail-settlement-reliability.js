import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

export default function RailSettlementReliability({ title, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Box sx={{ p: 3 }}>
        {list.map((rail) => (
          <Box key={rail.rail} sx={{ mb: 3 }}>
            
            <Chip
              label={rail.rail}
              size="small"
              sx={{ mb: 1.5 }}
              color={
                (rail.rail === 'UPI' && 'info') ||
                (rail.rail === 'QR' && 'success') ||
                (rail.rail === 'Card' && 'warning') ||
                'default'
              }
            />

            <Grid container spacing={2}>
              {rail.banks.map((bank) => (
                <Grid xs={6} md={3} key={bank.name}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {bank.name}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          (bank.color === 'success' && 'success.main') ||
                          (bank.color === 'warning' && 'warning.main') ||
                          (bank.color === 'error' && 'error.main'),
                        fontWeight: 600,
                      }}
                    >
                      {bank.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

RailSettlementReliability.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
};