import { Helmet } from 'react-helmet-async';
// sections
import KYCBasicInfo from 'src/sections/kyc/kyc-basic-info';

// ----------------------------------------------------------------------

export default function KYCBasicInfoPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: KYC Basic Info</title>
      </Helmet>

      <KYCBasicInfo />
    </>
  );
}
