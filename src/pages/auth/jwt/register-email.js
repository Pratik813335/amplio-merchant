import { Helmet } from 'react-helmet-async';
import JwtRegisterByEmailView from 'src/sections/auth/jwt/jwt-register-email-view';
// sections

// ----------------------------------------------------------------------

export default function RegisterEmailPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: Register</title>
      </Helmet>

      <JwtRegisterByEmailView />
    </>
  );
}
