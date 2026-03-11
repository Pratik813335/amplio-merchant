import { Helmet } from 'react-helmet-async';
// sections
import KYCCompanyDetails from 'src/sections/kyc/kyc-company-details';

// ----------------------------------------------------------------------

export default function KYCCompanyDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: KYC Company Details</title>
      </Helmet>

      <KYCCompanyDetails />
    </>
  );
}
