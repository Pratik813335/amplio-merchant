import { Helmet } from 'react-helmet-async';
// sections
// import OwnerCreateView from 'src/sections/kyc/owner-create-view';
// import PSPIntegrationForm from 'src/sections/kyc/psp';
import PSPListView from 'src/sections/kyc/psp/view/psp-list-view';

// ----------------------------------------------------------------------

export default function PSPCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new psp</title>
      </Helmet>

      <PSPListView />
      {/* <PSPCreateView /> */}
      {/* <PSPIntegrationForm /> */}
    </>
  );
}
