import { Helmet } from 'react-helmet-async';
// sections
// import { OverviewAppView } from 'src/sections/overview/app/view';
import { OverviewDashboardView } from 'src/sections/overview/dashboard/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      {/* <OverviewAppView /> */}
      <OverviewDashboardView />

    </>
  );
}
