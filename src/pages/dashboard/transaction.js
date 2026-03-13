import { Helmet } from 'react-helmet-async';
// sections
import { TransectionView } from 'src/sections/transaction/view/transaction-dashboard-view';


// ----------------------------------------------------------------------

export default function TransectionPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Transection</title>
      </Helmet>

      <TransectionView />
    </>
  );
}
