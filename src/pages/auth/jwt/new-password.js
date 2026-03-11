import { Helmet } from 'react-helmet-async';
import JwtNewPasswordView from 'src/sections/auth/jwt/jwt-new-password-view';
// sections

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Merchant: New Password</title>
      </Helmet>

      <JwtNewPasswordView />
    </>
  );
}
