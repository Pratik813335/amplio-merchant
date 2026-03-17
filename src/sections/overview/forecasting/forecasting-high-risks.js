import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

export default function ForecastingHighRisk({ title, list, ...other }) {
  const carousel = useCarousel({
    slidesToShow: 7,
    slidesToScroll: 1,
    infinite: false,
    speed: 500,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Box sx={{ p: 3, position: 'relative', mx: -1 }}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {list.map((item) => {
            let color = 'success';

            if (item.confidence < 80) color = 'error';
            else if (item.confidence < 90) color = 'warning';

            return (
              <Box key={item.date} sx={{ px: 1 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    py: 2,
                    textAlign: 'center',
                    borderColor: `${color}.main`,
                    bgcolor: `${color}.lighter`,
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
              </Box>
            );
          })}
        </Carousel>

        <CarouselArrows
          onNext={carousel.onNext}
          onPrev={carousel.onPrev}
          sx={{ top: -45, right: 16, position: 'absolute' }}
        />
      </Box>
    </Card>
  );
}

ForecastingHighRisk.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
};
