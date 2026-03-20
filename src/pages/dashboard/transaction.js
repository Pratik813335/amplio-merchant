import { Helmet } from 'react-helmet-async';
// sections
import { TransactionView } from 'src/sections/transaction/view/transaction-dashboard-view';


// ----------------------------------------------------------------------

export default function TransactionPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Transaction</title>
      </Helmet>

      <TransactionView />
    </>
  );
}
