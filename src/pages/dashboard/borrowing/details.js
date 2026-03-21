import { Helmet } from 'react-helmet-async';
import BorrowingDetailsView from 'src/sections/overview/borrowing/view/borrowing-details-view';
// sections



// ----------------------------------------------------------------------

export default function BorrowingDetailsPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Borrowing Details</title>
            </Helmet>

            <BorrowingDetailsView />
        </>
    );
}
