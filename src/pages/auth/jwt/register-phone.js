import { Helmet } from 'react-helmet-async';
import JwtRegisterByMobileView from 'src/sections/auth/jwt/jwt-register-phone-view';
// sections

// ----------------------------------------------------------------------

export default function RegisterPhonePage() {
  return (
    <>
      <Helmet>
        <title> Merchant: Register</title>
      </Helmet>

      <JwtRegisterByMobileView />
    </>
  );
}
