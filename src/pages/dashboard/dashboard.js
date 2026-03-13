import { Helmet } from 'react-helmet-async';
// sections
import OverviewDashboardView from 'src/sections/overview/dashboard/view/overview-dashboard-view';

// ----------------------------------------------------------------------

export default function OverviewDashboardPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Analytics</title>
            </Helmet>

            <OverviewDashboardView />
        </>
    );
}
