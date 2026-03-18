import { Helmet } from 'react-helmet-async';
import KYCUBOs from 'src/sections/kyc/kyc-ubo-list';

// ----------------------------------------------------------------------

export default function KYCSignatoriesPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: KYC Signatories</title>
      </Helmet>

      <KYCUBOs />
    </>
  );
}
