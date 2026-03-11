import { Helmet } from 'react-helmet-async';
// sections
import KYCReviewAndSubmit from 'src/sections/kyc/kyc-review-and-submit';

// ----------------------------------------------------------------------

export default function KYCReviewAndSubmitPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: KYC Review & Submit</title>
      </Helmet>

      <KYCReviewAndSubmit />
    </>
  );
}
