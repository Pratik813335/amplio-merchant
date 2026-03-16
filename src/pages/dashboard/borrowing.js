import { Helmet } from 'react-helmet-async';
// sections
import BorrowingListView from 'src/sections/overview/Borrowings/view/borrowing-list-view';

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
