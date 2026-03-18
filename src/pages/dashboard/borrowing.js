import { Helmet } from 'react-helmet-async';
import { BorrowingView } from 'src/sections/overview/borrowing/view/borrowing-dashboard-view';
// sections


// ----------------------------------------------------------------------

export default function OverviewDashboardPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Analytics</title>
            </Helmet>

            <BorrowingView/>
        </>
    );
}
