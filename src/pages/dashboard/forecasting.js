import { Helmet } from 'react-helmet-async';
// sections
import { OverviewForecastingView } from 'src/sections/overview/forecasting/view';

// ----------------------------------------------------------------------

export default function OverviewForecastingPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Forecasting</title>
      </Helmet>

      <OverviewForecastingView />
    </>
  );
}
