import { Helmet } from 'react-helmet-async';
import BorrowingListView from 'src/sections/overview/borrowing/view/borrowing-list-table';
// sections

// ----------------------------------------------------------------------

export default function BorrowingListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Borrowing List</title>
            </Helmet>

            <BorrowingListView />
        </>
    );
}
