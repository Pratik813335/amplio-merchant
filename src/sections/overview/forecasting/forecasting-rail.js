import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

// --------------------------------------------------------

function RailRow({ rail }) {
  const carousel = useCarousel({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    speed: 500,
  });

  return (
    <Box sx={{ mb: 3, position: 'relative' }}>
      <Chip
        label={rail.rail}
        size="medium"
        sx={{ mb: 1.5 }}
        color={
          (rail.rail === 'UPI' && 'info') ||
          (rail.rail === 'QR' && 'success') ||
          (rail.rail === 'Card' && 'warning') ||
          'default'
        }
      />

      <Box sx={{ position: 'relative', mx: -1 }}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {rail.banks.map((bank) => {

            const percentage = parseFloat(bank.value);
            let color = 'success';
            if (percentage < 97) color = 'error';
            else if (percentage < 98) color = 'warning';

            return (
              <Box key={bank.name} sx={{ px: 1 }}>
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
                    variant="h5"
                    sx={{
                      color: `${color}.main`,
                      fontWeight: 600,
                    }}
                  >
                    {bank.value}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Carousel>

        <CarouselArrows
          onNext={carousel.onNext}
          onPrev={carousel.onPrev}
          sx={{
            top: -36,
            right: 0,
            position: 'absolute',
          }}
        />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function ForecastingRail({ title, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Box sx={{ p: 3 }}>
        {list.map((rail) => (
          <RailRow key={rail.rail} rail={rail} />
        ))}
      </Box>
    </Card>
  );
}

ForecastingRail.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
};

RailRow.propTypes = {
  rail: PropTypes.object,
};