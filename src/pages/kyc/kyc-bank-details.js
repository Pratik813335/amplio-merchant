import { Helmet } from 'react-helmet-async';
// sections
import KYCBankDetails from 'src/sections/kyc/kyc-bank-details';

// ----------------------------------------------------------------------

export default function KYCBankDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: KYC Bank Details</title>
      </Helmet>

      <KYCBankDetails />
    </>
  );
}
