import { Helmet } from 'react-helmet-async';
import { AccountView } from 'src/sections/account/view';
// sections
import { TransactionView } from 'src/sections/transaction/view/transaction-dashboard-view';


// ----------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Settings</title>
      </Helmet>

      <AccountView />
    </>
  );
}
