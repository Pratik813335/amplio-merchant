import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

// --------------------------------------------------------

export default function ForecastingBankOutage({ title, data, ...other }) {

  const carousel = useCarousel({
    slidesToShow: 1,
    slidesToScroll: 1, 
    infinite: false,
    speed: 500,
  });

  const groups = [];
  for (let i = 0; i < data.length; i += 4) {
    groups.push(data.slice(i, i + 4));
  }

  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Box sx={{ p: 3, position: 'relative', mx: -1 }}>

        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>

          {groups.map((group, index) => (
            <Box key={index} sx={{ px: 1 }}>

              <Stack spacing={3}>
                {group.map((bank) => (
                  <BankItem key={bank.id} bank={bank} />
                ))}
              </Stack>

            </Box>
          ))}

        </Carousel>

        <CarouselArrows
          onNext={carousel.onNext}
          onPrev={carousel.onPrev}
          sx={{
            top: -45,
            right: 16,
            position: 'absolute',
          }}
        />

      </Box>
    </Card>
  );
}

ForecastingBankOutage.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

// --------------------------------------------------------

function BankItem({ bank }) {
  const { bank: name, lastOutage, percentage } = bank;

  let color = 'success';

  if (percentage >= 5) color = 'error';
  else if (percentage >= 3) color = 'warning';

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1">{name}</Typography>

        <Typography variant="subtitle1" color={`${color}.main`}>
          {percentage}%
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        Last outage: {lastOutage}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percentage * 10}
        color={color}
        sx={{
          height: 8,
          borderRadius: 5,
        }}
      />
    </Box>
  );
}

BankItem.propTypes = {
  bank: PropTypes.object,
};