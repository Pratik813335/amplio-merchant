import { Helmet } from 'react-helmet-async';
// sections
import { KYCView } from 'src/sections/kyc/view';

// ----------------------------------------------------------------------

export default function MerchantKycPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: KYC</title>
      </Helmet>

      <KYCView />
    </>
  );
}
