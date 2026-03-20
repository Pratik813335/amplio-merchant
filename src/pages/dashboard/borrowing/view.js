import { Helmet } from 'react-helmet-async';
import BorrowingTransactionsView from 'src/sections/overview/borrowing/view/borrowing-transactions-view';
// sections


// ----------------------------------------------------------------------

export default function BorrowingViewPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Borrowing Transactions</title>
            </Helmet>

            <BorrowingTransactionsView /> 
        </>
    );
}
