import { Helmet } from 'react-helmet-async';
import BorrowingListView from 'src/sections/overview/borrowing/view/borrowing-list-view';
// sections


// ----------------------------------------------------------------------

export default function OverviewDashboardPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Analytics</title>
            </Helmet>

            <BorrowingListView />
        </>
    );
}
