import { Helmet } from 'react-helmet-async';
// sections
import { BorrowingListView } from 'src/sections/overview/borrowing/view/';

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
